# Ingestion scaffolding

This folder contains helper scripts for capturing the canonical Ethics sources. The browser application never fetches these URLs at runtime; data is read from local JSON.

## Pipeline

1. Run `node --loader ts-node/esm scripts/fetch-raw-ethics.ts` to download the raw HTML of the Latin and English sources. Files are stored under `data/raw/`.
2. Manually or semi-automatically segment the texts into structured items and update `src/data/ethics-sample.json` (or a future `ethics.json`).
3. The SPA reads the JSON corpus at build time; no external requests are made in production.
