import { CANONICAL_ENGLISH_SOURCE_URL, CANONICAL_LATIN_SOURCE_URL } from '../data/constants';

const AboutPage = () => {
  return (
    <div className="card space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">About the project</h2>
      <p className="text-slate-700">
        This site is an experiment in presenting Spinoza&apos;s <em>Ethics</em> as a structured, navigable corpus enriched with formal
        logic. Items carry bilingual text, conceptual tags, dependencies, and multiple formal encodings to support scholarship and
        computational exploration.
      </p>
      <p className="text-slate-700">
        The Latin text is based on Gebhardt and made available online via The Latin Library. The English translation is by R.H.M.
        Elwes as hosted on the Marxists Internet Archive. Both sources are cited in every data item and captured locally for
        offline processing.
      </p>
      <ul className="list-disc space-y-1 pl-5 text-slate-700">
        <li>
          Latin source: <a className="underline" href={CANONICAL_LATIN_SOURCE_URL}>{CANONICAL_LATIN_SOURCE_URL}</a>
        </li>
        <li>
          English source: <a className="underline" href={CANONICAL_ENGLISH_SOURCE_URL}>{CANONICAL_ENGLISH_SOURCE_URL}</a>
        </li>
      </ul>
      <p className="text-slate-700">
        Formalizations are necessarily interpretive and will evolve. Contributions are welcome via edits to the local JSON corpus
        and scripts for ingesting and segmenting additional material.
      </p>
    </div>
  );
};

export default AboutPage;
