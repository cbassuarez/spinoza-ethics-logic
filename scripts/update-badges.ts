import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BADGE_CONFIG } from './badge-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BADGE_PATH = path.resolve(__dirname, '..', 'docs', 'badges', 'spinozaBadge-props.svg');

function main() {
  if (!fs.existsSync(BADGE_PATH)) {
    console.warn(`Badge SVG not found at ${BADGE_PATH} – skipping badge update.`);
    return;
  }

  const raw = fs.readFileSync(BADGE_PATH, 'utf8');

  const versionText = `v${BADGE_CONFIG.version}`;
  const coverageText = `${BADGE_CONFIG.propsCoverage}% PROPS`;

  let updated = updateTextNode(raw, 'badge-version', versionText);
  updated = updateTextNode(updated, 'badge-coverage', coverageText);

  fs.writeFileSync(BADGE_PATH, updated);
  console.log('Updated badge SVG:', {
    version: versionText,
    coverage: coverageText,
  });
}

main();
