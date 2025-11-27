import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import MathDisplay from '../components/MathDisplay';
import { findDependents, getItemById } from '../data';
import type { EthicsItem } from '../data/types';

const KIND_LABELS: Record<EthicsItem['kind'], string> = {
  definition: 'Definition',
  axiom: 'Axiom',
  postulate: 'Postulate',
  proposition: 'Proposition',
  scholium: 'Scholium',
  corollary: 'Corollary',
  lemma: 'Lemma',
};

type LogicSectionProps = {
  item: EthicsItem;
  onHover: (state: boolean) => void;
};

const LogicSection = ({ item, onHover }: LogicSectionProps) => {
  const [activeLogic, setActiveLogic] = useState<number>(0);

  const folEncodings = (item.logic ?? []).filter((enc) => enc.system === 'FOL' && enc.version === 'v1');

  useEffect(() => {
    setActiveLogic(0);
  }, [item.id]);

  useEffect(() => {
    if (activeLogic >= folEncodings.length) {
      setActiveLogic(0);
    }
  }, [activeLogic, folEncodings.length]);

  if (!folEncodings.length) {
    return null;
  }

  const logicEntry = folEncodings[activeLogic];

  return (
    <section
      className="space-y-3 rounded-[18px] border border-[var(--border)] bg-[var(--card-tint)]/60 p-4 transition"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.18em] text-[var(--text-muted)]">
          <span>Formalization ⊢</span>
          <span className="badge">{logicEntry.system}</span>
          <span className="badge">{logicEntry.version}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {folEncodings.map((logic, idx) => (
            <button
              key={`${logic.system}-${logic.version}-${idx}`}
              type="button"
              onClick={() => setActiveLogic(idx)}
              className={`badge border ${
                activeLogic === idx
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                  : 'border-[var(--border)]'
              }`}
            >
              {logic.system} {logic.version}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <div className="formal-block space-y-3">
          <MathDisplay latex={logicEntry.display} />
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">Encoding ({logicEntry.encoding_format})</p>
          <pre className="code-block mt-2 whitespace-pre-wrap">{logicEntry.encoding}</pre>
          {logicEntry.notes && <p className="text-sm text-[var(--text-muted)]">{logicEntry.notes}</p>}
        </div>
      </div>
    </section>
  );
};

const LanguageTabs = ({
  active,
  onChange,
  hasLatin,
}: {
  active: 'latin' | 'english';
  onChange: (lang: 'latin' | 'english') => void;
  hasLatin: boolean;
}) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1 font-mono text-xs uppercase tracking-[0.18em]">
    <button
      type="button"
      onClick={() => onChange('english')}
      className={`rounded-full px-3 py-1 transition ${
        active === 'english' ? 'bg-[var(--card-tint)] text-[var(--text)]' : 'text-[var(--text-muted)]'
      }`}
    >
      English
    </button>
    {hasLatin && (
      <button
        type="button"
        onClick={() => onChange('latin')}
        className={`rounded-full px-3 py-1 transition ${
          active === 'latin' ? 'bg-[var(--card-tint)] text-[var(--text)]' : 'text-[var(--text-muted)]'
        }`}
      >
        Latin
      </button>
    )}
  </div>
);

const EthicsItemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const item = getItemById(id || '');
    const [language, setLanguage] = useState<'latin' | 'english'>('english');
    const [linkedHover, setLinkedHover] = useState(false);

    type GraphNavState = {
        fromGraph?: boolean;
    };

    const navState = (location.state || {}) as GraphNavState;
    const fromGraph = Boolean(navState.fromGraph);

    const dependents = useMemo(() => (id ? findDependents(id) : []), [id]);

  useEffect(() => {
    setLanguage('english');
  }, [id]);

  if (!item) {
    return (
      <div className="space-y-4">
        <p className="text-lg font-semibold text-[var(--text)]">Item not found.</p>
        <Link to="/corpus" className="button-primary">
          Back to corpus
        </Link>
      </div>
    );
  }

    const paraphrase = item.proof.sketch || 'Paraphrase forthcoming.';
    const proofSketch = item.proof.sketch || 'No derivation notes available yet.';

    return (
        <div className="space-y-8">
            {fromGraph && (
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent)]"
                >
                    <span>← Back to graph view</span>
                </button>
            )}

            <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">{item.ref}</p>
                <div className="flex flex-wrap items-center gap-3">
                    <h2
                        className="text-3xl leading-tight text-[var(--text)]"
                        style={{ fontFamily: 'var(--font-serif)' }}
                    >
                        {item.label}
                    </h2>
                    <span className="badge capitalize">{KIND_LABELS[item.kind]}</span>
                    <span className="badge">Part {item.part}</span>
                    <span className="badge font-semibold">{item.id}</span>
                </div>
                <p className="text-[var(--text-muted)]">A bilingual rendering linked to a working formalization.</p>
            </div>

            <div className={`proposition-card ${linkedHover ? 'is-hovered' : ''}`}>
        <div className="flex flex-col gap-4 border-b border-[var(--border)] bg-[var(--card-tint)]/30 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">
              Part {item.part} · {KIND_LABELS[item.kind]}
            </p>
            <h3 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>
              {item.id}
            </h3>
          </div>
          <LanguageTabs active={language} onChange={setLanguage} hasLatin={Boolean(item.text.original)} />
        </div>

        <div className="space-y-6 px-5 py-6">
          <section
            className="linked-block space-y-3 bg-[var(--bg-elevated)]/60 p-4"
            onMouseEnter={() => setLinkedHover(true)}
            onMouseLeave={() => setLinkedHover(false)}
            onFocus={() => setLinkedHover(true)}
            onBlur={() => setLinkedHover(false)}
          >
            <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <span>Statement</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {(language === 'english' || !item.text.original) && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--text-muted)]">English</p>
                  <p className="whitespace-pre-wrap text-lg leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
                    {item.text.translation || 'Translation forthcoming.'}
                  </p>
                </div>
              )}
              {language === 'latin' && item.text.original && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--text-muted)]">Latin</p>
                  <p className="whitespace-pre-wrap text-lg leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
                    {item.text.original}
                  </p>
                </div>
              )}
              {language === 'english' && item.text.original && (
                <div className="hidden md:block">
                  <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--text-muted)]">Latin</p>
                  <p className="whitespace-pre-wrap text-lg leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
                    {item.text.original}
                  </p>
                </div>
              )}
            </div>
          </section>

          <LogicSection item={item} onHover={setLinkedHover} />

          <details className="rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)]/70 p-4" aria-expanded="false">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--text)]" style={{ fontFamily: 'var(--font-serif)' }}>
              Short paraphrase
            </summary>
            <p className="mt-2 text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-serif)' }}>
              {paraphrase}
            </p>
          </details>

          <details className="rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)]/70 p-4" aria-expanded="false">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--text)]" style={{ fontFamily: 'var(--font-serif)' }}>
              Derivation steps
            </summary>
            <p className="mt-2 text-[var(--text-muted)]">{proofSketch}</p>
            {item.proof.formal && (
              <div className="section-divider">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-[var(--text-muted)]">Formal ({item.proof.formal.format})</p>
                <pre className="code-block mt-2 whitespace-pre-wrap">{item.proof.formal.encoding}</pre>
              </div>
            )}
          </details>

          <details className="rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)]/70 p-4" aria-expanded="false">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--text)]" style={{ fontFamily: 'var(--font-serif)' }}>
              Notes
            </summary>
            <p className="mt-2 text-[var(--text-muted)]">Sources: {item.meta.sources.join(', ') || 'Unspecified sources'}.</p>
            <p className="text-[var(--text-muted)]">Contributors: {item.meta.contributors.join(', ') || 'Unspecified'}.</p>
          </details>

          <section className="rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)]/70 p-4">
            <h4 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>
              Dependencies
            </h4>
            <div className="mt-2 space-y-2 text-sm">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Depends on</p>
                {item.dependencies.uses.length === 0 && <p className="text-[var(--text-muted)]">No explicit dependencies.</p>}
                <div className="mt-1 flex flex-wrap gap-2">
                  {item.dependencies.uses.map((dep) => (
                    <Link key={dep.id} to={`/ethics/${dep.id}`} className="badge hover:border-[var(--accent)]">
                      {dep.role}: {dep.id}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="section-divider">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Used by</p>
                {dependents.length === 0 && <p className="text-[var(--text-muted)]">No dependents in sample corpus.</p>}
                <div className="mt-1 flex flex-wrap gap-2">
                  {dependents.map((dep) => (
                    <button
                      key={dep.id}
                      type="button"
                      onClick={() => navigate(`/ethics/${dep.id}`)}
                      className="badge hover:border-[var(--accent)]"
                    >
                      {dep.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="card space-y-3">
        <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>
          Concepts and tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {item.concepts.map((concept) => (
            <Link key={concept} to={`/corpus?concept=${encodeURIComponent(concept)}`} className="badge hover:border-[var(--accent)]">
              {concept}
            </Link>
          ))}
        </div>
      </section>

      <section className="card space-y-3">
        <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>
          Proof status
        </h3>
        <div className="flex flex-wrap gap-2 text-sm text-[var(--text-muted)]">
          <span className="badge">Status: {item.proof.status}</span>
          {item.proof.sketch && <span className="badge">Sketch available</span>}
          {item.proof.formal && <span className="badge">Formal encoding</span>}
        </div>
      </section>

      <section className="card space-y-3">
        <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>
          Sources & contributors
        </h3>
        <div className="text-sm text-[var(--text-muted)]">
          <p className="font-semibold text-[var(--text)]">Contributors: {item.meta.contributors.join(', ') || 'Unspecified'}</p>
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
