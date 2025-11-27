import { CANONICAL_ENGLISH_SOURCE_URL, CANONICAL_LATIN_SOURCE_URL } from '../data/constants';

const AboutPage = () => {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">About</p>
        <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>
          Ethics / Logic
        </h2>
        <p className="text-[var(--text-muted)]">
          A logical reconstruction and interface for reading Spinoza’s Ethics.
        </p>
      </div>
      <div className="card space-y-4">
        <p className="text-[var(--text-muted)]">
          This site is an experiment in presenting Spinoza&apos;s <em>Ethics</em> as a structured, navigable corpus enriched with
          formal logic. Items carry bilingual text, conceptual tags, dependencies, and multiple formal encodings to support
          scholarship and computational exploration.
        </p>
        <p className="text-[var(--text-muted)]">
          The Latin text is based on Gebhardt and made available online via The Latin Library. The English translation is by
          R.H.M. Elwes as hosted on the Marxists Internet Archive. Both sources are cited in every data item and captured locally
          for offline processing.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-[var(--text-muted)]">
          <li>
            Latin source: <a className="underline" href={CANONICAL_LATIN_SOURCE_URL}>{CANONICAL_LATIN_SOURCE_URL}</a>
          </li>
          <li>
            English source: <a className="underline" href={CANONICAL_ENGLISH_SOURCE_URL}>{CANONICAL_ENGLISH_SOURCE_URL}</a>
          </li>
        </ul>
        <p className="text-[var(--text-muted)]">
          Formalizations are necessarily interpretive and will evolve. Contributions are welcome via edits to the local JSON
          corpus and scripts for ingesting and segmenting additional material.
        </p>
        <p className="text-[var(--text-muted)]">Interface by Sebastian Suárez.</p>
      </div>
    </div>
  );
};

export default AboutPage;
