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
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Ethics Part {part}</h2>
        <p className="text-slate-600">Items grouped by type for quick navigation.</p>
      </div>
      {grouped.map((group) => (
        <div key={group.kind} className="space-y-3">
          <h3 className="text-lg font-semibold capitalize text-slate-800">{group.kind}s</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {group.items.map((item) => (
              <Link
                key={item.id}
                to={`/ethics/${item.id}`}
                className="card transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.id}</p>
                    <h4 className="text-lg font-semibold text-slate-900">{item.label}</h4>
                  </div>
                  <span className="badge">{item.meta.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-700">{item.text.translation || 'Translation placeholder'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.concepts.map((concept) => (
                    <span key={concept} className="badge bg-slate-100">
                      {concept}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
            {group.items.length === 0 && <p className="text-sm text-slate-600">No items of this kind yet.</p>}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-slate-600">No items available for this part yet. Try <Link to="/corpus">the corpus view</Link>.</p>
      )}
    </div>
  );
};

export default PartPage;
