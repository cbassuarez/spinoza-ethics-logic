import fs from 'node:fs';
import path from 'node:path';
import { CANONICAL_ENGLISH_SOURCE_URL, CANONICAL_LATIN_SOURCE_URL } from '../src/data/constants';

// Simple helper to ensure directories exist
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function fetchAndWrite(url: string, targetPath: string) {
  console.log(`Fetching ${url} ...`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(targetPath, text, 'utf8');
  console.log(`Saved ${targetPath}`);
}

async function main() {
  const latinPath = path.join(process.cwd(), 'data', 'raw', 'latin-part1.html');
  const englishPath = path.join(process.cwd(), 'data', 'raw', 'english-ethics.html');

  console.log('Capturing raw Ethics HTML sources (for offline segmentation only)...');
  await fetchAndWrite(CANONICAL_LATIN_SOURCE_URL, latinPath);
  await fetchAndWrite(CANONICAL_ENGLISH_SOURCE_URL, englishPath);
  console.log('Done. Review the raw HTML files and segment manually into structured JSON.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
