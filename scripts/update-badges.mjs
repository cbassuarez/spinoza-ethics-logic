import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const corpusPath = path.join(repoRoot, 'src', 'data', 'ethics.json');
const coverageMetaPath = path.join(repoRoot, 'src', 'meta', 'coverage.json');
const versionBadgePath = path.join(repoRoot, 'assets', 'badges', 'version.svg');
const coverageCorpusBadgePath = path.join(repoRoot, 'assets', 'badges', 'coverage-corpus.svg');
const coveragePropsBadgePath = path.join(repoRoot, 'assets', 'badges', 'coverage-props.svg');
const licenseBadgePath = path.join(repoRoot, 'assets', 'badges', 'license.svg');

const toFixedRatio = (value) => (Number.isFinite(value) ? Number(value.toFixed(4)) : 0);

const hasFolV1Coverage = (item) =>
  Array.isArray(item?.logic) && item.logic.some((logic) => logic?.system === 'FOL' && logic?.version === 'v1');

const readJson = async (targetPath) => JSON.parse(await fs.promises.readFile(targetPath, 'utf8'));

const writeJson = async (targetPath, data) =>
  fs.promises.writeFile(targetPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

const updateBadgeText = async (badgePath, id, nextValue) => {
  const svg = await fs.promises.readFile(badgePath, 'utf8');
  const pattern = new RegExp(`(<text[^>]*id=\\"${id}\\"[^>]*>)([^<]*)(</text>)`);
  if (!pattern.test(svg)) {
    throw new Error(`Unable to find id="${id}" in ${badgePath}`);
  }
  const updated = svg.replace(pattern, `$1${nextValue}$3`);
  await fs.promises.writeFile(badgePath, updated, 'utf8');
};

export const updateBadges = async () => {
  const corpusData = await readJson(corpusPath);
  const items = Array.isArray(corpusData) ? corpusData : [];

  const corpus_total = items.length;
  const corpus_covered = items.filter(hasFolV1Coverage).length;
  const propositions = items.filter((item) => item?.kind === 'proposition');
  const propositions_total = propositions.length;
  const propositions_covered = propositions.filter(hasFolV1Coverage).length;

  const coverage = {
    fol_v1_corpus: toFixedRatio(corpus_total ? corpus_covered / corpus_total : 0),
    fol_v1_propositions: toFixedRatio(
      propositions_total ? propositions_covered / propositions_total : 0
    ),
    corpus_total,
    corpus_covered,
    propositions_total,
    propositions_covered,
  };

  await writeJson(coverageMetaPath, coverage);

  const corpusPctLabel = `${Math.round(coverage.fol_v1_corpus * 100)}% corpus`;
  const propsPctLabel = `${Math.round(coverage.fol_v1_propositions * 100)}% props`;

  await updateBadgeText(coverageCorpusBadgePath, 'coverage-corpus-value', corpusPctLabel);
  await updateBadgeText(coveragePropsBadgePath, 'coverage-props-value', propsPctLabel);

  const pkg = await readJson(path.join(repoRoot, 'package.json'));
  const versionLabel = `v${pkg.version}`;
  await updateBadgeText(versionBadgePath, 'version-value', versionLabel);

  if (pkg.license) {
    await updateBadgeText(licenseBadgePath, 'license-value', pkg.license);
  }
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  updateBadges().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
