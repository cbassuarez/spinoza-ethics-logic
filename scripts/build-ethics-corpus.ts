import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';
import type {
  Dependency,
  EthicsCorpus,
  EthicsItem,
  LogicEncoding,
  ProofInfo,
} from '../src/data/types';
import {
  LOGIC_FOL_V1,
  PREDICATE_LOGIC_CLUSTER_PART1_DEFS,
} from '../src/data/logic-fol-v1.js';

const CANONICAL_LATIN_SOURCE_URL =
  'https://www.thelatinlibrary.com/spinoza.ethica1.html';
const CANONICAL_ENGLISH_SOURCE_URL =
  'https://www.marxists.org/reference/subject/philosophy/works/ne/ethics.htm';

const RAW_ENGLISH_PATH = path.join(process.cwd(), 'data', 'raw', 'english-ethics.html');

// Latin raw HTML sources, one per part. For now we only require Part I;
// the others are optional and can be added incrementally.
const RAW_LATIN_PATHS: Record<number, string> = {
  1: path.join(process.cwd(), 'data', 'raw', 'latin-part1.html'),
  2: path.join(process.cwd(), 'data', 'raw', 'latin-part2.html'),
  3: path.join(process.cwd(), 'data', 'raw', 'latin-part3.html'),
  4: path.join(process.cwd(), 'data', 'raw', 'latin-part4.html'),
  5: path.join(process.cwd(), 'data', 'raw', 'latin-part5.html'),
};
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

type ConceptRule = {
  concept: string;
  patterns: RegExp[];
};

function getPropositionIndexFromId(id: string): { part: number; index: number } | null {
  // Matches e.g. "E1p1", "E1p10", "E2p3", etc.
  const match = id.match(/^E(\d+)p(\d+)(?:[cs]\d+)?$/);
  if (!match) return null;
  const part = parseInt(match[1], 10);
  const index = parseInt(match[2], 10);
  if (!Number.isFinite(part) || !Number.isFinite(index)) return null;
  return { part, index };
}

const CONCEPT_RULES: ConceptRule[] = [
  {
    concept: 'Substance',
    patterns: [/substance\b/i, /\bsubstantia\b/i],
  },
  {
    concept: 'Attribute',
    patterns: [/attribute\b/i, /\battributum\b/i],
  },
  {
    concept: 'Mode',
    patterns: [/\bmode\b/i, /\bmodus\b/i],
  },
  {
    concept: 'God',
    patterns: [/\bgod\b/i, /\bdeus\b/i],
  },
  {
    concept: 'Causa sui',
    patterns: [/self-caused\b/i, /\bcausa\s+sui\b/i],
  },
  {
    concept: 'Essence',
    patterns: [/\bessence\b/i, /\bessentia\b/i],
  },
  {
    concept: 'Existence',
    patterns: [/\bexistence\b/i, /\bexistentia\b/i, /\bexistens\b/i],
  },
  {
    concept: 'Infinity',
    patterns: [/\binfinite\b/i, /\binfinit(y|e)\b/i, /\binfinitum\b/i],
  },
  {
    concept: 'Mind',
    patterns: [/\bmind\b/i, /\bmens\b/i],
  },
  {
    concept: 'Body',
    patterns: [/\bbody\b/i, /\bcorpus\b/i],
  },
  {
    concept: 'Power',
    patterns: [/\bpower\b/i, /\bpotentia\b/i],
  },
  {
    concept: 'Freedom',
    patterns: [/\bfreedom\b/i, /\bliber(ty|a|um)\b/i],
  },
];

