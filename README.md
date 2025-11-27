# Ethics as Formal Logic

A Vite + React + TypeScript + Tailwind SPA for exploring a structured corpus of Spinoza's *Ethics* with formal-logic annotations. The site is intended for GitHub Pages hosting at `https://cbassuarez.github.io/spinoza-ethics-logic/`.

<p align="left">
  <img
    src="docs/badges/version.svg"
    alt="Spinoza Ethics Logic Workspace — v0.1.0 · FOL v1"
    height="40"
  />
  <img
    src="docs/badges/fol-v1-props.svg"
    alt="FOL v1 coverage · Propositions (E1–E5)"
    height="40"
    style="margin-left: 8px;"
  />
</p>

`v0.1.0` – First public, but somewhat incomplete corpus: all parts are represented, but formal encodings and proof sketches are still in progress.

## Getting started

```bash
npm install
npm run dev
```

Open the dev server URL from the console. The SPA uses React Router with `basename="/spinoza-ethics-logic"` to match GitHub Pages hosting.

## Building for GitHub Pages

```bash
npm run build
```

This compiles the site into `docs/` with both `index.html` and `404.html` to support SPA routing on GitHub Pages.

### GitHub Pages

This site deploys from the Vite build output in the `docs/` directory.

- `npm run build` → generates the production bundle into `docs/`.
- GitHub Pages should be configured to deploy from the `main` branch and the `/docs` folder.
- The `Deploy to GitHub Pages` workflow builds `docs/` and publishes it to Pages on pushes to `main`, ensuring the hosted site always uses the compiled bundle.
- Always run the build before pushing changes that should go live.

## Data model

Structured items are defined by the `EthicsItem` type in `src/data/types.ts`. Key fields:

- `text`: Latin and English snippets
- `logic`: parallel encodings with human-readable `display` (KaTeX) and machine-readable `encoding`
- `dependencies`: explicit references to related items
- `proof`: status plus optional sketch or formal proof text

The live corpus is stored in `src/data/ethics.json` and read via `src/data/index.ts`.

## Updating the corpus

1. Fetch the canonical sources locally:

```bash
npm run fetch:raw
```

2. Build the structured corpus JSON from the downloaded HTML:

```bash
npm run build:corpus
```

This downloads raw HTML into `data/raw/`, parses and segments the texts with jsdom, and emits `src/data/ethics.json`. The browser app never fetches external sources at runtime. These raw captures are intentionally excluded from version control via `.gitignore` to avoid committing large or binary-like artifacts.

## Text sources

- Latin (Part I): https://www.thelatinlibrary.com/spinoza.ethica1.html
- English (Elwes translation): https://www.marxists.org/reference/subject/philosophy/works/ne/ethics.htm

## Testing

Run unit tests with:

```bash
npm test
```
