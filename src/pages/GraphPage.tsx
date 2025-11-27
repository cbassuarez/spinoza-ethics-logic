import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { corpus } from '../data';

const LogicGraph = lazy(() => import('../components/LogicGraph'));

const GraphPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">Logic Lab</p>
        <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>
          Dependency map of Ethics entries
        </h2>
        <p className="text-[var(--text-muted)]">
          Hover to inspect logical neighbors. Click a node to open the corresponding entry in the Text → Logic view. The layout
          drifts gently to suggest the live structure of the corpus.
        </p>
      </div>
      <div className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-elevated)]/70 p-4">
        <Suspense fallback={<p className="text-[var(--text-muted)]">Loading graph…</p>}>
          <LogicGraph items={corpus} onSelect={(id) => navigate(`/ethics/${id}`)} />
        </Suspense>
      </div>
      <div className="card space-y-2">
        <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>
          Reading the graph
        </h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          <li>Edges represent dependency claims already present in the corpus.</li>
          <li>Gold highlights indicate the active node and its immediate neighbors.</li>
          <li>Use the Method notes to see how formalization choices shape these relations.</li>
        </ul>
      </div>
    </div>
  );
};

export default GraphPage;