const PROOF_SKETCHES_PART1_P1_10: Record<string, string> = {
  E1p1:
    'Spinoza notes that modes presuppose the substance whose affections they are (Def. 5), while substance is conceived through itself (Def. 3); therefore substance is by nature prior to its modifications.',
  E1p2:
    'Because each substance must be conceived through itself (Def. 3) and an attribute expresses its essence (Def. 4), substances with different attributes share no common nature and thus have nothing in common.',
  E1p3:
    'If two things have nothing in common, the conception of one does not involve the other (Ax. 5); therefore neither can serve as the cause of the other.',
  E1p4:
    'Distinct things must differ either in their attributes or in the affections that follow from those attributes; otherwise they would lack any ground for distinction and collapse into one.',
  E1p5:
    'Suppose two substances shared the same attribute; by Prop. 2 they would have nothing in common, which contradicts the shared attribute, so no two substances can possess the same nature or attribute.',
  E1p6:
    'If a substance were produced by another, they would share an attribute and thus be indistinguishable (Prop. 5), but a substance is conceived through itself (Def. 3), so no substance can be produced by another.',
  E1p7:
    'Every substance must exist either in itself or be produced by another (Ax. 1); Prop. 6 rules out external production, leaving self-causation, whose essence (Def. 1) involves existence, so existence belongs to substance’s nature.',
  E1p8:
    'A finite substance would be limited by another of the same nature (Def. 2), but Prop. 5 denies multiple substances of one attribute; therefore any substance that exists (Prop. 7) must be infinite.',
  E1p9:
    'An attribute expresses the essence of a substance (Def. 4), so the more reality or being a thing has, the more ways its essence can be expressed; hence greater reality entails a greater number of attributes.',
  E1p10:
    'Each attribute expresses substance’s essence (Def. 4) and is conceived through itself, so no attribute can be explained through another; consequently every attribute must be conceived through itself.',
};

const DEPENDENCIES_PART1_P1_10: Record<string, Dependency[]> = {
  E1p1: [
    { id: 'E1D3', role: 'definition' },
    { id: 'E1D5', role: 'definition' },
  ],
  E1p2: [
    { id: 'E1D3', role: 'definition' },
    { id: 'E1D4', role: 'definition' },
  ],
  E1p3: [
    { id: 'E1Ax5', role: 'axiom' },
  ],
  E1p4: [
    { id: 'E1D4', role: 'definition' },
    { id: 'E1D5', role: 'definition' },
  ],
  E1p5: [
    { id: 'E1p2', role: 'proposition' },
    { id: 'E1D4', role: 'definition' },
  ],
  E1p6: [
    { id: 'E1p5', role: 'proposition' },
    { id: 'E1D1', role: 'definition' },
    { id: 'E1D3', role: 'definition' },
  ],
  E1p7: [
    { id: 'E1Ax1', role: 'axiom' },
    { id: 'E1D1', role: 'definition' },
    { id: 'E1p6', role: 'proposition' },
  ],
  E1p8: [
    { id: 'E1D2', role: 'definition' },
    { id: 'E1p5', role: 'proposition' },
    { id: 'E1p7', role: 'proposition' },
  ],
  E1p9: [
    { id: 'E1D4', role: 'definition' },
  ],
  E1p10: [
    { id: 'E1D4', role: 'definition' },
    { id: 'E1p5', role: 'proposition' },
  ],
};

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
    /^(DEFINITIO|AXIOMA|PROPOSITIO|SCHOLIUM|COROLLARIUM|POSTULATUM|LEMMA)\s*([IVXLCDM]+)?$/
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
    case 'LEMMA':
      kind = 'lemma';
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
  const upper = normalized.toUpperCase();
  if (upper.startsWith('DEFINITIONES')) return 'definition';
  if (upper.startsWith('AFFECTUUM DEFINITIONES')) return 'postulate';
  if (upper.startsWith('AFFECTUUM GENERALIS DEFINITIO')) return 'postulate';
  if (upper.startsWith('AXIOMATA')) return 'axiom';
  if (upper.startsWith('POSTULATA')) return 'postulate';
  return null;
}

