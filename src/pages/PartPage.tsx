import { Link, useParams } from 'react-router-dom';
import { getItemsByPart } from '../data';

const groupOrder = ['definition', 'axiom', 'postulate', 'proposition', 'scholium', 'corollary', 'lemma'];

const PartPage = () => {
  const { partNumber } = useParams();
  const part = Number(partNumber);
  const items = getItemsByPart(part);

  const grouped = groupOrder.map((kind) => ({
    kind,
    items: items.filter((item) => item.kind === kind),
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">Text → Logic</p>
        <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>
          Ethics Part {part}
        </h2>
        <p className="text-[var(--text-muted)]">Items grouped by type for quick navigation.</p>
      </div>
      {grouped.map((group) => (
        <div key={group.kind} className="space-y-3">
          <h3 className="text-lg font-semibold capitalize text-[var(--text)]" style={{ fontFamily: 'var(--font-serif)' }}>
            {group.kind}s
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {group.items.map((item) => (
              <Link
                key={item.id}
                to={`/ethics/${item.id}`}
                className="proposition-card block p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{item.id}</p>
                    <h4 className="text-lg font-semibold text-[var(--text)]" style={{ fontFamily: 'var(--font-serif)' }}>
                      {item.label}
                    </h4>
                  </div>
                  <span className="badge">{item.meta.status}</span>
                </div>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  {item.text.translation || 'Translation placeholder'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.concepts.map((concept) => (
                    <span key={concept} className="badge bg-[var(--card-tint)]">
                      {concept}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
            {group.items.length === 0 && <p className="text-sm text-[var(--text-muted)]">No items of this kind yet.</p>}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-[var(--text-muted)]">
          No items available for this part yet. Try <Link to="/corpus">the corpus view</Link>.
        </p>
      )}
    </div>
  );
};

export default PartPage;
