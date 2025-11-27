import { Link } from 'react-router-dom';
import SpinozaMark from '../components/SpinozaMark';
import { corpus } from '../data';
import { SpinozaHeroSection } from '../components/SpinozaHeroSection';
import type { EthicsPart } from '../three/effects/SpinozaDitherEffect';

const HomePage = () => {
  const currentPart: EthicsPart = 1;
  const hoveredPart: EthicsPart | null = null;
  const hoveredItemId: string | null = null;

  return (
    <div className="space-y-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Spinoza / Ethics</p>
          <h2 className="text-4xl font-semibold text-slate-900">
            A data-driven path through the Ethics, with formal-logic annotations.
          </h2>
          <p className="text-lg text-slate-700">
            Explore Spinoza&apos;s definitions, axioms, and propositions alongside formal encodings, dependencies, and proof
            sketches. This is a foundation for graph views and deeper logical analysis.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/corpus" className="button-primary">
              Browse corpus
            </Link>
            <Link to="/ethics/part/1" className="button-secondary">
              Start with Part I
            </Link>
            <Link to="/graph" className="button-secondary">
              Dependency graph
            </Link>
          </div>
          <div className="flex gap-4 text-sm text-slate-600">
            <div className="rounded-lg bg-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase text-slate-500">Items</p>
              <p className="text-2xl font-semibold">{corpus.length}</p>
            </div>
            <div className="rounded-lg bg-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase text-slate-500">Parts represented</p>
              <p className="text-2xl font-semibold">{new Set(corpus.map((item) => item.part)).size}</p>
            </div>
          </div>
        </div>
        <div className="card flex flex-col items-center justify-center gap-6">
          <div className="w-40">
            <SpinozaMark />
          </div>
          <p className="text-center text-slate-700">Thoughtful exploration through data, logic, and visual tools.</p>
        </div>
      </div>

      <SpinozaHeroSection currentPart={currentPart} hoveredPart={hoveredPart} hoveredItemId={hoveredItemId} />
    </div>
  );
};

export default HomePage;