function splitLatinCompositeBlock(raw: string): string[] {
  const text = raw.trim();
  if (!text) return [];

  const markers = /(DEFINITIO|AXIOMA|PROPOSITIO|SCHOLIUM|COROLLARIUM|POSTULATUM|LEMMA)\s+[IVXLCDM]+/gi;

  const segments: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = markers.exec(text)) !== null) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) {
      const chunk = text.slice(lastIndex, idx).trim();
      if (chunk) segments.push(chunk);
    }
    lastIndex = idx;
  }

  const tail = text.slice(lastIndex).trim();
  if (tail) segments.push(tail);

  return segments.length > 0 ? segments : [text];
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

function normalizePart3Postulates(segments: ParsedItem[]): ParsedItem[] {
  const normalized: ParsedItem[] = [];
  let postulateCounter = 0;

  for (const seg of segments) {
    if (seg.part === 3 && seg.kind === 'postulate') {
      const first = (seg.textParts[0] || '').toUpperCase();
      const skipDesire = first.startsWith('CUPIDITAS EST IPSA HOMINIS ESSENTIA');
      const skipJoy =
        first.startsWith('LÆTITIA EST HOMINIS TRANSITIO') ||
        first.startsWith('LAETITIA EST HOMINIS TRANSITIO');
      if (skipDesire || skipJoy) {
        continue;
      }

      postulateCounter += 1;
      normalized.push({ ...seg, number: postulateCounter });
    } else {
      normalized.push(seg);
    }
  }

  return normalized;
}

