import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { corpus } from '../data';
import type { EthicsItem } from '../data/types';

const kinds = ['all', 'definition', 'axiom', 'postulate', 'proposition', 'scholium', 'corollary', 'lemma'] as const;

const CorpusPage = () => {
  const [partFilter, setPartFilter] = useState<string>('all');
  const [kindFilter, setKindFilter] = useState<(typeof kinds)[number]>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return corpus.filter((item) => {
      const matchesPart = partFilter === 'all' || item.part === Number(partFilter);
      const matchesKind = kindFilter === 'all' || item.kind === kindFilter;
      const matchesQuery =
        !normalizedQuery ||
        item.id.toLowerCase().includes(normalizedQuery) ||
        item.label.toLowerCase().includes(normalizedQuery) ||
        item.concepts.some((c) => c.toLowerCase().includes(normalizedQuery));
      return matchesPart && matchesKind && matchesQuery;
    });
  }, [kindFilter, partFilter, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">Text → Logic</p>
          <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>
            Corpus explorer
          </h2>
          <p className="text-[var(--text-muted)]">Browse the structured items of Ethics with light filtering.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-sm text-[var(--text)]">
            Part
            <select
              value={partFilter}
              onChange={(e) => setPartFilter(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              <option value="1">I</option>
              <option value="2">II</option>
              <option value="3">III</option>
              <option value="4">IV</option>
              <option value="5">V</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--text)]">
            Kind
            <select
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value as (typeof kinds)[number])}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm capitalize"
            >
              {kinds.map((kind) => (
                <option value={kind} key={kind} className="capitalize">
                  {kind === 'all' ? 'All' : kind}
                </option>
              ))}
            </select>
          </label>
          <input
            type="search"
            placeholder="Search by id, label, or concept"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm md:w-72"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm">
        <div className="grid grid-cols-6 gap-2 border-b border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          <span>ID</span>
          <span>Part</span>
          <span>Kind</span>
          <span>Label</span>
          <span>Status</span>
          <span>Concepts</span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {filtered.map((item: EthicsItem) => (
            <div key={item.id} className="grid grid-cols-6 gap-2 px-4 py-3 text-sm">
              <Link to={`/ethics/${item.id}`} className="font-semibold text-[var(--text)] underline">
                {item.id}
              </Link>
              <span className="text-[var(--text-muted)]">Part {item.part}</span>
              <span className="capitalize text-[var(--text)]">{item.kind}</span>
              <span className="text-[var(--text)]">{item.label}</span>
              <span>
                <span className="badge">{item.meta.status}</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {item.concepts.map((concept) => (
                  <span key={concept} className="badge bg-[var(--card-tint)] text-[var(--text-muted)]">
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="p-4 text-[var(--text-muted)]">No items match the filters.</p>}
        </div>
      </div>
    </div>
  );
};

export default CorpusPage;
