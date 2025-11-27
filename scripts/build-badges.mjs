import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const rootDir = path.resolve(__dirname, '..');
const configPath = path.join(rootDir, 'badges.config.json');
const outDir = path.join(rootDir, 'docs', 'badges');

if (!fs.existsSync(configPath)) {
  throw new Error(`Missing badges.config.json at ${configPath}`);
}

const raw = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(raw);

/**
 * Expected shape:
 * {
 *   "version": "0.1.0",
 *   "folV1": {
 *     "label": "FOL v1",
 *     "coverageGlobal": "—",
 *     "coveragePropositions": "TBD"
 *   }
 * }
 */
const version = String(config.version ?? '0.0.0');
const folLabel = String(config.folV1?.label ?? 'FOL v1');
const folCoverageProps = String(config.folV1?.coveragePropositions ?? 'TBD');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

/**
 * Common palette (deep indigo + gold).
 */
const COLORS = {
  bgOuter: '#020617',         // near slate-950
  bgInner: '#111827',         // slightly lighter indigo/slate
  borderStart: '#1e293b',     // blue-slate
  borderEnd: '#fbbf24',       // gold
  textMain: '#e5e7eb',        // light slate
  textMuted: '#9ca3af',       // muted gray
  gold: '#fbbf24',            // primary gold
};

/**
 * Base viewBox and geometry.
 */
const VIEWBOX = '0 0 220 40';
const WIDTH = 220;
const HEIGHT = 40;
const RADIUS = 18;

/**
 * Font stacks.
 */
const FONT_SERIF =
  '"EB Garamond", Garamond, "Times New Roman", Times, serif';
const FONT_MONO =
  '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/**
 * Version badge SVG (Spinoza Ethics Logic Workspace).
 */
function createVersionBadgeSvg() {
  return String.raw`<svg viewBox="${VIEWBOX}" width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">Spinoza Ethics Logic Workspace — version ${version}</title>
  <desc id="desc">Version badge for the Spinoza Ethics Logic Workspace project.</desc>
  <defs>
    <linearGradient id="badge-border" x1="0" y1="0" x2="220" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${COLORS.borderStart}" />
      <stop offset="0.55" stop-color="${COLORS.borderStart}" />
      <stop offset="1" stop-color="${COLORS.borderEnd}" />
    </linearGradient>
    <radialGradient id="badge-bg" cx="30%" cy="20%" r="80%">
      <stop offset="0" stop-color="${COLORS.bgInner}" />
      <stop offset="1" stop-color="${COLORS.bgOuter}" />
    </radialGradient>
  </defs>
  <rect
    x="0.5"
    y="0.5"
    width="${WIDTH - 1}"
    height="${HEIGHT - 1}"
    rx="${RADIUS}"
    fill="url(#badge-bg)"
    stroke="url(#badge-border)"
    stroke-width="1"
  />
  <!-- inner subtle bevel -->
  <rect
    x="2"
    y="2"
    width="${WIDTH - 4}"
    height="${HEIGHT - 4}"
    rx="${RADIUS - 2}"
    fill="none"
    stroke="rgba(15,23,42,0.75)"
    stroke-width="1"
  />
  <!-- left/title segment -->
  <g transform="translate(16, 0)">
    <text
      x="0"
      y="17"
      fill="${COLORS.textMain}"
      font-family=${FONT_SERIF}
      font-size="13"
      font-weight="600"
    >
      Spinoza Ethics
    </text>
    <text
      x="0"
      y="30"
      fill="${COLORS.textMuted}"
      font-family=${FONT_MONO}
      font-size="10"
      letter-spacing="0.22em"
      textLength="120"
      lengthAdjust="spacingAndGlyphs"
    >
      LOGIC WORKSPACE
    </text>
  </g>
  <!-- divider -->
  <line
    x1="142"
    y1="8"
    x2="142"
    y2="32"
    stroke="rgba(148,163,184,0.5)"
    stroke-width="1"
  />
  <!-- right/version segment -->
  <g transform="translate(0, 0)" text-anchor="end">
    <text
      x="204"
      y="17"
      fill="${COLORS.gold}"
      font-family=${FONT_MONO}
      font-size="11"
      font-weight="600"
    >
      v${version}
    </text>
    <text
      x="204"
      y="30"
      fill="${COLORS.textMuted}"
      font-family=${FONT_MONO}
      font-size="10"
      letter-spacing="0.12em"
      textLength="64"
      lengthAdjust="spacingAndGlyphs"
    >
      ${folLabel}
    </text>
  </g>
</svg>
`;
}