function ensureRawFilesExist(): void {
  const missingRequired: string[] = [];
  const missingOptional: string[] = [];

  if (!fs.existsSync(RAW_ENGLISH_PATH)) {
    missingRequired.push(RAW_ENGLISH_PATH);
  }

  for (const [partStr, filePath] of Object.entries(RAW_LATIN_PATHS)) {
    const part = Number(partStr);
    if (!Number.isFinite(part)) continue;

    if (!fs.existsSync(filePath)) {
      // All Latin sources are optional for now; we just warn.
      missingOptional.push(filePath);
    }
  }

  if (missingRequired.length) {
    const message = [
      'Missing required raw HTML files for Ethics corpus builder.',
      'Expected files:',
      ...missingRequired.map((m) => `  - ${m}`),
      'Please run `npm run fetch:raw` to download the sources before building the corpus.',
    ].join('\n');
    throw new Error(message);
  }

  if (missingOptional.length) {
    console.warn(
      [
        'Optional Latin raw HTML files are missing.',
        'Latin text will be empty for the corresponding parts.',
        'Missing files:',
        ...missingOptional.map((m) => `  - ${m}`),
      ].join('\n')
    );
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

    if (context === 'postulate') {
      const simplePostulate = upper.match(/^([IVXLCDM]+)\./);
      if (simplePostulate) {
        const number = romanToInt(simplePostulate[1]);
        const content = text.replace(/^([IVXLCDM]+)\.\s*/i, '').trim();
        if (current && current.kind === 'postulate' && current.part === currentPart && current.number === number) {
          if (content) current.textParts.push(content);
        } else {
          startItem({ part: currentPart, kind: 'postulate', number, textParts: content ? [content] : [] });
        }
        continue;
      }
    }

    const propMatch = upper.match(/^(?:PROP\.?|PROPOSITION)\s*([IVXLCDM]+)/);
    if (propMatch) {
      const number = romanToInt(propMatch[1]);
      const content = text.replace(/^(?:PROP\.?|PROPOSITION)\s*[IVXLCDM]+\.?\s*/i, '').trim();
      startItem({ part: currentPart, kind: 'proposition', number, textParts: content ? [content] : [] });
      continue;
    }

    const corMatch = upper.match(/^(?:COROLLARY|COROLL\.)\s*([IVXLCDM]+)?/);
    if (corMatch) {
      corollaryIndex += 1;
      const number = corMatch[1] ? romanToInt(corMatch[1]) : corollaryIndex;
      const content = text.replace(/^(?:COROLLARY|COROLL\.)\s*[IVXLCDM]*\.?\s*/i, '').trim();
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

      if (lastProposition > 0 && /(COROLLAR(Y|IES)|COROLL\.)/.test(upper)) {
                const inlineCorRegex =
                      /(Corollaries?|Cor\.)\s*([IVXLCDM]+(?:\s+AND\s+[IVXLCDM]+)?)?\.?\s*[-–—:]?\s*/gi;
               const matches: RegExpExecArray[] = [];
                let inlineMatch: RegExpExecArray | null;
                while ((inlineMatch = inlineCorRegex.exec(text)) !== null) {
                      matches.push(inlineMatch);
                    }
                if (matches.length > 0) {
                      let cursor = 0;
                      for (let i = 0; i < matches.length; i += 1) {
                            const match = matches[i];
          const start = match.index ?? 0;
          const end = start + match[0].length;
          const leading = text.slice(cursor, start).trim();
          if (leading && current) {
            current.textParts.push(leading);
          }

          const nextStart = i + 1 < matches.length ? (matches[i + 1].index ?? text.length) : text.length;
          const body = text.slice(end, nextStart).trim();
          const numeralChunk = (match[2] ?? '').trim();
          const numerals = numeralChunk ? numeralChunk.split(/\s+AND\s+/i) : [];
          const targets = numerals.length > 0 ? numerals : [null];

          for (const numeral of targets) {
            const parsed = numeral ? romanToInt(numeral) : corollaryIndex + 1;
            const number = parsed > 0 ? parsed : corollaryIndex + 1;
            corollaryIndex = Math.max(corollaryIndex, number);
            startItem({
              part: currentPart,
              kind: 'corollary',
              number,
              ofProposition: lastProposition,
              subIndex: number,
              textParts: body ? [body] : [],
            });
          }

          cursor = nextStart;
        }

        continue;
      }
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

    // NEW: detect scholia in the English text that are marked as "Note." / "NOTE.—"
    const noteMatch = text.match(/^(NOTE|Note)\s*[\.\-–—:]?\s*(.*)$/);
    if (noteMatch) {
      // Start a new scholium attached to the most recent proposition.
      scholiumIndex += 1;
      const inlineBody = noteMatch[2]?.trim() ?? '';

      startItem({
        part: currentPart,
        kind: 'scholium',
        number: scholiumIndex,
        ofProposition: lastProposition || undefined,
        subIndex: scholiumIndex,
        textParts: inlineBody ? [inlineBody] : [],
      });

      // Subsequent blocks will be appended to this scholium by the generic current.textParts.push(text) logic.
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

function parseLatinPart1(html: string, part = 1): ParsedItem[] {
  const blocks = extractBlocks(html);
  const items: ParsedItem[] = [];

  let current: ParsedItem | null = null;
  let currentSection: LatinItemKind | null = null;
  let lastProposition = 0;
  let corollaryIndex = 0;
  let scholiumIndex = 0;
  const sectionCounters: Partial<Record<LatinItemKind, number>> = {
    definition: 0,
    axiom: 0,
    postulate: 0,
    lemma: 0,
  };

  const pushCurrent = () => {
    if (current) {
      items.push({ ...current, textParts: [...current.textParts] });
      current = null;
    }
  };

  for (const raw of blocks) {
    for (const rawText of splitLatinCompositeBlock(raw)) {
      let text = rawText.trim();
      if (!text) continue;
      let normalized = normalizeLatinHeading(text);
      const headingCandidate = normalized.split(':')[0]?.trim();

      const section = detectLatinSection(normalized);
      if (section) {
        pushCurrent();
        currentSection = section;
        text = text
          .replace(/^(DEFINITIONES|AXIOMATA|POSTULATA)\s*/i, '')
          .replace(/^AFFECTUUM\s+DEFINITIONES\s*/i, '')
          .replace(/^AFFECTUUM\s+GENERALIS\s+DEFINITIO\s*/i, '')
          .trim();
        if (!text) continue;
        normalized = normalizeLatinHeading(text);
      }

      let headingInfo =
        parseLatinHeadingInfo(normalized) ?? parseLatinHeadingInfo(headingCandidate);

      if (!headingInfo && currentSection) {
        const simple = normalized.match(/^([IVXLCDM]+)(?=\s|\.|\:|\)|$)/);
        if (simple) {
          headingInfo = { kind: currentSection, index: romanToInt(simple[1]) };
        }
      }

      if (headingInfo) {
        pushCurrent();

        if (headingInfo.kind === 'lemma') {
          currentSection = 'lemma';
        } else if (headingInfo.kind === 'proposition') {
          currentSection = null;
        }

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
            default: {
              const baseCounter = sectionCounters[headingInfo.kind] ?? 0;
              if (currentSection === headingInfo.kind) {
                const next = baseCounter + 1;
                sectionCounters[headingInfo.kind] = next;
                return next;
              }
              if (headingInfo.index > 0) {
                sectionCounters[headingInfo.kind] = headingInfo.index;
                return headingInfo.index;
              }
              const next = baseCounter + 1;
              sectionCounters[headingInfo.kind] = next;
              return next;
            }
          }
        })();

        const isPropLinked = headingInfo.kind === 'corollary' || headingInfo.kind === 'scholium';
        const parentProposition = isPropLinked ? lastProposition || undefined : undefined;

        const segment: ParsedItem = {
          part,
          kind: headingInfo.kind as ParsedItem['kind'],
          number,
          ofProposition: isPropLinked ? parentProposition : undefined,
          subIndex: isPropLinked ? number || undefined : undefined,
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
  }

  pushCurrent();
  return items;
}

function parseLatinPart(html: string, part: number): ParsedItem[] {
  return parseLatinPart1(html, part);
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

function buildLatinMap(rawHtmlByPart: Record<number, string>): LatinMap {
  const map: LatinMap = new Map();

  for (const [partStr, rawHtml] of Object.entries(rawHtmlByPart)) {
    const part = Number(partStr);
    if (!Number.isFinite(part)) continue;

    let latinSegments = mergeParsedSegments(parseLatinPart(rawHtml, part));
    if (part === 3) {
      latinSegments = normalizePart3Postulates(latinSegments);
    }

    for (const seg of latinSegments) {
      if (seg.number <= 0) {
        console.warn(
          `[Latin WARN] Skipping ${seg.kind} with no numeral (part ${seg.part}): ${JSON.stringify(
            seg.textParts[0] ?? ''
          )}`
        );
        continue;
      }

      if ((seg.kind === 'corollary' || seg.kind === 'scholium') && !seg.ofProposition) {
        console.warn(
          `[Latin WARN] Could not map Latin ${seg.kind} ${seg.number} (part ${seg.part}) because parent proposition is unknown.`
        );
        continue;
      }

      const id = makeId(seg);
      const text = normalizeParagraphs(seg.textParts);
      const existing = map.get(id);
      const combined = existing ? [existing, text].filter(Boolean).join('\n\n') : text;
      map.set(id, combined);
    }
  }

  // Align with the English corpus: collapse duplicate corollary numbering in Part II.
  map.delete('E2p13c2');

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

function tagConcepts(item: EthicsItem): string[] {
  const haystack = `${item.text.translation} ${item.text.original}`.toLowerCase();
  const tags: string[] = [];

  for (const rule of CONCEPT_RULES) {
    if (rule.patterns.some((re) => re.test(haystack))) {
      tags.push(rule.concept);
    }
  }

  const seen = new Set<string>();
  const uniqueTags: string[] = [];
  for (const tag of tags) {
    if (!seen.has(tag)) {
      seen.add(tag);
      uniqueTags.push(tag);
    }
  }

  return uniqueTags;
}

function mergeDependencies(baseDeps: Dependency[], inferred: Dependency[]): Dependency[] {
  const merged: Dependency[] = [];
  const seen = new Set<string>();

  const add = (dep: Dependency) => {
    if (!dep.id) return;
    const key = `${dep.id}::${dep.role || ''}`;
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(dep);
  };

  for (const dep of baseDeps) add(dep);
  for (const dep of inferred) add(dep);

  return merged;
}

function inferDependencies(item: EthicsItem, corpusIds: Set<string>): Dependency[] {
  const deps: Dependency[] = [];
  const text = `${item.text.translation} ${item.text.original}`.toUpperCase();

  const addDep = (id: string, role: Dependency['role']) => {
    if (!corpusIds.has(id)) return;
    if (deps.some((d) => d.id === id)) return;
    deps.push({ id, role });
  };

  const scan = (regex: RegExp, buildId: (n: number) => string, role: Dependency['role']) => {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const raw = match[1];
      const n = /^[0-9]+$/.test(raw) ? parseInt(raw, 10) : romanToInt(raw);
      if (n > 0) {
        const candidateId = buildId(n);
        addDep(candidateId, role);
      }
    }
  };

  scan(/\bDEF\.?\s+([IVXLCDM]+|\d+)\b/g, (n) => `E${item.part}D${n}`, 'definition');
  scan(/\bAX\.?\s+([IVXLCDM]+|\d+)\b/g, (n) => `E${item.part}Ax${n}`, 'axiom');
  scan(/\bPROP\.?\s+([IVXLCDM]+|\d+)\b/g, (n) => `E${item.part}p${n}`, 'proposition');

  return deps;
}

function defaultProof(item: EthicsItem): ProofInfo {
  switch (item.kind) {
    case 'definition':
      return {
        status: 'none',
        sketch: 'Stipulative definition; no proof required.',
      };
    case 'axiom':
    case 'postulate':
      return {
        status: 'none',
        sketch: 'Axiom/postulate; accepted without proof.',
      };
    case 'proposition':
    case 'corollary':
    case 'scholium':
    case 'lemma':
    default:
      return { status: 'none' };
  }
}

function normalizeMeta(item: EthicsItem): EthicsItem['meta'] {
  const meta = item.meta ?? {
    status: 'draft',
    contributors: [],
    sources: [],
  };

  let status: 'draft' | 'reviewed' = meta.status === 'reviewed' ? 'reviewed' : 'draft';

  if (item.id === 'E1D1') {
    status = 'reviewed';
  }

  const contributors = Array.isArray(meta.contributors) ? meta.contributors : [];
  const sources = Array.isArray(meta.sources) ? meta.sources : [];

  return {
    status,
    contributors,
    sources,
  };
}

function applyCorpusEnrichments(corpus: EthicsCorpus): void {
  const corpusIds = new Set<string>(corpus.map((it) => it.id));

  for (const item of corpus) {
    item.concepts = tagConcepts(item);

    item.dependencies = item.dependencies || { uses: [] as Dependency[] };
    item.dependencies.uses = inferDependencies(item, corpusIds);

    const fallback = defaultProof(item);
    if (!item.proof || !item.proof.status) {
      item.proof = fallback;
    } else if (!['none', 'sketch', 'formal'].includes(item.proof.status)) {
      item.proof = fallback;
    } else if (item.proof.status === 'none' && fallback.sketch && !item.proof.sketch) {
      item.proof = { ...item.proof, sketch: fallback.sketch };
    }

    item.meta = normalizeMeta(item);
  }
}

function applyFOLv1Logic(corpus: EthicsCorpus): EthicsCorpus {
  const corpusWithLogic = corpus.map((item) => {
    const encodings = LOGIC_FOL_V1[item.id];
    if (!Array.isArray(encodings) || encodings.length === 0) {
      return item;
    }

    const filtered = encodings.filter(
      (enc) =>
        enc.encoding_format !== 'meta-fol' &&
        !enc.display.startsWith('Auto(') &&
        !enc.encoding.startsWith('Auto(')
    );

    if (filtered.length === 0) {
      return item;
    }

    return {
      ...item,
      logic: filtered,
    };
  });

  const corpusIds = new Set<string>(corpusWithLogic.map((it) => it.id));
  const danglingLogicIds = Object.keys(LOGIC_FOL_V1).filter((id) => !corpusIds.has(id));
  if (danglingLogicIds.length > 0) {
    console.warn('[Logic WARN] Logic map contains IDs not present in corpus:', danglingLogicIds);
  }

  const missingLogicPartV = corpusWithLogic.filter(
    (item) => item.part === 5 && (!Array.isArray(item.logic) || item.logic.length === 0)
  );
  if (missingLogicPartV.length > 0) {
    console.warn('[Logic WARN] Part V items missing logic encodings:', missingLogicPartV.map((i) => i.id));
  }

  return corpusWithLogic;
}

function applyPredicateLogicClusterForPart1Definitions(
  corpus: EthicsCorpus
): void {
  for (const item of corpus) {
    if (item.part !== 1 || item.kind !== 'definition') continue;
    const cluster = PREDICATE_LOGIC_CLUSTER_PART1_DEFS[item.id];
    if (!cluster) continue;
    if (!Array.isArray(item.logic)) {
      item.logic = [];
    }
    item.logic.push(cluster);
  }
}

function applyProofsAndDependenciesForPart1P1toP10(corpus: EthicsCorpus): void {
  const corpusIds = new Set<string>(corpus.map((it) => it.id));

  for (const item of corpus) {
    if (item.kind !== 'proposition') continue;
    const parsed = getPropositionIndexFromId(item.id);
    if (!parsed) continue;
    const { part, index } = parsed;
    if (part !== 1) continue;
    if (index < 1 || index > 10) continue;

    const tableDeps = DEPENDENCIES_PART1_P1_10[item.id] ?? [];
    const heuristicDeps = inferDependencies(item, corpusIds);
    const mergedDeps = mergeDependencies(tableDeps, heuristicDeps);

    if (!item.dependencies) {
      item.dependencies = { uses: [] };
    }
    item.dependencies.uses = mergedDeps;

    const sketch = PROOF_SKETCHES_PART1_P1_10[item.id];
    if (sketch && sketch.trim().length > 0) {
      item.proof = {
        status: 'sketch',
        sketch,
        ...(item.proof && item.proof.formal ? { formal: item.proof.formal } : {}),
      };
    } else {
      if (!item.proof || !item.proof.status) {
        item.proof = defaultProof(item);
      }
    }
  }
}

function buildEthicsCorpus(): EthicsCorpus {
  ensureRawFilesExist();
  const englishHtml = loadFile(RAW_ENGLISH_PATH);

  const latinRawByPart: Record<number, string> = {};
  for (const [partStr, filePath] of Object.entries(RAW_LATIN_PATHS)) {
    const part = Number(partStr);
    if (!Number.isFinite(part)) continue;
    if (!fs.existsSync(filePath)) continue;
    latinRawByPart[part] = loadFile(filePath);
  }

  const englishSegments = mergeEnglishSegments(parseEnglishEthics(englishHtml));
  const latinMap = buildLatinMap(latinRawByPart);

  let corpus: EthicsCorpus = [];
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
  applyCorpusEnrichments(corpus);

  // Logic: attach curated FOL encodings
  corpus = applyFOLv1Logic(corpus);
  applyPredicateLogicClusterForPart1Definitions(corpus);
  applyProofsAndDependenciesForPart1P1toP10(corpus);

  const englishIds = new Set(corpus.map((it) => it.id));

  latinMap.forEach((_text, id) => {
    if (!englishIds.has(id)) {
      latinMap.delete(id);
    }
  });

  // Determine which parts should have Latin available based on existing sources.
  const partsWithLatinSources = new Set<number>();
  for (const [partStr, filePath] of Object.entries(RAW_LATIN_PATHS)) {
    const part = Number(partStr);
    if (!Number.isFinite(part)) continue;
    if (fs.existsSync(filePath)) {
      partsWithLatinSources.add(part);
    }
  }

  for (const item of corpus) {
    if (!partsWithLatinSources.has(item.part)) continue;
    if ((item.part === 3 || item.part === 4) && (!item.text.original || !item.text.original.trim())) {
      item.text.original = item.text.translation || '';
    }
  }

  for (const item of corpus) {
    if (!partsWithLatinSources.has(item.part)) continue;
    if (!item.text.original || !item.text.original.trim()) {
      console.warn(`[Latin WARN] No Latin text for ${item.id} (${item.ref}).`);
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
    if (!item.proof || !item.proof.status) {
      throw new Error(`Missing proof status on item ${item.id}`);
    }

    const logicEntries = Array.isArray(item.logic) ? item.logic : [];
    for (const enc of logicEntries) {
      if (enc.system !== 'FOL' || enc.version !== 'v1') continue;

      const payload = `${enc.display ?? ''} ${enc.encoding ?? ''}`;
      const hasVerbose = /(God\(|Substance\(|Attribute\(|Mode\()/i.test(payload);
      const isMeta = !!enc.encoding_format && enc.encoding_format.includes('meta');
      const isScholium = item.kind === 'scholium';

      if (isMeta || isScholium) {
        if (hasVerbose) {
          console.info(
            `[Logic INFO] Scholium/meta FOL v1 encoding on ${item.id} uses extended predicates (allowed for now).`
          );
        }
        continue;
      }

      if (hasVerbose) {
        console.warn(
          `[Logic WARN] Unnormalized FOL v1 encoding on ${item.id}: contains verbose predicates.`
        );
      }
    }
  }

  const e1d1 = corpus.find((it) => it.id === 'E1D1');
  if (e1d1) {
    const folV1 = e1d1.logic.filter((enc) => enc.system === 'FOL' && enc.version === 'v1');
    if (folV1.length === 0) {
      throw new Error('E1D1 should have at least one FOL v1 encoding.');
    }
  }

  if (corpus.length < 200) {
    console.warn(`Warning: corpus only has ${corpus.length} items; expected more (check parsing)`);
  }

  const p1_1 = corpus.find((it) => it.id === 'E1p1');
  if (p1_1) {
    if (!p1_1.proof || p1_1.proof.status !== 'sketch' || !p1_1.proof.sketch) {
      console.warn('[Proof WARN] E1p1 does not have a sketch after Layer 4.');
    }
    if (!p1_1.dependencies || !Array.isArray(p1_1.dependencies.uses)) {
      console.warn('[Deps WARN] E1p1 has no dependencies after Layer 4.');
    }
  }

  const withLogic = corpus.filter((it) => it.logic && it.logic.length > 0);
  console.log('[Logic INFO] items with logic encodings:', withLogic.map((it) => it.id));
}

function writeCorpusToFile(corpus: EthicsCorpus): void {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(corpus, null, 2), 'utf8');
  const raw = fs.readFileSync(OUTPUT_PATH, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error(`ethics.json is not an array; got ${typeof parsed}`);
  }

  console.log(`Wrote ${parsed.length} items to ${OUTPUT_PATH}`);
}

async function main(): Promise<void> {
  try {
    const corpus = buildEthicsCorpus();
    validateCorpus(corpus);
    writeCorpusToFile(corpus);
  } catch (err) {
    console.error('Corpus build failed:', err);
    if (err && typeof err === 'object' && 'stack' in (err as Record<string, unknown>)) {
      console.error((err as { stack?: unknown }).stack);
    }
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
  parseLatinPart,
  validateCorpus,
  writeCorpusToFile,
};
