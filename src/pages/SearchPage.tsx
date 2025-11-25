import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { corpus } from '../data';

const SearchPage = () => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const normalized = query.toLowerCase();
    if (!normalized) return corpus;
    return corpus.filter((item) =>
      [
        item.id,
        item.label,
        item.text.translation,
        item.concepts.join(' '),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Search</h2>
          <p className="text-slate-600">Search across ids, labels, translations, and concepts.</p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a keyword"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 md:w-80"
        />
      </div>

      <div className="grid gap-3">
        {results.map((item) => (
          <Link
            key={item.id}
            to={`/ethics/${item.id}`}
            className="card transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.id}</p>
                <h3 className="text-lg font-semibold text-slate-900">{item.label}</h3>
                <p className="text-sm text-slate-700">{item.text.translation}</p>
              </div>
              <span className="badge">{item.kind}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
              {item.concepts.map((concept) => (
                <span key={concept} className="badge bg-slate-100">
                  {concept}
                </span>
              ))}
            </div>
          </Link>
        ))}
        {results.length === 0 && <p className="text-slate-600">No items matched the query.</p>}
      </div>
    </div>
  );
};

export default SearchPage;
