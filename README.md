# Ethics as Formal Logic

A Vite + React + TypeScript + Tailwind SPA for exploring a structured corpus of Spinoza's *Ethics* with formal-logic annotations. The site is intended for GitHub Pages hosting at `https://cbassuarez.github.io/spinoza-ethics-logic/`.

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

## Data model

Structured items are defined by the `EthicsItem` type in `src/data/types.ts`. Key fields:

- `text`: Latin and English snippets
- `logic`: parallel encodings with human-readable `display` (KaTeX) and machine-readable `encoding`
- `dependencies`: explicit references to related items
- `proof`: status plus optional sketch or formal proof text

Sample data lives in `src/data/ethics-sample.json` and is imported via `src/data/index.ts`.

## Updating the corpus

1. Edit `src/data/ethics-sample.json` (or a future `ethics.json`) to add or refine items.
2. To refresh the canonical sources locally, run:

```bash
node --loader ts-node/esm scripts/fetch-raw-ethics.ts
```

This downloads raw HTML into `data/raw/` for offline segmentation. The browser app never fetches external sources at runtime.
These raw captures are intentionally excluded from version control via `.gitignore` to avoid committing large or binary-like artifacts.

## Text sources

- Latin (Part I): https://www.thelatinlibrary.com/spinoza.ethica1.html
- English (Elwes translation): https://www.marxists.org/reference/subject/philosophy/works/ne/ethics.htm

## Testing

Run unit tests with:

```bash
npm test
```
