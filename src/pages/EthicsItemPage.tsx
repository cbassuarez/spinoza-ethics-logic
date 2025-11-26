import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MathDisplay from '../components/MathDisplay';
import { corpus, findDependents, getItemById } from '../data';
import type { LogicEncoding } from '../data/types';

const EthicsItemPage = () => {
  const { id } = useParams();
  const item = getItemById(id || '');
  const [activeLogic, setActiveLogic] = useState<number>(0);

  const folEncodings = useMemo(
    () =>
      (item?.logic ?? []).filter(
        (encoding) => encoding.system === 'FOL' && encoding.version === 'v1'
      ),
    [item]
  );

  useEffect(() => {
    setActiveLogic(0);
  }, [id]);

  useEffect(() => {
    if (activeLogic >= folEncodings.length) {
      setActiveLogic(0);
    }
  }, [activeLogic, folEncodings.length]);

  const dependents = useMemo(() => (id ? findDependents(id) : []), [id]);

  if (!item) {
    return (
      <div className="space-y-4">
        <p className="text-lg font-semibold text-slate-900">Item not found.</p>
        <Link to="/corpus" className="button-primary">
          Back to corpus
        </Link>
      </div>
    );
  }

  const logicEntry: LogicEncoding | undefined = folEncodings[activeLogic];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.ref}</p>
          <h2 className="text-3xl font-semibold text-slate-900">{item.label}</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-700">
            <span className="badge">{item.id}</span>
            <span className="badge">Part {item.part}</span>
            <span className="badge capitalize">{item.kind}</span>
            <span className="badge">Status: {item.meta.status}</span>
          </div>
        </div>
        <Link to="/corpus" className="button-secondary">
          Back to corpus
        </Link>
      </div>

      <section className="card space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Text</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-slate-500">Latin</p>
            <p className="whitespace-pre-wrap font-serif text-slate-800">{item.text.original}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">English (Elwes)</p>
            <p className="whitespace-pre-wrap text-slate-800">{item.text.translation}</p>
          </div>
        </div>
      </section>

      <section className="card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-900">Logic encodings</h3>
          <div className="flex flex-wrap gap-2">
            {folEncodings.map((logic, idx) => (
              <button
                key={`${logic.system}-${logic.version}-${idx}`}
                type="button"
                onClick={() => setActiveLogic(idx)}
                className={`badge border ${activeLogic === idx ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50'}`}
              >
                {logic.system} {logic.version}
              </button>
            ))}
          </div>
        </div>
        {logicEntry ? (
          <div className="space-y-3">
            <MathDisplay latex={logicEntry.display} />
            <div>
              <p className="text-xs uppercase text-slate-500">Encoding ({logicEntry.encoding_format})</p>
              <pre className="code-block">{logicEntry.encoding}</pre>
              {logicEntry.notes && <p className="text-sm text-slate-600">{logicEntry.notes}</p>}
            </div>
          </div>
        ) : (
          <p className="text-slate-600">No FOL v1 logic encodings available.</p>
        )}
      </section>

      <section className="card space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Concepts</h3>
        <div className="flex flex-wrap gap-2">
          {item.concepts.map((concept) => (
            <Link key={concept} to={`/corpus?concept=${encodeURIComponent(concept)}`} className="badge bg-slate-100">
              {concept}
            </Link>
          ))}
        </div>
      </section>

      <section className="card space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Dependencies</h3>
        <div className="space-y-2">
          <div>
            <p className="text-sm font-semibold text-slate-800">Depends on</p>
            {item.dependencies.uses.length === 0 && <p className="text-sm text-slate-600">No explicit dependencies.</p>}
            <ul className="mt-1 space-y-1">
              {item.dependencies.uses.map((dep) => (
                <li key={dep.id} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="badge bg-slate-100">{dep.role}</span>
                  <Link to={`/ethics/${dep.id}`} className="underline">
                    {dep.id}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Used by</p>
            {dependents.length === 0 && <p className="text-sm text-slate-600">No dependents in sample corpus.</p>}
            <ul className="mt-1 space-y-1">
              {dependents.map((dep) => (
                <li key={dep.id} className="flex items-center gap-2 text-sm text-slate-700">
                  <Link to={`/ethics/${dep.id}`} className="underline">
                    {dep.id}
                  </Link>
                  <span className="text-slate-500">{dep.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="card space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Proof</h3>
        <div className="flex flex-wrap gap-2 text-sm text-slate-700">
          <span className="badge">Status: {item.proof.status}</span>
        </div>
        {item.proof.sketch && <p className="text-slate-700">{item.proof.sketch}</p>}
        {item.proof.formal && (
          <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <summary className="cursor-pointer font-semibold text-slate-800">View formal proof ({item.proof.formal.format})</summary>
            <pre className="code-block mt-2 whitespace-pre-wrap">{item.proof.formal.encoding}</pre>
          </details>
        )}
        {!item.proof.sketch && !item.proof.formal && <p className="text-slate-600">No proof provided yet.</p>}
      </section>

      <section className="card space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Sources & contributors</h3>
        <div className="text-sm text-slate-700">
          <p className="font-semibold">Contributors: {item.meta.contributors.join(', ') || 'Unspecified'}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {item.meta.sources.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default EthicsItemPage;
