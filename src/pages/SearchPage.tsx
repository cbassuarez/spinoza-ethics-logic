import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { corpus } from '../data';

const SearchPage = () => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const normalized = query.toLowerCase();
    if (!normalized) return corpus;
    return corpus.filter((item) =>
      [item.id, item.label, item.text.translation, item.concepts.join(' ')].join(' ').toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">Search</p>
          <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>
            Search the corpus
          </h2>
          <p className="text-[var(--text-muted)]">Search across ids, labels, translations, and concepts.</p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a keyword"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm md:w-80"
        />
      </div>

      <div className="grid gap-3">
        {results.map((item) => (
          <Link
            key={item.id}
            to={`/ethics/${item.id}`}
            className="proposition-card transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{item.id}</p>
                <h3 className="text-lg font-semibold text-[var(--text)]" style={{ fontFamily: 'var(--font-serif)' }}>
                  {item.label}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">{item.text.translation}</p>
              </div>
              <span className="badge capitalize">{item.kind}</span>
            </div>
            <div className="border-t border-[var(--border)] bg-[var(--card-tint)]/60 px-5 py-3">
              <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                {item.concepts.map((concept) => (
                  <span key={concept} className="badge bg-[var(--card-tint)]">
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
        {results.length === 0 && <p className="text-[var(--text-muted)]">No items matched the query.</p>}
      </div>
    </div>
  );
};

export default SearchPage;
