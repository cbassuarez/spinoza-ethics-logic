import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';
import type {
  Dependency,
  EthicsCorpus,
  EthicsItem,
  ProofInfo,
} from '../src/data/types';

const CANONICAL_LATIN_SOURCE_URL =
  'https://www.thelatinlibrary.com/spinoza.ethica1.html';
const CANONICAL_ENGLISH_SOURCE_URL =
  'https://www.marxists.org/reference/subject/philosophy/works/ne/ethics.htm';

const RAW_ENGLISH_PATH = path.join(process.cwd(), 'data', 'raw', 'english-ethics.html');
const RAW_LATIN_PATH = path.join(process.cwd(), 'data', 'raw', 'latin-part1.html');
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'ethics.json');

const ALLOWED_KINDS: EthicsItem['kind'][] = [
  'definition',
  'axiom',
  'postulate',
  'proposition',
  'scholium',
  'corollary',
  'lemma',
];

type ParsedItem = {
  part: number;
  kind: EthicsItem['kind'];
  number: number; // primary number (definition/axiom/prop/etc.)
  ofProposition?: number; // for scholia/corollaries
  subIndex?: number; // corollary/scholium number when multiple
  textParts: string[];
};

type ParsedEnglishItem = ParsedItem & {
  translation: string;
};

type LatinMap = Map<string, string>;

function romanToInt(roman: string): number {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let prev = 0;
  for (const char of roman.toUpperCase()) {
    const value = map[char] ?? 0;
    if (value > prev) {
      total += value - 2 * prev;
    } else {
      total += value;
    }
    prev = value;
  }
  return total;
}

