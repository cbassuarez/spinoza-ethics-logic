import type { LogicEncoding } from './types.js';

export const LOGIC_FOL_V1_PART3: Record<string, LogicEncoding[]> = {
  E3D1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'AdequateCause(c,e) ↔ (CauseOf(c,e) ∧ ClearDistinct(e,c))',
      encoding_format: 'custom-fol',
      encoding: 'AdequateCause(c, e) <-> (CauseOf(c, e) & ClearDistinct(e, c))',
      notes: 'Adequate causes render their effects intelligible.',
    },
  ],
  E3D2: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'InadequateCause(c,e) ↔ (CauseOf(c,e) ∧ ¬ClearDistinct(e,c))',
      encoding_format: 'custom-fol',
      encoding: 'InadequateCause(c, e) <-> (CauseOf(c, e) & ~ClearDistinct(e, c))',
      notes: 'Partial causes obscure the intelligibility of their effects.',
    },
  ],
  E3D3: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Emotion(ε,x) ↔ (ModifiesBody(ε,x) ∧ AdjustsPower(ε,x) ∧ IdeaOf(ε,x))',
      encoding_format: 'custom-fol',
      encoding: 'Emotion(e, x) <-> (ModifiesBody(e, x) & AdjustsPower(e, x) & IdeaOf(e, x))',
      notes: 'An emotion modifies the body, changes its power, and involves an accompanying idea.',
    },
  ],
  E3p1: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        '∀m[(Mind(m) ∧ AdequateIdeas(m)) → Active(m)] ∧ ∀m[(Mind(m) ∧ InadequateIdeas(m)) → Passive(m)]',
      encoding_format: 'custom-fol',
      encoding:
        'forall m: (Mind(m) & AdequateIdeas(m) -> Active(m)) & (Mind(m) & InadequateIdeas(m) -> Passive(m))',
      notes: 'Adequate ideas make the mind active; inadequate ones leave it passive.',
    },
  ],
  E3p2: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀b∀m[(Body(b) ∧ MindOf(m,b)) → (¬Determines(b,m) ∧ ¬Determines(m,b))]',
      encoding_format: 'custom-fol',
      encoding: 'forall b forall m: (Body(b) & MindOf(m, b)) -> (~Determines(b, m) & ~Determines(m, b))',
      notes: 'Body and its mind do not determine one another across attributes.',
    },
  ],
  E3p4: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (Destruction(x) → ∃c ExternalCause(c,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Destruction(x) -> exists c: ExternalCause(c, x)',
      notes: 'Whatever is destroyed has an external cause.',
    },
  ],
  E3p6: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (Thing(x) → StrivesToPersist(x))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Thing(x) -> StrivesToPersist(x)',
      notes: 'Every individual strives to persist in its own being.',
    },
  ],
  E3p9: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        '∀m[(Mind(m) ∧ (AdequateIdeas(m) ∨ InadequateIdeas(m))) → StrivesToPersist(m)]',
      encoding_format: 'custom-fol',
      encoding:
        'forall m: (Mind(m) & (AdequateIdeas(m) | InadequateIdeas(m))) -> StrivesToPersist(m)',
      notes: 'Minds strive to persist regardless of the adequacy of their ideas.',
    },
  ],
};
