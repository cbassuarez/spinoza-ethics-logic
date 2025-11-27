import type { LogicEncoding } from './types.js';

export const LOGIC_FOL_V1_PART2: Record<string, LogicEncoding[]> = {
  E2D1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀b (Body(b) ↔ (M(b,Ext) ∧ ExpressesAs(b,G,Ext)))',
      encoding_format: 'custom-fol',
      encoding: 'forall b: Body(b) <-> (M(b, Ext) & ExpressesAs(b, G, Ext))',
      notes:
        'A body is a finite mode of extension (M) that expresses God (G) under the attribute of extension (ExpressesAs).',
    },
  ],
  E2D2: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x∀φ (EssPart(φ,x) ↔ ((Given(φ,x) → Exists(x)) ∧ (Removed(φ,x) → ¬Exists(x))))',
      encoding_format: 'custom-fol',
      encoding:
        'forall x forall phi: EssPart(phi, x) <-> ((Given(phi, x) -> Exists(x)) & (Removed(phi, x) -> ~Exists(x)))',
      notes:
        'A property belongs to the essence of x when its presence ensures existence and its removal negates existence.',
    },
  ],
  E2D3: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Idea(i) ↔ ∃m (Mind(m) ∧ Forms(m,i) ∧ ThinksOf(m,i))',
      encoding_format: 'custom-fol',
      encoding: 'Idea(i) <-> exists m: Mind(m) & Forms(m, i) & ThinksOf(m, i)',
      notes: 'An idea is a conception formed by a mind considered as a thinking thing.',
    },
  ],
  E2D4: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'AdequateIdea(i) ↔ (Idea(i) ∧ TrueMarks(i))',
      encoding_format: 'custom-fol',
      encoding: 'AdequateIdea(i) <-> (Idea(i) & TrueMarks(i))',
      notes: 'Adequate ideas bear the intrinsic marks of truth.',
    },
  ],
  E2D5: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Duration(x) ↔ (ExistsContinuously(x) ∧ Indefinite(x))',
      encoding_format: 'custom-fol',
      encoding: 'Duration(x) <-> (ExistsContinuously(x) & Indefinite(x))',
      notes: 'Duration is indefinite continuance of existence.',
    },
  ],
  E2D6: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (Reality(x) ↔ Perfection(x))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Reality(x) <-> Perfection(x)',
      notes: 'Reality and perfection are interchangeable predicates.',
    },
  ],
  E2D7: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Particular(x) ↔ (Finite(x) ∧ Conditioned(x)) ∨ (JointAction(x) ∧ SharedCause(x))',
      encoding_format: 'custom-fol',
      encoding: 'Particular(x) <-> ((Finite(x) & Conditioned(x)) | (JointAction(x) & SharedCause(x)))',
      notes:
        'Particular things are finite, conditioned individuals or coordinated collections treated as one.',
    },
  ],
  E2Ax1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀h(Human(h) → ¬EssImpliesExistence(h)) ∧ ∀b(Body(b) → (InMotion(b) ∨ AtRest(b)))',
      encoding_format: 'custom-fol',
      encoding:
        'forall h: Human(h) -> ~EssImpliesExistence(h) & forall b: Body(b) -> (InMotion(b) | AtRest(b))',
      notes:
        'Human essences do not necessitate existence; every body is either in motion or at rest.',
    },
  ],
  E2Ax2: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀h(Human(h) → Thinks(h)) ∧ ∀b(Body(b) → VariableSpeed(b))',
      encoding_format: 'custom-fol',
      encoding: 'forall h: Human(h) -> Thinks(h) & forall b: Body(b) -> VariableSpeed(b)',
      notes: 'Humans think; bodies admit variation of motion.',
    },
  ],
  E2Ax3: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀m∀x(TMod(m,x) → ∃i IdeaOf(i,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall m forall x: TMod(m, x) -> exists i: IdeaOf(i, x)',
      notes: 'Modes of thought require an idea of their object.',
    },
    {
      system: 'FOL',
      version: 'v1',
      display: '∀i(Idea(i) → Indep(i))',
      encoding_format: 'custom-fol',
      encoding: 'forall i: Idea(i) -> Indep(i)',
      notes: 'Ideas can be conceived independently of other concurrent modes of thought.',
    },
  ],
  E2Ax4: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∃b (Body(b) ∧ ManyAffections(b))',
      encoding_format: 'custom-fol',
      encoding: 'exists b: Body(b) & ManyAffections(b)',
      notes: 'We encounter at least one body affected in many ways.',
    },
  ],
  E2Ax5: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (Particular(x) → (Body(x) ∨ ModeOfThought(x)))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Particular(x) -> (Body(x) | ModeOfThought(x))',
      notes: 'All particulars are either bodies or modes of thought.',
    },
  ],
  E2p1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Attr(Thought) ∧ A(G,Thought)',
      encoding_format: 'custom-fol',
      encoding: 'Attr(Thought) & A(G, Thought)',
      notes: 'Thought is an attribute of God.',
    },
  ],
  E2p2: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Attr(Ext) ∧ A(G,Ext)',
      encoding_format: 'custom-fol',
      encoding: 'Attr(Ext) & A(G, Ext)',
      notes: 'Extension is likewise an attribute of God.',
    },
  ],
  E2p3: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'IdeaOf(G,Ess(G)) ∧ ∀x(FollowsFromEss(x,G) → IdeaOf(G,x))',
      encoding_format: 'custom-fol',
      encoding: 'IdeaOf(G, Ess(G)) & forall x: FollowsFromEss(x, G) -> IdeaOf(G, x)',
      notes: 'God has an idea of his essence and of everything following from it.',
    },
  ],
  E2p4: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∃!i (IdeaOf(G,i) ∧ InfiniteOrder(i))',
      encoding_format: 'custom-fol',
      encoding: 'exists! i: IdeaOf(G, i) & InfiniteOrder(i)',
      notes: 'There is a unique infinite idea of God.',
    },
  ],
  E2p5: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀i[(Idea(i) ∧ Exists(i)) → CauseAsThought(G,i)]',
      encoding_format: 'custom-fol',
      encoding: 'forall i: (Idea(i) & Exists(i)) -> CauseAsThought(G, i)',
      notes: 'God, as thinking, is cause of the actual being of every idea.',
    },
  ],
  E2p7: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x∀y (OrderThings(x,y) ↔ OrderIdeas(IdeaOf(x),IdeaOf(y)))',
      encoding_format: 'custom-fol',
      encoding: 'forall x forall y: OrderThings(x, y) <-> OrderIdeas(IdeaOf(x), IdeaOf(y))',
      notes: 'The order and connection of ideas matches that of things.',
    },
  ],
  E2p7c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀e (FollowsFromExt(e) ↔ FollowsFromThought(IdeaOf(e)))',
      encoding_format: 'custom-fol',
      encoding: 'forall e: FollowsFromExt(e) <-> FollowsFromThought(IdeaOf(e))',
      notes: 'Whatever follows from God in extension follows likewise from the divine intellect.',
    },
  ],
};
