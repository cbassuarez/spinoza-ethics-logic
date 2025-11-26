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

type LatinItemKind =
  | 'definition'
  | 'axiom'
  | 'postulate'
  | 'proposition'
  | 'scholium'
  | 'corollary'
  | 'lemma';

type LatinHeadingInfo = {
  kind: LatinItemKind;
  index: number;
};

function romanToInt(roman: string): number {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let prev = 0;
  for (const char of roman.toUpperCase()) {
    const value = map[char];
    if (!value) return 0;
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

function normalizeLatinHeading(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/[\.\:\;]+$/g, '')
    .trim();
}

function parseLatinHeadingInfo(normalized: string): LatinHeadingInfo | null {
  const match = normalized.match(
    /^(DEFINITIO|AXIOMA|PROPOSITIO|SCHOLIUM|COROLLARIUM|POSTULATUM)\s*([IVXLCDM]+)?$/
  );
  if (!match) return null;
  const [, tag, roman] = match;
  const index = roman ? romanToInt(roman) : 0;

  let kind: LatinItemKind;
  switch (tag) {
    case 'DEFINITIO':
      kind = 'definition';
      break;
    case 'AXIOMA':
      kind = 'axiom';
      break;
    case 'PROPOSITIO':
      kind = 'proposition';
      break;
    case 'SCHOLIUM':
      kind = 'scholium';
      break;
    case 'COROLLARIUM':
      kind = 'corollary';
      break;
    case 'POSTULATUM':
      kind = 'postulate';
      break;
    default:
      return null;
  }

  return { kind, index };
}

function detectLatinSection(normalized: string): LatinItemKind | null {
  if (normalized === 'DEFINITIONES') return 'definition';
  if (normalized === 'AXIOMATA') return 'axiom';
  if (normalized === 'POSTULATA') return 'postulate';
  return null;
}

function stripLatinHeading(raw: string, heading: LatinHeadingInfo): string {
  const headingWordMap: Record<LatinItemKind, string> = {
    definition: 'DEFINITIO',
    axiom: 'AXIOMA',
    postulate: 'POSTULATUM',
    proposition: 'PROPOSITIO',
    scholium: 'SCHOLIUM',
    corollary: 'COROLLARIUM',
    lemma: 'LEMMA',
  };

  const headingWord = headingWordMap[heading.kind];
  const roman = heading.index > 0 ? intToRoman(heading.index) : '';
  const candidates: RegExp[] = [];

  if (headingWord && roman) {
    candidates.push(new RegExp(`^\s*${headingWord}\s+${roman}[\s\.:;\-–—]*`, 'i'));
  }
  if (headingWord) {
    candidates.push(new RegExp(`^\s*${headingWord}\s*[\s\.:;\-–—]*`, 'i'));
  }
  if (roman) {
    candidates.push(new RegExp(`^\s*${roman}[\s\.:;\-–—]*`, 'i'));
  }

  let result = raw.trim();
  for (const pattern of candidates) {
    if (pattern.test(result)) {
      result = result.replace(pattern, '').trim();
      break;
    }
  }
  return result.trim();
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
  let currentSection: LatinItemKind | null = null;
  let lastProposition = 0;
  let corollaryIndex = 0;
  let scholiumIndex = 0;

  const pushCurrent = () => {
    if (current) {
      items.push({ ...current, textParts: [...current.textParts] });
      current = null;
    }
  };

  for (const raw of blocks) {
    const text = raw.trim();
    if (!text) continue;
    const normalized = normalizeLatinHeading(text);
    const headingCandidate = normalized.split(':')[0];

    const section = detectLatinSection(normalized);
    if (section) {
      pushCurrent();
      currentSection = section;
      continue;
    }

    let headingInfo = parseLatinHeadingInfo(normalized) ?? parseLatinHeadingInfo(headingCandidate);

    if (!headingInfo && currentSection) {
      const simple = normalized.match(/^([IVXLCDM]+)(?=\s|\.|\:|\)|$)/);
      if (simple) {
        headingInfo = { kind: currentSection, index: romanToInt(simple[1]) };
      }
    }

    if (headingInfo) {
      pushCurrent();

      if (headingInfo.kind === 'proposition') {
        lastProposition = headingInfo.index;
        corollaryIndex = 0;
        scholiumIndex = 0;
      }

      if (headingInfo.kind === 'corollary') {
        corollaryIndex = headingInfo.index > 0 ? headingInfo.index : corollaryIndex + 1;
      } else if (headingInfo.kind === 'scholium') {
        scholiumIndex = headingInfo.index > 0 ? headingInfo.index : scholiumIndex + 1;
      }

      const number = (() => {
        switch (headingInfo.kind) {
          case 'corollary':
            return corollaryIndex || headingInfo.index;
          case 'scholium':
            return scholiumIndex || headingInfo.index;
          default:
            return headingInfo.index || 0;
        }
      })();

      const segment: ParsedItem = {
        part: 1,
        kind: headingInfo.kind as ParsedItem['kind'],
        number,
        ofProposition:
          headingInfo.kind === 'corollary' || headingInfo.kind === 'scholium' ? lastProposition || undefined : undefined,
        subIndex:
          headingInfo.kind === 'corollary' || headingInfo.kind === 'scholium' ? number || undefined : undefined,
        textParts: [],
      };

      const body = stripLatinHeading(text, headingInfo);
      if (body) {
        segment.textParts.push(body);
      }

      current = segment;
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

function buildLatinMapForPart1(rawHtml: string): LatinMap {
  const latinSegments = mergeParsedSegments(parseLatinPart1(rawHtml));
  const map: LatinMap = new Map();

  for (const seg of latinSegments) {
    if (seg.part !== 1) continue;

    if (seg.number <= 0) {
      console.warn(`[Latin WARN] Skipping ${seg.kind} with no numeral: ${JSON.stringify(seg.textParts[0] ?? '')}`);
      continue;
    }

    if ((seg.kind === 'corollary' || seg.kind === 'scholium') && !seg.ofProposition) {
      console.warn(
        `[Latin WARN] Could not map Latin ${seg.kind} ${seg.number} because parent proposition is unknown.`
      );
      continue;
    }

    const id = makeId(seg);
    const text = normalizeParagraphs(seg.textParts);
    const existing = map.get(id);
    const combined = existing ? [existing, text].filter(Boolean).join('\n\n') : text;
    map.set(id, combined);
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
  const latinMap = buildLatinMapForPart1(latinHtml);

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
        original: seg.part === 1 ? latinMap.get(id) ?? '' : '',
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
    const englishIds = new Set(corpus.filter((it) => it.part === 1).map((it) => it.id));

    latinMap.forEach((_text, id) => {
        if (!englishIds.has(id)) {
            console.warn(
                `[Latin WARN] Latin map has entry for ${id} but no matching English item.`
            );
        }
    });

    for (const item of corpus) {
    if (item.part === 1) {
      if (!item.text.original || !item.text.original.trim()) {
        console.warn(`[Latin WARN] No Latin text for ${item.id} (${item.ref}).`);
      }
    }
  }
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