/**
 * FOL v1 propositions coverage badge.
 */
function createFOLPropsBadgeSvg() {
  return String.raw`<svg viewBox="${VIEWBOX}" width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">FOL v1 coverage for propositions — Spinoza Ethics Logic Workspace</title>
  <desc id="desc">Coverage badge for FOL v1 encodings on propositions in the Spinoza Ethics corpus.</desc>
  <defs>
    <linearGradient id="badge-border" x1="0" y1="0" x2="220" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${COLORS.borderStart}" />
      <stop offset="0.55" stop-color="${COLORS.borderStart}" />
      <stop offset="1" stop-color="${COLORS.borderEnd}" />
    </linearGradient>
    <radialGradient id="badge-bg" cx="30%" cy="20%" r="80%">
      <stop offset="0" stop-color="${COLORS.bgInner}" />
      <stop offset="1" stop-color="${COLORS.bgOuter}" />
    </radialGradient>
  </defs>
  <rect
    x="0.5"
    y="0.5"
    width="${WIDTH - 1}"
    height="${HEIGHT - 1}"
    rx="${RADIUS}"
    fill="url(#badge-bg)"
    stroke="url(#badge-border)"
    stroke-width="1"
  />
  <rect
    x="2"
    y="2"
    width="${WIDTH - 4}"
    height="${HEIGHT - 4}"
    rx="${RADIUS - 2}"
    fill="none"
    stroke="rgba(15,23,42,0.75)"
    stroke-width="1"
  />
  <!-- left/title segment -->
  <g transform="translate(16, 0)">
    <text
      x="0"
      y="17"
      fill="${COLORS.textMain}"
      font-family=${FONT_MONO}
      font-size="11"
      font-weight="600"
    >
      ${folLabel} coverage
    </text>
    <text
      x="0"
      y="30"
      fill="${COLORS.textMuted}"
      font-family=${FONT_SERIF}
      font-size="11"
    >
      Propositions
    </text>
  </g>
  <!-- divider -->
  <line
    x1="142"
    y1="8"
    x2="142"
    y2="32"
    stroke="rgba(148,163,184,0.5)"
    stroke-width="1"
  />
  <!-- right/coverage segment -->
  <g transform="translate(0, 0)" text-anchor="end">
    <text
      x="204"
      y="17"
      fill="${COLORS.gold}"
      font-family=${FONT_MONO}
      font-size="13"
      font-weight="600"
    >
      ${folCoverageProps}
    </text>
    <text
      x="204"
      y="30"
      fill="${COLORS.textMuted}"
      font-family=${FONT_MONO}
      font-size="10"
      letter-spacing="0.12em"
      textLength="64"
      lengthAdjust="spacingAndGlyphs"
    >
      E1–E5
    </text>
  </g>
</svg>
`;
}

fs.writeFileSync(path.join(outDir, 'version.svg'), createVersionBadgeSvg(), 'utf8');
fs.writeFileSync(path.join(outDir, 'fol-v1-props.svg'), createFOLPropsBadgeSvg(), 'utf8');

console.log(`Wrote badges to:
  - ${path.join(outDir, 'version.svg')}
  - ${path.join(outDir, 'fol-v1-props.svg')}
Using config from:
  - ${configPath}
`);
