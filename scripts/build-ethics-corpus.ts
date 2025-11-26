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

const CANONICAL_LATIN_SOURCE_URL =
  'https://www.thelatinlibrary.com/spinoza.ethica1.html';
const CANONICAL_ENGLISH_SOURCE_URL =
  'https://www.marxists.org/reference/subject/philosophy/works/ne/ethics.htm';

const PREDICATE_BLOCK_PART1_DEFS = [
  'predicate logic',
  'S(G)∧E(G)∧∀α[A(G,α)→Ess(α)]',
  '∀x∀y[(S(x)∧S(y)∧∃α(A(x,α)∧A(y,α)))→x=y]',
  '→∀x[(S(x)∧x≠G)→¬E(x)]',
  '→∀x[(S(x)∧x≠G)→¬C(x)]',
  '∴∀x[S(x)→x=G]',
  '∴∃!G[S(G)]',
  '∴∀x[(Ext(x)∨Cog(x))→∃α((A(G,α)∧(x=α))∨M(x,α))]',
].join('\n');

const PREDICATE_LOGIC_CLUSTER_ENCODING: LogicEncoding = {
  system: 'FOL',
  version: 'v1',
  display: PREDICATE_BLOCK_PART1_DEFS,
  encoding_format: 'derivation-block',
  encoding: PREDICATE_BLOCK_PART1_DEFS,
  notes:
    'Cluster-level derivation for Part I definitions (God, substance, attributes, modes) using S,G,E,A,Ess,M,Ext,Cog,C,… notation.',
};

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

const LOGIC_FOL_V1_DEFINITIONS_PART1: Record<string, LogicEncoding[]> = {
  // E1D1: Self-caused (causa sui)
  E1D1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '\\forall x\\, (C(x) \\leftrightarrow E(x))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: C(x) <-> E(x)',
      notes:
        'C(x): x is causa sui (self-caused). E(x): x\'s essence involves existence (its nature necessitates existence).',
    },
  ],

  // E1D2: Finite in its kind
  E1D2: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        '\\forall x\\, (F(x) \\leftrightarrow \\exists y\\, (Same(x, y) \\land Limits(y, x)))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: F(x) <-> exists y: Same(x, y) & Limits(y, x)',
      notes:
        'F(x): x is finite in its kind. Same(x, y): x and y share the same nature. Limits(y, x): y bounds or limits x\'s nature.',
    },
  ],

  // E1D3: Substance
  E1D3: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        '\\forall x\\, (S(x) \\leftrightarrow (InSelf(x) \\land SelfConceived(x)))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: S(x) <-> (InSelf(x) & SelfConceived(x))',
      notes:
        'S(x): x is a substance. InSelf(x): x exists in itself. SelfConceived(x): x is conceived through itself (its concept does not require another).',
    },
  ],

  // E1D4: Attribute
  E1D4: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        '\\forall \\alpha\\, (Attr(\\alpha) \\leftrightarrow \\exists s\\, (S(s) \\land A(s, \\alpha) \\land Ess(\\alpha)))',
      encoding_format: 'custom-fol',
      encoding: 'forall alpha: Attr(alpha) <-> exists s: S(s) & A(s, alpha) & Ess(alpha)',
      notes:
        'Attr(α): α is an attribute. S(s): s is a substance. A(s, α): α belongs to substance s. Ess(α): α expresses or constitutes the essence of the substance.',
    },
  ],

  // E1D5: Mode
  E1D5: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        '\\forall m\\,\\forall s\\,\\forall \\alpha\\, (M(m, \\alpha) \\leftrightarrow (A(s, \\alpha) \\land InOther(m, s) \\land ConceivedThrough(m, s)))',
      encoding_format: 'custom-fol',
      encoding:
        'forall m forall s forall alpha: M(m, alpha) <-> (A(s, alpha) & InOther(m, s) & ConceivedThrough(m, s))',
      notes:
        'M(m, α): m is a mode under attribute α. A(s, α): α is an attribute of substance s. InOther(m, s): m exists in s. ConceivedThrough(m, s): m is conceived through s.',
    },
  ],

  // E1D6: God
  E1D6: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        '\\forall x\\, (G(x) \\leftrightarrow (S(x) \\land InfAtt(x) \\land \\forall \\alpha\\, (A(x, \\alpha) \\rightarrow Ess(\\alpha))))',
      encoding_format: 'custom-fol',
      encoding:
        'forall x: G(x) <-> (S(x) & InfAtt(x) & forall alpha: (A(x, alpha) -> Ess(alpha)))',
      notes:
        'G(x): x is God. S(x): x is a substance. InfAtt(x): x has absolutely infinite attributes. A(x, α): attribute α belongs to x. Ess(α): α expresses the essence of the substance.',
    },
  ],

  // E1D7: Free
  E1D7: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        '\\forall x\\, (Free(x) \\leftrightarrow (FromNature(x) \\land ActsFromNature(x)))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Free(x) <-> (FromNature(x) & ActsFromNature(x))',
      notes:
        'Free(x): x is free. FromNature(x): x exists solely from the necessity of its own nature. ActsFromNature(x): x is determined to act by itself alone (not by external compulsion).',
    },
  ],

  // E1D8: Eternal
  E1D8: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        '\\forall x\\, (Eternal(x) \\leftrightarrow (DefImpliesExistence(x) \\land Atemporal(x)))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Eternal(x) <-> (DefImpliesExistence(x) & Atemporal(x))',
      notes:
        'Eternal(x): x is eternal. DefImpliesExistence(x): x\'s existence follows solely from its definition. Atemporal(x): x\'s existence is conceived without relation to time.',
    },
  ],
};

