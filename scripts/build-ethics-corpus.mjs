import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
const CANONICAL_LATIN_SOURCE_URL = 'https://www.thelatinlibrary.com/spinoza.ethica1.html';
const CANONICAL_ENGLISH_SOURCE_URL = 'https://www.marxists.org/reference/subject/philosophy/works/ne/ethics.htm';

process.on('uncaughtException', (error) => {
  console.error('Uncaught error while building corpus:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection while building corpus:', reason);
  process.exit(1);
});

console.log('Running Ethics corpus builder...');

const sources = {
  english: CANONICAL_ENGLISH_SOURCE_URL,
  latin: CANONICAL_LATIN_SOURCE_URL,
};

function normalize(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function romanToInt(roman) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
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

function deriveLabel(text) {
  const clean = normalize(text);
  if (!clean) return '';
  const sentenceMatch = clean.match(/(.{1,140}?[\.!?])\s/);
  if (sentenceMatch) return sentenceMatch[1];
  return clean.slice(0, 140);
}

function makeId(segment) {
  const base = `E${segment.part}`;
  switch (segment.kind) {
    case 'definition':
      return `${base}D${segment.number}`;
    case 'axiom':
      return `${base}Ax${segment.number}`;
    case 'postulate':
      return `${base}Post${segment.number}`;
    case 'lemma':
      return `${base}Lemma${segment.number}`;
    case 'proposition':
      return `${base}p${segment.number}`;
    case 'corollary':
      return `${base}p${segment.ofProposition ?? segment.number}c${segment.number}`;
    case 'scholium':
      return `${base}p${segment.ofProposition ?? segment.number}s${segment.number}`;
    default:
      return `${base}-${segment.number}`;
  }
}

function makeRef(segment) {
  const partLabel = `Part ${segment.part}`;
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
      return `${partLabel}, Proposition ${segment.ofProposition} Corollary ${segment.number}`;
    case 'scholium':
      return `${partLabel}, Proposition ${segment.ofProposition} Scholium ${segment.number}`;
    default:
      return partLabel;
  }
}

function stripPrefix(text, pattern) {
  return text.replace(pattern, '').trim();
}

function parseDocument(html, defaultPart = 0) {
  const dom = new JSDOM(html);
  const elements = Array.from(dom.window.document.body.children);
  const segments = [];

  let part = defaultPart;
  let context = null;
  let current = null;
  let currentProposition = null;
  let corollaryIndex = 0;
  let scholiumIndex = 0;

  const pushCurrent = () => {
    if (current) {
      segments.push(current);
      current = null;
    }
  };

  const beginSegment = (segment) => {
    pushCurrent();
    current = segment;
  };

  for (const el of elements) {
    const tag = el.tagName.toLowerCase();

    if (tag === 'h3') {
      pushCurrent();
      const heading = normalize(el.textContent ?? '');
      const partMatch = heading.match(/Part\s+([IVXLCDM]+)/i);
      if (partMatch) {
        part = romanToInt(partMatch[1]);
        context = null;
        currentProposition = null;
        corollaryIndex = 0;
        scholiumIndex = 0;
      }
      continue;
    }

    if (tag === 'h4') {
      pushCurrent();
      const heading = normalize(el.textContent ?? '').toLowerCase();
      if (heading.includes('definition')) context = 'definition';
      else if (heading.includes('axiom')) context = 'axiom';
      else if (heading.includes('postulate')) context = 'postulate';
      else if (heading.includes('lemma')) context = 'lemma';
      else context = null;
      continue;
    }

    if (tag !== 'p' || !part) continue;

    const text = normalize(el.textContent ?? '');
    if (!text) continue;

    const propMatch = text.match(/^PROP\.\s*([IVXLCDM]+)\./i);
    if (propMatch) {
      const number = romanToInt(propMatch[1]);
      beginSegment({
        part,
        kind: 'proposition',
        number,
        textParts: [stripPrefix(text, /^PROP\.\s*[IVXLCDM]+\.\s*/i)],
      });
      currentProposition = number;
      corollaryIndex = 0;
      scholiumIndex = 0;
      continue;
    }

    const corollaryMatch = text.match(/^Corollary\s*([IVXLCDM]+)?/i);
    if (corollaryMatch && currentProposition) {
      const number = corollaryMatch[1] ? romanToInt(corollaryMatch[1]) : corollaryIndex + 1;
      beginSegment({
        part,
        kind: 'corollary',
        number,
        ofProposition: currentProposition,
        textParts: [stripPrefix(text, /^Corollary\s*[IVXLCDM]*\.?\s*/i)],
      });
      corollaryIndex = number;
      continue;
    }

    const scholiumMatch = text.match(/^(Scholium|Note)\s*([IVXLCDM]+)?/i);
    if (scholiumMatch && currentProposition) {
      const number = scholiumMatch[2] ? romanToInt(scholiumMatch[2]) : scholiumIndex + 1;
      beginSegment({
        part,
        kind: 'scholium',
        number,
        ofProposition: currentProposition,
        textParts: [stripPrefix(text, /^(Scholium|Note)\s*[IVXLCDM]*\.?\s*/i)],
      });
      scholiumIndex = number;
      continue;
    }

    const lemmaMatch = text.match(/^LEMMA\s*([IVXLCDM]+)\./i);
    if (lemmaMatch) {
      beginSegment({
        part,
        kind: 'lemma',
        number: romanToInt(lemmaMatch[1]),
        textParts: [stripPrefix(text, /^LEMMA\s*[IVXLCDM]+\.\s*/i)],
      });
      continue;
    }

    const postulateMatch = text.match(/^Postulate\s*([IVXLCDM]+)\.?/i);
    if (postulateMatch || context === 'postulate') {
      const number = postulateMatch ? romanToInt(postulateMatch[1]) : romanToInt(text.match(/^([IVXLCDM]+)\./)?.[1] ?? '0');
      if (number) {
        beginSegment({
          part,
          kind: 'postulate',
          number,
          textParts: [stripPrefix(text, /^(Postulate\s*)?[IVXLCDM]+\.?\s*/i)],
        });
        continue;
      }
    }

    const axiomMatch = text.match(/^Axiom\s*([IVXLCDM]+)\.?/i);
    if (axiomMatch || context === 'axiom') {
      const number = axiomMatch ? romanToInt(axiomMatch[1]) : romanToInt(text.match(/^([IVXLCDM]+)\./)?.[1] ?? '0');
      if (number) {
        beginSegment({
          part,
          kind: 'axiom',
          number,
          textParts: [stripPrefix(text, /^(Axiom\s*)?[IVXLCDM]+\.?\s*[–-]?\s*/i)],
        });
        continue;
      }
    }

    if (context === 'definition') {
      const defMatch = text.match(/^([IVXLCDM]+)\./);
      if (defMatch) {
        beginSegment({
          part,
          kind: 'definition',
          number: romanToInt(defMatch[1]),
          textParts: [stripPrefix(text, /^[IVXLCDM]+\.\s*/)],
        });
        continue;
      }
    }

    if (current) {
      current.textParts.push(text);
    }
  }

  pushCurrent();
  return segments;
}

function loadFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function attachLatinText(items, latinSegments) {
  const latinMap = new Map();
  latinSegments
    .filter((segment) => segment.part === 1)
    .forEach((segment) => {
      latinMap.set(makeId(segment), segment.textParts.join('\n\n'));
    });

  items.forEach((item) => {
    if (item.part === 1 && latinMap.has(item.id)) {
      item.text.original = latinMap.get(item.id) ?? '';
    }
  });
}

function buildCorpus() {
  const englishHtml = loadFile(path.join(process.cwd(), 'data', 'raw', 'english-ethics.html'));
  const latinHtml = loadFile(path.join(process.cwd(), 'data', 'raw', 'latin-part1.html'));

  const englishSegments = parseDocument(englishHtml);
  const latinSegments = parseDocument(latinHtml, 1);

  const corpus = [];
  let currentPart = 0;
  let order = 0;

  for (const segment of englishSegments) {
    if (segment.part !== currentPart) {
      currentPart = segment.part;
      order = 0;
    }
    order += 1;

    const translation = segment.textParts.join('\n\n');
    const id = makeId(segment);
    const baseSources = [
      `English source: R.H.M. Elwes translation as hosted by Marxists Internet Archive (${sources.english})`,
    ];
    const sourceList = segment.part === 1
      ? [`Latin source: The Latin Library (${sources.latin})`, ...baseSources]
      : baseSources;

    const item = {
      id,
      ref: makeRef(segment),
      part: segment.part,
      kind: segment.kind,
      label: deriveLabel(translation),
      order,
      text: {
        original_language: 'Latin',
        original: '',
        translation,
      },
      concepts: [],
      logic: [],
      dependencies: { uses: [] },
      proof: { status: 'none' },
      meta: {
        status: 'draft',
        contributors: [],
        sources: sourceList,
      },
    };

    corpus.push(item);
  }

  attachLatinText(corpus, latinSegments);
  return corpus;
}

function writeCorpus(items) {
  const targetPath = path.join(process.cwd(), 'src', 'data', 'ethics.json');
  fs.writeFileSync(targetPath, JSON.stringify(items, null, 2), 'utf8');
  console.log(`Wrote ${items.length} items to ${targetPath}`);
}

function summarize(items) {
  const counts = items.reduce((acc, item) => {
    acc[item.kind] = (acc[item.kind] ?? 0) + 1;
    return acc;
  }, {});
  console.log('Summary by kind:', counts);
  const parts = new Set(items.map((item) => item.part));
  console.log('Parts covered:', Array.from(parts).join(', '));
}

function main() {
  const corpus = buildCorpus();
  writeCorpus(corpus);
  summarize(corpus);
}

main();
