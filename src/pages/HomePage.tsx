import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SpinozaMark from '../components/SpinozaMark';
import { corpus } from '../data';
import { spinozaPortraitDataUrl } from '../assets/spinozaPortrait.ts';
import versionMeta from '../meta/version.json';
import coverageMeta from '../meta/coverage.json';
import { usePageMeta } from '../hooks/usePageMeta';

const HomePage = () => {
  const appVersion = versionMeta.version;
  const folCorpusPct = Math.round((coverageMeta.fol_v1_corpus || 0) * 100);
  const folPropsPct = Math.round((coverageMeta.fol_v1_propositions || 0) * 100);

  usePageMeta(
    'Spinoza’s Ethics – Spinoza Ethics Logic Workspace',
    'Spinoza Ethics Logic Workspace: a data-driven corpus of Spinoza’s Ethics with formal-logic annotations, dependencies, and proof sketches for Parts I–V.'
  );

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-gradient-to-br from-[var(--bg-elevated)] via-[var(--panel)] to-[var(--bg)] px-6 py-10 md:px-10 md:py-14">
      <div className="hero-glow" aria-hidden />
      <div className="relative grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">
            Spinoza Ethics Logic Workspace
          </p>
          <motion.h1
            className="text-4xl font-semibold text-[var(--text)] md:text-5xl"
            style={{ fontFamily: 'var(--font-serif)' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Spinoza’s Ethics
          </motion.h1>
          <motion.h2
            className="text-lg text-[var(--text-muted)]"
            style={{ fontFamily: 'var(--font-serif)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            A data-driven path through Spinoza’s Ethics, with formal-logic annotations, dependencies, and proof sketches.
          </motion.h2>
          <motion.div
            className="flex flex-wrap gap-2 text-xs"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            <div className="badge--metric">
              <span>version</span>
              <span className="badge--metric-value">v{appVersion}</span>
            </div>
            <div className="badge--metric">
              <span>fol-v1 coverage</span>
              <span className="badge--metric-value">{folCorpusPct}% corpus</span>
            </div>
            <div className="badge--metric">
              <span>fol-v1 coverage</span>
              <span className="badge--metric-value">{folPropsPct}% propositions</span>
            </div>
            <div className="badge--metric">
              <span>license</span>
              <span className="badge--metric-value">MIT</span>
            </div>
          </motion.div>
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
          >
            <Link to="/corpus" className="button-primary">
              Browse the Corpus
            </Link>
            <Link to="/graph" className="button-secondary">
              View the logic graph
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
