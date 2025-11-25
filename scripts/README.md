# Ingestion scaffolding

This folder contains helper scripts for capturing the canonical Ethics sources. The browser application never fetches these URLs at runtime; data is read from local JSON.

## Pipeline

1. Run `npm run fetch:raw` to download the raw HTML of the Latin and English sources. Files are stored under `data/raw/`.
2. Run `npm run build:corpus` to parse the downloaded HTML with jsdom and emit `src/data/ethics.json` containing the full corpus across Parts I–V.
3. The SPA reads the JSON corpus at build time; no external requests are made in production.
