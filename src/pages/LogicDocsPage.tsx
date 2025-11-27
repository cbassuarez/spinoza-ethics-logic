const LogicDocsPage = () => {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">Method</p>
        <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>
          Notes on formalization
        </h2>
        <p className="text-[var(--text-muted)]">
          How the Ethics is rendered into parallel strands: bilingual text, propositional identifiers, and symbolic encodings.
        </p>
      </div>
      <div className="card space-y-4">
        <p className="text-[var(--text-muted)]">
          Each Ethics item can carry multiple formalizations. The <code>display</code> field is intended for human-friendly math
          notation (rendered with KaTeX), while the <code>encoding</code> field preserves a machine-readable representation in
          formats such as TPTP, Lean, Coq, or custom first-order logic. Predicate choices remain interpretive and are documented
          alongside each version.
        </p>
        <p className="text-[var(--text-muted)]">
          Common predicate symbols include <strong>G(x)</strong> for God, <strong>S(x)</strong> for Substance, and
          <strong>A(x)</strong> for Attribute. Systems may range from classical FOL to modal or topos-inspired logics as the
          corpus evolves. Multiple versions can coexist to track disagreements or refinements.
        </p>
        <p className="text-[var(--text-muted)]">
          The goal is not to replace the text but to stage it as a working lab notebook. Use the Logic Lab to inspect
          dependencies and the Text → Logic view to read the prose alongside the formal encodings.
        </p>
      </div>
    </div>
  );
};

export default LogicDocsPage;
