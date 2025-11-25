import { useMemo } from 'react';
import { InlineMath } from 'react-katex';

type MathDisplayProps = {
  latex: string;
};

const MathDisplay = ({ latex }: MathDisplayProps) => {
  const content = useMemo(() => latex || '', [latex]);

  if (!content.trim()) {
    return <span className="text-slate-500">No formal display provided.</span>;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-lg">
      <InlineMath>{content}</InlineMath>
    </div>
  );
};

export default MathDisplay;