function intToRoman(value: number): string {
  const numerals: Array<[number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let remaining = value;
  let result = '';
  for (const [n, sym] of numerals) {
    while (remaining >= n) {
      result += sym;
      remaining -= n;
    }
  }
  return result || value.toString();
}

function normalizeBlock(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function normalizeParagraphs(parts: string[]): string {
  const cleaned = parts
    .map((p) => normalizeBlock(p))
    .filter((p) => p.length > 0);
  return cleaned.join('\n\n');
}

function mergeEnglishSegments(segments: ParsedEnglishItem[]): ParsedEnglishItem[] {
  const merged = new Map<string, ParsedEnglishItem>();
  const order: string[] = [];
  for (const seg of segments) {
    const id = makeId(seg);
    if (!merged.has(id)) {
      merged.set(id, { ...seg });
      order.push(id);
    } else {
      const existing = merged.get(id)!;
      const combined = [existing.translation, seg.translation].filter(Boolean).join('\n\n');
      merged.set(id, { ...existing, translation: combined });
    }
  }
  return order.map((id) => merged.get(id)!).filter(Boolean);
}

function mergeParsedSegments(segments: ParsedItem[]): ParsedItem[] {
  const merged = new Map<string, ParsedItem>();
  const order: string[] = [];
  for (const seg of segments) {
    const id = makeId(seg);
    if (!merged.has(id)) {
      merged.set(id, { ...seg, textParts: [...seg.textParts] });
      order.push(id);
    } else {
      const existing = merged.get(id)!;
      merged.set(id, { ...existing, textParts: [...existing.textParts, ...seg.textParts] });
    }
  }
  return order.map((id) => merged.get(id)!).filter(Boolean);
}

function ensureRawFilesExist(): void {
  const missing: string[] = [];
  if (!fs.existsSync(RAW_ENGLISH_PATH)) missing.push(RAW_ENGLISH_PATH);
  if (!fs.existsSync(RAW_LATIN_PATH)) missing.push(RAW_LATIN_PATH);
  if (missing.length) {
    const message = [
      'Missing required raw HTML files for Ethics corpus builder.',
      'Expected files:',
      ...missing.map((m) => `  - ${m}`),
      'Please run `npm run fetch:raw` to download the sources before building the corpus.',
    ].join('\n');
    throw new Error(message);
  }
}

function loadFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function extractBlocks(html: string): string[] {
  const dom = new JSDOM(html);
  const blocks: string[] = [];
  const selectors = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'div',
    'center',
    'article',
    'section',
    'pre',
    'blockquote',
  ];
  const elements = Array.from(
    dom.window.document.body.querySelectorAll(selectors.join(','))
  ) as Array<{ textContent: string | null }>;
  for (const el of elements) {
    const text = el.textContent?.replace(/\s+/g, ' ').trim();
    if (text) {
      blocks.push(text);
    }
  }
  return blocks;
}

function detectPart(text: string): number | null {
  const match = text.trim().toUpperCase().match(/^PART\s+([IVXLCDM]+)/);
  if (!match) return null;
  const value = romanToInt(match[1]);
  if (value < 1 || value > 5) return null;
  return value;
}

function isSectionHeading(text: string, keyword: string): boolean {
  const pattern = new RegExp(`^${keyword}s?\.?:?$`, 'i');
  return pattern.test(text.trim());
}

function parseEnglishEthics(html: string): ParsedEnglishItem[] {
  const blocks = extractBlocks(html);
  const items: ParsedEnglishItem[] = [];

  let currentPart = 0;
  let current: ParsedItem | null = null;
  let lastProposition = 0;
  let corollaryIndex = 0;
  let scholiumIndex = 0;
  let context: 'definition' | 'axiom' | 'postulate' | null = null;

  const pushCurrent = () => {
    if (current) {
      const translation = normalizeParagraphs(current.textParts);
      items.push({ ...current, translation });
      current = null;
    }
  };

  const startItem = (segment: ParsedItem) => {
    pushCurrent();
    if (segment.kind === 'proposition') {
      lastProposition = segment.number;
      corollaryIndex = 0;
      scholiumIndex = 0;
    }
    current = { ...segment, textParts: [...segment.textParts] };
  };

  for (const raw of blocks) {
    const text = raw.trim();
    if (!text) continue;
    const partMatch = detectPart(text);
    if (partMatch) {
      pushCurrent();
      currentPart = partMatch;
      context = null;
      continue;
    }

    if (isSectionHeading(text, 'DEFINITION')) {
      pushCurrent();
      context = 'definition';
      continue;
    }
    if (isSectionHeading(text, 'AXIOM')) {
      pushCurrent();
      context = 'axiom';
      continue;
    }
    if (isSectionHeading(text, 'POSTULATE')) {
      pushCurrent();
      context = 'postulate';
      continue;
    }

    const upper = text.toUpperCase();

    const defMatch = upper.match(/^(?:DEFINITION|DEFIN\.|DEF\.)\s*([IVXLCDM]+)/);
    if (defMatch) {
      const number = romanToInt(defMatch[1]);
      const content = text.replace(/^(?:DEFINITION|DEFIN\.|DEF\.)\s*[IVXLCDM]+\.?\s*/i, '').trim();
      startItem({ part: currentPart, kind: 'definition', number, textParts: content ? [content] : [] });
      context = 'definition';
      continue;
    }

    if (context === 'definition') {
      const simpleDef = upper.match(/^([IVXLCDM]+)\./);
      if (simpleDef) {
        const number = romanToInt(simpleDef[1]);
        const content = text.replace(/^([IVXLCDM]+)\.\s*/i, '').trim();
        if (current && current.kind === 'definition' && current.part === currentPart && current.number === number) {
          if (content) current.textParts.push(content);
        } else {
          startItem({
            part: currentPart,
            kind: 'definition',
            number,
            textParts: content ? [content] : [],
          });
        }
        continue;
      }
    }

    const axiomMatch = upper.match(/^(?:AXIOM)\s*([IVXLCDM]+)/);
    if (axiomMatch) {
      const number = romanToInt(axiomMatch[1]);
      const content = text.replace(/^(?:AXIOM)\s*[IVXLCDM]+\.?\s*/i, '').trim();
      startItem({ part: currentPart, kind: 'axiom', number, textParts: content ? [content] : [] });
      context = 'axiom';
      continue;
    }

    if (context === 'axiom') {
      const simpleAxiom = upper.match(/^([IVXLCDM]+)\./);
      if (simpleAxiom) {
        const number = romanToInt(simpleAxiom[1]);
        const content = text.replace(/^([IVXLCDM]+)\.\s*/i, '').trim();
        if (current && current.kind === 'axiom' && current.part === currentPart && current.number === number) {
          if (content) current.textParts.push(content);
        } else {
          startItem({ part: currentPart, kind: 'axiom', number, textParts: content ? [content] : [] });
        }
        continue;
      }
    }

    const postMatch = upper.match(/^(?:POSTULATE)\s*([IVXLCDM]+)/);
    if (postMatch) {
      const number = romanToInt(postMatch[1]);
      const content = text.replace(/^(?:POSTULATE)\s*[IVXLCDM]+\.?\s*/i, '').trim();
      startItem({ part: currentPart, kind: 'postulate', number, textParts: content ? [content] : [] });
      context = 'postulate';
      continue;
    }

    const propMatch = upper.match(/^(?:PROP\.?|PROPOSITION)\s*([IVXLCDM]+)/);
    if (propMatch) {
      const number = romanToInt(propMatch[1]);
      const content = text.replace(/^(?:PROP\.?|PROPOSITION)\s*[IVXLCDM]+\.?\s*/i, '').trim();
      startItem({ part: currentPart, kind: 'proposition', number, textParts: content ? [content] : [] });
      continue;
    }

    const corMatch = upper.match(/^COROLLARY\s*([IVXLCDM]+)?/);
    if (corMatch) {
      corollaryIndex += 1;
      const number = corMatch[1] ? romanToInt(corMatch[1]) : corollaryIndex;
      const content = text.replace(/^COROLLARY\s*[IVXLCDM]*\.?\s*/i, '').trim();
      startItem({
        part: currentPart,
        kind: 'corollary',
        number,
        ofProposition: lastProposition,
        subIndex: number,
        textParts: content ? [content] : [],
      });
      continue;
    }

    if (upper.startsWith('SCHOLIUM')) {
      scholiumIndex += 1;
      const content = text.replace(/^SCHOLIUM\.?\s*/i, '').trim();
      startItem({
        part: currentPart,
        kind: 'scholium',
        number: scholiumIndex,
        ofProposition: lastProposition,
        subIndex: scholiumIndex,
        textParts: content ? [content] : [],
      });
      continue;
    }

    const lemmaMatch = upper.match(/^LEMMA\s*([IVXLCDM]+)/);
    if (lemmaMatch) {
      const number = romanToInt(lemmaMatch[1]);
      const content = text.replace(/^LEMMA\s*[IVXLCDM]+\.?\s*/i, '').trim();
      startItem({ part: currentPart, kind: 'lemma', number, textParts: content ? [content] : [] });
      continue;
    }

    if (current) {
      current.textParts.push(text);
    }
  }

  pushCurrent();

  items.forEach((item) => {
    if (item.translation && /^[a-z]/.test(item.translation)) {
      console.warn(`Warning: translation for part ${item.part} ${item.kind} ${item.number} may start mid-sentence`);
    }
  });

  return items;
}

function parseLatinPart1(html: string): ParsedItem[] {
  const blocks = extractBlocks(html);
  const items: ParsedItem[] = [];

  let current: ParsedItem | null = null;
  let lastProposition = 0;
  let corollaryIndex = 0;
  let scholiumIndex = 0;

  const pushCurrent = () => {
    if (current) {
      items.push({ ...current, textParts: [...current.textParts] });
      current = null;
    }
  };

  const startItem = (segment: ParsedItem) => {
    pushCurrent();
    if (segment.kind === 'proposition') {
      lastProposition = segment.number;
      corollaryIndex = 0;
      scholiumIndex = 0;
    }
    current = { ...segment, textParts: [...segment.textParts] };
  };

  for (const raw of blocks) {
    const text = raw.trim();
    if (!text) continue;
    const upper = text.toUpperCase();

    const defMatch = upper.match(/^DEFINITIO\s*([IVXLCDM]+)/);
    if (defMatch) {
      startItem({ part: 1, kind: 'definition', number: romanToInt(defMatch[1]), textParts: [] });
      continue;
    }

    const axiomMatch = upper.match(/^AXIOMA\s*([IVXLCDM]+)/);
    if (axiomMatch) {
      startItem({ part: 1, kind: 'axiom', number: romanToInt(axiomMatch[1]), textParts: [] });
      continue;
    }

    const postMatch = upper.match(/^POSTULATUM\s*([IVXLCDM]+)/);
    if (postMatch) {
      startItem({ part: 1, kind: 'postulate', number: romanToInt(postMatch[1]), textParts: [] });
      continue;
    }

    const propMatch = upper.match(/^PROPOSITIO\s*([IVXLCDM]+)/);
    if (propMatch) {
      startItem({ part: 1, kind: 'proposition', number: romanToInt(propMatch[1]), textParts: [] });
      continue;
    }

    const corMatch = upper.match(/^COROLLARIUM\s*([IVXLCDM]+)?/);
    if (corMatch) {
      corollaryIndex += 1;
      const number = corMatch[1] ? romanToInt(corMatch[1]) : corollaryIndex;
      startItem({
        part: 1,
        kind: 'corollary',
        number,
        ofProposition: lastProposition,
        subIndex: number,
        textParts: [],
      });
      continue;
    }

    if (upper.startsWith('SCHOLIUM')) {
      scholiumIndex += 1;
      startItem({
        part: 1,
        kind: 'scholium',
        number: scholiumIndex,
        ofProposition: lastProposition,
        subIndex: scholiumIndex,
        textParts: [],
      });
      continue;
    }

    const lemmaMatch = upper.match(/^LEMMA\s*([IVXLCDM]+)/);
    if (lemmaMatch) {
      startItem({ part: 1, kind: 'lemma', number: romanToInt(lemmaMatch[1]), textParts: [] });
      continue;
    }

    if (current) {
      current.textParts.push(text);
    }
  }

  pushCurrent();
  return items;
}

function makeId(segment: ParsedItem): string {
  const base = `E${segment.part}`;
  switch (segment.kind) {
    case 'definition':
      return `${base}D${segment.number}`;
    case 'axiom':
      return `${base}Ax${segment.number}`;
    case 'postulate':
      return `${base}Post${segment.number}`;
    case 'lemma':
      return `${base}L${segment.number}`;
    case 'proposition':
      return `${base}p${segment.number}`;
    case 'corollary':
      return `${base}p${segment.ofProposition ?? segment.number}c${segment.subIndex ?? segment.number}`;
    case 'scholium':
      return `${base}p${segment.ofProposition ?? segment.number}s${segment.subIndex ?? segment.number}`;
    default:
      return `${base}-${segment.number}`;
  }
}

function makeRef(segment: ParsedItem): string {
  const partLabel = `Part ${intToRoman(segment.part)}`;
  switch (segment.kind) {
    case 'definition':
      return `${partLabel}, Definition ${segment.number}`;
    case 'axiom':
      return `${partLabel}, Axiom ${segment.number}`;
    case 'postulate':
      return `${partLabel}, Postulate ${segment.number}`;
    case 'lemma':
      return `${partLabel}, Lemma ${segment.number}`;
    case 'proposition':
      return `${partLabel}, Proposition ${segment.number}`;
    case 'corollary':
      return `${partLabel}, Proposition ${segment.ofProposition ?? segment.number}, Corollary ${
        segment.subIndex ?? segment.number
      }`;
    case 'scholium':
      return `${partLabel}, Proposition ${segment.ofProposition ?? segment.number}, Scholium`;
    default:
      return partLabel;
  }
}

function makeLabel(segment: ParsedItem): string {
  switch (segment.kind) {
    case 'definition':
      return `Definition ${segment.number}`;
    case 'axiom':
      return `Axiom ${segment.number}`;
    case 'postulate':
      return `Postulate ${segment.number}`;
    case 'lemma':
      return `Lemma ${segment.number}`;
    case 'proposition':
      return `Proposition ${segment.number}`;
    case 'corollary':
      return `Corollary ${segment.subIndex ?? segment.number}`;
    case 'scholium':
      return `Scholium ${segment.subIndex ?? segment.number}`;
    default:
      return makeRef(segment);
  }
}

function buildLatinMap(latinSegments: ParsedItem[]): LatinMap {
  const map: LatinMap = new Map();
  for (const seg of latinSegments) {
    const id = makeId(seg);
    const text = normalizeParagraphs(seg.textParts);
    map.set(id, text);
  }
  return map;
}

function enrichE1D1(items: EthicsItem[]): void {
  const item = items.find((it) => it.id === 'E1D1' && it.part === 1 && it.kind === 'definition');
  if (!item) return;
  item.label = 'Self-caused (causa sui)';
  item.text.original_language = 'Latin';
  item.text.original =
    'Per causam sui intelligo id cujus essentia involvit existentiam sive id cujus natura non potest concipi nisi existens.';
  item.text.translation =
    'By that which is self-caused, I mean that of which the essence involves existence, or that of which the nature is only conceivable as existent.';
}

function buildEthicsCorpus(): EthicsCorpus {
  ensureRawFilesExist();
  const englishHtml = loadFile(RAW_ENGLISH_PATH);
  const latinHtml = loadFile(RAW_LATIN_PATH);

  const englishSegments = mergeEnglishSegments(parseEnglishEthics(englishHtml));
  const latinSegments = mergeParsedSegments(parseLatinPart1(latinHtml));
  const latinMap = buildLatinMap(latinSegments);

  const corpus: EthicsCorpus = [];
  let currentPart = 0;
  let order = 0;

  for (const seg of englishSegments) {
    if (seg.part !== currentPart) {
      currentPart = seg.part;
      order = 0;
    }
    order += 1;
    const baseSegment: ParsedItem = {
      part: seg.part,
      kind: seg.kind,
      number: seg.number,
      ofProposition: seg.ofProposition,
      subIndex: seg.subIndex,
      textParts: [],
    };

    const id = makeId(baseSegment);
    const ref = makeRef(baseSegment);
    const label = makeLabel(baseSegment);

    const item: EthicsItem = {
      id,
      ref,
      part: seg.part as EthicsItem['part'],
      kind: seg.kind,
      label,
      order,
      text: {
        original_language: 'Latin',
        original: latinMap.get(id) ?? '',
        translation: seg.translation,
      },
      concepts: [],
      logic: [],
      dependencies: { uses: [] as Dependency[] },
      proof: { status: 'none' } as ProofInfo,
      meta: {
        status: 'draft',
        contributors: [],
        sources: [
          `Latin source: The Latin Library (Part I: ${CANONICAL_LATIN_SOURCE_URL})`,
          `English source: R.H.M. Elwes translation as hosted by Marxists Internet Archive (${CANONICAL_ENGLISH_SOURCE_URL})`,
        ],
      },
    };

    corpus.push(item);
  }

  enrichE1D1(corpus);
  return corpus;
}

function validateCorpus(corpus: EthicsCorpus): void {
  const seen = new Set<string>();
  for (const item of corpus) {
    if (seen.has(item.id)) {
      throw new Error(`Duplicate id in corpus: ${item.id}`);
    }
    seen.add(item.id);
    if (![1, 2, 3, 4, 5].includes(item.part)) {
      throw new Error(`Invalid part on item ${item.id}: ${item.part}`);
    }
    if (!ALLOWED_KINDS.includes(item.kind)) {
      throw new Error(`Invalid kind on item ${item.id}: ${item.kind}`);
    }
  }
  if (corpus.length < 200) {
    console.warn(`Warning: corpus only has ${corpus.length} items; expected more (check parsing)`);
  }
}

function writeCorpusToFile(corpus: EthicsCorpus): void {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(corpus, null, 2), 'utf8');
  console.log(`Wrote ${corpus.length} items to ${OUTPUT_PATH}`);
}

async function main(): Promise<void> {
  try {
    const corpus = buildEthicsCorpus();
    validateCorpus(corpus);
    writeCorpusToFile(corpus);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const entryUrl = pathToFileURL(process.argv[1] ?? '').href;
if (import.meta.url === entryUrl) {
  void main();
}

export {
  buildEthicsCorpus,
  mergeEnglishSegments,
  mergeParsedSegments,
  parseEnglishEthics,
  parseLatinPart1,
  validateCorpus,
  writeCorpusToFile,
};
