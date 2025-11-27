import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SpinozaMark from '../components/SpinozaMark';
import { corpus } from '../data';
import { spinozaPortraitDataUrl } from '../assets/spinozaPortrait.ts';

const HomePage = () => {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-gradient-to-br from-[var(--bg-elevated)] via-[var(--panel)] to-[var(--bg)] px-6 py-10 md:px-10 md:py-14">
      <div className="hero-glow" aria-hidden />
      <div className="relative grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">Ethics / Logic</p>
          <motion.h2
            className="text-4xl leading-tight text-[var(--text)] md:text-5xl"
            style={{ fontFamily: 'var(--font-serif)' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Spinoza’s Ethics as Formal Logic
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--text-muted)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            A logical reconstruction and interface for reading Spinoza’s <em>Ethics</em> in English, Latin, and symbolic notation.
            This interface aligns the original text with a working formalization: propositions, axioms, definitions, derivations,
            and their dependencies.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            <Link to="/ethics/part/1" className="button-primary">
              Browse the Ethics
            </Link>
            <Link to="/logic" className="button-secondary">
              Read the Method Notes
            </Link>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card flex flex-col gap-1 bg-[var(--bg-elevated)]/80">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Corpus size</p>
              <p className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>
                {corpus.length}
              </p>
              <p className="text-sm text-[var(--text-muted)]">Structured items</p>
            </div>
            <div className="card flex flex-col gap-1 bg-[var(--bg-elevated)]/80">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Parts covered</p>
              <p className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>
                {new Set(corpus.map((item) => item.part)).size}
              </p>
              <p className="text-sm text-[var(--text-muted)]">From I to V</p>
            </div>
            <div className="card flex flex-col gap-1 bg-[var(--bg-elevated)]/80">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Modes</p>
                <p className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>
                    Parts & Explorer
                </p>
                <p className="text-sm text-[var(--text-muted)]">English · Latin · Formal</p>
            </div>
          </div>
        </div>

        <motion.div
          className="relative flex flex-col items-center justify-center gap-4 rounded-[26px] border border-[var(--border)] bg-[var(--bg-elevated)]/80 p-6 shadow-lg backdrop-blur"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--card-tint)] via-transparent to-[var(--card-tint)]" aria-hidden />
          <div className="relative inline-flex h-64 w-64 items-center justify-center overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--bg)] shadow-inner">
            <img src={spinozaPortraitDataUrl} alt="Portrait of Spinoza" className="h-full w-full object-cover" />
          </div>
          <div className="relative text-center text-sm text-[var(--text-muted)]">
            <p style={{ fontFamily: 'var(--font-serif)' }} className="text-[var(--text)]">
              Baruch Spinoza (1632–1677)
            </p>
            <p>Ethics, Demonstrated in Geometrical Order (1677)</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
