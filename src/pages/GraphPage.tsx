import { corpus } from '../data';

const GraphPage = () => {
  return (
    <div className="card space-y-3">
      <h2 className="text-2xl font-semibold text-slate-900">Graph view</h2>
      <p className="text-slate-700">
        Graph view coming soon. This will visualize the dependency graph of Ethics items and allow navigating through proofs.
      </p>
      <p className="text-sm text-slate-600">Current corpus size: {corpus.length} items.</p>
    </div>
  );
};

export default GraphPage;
