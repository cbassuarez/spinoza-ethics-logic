import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SpinozaMark from '../components/SpinozaMark';
import { corpus } from '../data';

const HomePage = () => {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Spinoza / Ethics</p>
        <h2 className="text-4xl font-semibold text-slate-900">
          A data-driven path through the Ethics, with formal-logic annotations.
        </h2>
        <p className="text-lg text-slate-700">
          Explore Spinoza&apos;s definitions, axioms, and propositions alongside formal encodings, dependencies, and proof sketches.
          This is a foundation for graph views and deeper logical analysis.
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
            <p className="text-2xl font-semibold">1</p>
          </div>
        </div>
      </div>
      <motion.div
        className="card flex flex-col items-center justify-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-40">
          <SpinozaMark />
        </div>
        <p className="text-center text-slate-700">
          The mark above is a procedural halftone meant to suggest the textured surface of a folio. Subtle motion keeps the page
          alive while keeping focus on the text.
        </p>
      </motion.div>
    </div>
  );
};

export default HomePage;
