import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import { execFile } from 'node:child_process';
import { CANONICAL_ENGLISH_SOURCE_URL, CANONICAL_LATIN_SOURCE_URL } from '../src/data/constants.js';

const RAW_DIR = path.join(process.cwd(), 'data', 'raw');

const LATIN_PART_SOURCES = [
  {
    part: 1,
    url: CANONICAL_LATIN_SOURCE_URL,
    output: path.join(RAW_DIR, 'latin-part1.html'),
  },
  {
    part: 2,
    url: 'https://www.thelatinlibrary.com/spinoza.ethica2.html',
    output: path.join(RAW_DIR, 'latin-part2.html'),
  },
  {
    part: 3,
    url: 'https://www.thelatinlibrary.com/spinoza.ethica3.html',
    output: path.join(RAW_DIR, 'latin-part3.html'),
  },
  {
    part: 4,
    url: 'https://www.thelatinlibrary.com/spinoza.ethica4.html',
    output: path.join(RAW_DIR, 'latin-part4.html'),
  },
  {
    part: 5,
    url: 'https://www.thelatinlibrary.com/spinoza.ethica5.html',
    output: path.join(RAW_DIR, 'latin-part5.html'),
  },
] as const;

// Simple helper to ensure directories exist
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    client
      .get(url, { family: 4 }, (res) => {
        const { statusCode, headers } = res;
        if (statusCode && statusCode >= 300 && statusCode < 400 && headers.location) {
          // Follow simple redirects
          return resolve(fetchHtml(headers.location));
        }
        if (statusCode !== undefined && statusCode >= 400) {
          reject(new Error(`Request failed with status ${statusCode}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer.toString('utf8'));
        });
      })
      .on('error', reject);
  });
}

async function fetchAndWrite(url: string, targetPath: string) {
  console.log(`Fetching ${url} ...`);
  let text: string | null = null;
  const candidates = url.startsWith('https://') ? [url, url.replace('https://', 'http://')] : [url];

  for (const candidate of candidates) {
    try {
      text = await fetchHtml(candidate);
      break;
    } catch (error) {
      console.warn(`Primary fetch failed for ${candidate}: ${String(error)}`);
    }
  }

  if (!text) {
    console.warn(`Falling back to curl for ${url} ...`);
    text = await new Promise<string>((resolve, reject) => {
      execFile('curl', ['-L', url], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
        if (err) {
          reject(new Error(`curl failed: ${stderr || err.message}`));
          return;
        }
        resolve(stdout);
      });
    });
  }
  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(targetPath, text, 'utf8');
  console.log(`Saved ${targetPath}`);
}

async function fetchLatinWithCurlFallback(source: (typeof LATIN_PART_SOURCES)[number]) {
  const { part, url, output } = source;
  const label = `Latin Part ${part}`;

  console.log(`Fetching ${label} from ${url} ...`);
  await fetchAndWrite(url, output);
}

async function main() {
  const englishPath = path.join(RAW_DIR, 'english-ethics.html');

  console.log('Capturing raw Ethics HTML sources (for offline segmentation only)...');
  for (const source of LATIN_PART_SOURCES) {
    await fetchLatinWithCurlFallback(source);
  }
  await fetchAndWrite(CANONICAL_ENGLISH_SOURCE_URL, englishPath);
  console.log('Done. Review the raw HTML files and segment manually into structured JSON.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
