import { Link } from 'react-router-dom';
import SpinozaMark from '../components/SpinozaMark';
import { computePartStats, getPartLabel, PART_METADATA } from '../utils/ethicsParts';

const EthicsPartsPage = () => {
  const partStats = computePartStats();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--card-tint)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            <span>Spinoza / Ethics</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-[var(--text)] md:text-4xl" style={{ fontFamily: 'var(--font-serif)' }}>
              Browse the Ethics by Part
            </h1>
            <p className="max-w-2xl text-sm text-[var(--text-muted)] md:text-base">
              Jump directly into any part of Spinoza&apos;s <em>Ethics</em>. Each card shows how much has been encoded: item counts,
              logic formalizations, and the percentage of propositions with proof sketches or notes.
            </p>
            <p className="max-w-2xl text-sm text-[var(--text-muted)] md:text-base">
              Use this as a launchpad into parts I–V, or return here from other tools like the corpus table and graph explorer.
            </p>
          </div>
        </div>
          <div className="mt-2 flex justify-start md:justify-end">
              <div className="card flex items-center gap-4 px-4 py-3">
                  <div className="w-10 shrink-0">
                      <SpinozaMark />
                  </div>
                  <div className="pl-3 text-xs text-[var(--text-muted)]">
                      <div className="font-semibold text-[var(--text)]">Ethics workspace</div>
                      <div>Parts I–V as a navigable entry point.</div>
                  </div>
              </div>
          </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {partStats.map((stat) => {
          const meta = PART_METADATA[stat.partId];
          const proofPercent = Math.round(stat.proofCoverage * 100);
          const isHighCoverage = proofPercent >= 75;

          return (
            <Link
              key={stat.partId}
              to={`/ethics/part/${stat.partId}`}
              className="card group flex h-full flex-col gap-3 transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="badge">{meta?.label ?? getPartLabel(stat.partId)}</div>
                  {meta?.subtitle && (
                    <h2 className="text-lg font-semibold text-[var(--text)]" style={{ fontFamily: 'var(--font-serif)' }}>
                      {meta.subtitle}
                    </h2>
                  )}
                </div>
                {isHighCoverage && <span className="badge bg-emerald-100 text-emerald-700">High coverage</span>}
              </div>

              {meta?.description && <p className="text-sm text-[var(--text-muted)]">{meta.description}</p>}

              <div className="mt-2 flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                <div>
                  <div className="uppercase tracking-wide text-[0.65rem] text-[var(--text-muted)]">Items</div>
                  <div className="text-sm font-semibold text-[var(--text)]">{stat.totalItems}</div>
                </div>
                <div>
                  <div className="uppercase tracking-wide text-[0.65rem] text-[var(--text-muted)]">With logic</div>
                  <div className="text-sm font-semibold text-[var(--text)]">{stat.logicItems}</div>
                </div>
                <div>
                  <div className="uppercase tracking-wide text-[0.65rem] text-[var(--text-muted)]">% proofs coverage</div>
                  <div className="text-sm font-semibold text-[var(--text)]">{proofPercent}%</div>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Open {getPartLabel(stat.partId)}</span>
                <span className="transition group-hover:translate-x-0.5">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default EthicsPartsPage;
