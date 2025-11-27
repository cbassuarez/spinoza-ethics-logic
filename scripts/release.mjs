import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const run = (cmd) => execSync(cmd, { cwd: repoRoot, encoding: 'utf8' }).trim();

const parseVersion = (tagVersion) => {
  const [major = 0, minor = 0, patch = 0] = tagVersion.split('.').map((part) => Number(part) || 0);
  return { major, minor, patch };
};

const detectBump = (commits) => {
  if (commits.some((msg) => /^feat(\(.+\))?!:/.test(msg))) return 'major';
  if (commits.some((msg) => /^feat(\(.+\))?:/.test(msg))) return 'minor';
  if (commits.some((msg) => /^fix(\(.+\))?:/.test(msg))) return 'patch';
  return null;
};

const bumpVersion = (base, bump) => {
  const next = { ...base };
  if (bump === 'major') {
    next.major += 1;
    next.minor = 0;
    next.patch = 0;
  } else if (bump === 'minor') {
    next.minor += 1;
    next.patch = 0;
  } else if (bump === 'patch') {
    next.patch += 1;
  }
  return `${next.major}.${next.minor}.${next.patch}`;
};

const collectCommits = (rangeRef) => {
  const logRange = rangeRef ? `${rangeRef}..HEAD` : 'HEAD';
  const output = run(`git log ${logRange} --pretty=format:%s`);
  return output ? output.split('\n').filter(Boolean) : [];
};

const writeJson = (targetPath, data) => {
  fs.writeFileSync(targetPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

const main = async () => {
  const tagList = run('git tag --list "v*" --sort=-v:refname');
  const lastTag = tagList.split('\n').find(Boolean) || '';
  const commits = collectCommits(lastTag);
  const bump = detectBump(commits);

  if (!bump) {
    console.log('No conventional commits detected since last tag; skipping release.');
    return;
  }

  const baseVersion = lastTag ? lastTag.slice(1) : '0.0.0';
  const nextVersion = bumpVersion(parseVersion(baseVersion), bump);

  const pkgPath = path.join(repoRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = nextVersion;
  writeJson(pkgPath, pkg);

  const versionMetaPath = path.join(repoRoot, 'src', 'meta', 'version.json');
  writeJson(versionMetaPath, { version: nextVersion });

  // Run the TypeScript badge updater via ts-node/esm
  run('node --loader ts-node/esm scripts/update-badges.ts');

  // Stage updated metadata + badge assets
  run('git add package.json src/meta/version.json src/meta/coverage.json docs/badges');
  run(`git commit -m "chore(release): v${nextVersion}"`);
  run(`git tag -a v${nextVersion} -m "Release v${nextVersion}"`);

  console.log(`Release v${nextVersion} created.`);
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