const PREDICATE_LOGIC_CLUSTER_PART1_DEFS: Record<string, LogicEncoding> = {
  E1D1: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D2: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D3: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D4: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D5: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D6: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D7: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D8: PREDICATE_LOGIC_CLUSTER_ENCODING,
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

function applyFOLv1DefinitionsPart1(corpus: EthicsCorpus): void {
  for (const item of corpus) {
    if (item.part !== 1 || item.kind !== 'definition') continue;

    const encodings = LOGIC_FOL_V1_DEFINITIONS_PART1[item.id];
    if (!encodings || encodings.length === 0) {
      console.warn(`[Logic WARN] No FOL v1 definition encoding for ${item.id} (${item.ref}).`);
      continue;
    }

    if (!Array.isArray(item.logic)) {
      item.logic = [];
    }

    item.logic = item.logic.filter((enc) => !(enc.system === 'FOL' && enc.version === 'v1'));

    for (const enc of encodings) {
      item.logic.push(enc);
    }
  }
}

function applyPredicateLogicClusterForPart1Definitions(corpus: EthicsCorpus): void {
  for (const item of corpus) {
    if (item.part !== 1 || item.kind !== 'definition') continue;

    const extra = PREDICATE_LOGIC_CLUSTER_PART1_DEFS[item.id];
    if (!extra) continue;

    if (!Array.isArray(item.logic)) {
      item.logic = [];
    }

    const alreadyPresent = item.logic.some(
      (enc) =>
        enc.system === extra.system &&
        enc.version === extra.version &&
        enc.encoding_format === extra.encoding_format &&
        enc.display === extra.display
    );

    if (!alreadyPresent) {
      item.logic.push(extra);
    }
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
  applyCorpusEnrichments(corpus);
  applyFOLv1DefinitionsPart1(corpus);
  applyPredicateLogicClusterForPart1Definitions(corpus);
  applyProofsAndDependenciesForPart1P1toP10(corpus);

  const englishIds = new Set(corpus.filter((it) => it.part === 1).map((it) => it.id));

  latinMap.forEach((_text, id) => {
    if (!englishIds.has(id)) {
      console.warn(`[Latin WARN] Latin map has entry for ${id} but no matching English item.`);
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
    if (!item.proof || !item.proof.status) {
      throw new Error(`Missing proof status on item ${item.id}`);
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
