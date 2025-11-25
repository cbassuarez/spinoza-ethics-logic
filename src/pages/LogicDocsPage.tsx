const LogicDocsPage = () => {
  return (
    <div className="card space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Logic documentation</h2>
      <p className="text-slate-700">
        Each Ethics item can carry multiple formalizations. The <code>display</code> field is intended for human-friendly math
        notation (rendered with KaTeX), while the <code>encoding</code> field preserves a machine-readable representation in
        formats such as TPTP, Lean, Coq, or custom first-order logic.
      </p>
      <p className="text-slate-700">
        Common predicate symbols include <strong>G(x)</strong> for God, <strong>S(x)</strong> for Substance, and
        <strong>A(x)</strong> for Attribute. Systems may range from classical FOL to modal or topos-inspired logics as the corpus
        evolves.
      </p>
      <p className="text-slate-700">
        Versions track changes in interpretation so competing encodings can sit side-by-side. All formalizations are interpretive
        and will be refined alongside the philological notes.
      </p>
    </div>
  );
};

export default LogicDocsPage;
