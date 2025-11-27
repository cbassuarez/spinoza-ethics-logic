import type { LogicEncoding } from './types.js';

export const LOGIC_FOL_V1_PART2: Record<string, LogicEncoding[]> = {
  E2D1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀b (Body(b) ↔ (M(b,Ext) ∧ ExpressesAs(b,G,Ext)))',
      encoding_format: 'custom-fol',
      encoding: 'forall b: Body(b) <-> (M(b, Ext) & ExpressesAs(b, G, Ext))',
      notes: 'A body is a finite mode of extension (M) that expresses God (G) under the attribute of extension (ExpressesAs).',
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
      notes: 'A property belongs to the essence of x when its presence ensures existence and its removal negates existence.',
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
      notes: 'Particular things are finite, conditioned individuals or coordinated collections treated as one.',
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
      notes: 'Human essences do not necessitate existence; every body is either in motion or at rest.',
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
  E2p1s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'InfiniteBeing(G) → ∃i (Idea(i) ∧ Infinite(i) ∧ IdeaOf(i,G))',
      encoding_format: 'custom-fol',
      encoding: 'InfiniteBeing(G) -> exists i: Idea(i) & Infinite(i) & IdeaOf(i, G)',
      notes: 'Conceiving God as infinite entails conceiving infinitely many thoughts in God.',
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
  E2p3s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (InPotentia(G,x) → Necessary(x))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: InPotentia(G, x) -> Necessary(x)',
      notes: 'Things conceived through divine power follow necessarily, not contingently, from God.',
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
  E2p6: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀m∀α[(ModeOfAttr(m,α)) → CauseInAttr(G,m,α)]',
      encoding_format: 'custom-fol',
      encoding: 'forall m forall alpha: ModeOfAttr(m, alpha) -> CauseInAttr(G, m, alpha)',
      notes: 'Modes of any attribute depend causally on God only under that same attribute.',
    },
  ],
  E2p6c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x[(¬ModeOfThought(x)) → ¬CauseAsThought(G,x)]',
      encoding_format: 'custom-fol',
      encoding: 'forall x: (~ModeOfThought(x)) -> ~CauseAsThought(G, x)',
      notes: 'Non-thinking things do not owe their being to God as thinking but as extended.',
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
  E2p7s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x(Substance(x) → (IdeaOf(x)=x))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Substance(x) -> (IdeaOf(x) = x)',
      notes: 'Substance and its idea are conceived under the same order when viewed by infinite intellect.',
    },
  ],
  E2p8: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀m(¬Exists(m) ∧ Mode(m) → IdeaIn(G,m,InfiniteIdea))',
      encoding_format: 'custom-fol',
      encoding: 'forall m: (~Exists(m) & Mode(m)) -> IdeaIn(G, m, InfiniteIdea)',
      notes: 'Ideas of non-existent modes are contained in God’s infinite idea as their essences are in attributes.',
    },
  ],
  E2p8c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀m(¬Exists(m) → (IdeaOf(m)↔ IdeaWithinInfinite(G,m)))',
      encoding_format: 'custom-fol',
      encoding: 'forall m: (~Exists(m)) -> (IdeaOf(m) <-> IdeaWithinInfinite(G, m))',
      notes: 'So long as particulars do not actually exist, their ideas subsist only as included within the infinite divine idea.',
    },
  ],
  E2p8s1: [
      {
        system: 'FOL',
        version: 'v1',
        display: '∀m(FormalEssence(m) ↔ ObjectiveEssence(IdeaOf(m)))',
        encoding_format: 'custom-fol',
        encoding: 'forall m: FormalEssence(m) <-> ObjectiveEssence(IdeaOf(m))',
        notes: 'The formal essence of a mode corresponds to the objective essence contained in its idea.',
      },
    ],
  E2p9: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀i[(Idea(i) ∧ Exists(i)) → ∃j(IndividualIdea(j) ∧ Cause(i,G_as(j)))]',
      encoding_format: 'custom-fol',
      encoding: 'forall i: (Idea(i) & Exists(i)) -> exists j: IndividualIdea(j) & Cause(i, G_as(j))',
      notes: 'An idea of an existing individual arises from God as modified by an antecedent individual idea, ad infinitum.',
    },
  ],
  E2p9c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀o∀i[(IdeaOf(i,o) ∧ EventIn(o,e)) → KnowledgeIn(G,i,e)]',
      encoding_format: 'custom-fol',
      encoding: 'forall o forall i: (IdeaOf(i, o) & EventIn(o, e)) -> KnowledgeIn(G, i, e)',
      notes: 'Whatever happens to an idea’s object is known by God insofar as he has that idea.',
    },
  ],
  E2p10: [
    {
      system: 'FOL',
      version: 'v1',
      display: '¬EssPart(Substance,Man)',
      encoding_format: 'custom-fol',
      encoding: '~EssPart(Substance, Man)',
      notes: 'Substance is not part of the essence constituting man’s actual being.',
    },
  ],
  E2p10s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'SubstanceUnique → ¬Human(Substance)',
      encoding_format: 'custom-fol',
      encoding: 'SubstanceUnique -> ~Human(Substance)',
      notes: 'Because substance is unique and cannot share a nature, humanity cannot be identical with substance.',
    },
  ],
  E2p10c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'EssPart(HumanEssence,Man) → Exists(HumanEssence)',
      encoding_format: 'custom-fol',
      encoding: 'EssPart(HumanEssence, Man) -> Exists(HumanEssence)',
      notes: 'Whatever constitutes the essence of man must itself exist in man.',
    },
  ],
  E2p10s2: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'HumanBody ≠ God ∧ HumanMind ≠ God',
      encoding_format: 'custom-fol',
      encoding: 'HumanBody != G & HumanMind != G',
      notes: 'Neither human body nor mind is identical with God, though both depend on divine nature.',
    },
  ],
  E2p11: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Mind(h) ↔ ∃o(Actual(o) ∧ IdeaOf(h,o) ∧ FirstConstituent(h,o))',
      encoding_format: 'custom-fol',
      encoding: 'Mind(h) <-> exists o: Actual(o) & IdeaOf(h, o) & FirstConstituent(h, o)',
      notes: 'The first element of a human mind is the idea of some actually existing thing.',
    },
  ],
  E2p11c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Mind(h) → EssPart(IdeaOf(h,ObjectOf(h)),h)',
      encoding_format: 'custom-fol',
      encoding: 'Mind(h) -> EssPart(IdeaOf(h, ObjectOf(h)), h)',
      notes: 'The idea whose object constitutes the mind belongs essentially to that mind.',
    },
  ],
  E2p11s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '¬IdeaOfNonexistent(h) ∧ ¬IdeaOfInfinite(h)',
      encoding_format: 'custom-fol',
      encoding: '~IdeaOfNonexistent(h) & ~IdeaOfInfinite(h)',
      notes: 'The constituting idea cannot be of a non-existent or necessarily infinite object.',
    },
  ],
  E2p12: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀h∀o[(MindOf(h,o)) → ∀e(EventIn(o,e) → IdeaIn(h,e))]',
      encoding_format: 'custom-fol',
      encoding: 'forall h forall o: MindOf(h, o) -> forall e: EventIn(o, e) -> IdeaIn(h, e)',
      notes: 'Whatever happens in the object whose idea constitutes a mind is perceived in that mind.',
    },
  ],
  E2p12s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'MindOf(h,o) → KnowledgeIn(G_as(h),Events(o))',
      encoding_format: 'custom-fol',
      encoding: 'MindOf(h, o) -> KnowledgeIn(G_as(h), Events(o))',
      notes: 'God, insofar as he constitutes a given mind, contains knowledge of that mind’s object.',
    },
  ],
  E2p13: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'MindOf(h,o) → (Body(o) ∧ ObjectOfMind(h,o))',
      encoding_format: 'custom-fol',
      encoding: 'MindOf(h, o) -> (Body(o) & ObjectOfMind(h, o))',
      notes: 'The object of the idea constituting the human mind is a determinate existing body and nothing else.',
    },
  ],
  E2p13s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀m(ModesOfBody(m) → InMind(h,m))',
      encoding_format: 'custom-fol',
      encoding: 'forall m: ModesOfBody(m) -> InMind(h, m)',
      notes: 'Ideas of a body’s affections are in the mind whose object that body is.',
    },
  ],
  E2L1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀b1∀b2[Body(b1) ∧ Body(b2) → DistinctByMotion(b1,b2)]',
      encoding_format: 'custom-fol',
      encoding: 'forall b1 forall b2: (Body(b1) & Body(b2)) -> DistinctByMotion(b1, b2)',
      notes: 'Bodies differ by motion/rest and velocity, not by substance.',
    },
  ],
  E2L2: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∃c∀p(Particle(p,c) → MaintainsMotionRatio(p,c))',
      encoding_format: 'custom-fol',
      encoding: 'exists c forall p: Particle(p, c) -> MaintainsMotionRatio(p, c)',
      notes: 'In a composite, constituent particles preserve a fixed ratio of motion and rest.',
    },
  ],
  E2L3: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀c[Composite(c) → (ExternalCausesChangeRatio(c) ∨ InternalResistance(c))]',
      encoding_format: 'custom-fol',
      encoding: 'forall c: Composite(c) -> (ExternalCausesChangeRatio(c) | InternalResistance(c))',
      notes: 'Composites retain motion/rest ratio unless altered by external causes.',
    },
  ],
  E2p13c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'IdeaOf(h,Body(h)) ∧ HumanMind(h)',
      encoding_format: 'custom-fol',
      encoding: 'IdeaOf(h, Body(h)) & HumanMind(h)',
      notes: 'The idea constituting the human mind is of the human body.',
    },
  ],
  E2L4: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀c(Composite(c) → Persistence(c) ↔ RatioPreserved(c))',
      encoding_format: 'custom-fol',
      encoding: 'forall c: Composite(c) -> (Persistence(c) <-> RatioPreserved(c))',
      notes: 'A composite persists as long as its particles maintain the same motion/rest ratio.',
    },
  ],
  E2L5: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀c∀b[(Composite(c) ∧ PartOf(b,c)) → TransmitsMotion(b,c)]',
      encoding_format: 'custom-fol',
      encoding: 'forall c forall b: (Composite(c) & PartOf(b, c)) -> TransmitsMotion(b, c)',
      notes: 'Motion and rest are communicated among the parts of a composite according to its structure.',
    },
  ],
  E2L6: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀c(Composite(c) → Stability(c) ∧ InteractionRules(c))',
      encoding_format: 'custom-fol',
      encoding: 'forall c: Composite(c) -> Stability(c) & InteractionRules(c)',
      notes: 'Composites exhibit stability and lawful interaction of parts preserving the ratio.',
    },
  ],
  E2L7: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀c∀p[(Composite(c) ∧ PartOf(p,c)) → AffectedByExternal(p,c)]',
      encoding_format: 'custom-fol',
      encoding: 'forall c forall p: (Composite(c) & PartOf(p, c)) -> AffectedByExternal(p, c)',
      notes: 'Parts of a composite are affected by external bodies impacting the whole.',
    },
  ],
  E2p13s2: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∃b(HumanBody(b) ∧ MaintainsRatio(b))',
      encoding_format: 'custom-fol',
      encoding: 'exists b: HumanBody(b) & MaintainsRatio(b)',
      notes: 'The human body is a composite preserving a certain ratio of motion and rest.',
    },
  ],
  E2Post1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'HumanBody(h) → CanMove(h) ∧ CanRest(h)',
      encoding_format: 'custom-fol',
      encoding: 'HumanBody(h) -> CanMove(h) & CanRest(h)',
      notes: 'The human body can move and remain at rest.',
    },
  ],
  E2Post2: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'HumanBody(h) → AffectsOthers(h)',
      encoding_format: 'custom-fol',
      encoding: 'HumanBody(h) -> AffectsOthers(h)',
      notes: 'The human body can affect external bodies.',
    },
  ],
  E2Post3: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'HumanBody(h) → AffectedByExternal(h)',
      encoding_format: 'custom-fol',
      encoding: 'HumanBody(h) -> AffectedByExternal(h)',
      notes: 'The human body can be affected by external bodies in many ways.',
    },
  ],
  E2Post4: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'HumanBody(h) → CanChangeSpeed(h)',
      encoding_format: 'custom-fol',
      encoding: 'HumanBody(h) -> CanChangeSpeed(h)',
      notes: 'The human body can vary its motion.',
    },
  ],
  E2Post5: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'HumanBody(h) → RestMotionCaused(h)',
      encoding_format: 'custom-fol',
      encoding: 'HumanBody(h) -> RestMotionCaused(h)',
      notes: 'Changes of motion or rest in the human body are caused by other bodies.',
    },
  ],
  E2Post6: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'HumanBody(h) → CanRearrangeParts(h)',
      encoding_format: 'custom-fol',
      encoding: 'HumanBody(h) -> CanRearrangeParts(h)',
      notes: 'The parts of the human body can be variously arranged while maintaining the composite ratio.',
    },
  ],
  E2p14: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Mind(h) ↔ IdeaOf(h,Body(h))',
      encoding_format: 'custom-fol',
      encoding: 'Mind(h) <-> IdeaOf(h, Body(h))',
      notes: 'The human mind is the idea of the human body.',
    },
  ],
  E2p15: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'IdeaOf(G,Body(h)) ↔ FormalBeing(h)',
      encoding_format: 'custom-fol',
      encoding: 'IdeaOf(G, Body(h)) <-> FormalBeing(h)',
      notes: 'The idea of the human body is in God and its formal being is expressed in divine intellect.',
    },
  ],
  E2p16: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀h(Mind(h) → ∃b(Body(b) ∧ CauseOfMind(b,h)))',
      encoding_format: 'custom-fol',
      encoding: 'forall h: Mind(h) -> exists b: Body(b) & CauseOfMind(b, h)',
      notes: 'If a mind exists, its body must exist and causally determines it.',
    },
  ],
  E2p16c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∃!h(Mind(h) ∧ CorrespondsToBody(h))',
      encoding_format: 'custom-fol',
      encoding: 'exists! h: Mind(h) & CorrespondsToBody(h)',
      notes: 'There is one mind corresponding to a given human body.',
    },
  ],
  E2p16c2: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀i[(IdeaOf(i,Body(h)) ∧ AdequateIn(G,i)) → AdequateIn(h,i)]',
      encoding_format: 'custom-fol',
      encoding: 'forall i: (IdeaOf(i, Body(h)) & AdequateIn(G, i)) -> AdequateIn(h, i)',
      notes: 'Ideas of the human body which are adequate in God are also adequate in the human mind.',
    },
  ],
  E2p17: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'OrderIdeas(G) = OrderIdeas(h)',
      encoding_format: 'custom-fol',
      encoding: 'OrderIdeas(G) = OrderIdeas(h)',
      notes: 'The order and connection of ideas in the human mind mirrors God’s idea of the body.',
    },
  ],
  E2p17c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀i(IdeaOf(h,i) → CauseAsThought(G,i))',
      encoding_format: 'custom-fol',
      encoding: 'forall i: IdeaOf(h, i) -> CauseAsThought(G, i)',
      notes: 'God, as thinking, is cause of the ideas composing the human mind.',
    },
  ],
  E2p17s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀m(ModeOf(Body(h),m) → ModeOfMind(h,IdeaOf(h,m)))',
      encoding_format: 'custom-fol',
      encoding: 'forall m: ModeOf(Body(h), m) -> ModeOfMind(h, IdeaOf(h, m))',
      notes: 'Each bodily affection has a corresponding mode of thought in the mind.',
    },
  ],
  E2p18: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀i(IdeaOf(h,i) → AdequateIn(h,i) ↔ AdequateIn(G,i))',
      encoding_format: 'custom-fol',
      encoding: 'forall i: IdeaOf(h, i) -> (AdequateIn(h, i) <-> AdequateIn(G, i))',
      notes: 'An idea in the human mind is adequate iff it is adequate in God.',
    },
  ],
  E2p18s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'AdequateIn(h,i) ↔ CausesInMind(h,i)',
      encoding_format: 'custom-fol',
      encoding: 'AdequateIn(h, i) <-> CausesInMind(h, i)',
      notes: 'Adequacy of an idea entails that the mind is the adequate cause of its effects.',
    },
  ],
  E2p19: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Mind(h) → InBody(h)',
      encoding_format: 'custom-fol',
      encoding: 'Mind(h) -> InBody(h)',
      notes: 'The human mind is united to the human body.',
    },
  ],
  E2p20: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Mind(h) perceives Body(h) and Affections(Body(h))',
      encoding_format: 'custom-fol',
      encoding: 'Mind(h) -> (Perceives(h, Body(h)) & Perceives(h, Affections(Body(h))))',
      notes: 'The mind perceives the human body and its affections.',
    },
  ],
  E2p21: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Mind(h) perceives ExternalBodies insofar as Body(h) affected',
      encoding_format: 'custom-fol',
      encoding: 'Mind(h) -> PerceivesVia(h, ExternalBodies, Body(h))',
      notes: 'The mind perceives external bodies through the affections of its own body.',
    },
  ],
  E2p21s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∃b(ExternalBody(b) ∧ SimultaneousAffect(b,Body(h)))',
      encoding_format: 'custom-fol',
      encoding: 'exists b: ExternalBody(b) & SimultaneousAffect(b, Body(h))',
      notes: 'The human body is simultaneously affected with external bodies it encounters.',
    },
  ],
  E2p22: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Mind(h) perceives its own mind',
      encoding_format: 'custom-fol',
      encoding: 'Mind(h) -> Perceives(h, Mind(h))',
      notes: 'The human mind perceives itself through ideas of its body.',
    },
  ],
  E2p23: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Mind(h) knows itself via ideas of Body(h)',
      encoding_format: 'custom-fol',
      encoding: 'Mind(h) -> KnowsThrough(h, Mind(h), Body(h))',
      notes: 'Self-knowledge of the mind arises from perceiving ideas of the body.',
    },
  ],
  E2p24: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Mind(h) involves knowledge of God',
      encoding_format: 'custom-fol',
      encoding: 'Mind(h) -> InvolvesKnowledgeOf(h, G)',
      notes: 'Knowledge of God is involved in the human mind.',
    },
  ],
  E2p25: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'IdeaOf(IdeaOf(Body(h))) ∧ MindKnowsMind(h)',
      encoding_format: 'custom-fol',
      encoding: 'IdeaOf(IdeaOf(Body(h))) & MindKnowsMind(h)',
      notes: 'The mind contains the idea of its own idea of the body.',
    },
  ],
  E2p26: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'HumanBody(h) → ∃i(SimultaneousImages(h,i))',
      encoding_format: 'custom-fol',
      encoding: 'HumanBody(h) -> exists i: SimultaneousImages(h, i)',
      notes: 'The human body forms simultaneous images of many bodies.',
    },
  ],
  E2p26c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Mind(h) can regard many things at once',
      encoding_format: 'custom-fol',
      encoding: 'Mind(h) -> CanRegardMany(h)',
      notes: 'The mind can consider several things simultaneously.',
    },
  ],
  E2p27: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Mind(h) can imagine as present absent things',
      encoding_format: 'custom-fol',
      encoding: 'Mind(h) -> ImagineAsPresent(h, AbsentThings)',
      notes: 'From bodily traces the mind imagines absent things as if present.',
    },
  ],
  E2p28: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Mind(h) imagines as past future likewise',
      encoding_format: 'custom-fol',
      encoding: 'Mind(h) -> ImagineAsPastOrFuture(h)',
      notes: 'The mind can contemplate things as past or future.',
    },
  ],
  E2p28s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Memory(h) formed from bodily traces and affective order',
      encoding_format: 'custom-fol',
      encoding: 'Memory(h) -> FormedFrom(Traces(Body(h)), AffectiveOrder(h))',
      notes: 'Memory arises from order of bodily affections rather than intellectual order.',
    },
  ],
  E2p29: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'IdeaConfused(h,a) ∧ Event(a) → MindPassive(h)',
      encoding_format: 'custom-fol',
      encoding: 'IdeaConfused(h, a) & Event(a) -> MindPassive(h)',
      notes: 'If an affection’s idea is inadequate, the mind is passive regarding it.',
    },
  ],
  E2p29c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'MindPassive(h) ↔ InadequateIdeaOfBody(h)',
      encoding_format: 'custom-fol',
      encoding: 'MindPassive(h) <-> InadequateIdeaOfBody(h)',
      notes: 'Mind’s passivity arises from inadequate ideas of the body’s affections.',
    },
  ],
  E2p29s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'MindPassive(h) → DependentOnExternalCauses(h)',
      encoding_format: 'custom-fol',
      encoding: 'MindPassive(h) -> DependentOnExternalCauses(h)',
      notes: 'Passivity reflects dependence on external causes unknown to the mind.',
    },
  ],
  E2p30: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'InadequateIdea(h,a) ↔ IdeaOfEffectWithoutCause(h,a)',
      encoding_format: 'custom-fol',
      encoding: 'InadequateIdea(h, a) <-> IdeaOfEffectWithoutCause(h, a)',
      notes: 'An idea is inadequate when the mind perceives an effect without its adequate cause.',
    },
  ],
  E2p31: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'AdequateIdeaInMind(h) ↔ MindActive(h)',
      encoding_format: 'custom-fol',
      encoding: 'AdequateIdeaInMind(h) <-> MindActive(h)',
      notes: 'Having an adequate idea makes the mind active regarding its effects.',
    },
  ],
  E2p31c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'MindActive(h) → ∃a(CausesMind(h,a))',
      encoding_format: 'custom-fol',
      encoding: 'MindActive(h) -> exists a: CausesMind(h, a)',
      notes: 'When active, the mind is adequate cause of its affections.',
    },
  ],
  E2p32: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'There is nothing in things from which something follows unless determined by God',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Exists(x) -> DeterminedByGod(x)',
      notes: 'All things and their effects are determined by God.',
    },
  ],
  E2p33: [
    {
      system: 'FOL',
      version: 'v1',
      display: '¬∃p(PositiveInIdea(p) ∧ CausesFalsity(p))',
      encoding_format: 'custom-fol',
      encoding: 'not exists p: PositiveInIdea(p) & CausesFalsity(p)',
      notes: 'No positive element of an idea causes it to be false.',
    },
  ],
  E2p34: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'AdequateIdea(h,i) → True(i)',
      encoding_format: 'custom-fol',
      encoding: 'AdequateIdea(h, i) -> True(i)',
      notes: 'Every adequate idea in us is true.',
    },
  ],
  E2p35: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Falsity(i) ↔ PrivationOfKnowledge(i)',
      encoding_format: 'custom-fol',
      encoding: 'Falsity(i) <-> PrivationOfKnowledge(i)',
      notes: 'Falsity consists in the lack of knowledge within confused or fragmentary ideas.',
    },
  ],
  E2p35s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Error(i) → DerivedFromConfusedPerception(i)',
      encoding_format: 'custom-fol',
      encoding: 'Error(i) -> DerivedFromConfusedPerception(i)',
      notes: 'Errors arise from confused perceptions like imagining the sun near due to inadequate ideas.',
    },
  ],
  E2p36: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'InadequateIdea(i) → Necessary(i)',
      encoding_format: 'custom-fol',
      encoding: 'InadequateIdea(i) -> Necessary(i)',
      notes: 'Inadequate and confused ideas follow necessarily just like adequate ones.',
    },
  ],
  E2p37: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'CommonProperty(c) → ¬EssenceOfParticular(c)',
      encoding_format: 'custom-fol',
      encoding: 'CommonProperty(c) -> ~EssenceOfParticular(c)',
      notes: 'What is common to all bodies is not the essence of any particular thing.',
    },
  ],
  E2p38: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'CommonProperty(c) → ConceivedAdequately(c)',
      encoding_format: 'custom-fol',
      encoding: 'CommonProperty(c) -> ConceivedAdequately(c)',
      notes: 'Things common to all are conceived adequately.',
    },
  ],
  E2p38c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'CommonProperty(c) → ∀h(Human(h) → IdeaOf(h,c))',
      encoding_format: 'custom-fol',
      encoding: 'CommonProperty(c) -> forall h: Human(h) -> IdeaOf(h, c)',
      notes: 'There are notions common to all humans because bodies agree in some respects.',
    },
  ],
  E2p39: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'CommonWithHumanBody(c) → IdeaInMind(h,c)',
      encoding_format: 'custom-fol',
      encoding: 'CommonWithHumanBody(c) -> IdeaInMind(h, c)',
      notes: 'Features common to the human body and interacting bodies are represented adequately in the mind.',
    },
  ],
  E2p39c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'MoreCommonalities(Body(h)) → MoreAdequatePerceptions(h)',
      encoding_format: 'custom-fol',
      encoding: 'MoreCommonalities(Body(h)) -> MoreAdequatePerceptions(h)',
      notes: 'The more a body shares with others, the more the mind can perceive adequately.',
    },
  ],
  E2p40: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀i[(IdeaIn(h,i) ∧ FollowsFromAdequate(h,i)) → AdequateIdea(h,i)]',
      encoding_format: 'custom-fol',
      encoding: 'forall i: (IdeaIn(h, i) & FollowsFromAdequate(h, i)) -> AdequateIdea(h, i)',
      notes: 'Ideas that follow from adequate ideas are themselves adequate.',
    },
  ],
  E2p40s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'CommonNotions(h) form basis of reasoning',
      encoding_format: 'custom-fol',
      encoding: 'CommonNotions(h)',
      notes: 'Common notions grounded in shared bodily properties underpin human reasoning.',
    },
  ],
  E2p40s2: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'GeneralNotions arise from images or common properties',
      encoding_format: 'custom-fol',
      encoding: 'GeneralNotions(h) -> (FromImages(h) | FromCommonProperties(h))',
      notes: 'General notions stem either from confused images or from common properties grasped adequately.',
    },
  ],
  E2p41: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'KnowledgeKind1(h) → SourceOfFalsity(h)',
      encoding_format: 'custom-fol',
      encoding: 'KnowledgeKind1(h) -> SourceOfFalsity(h)',
      notes: 'Only imagination-based knowledge produces falsity; higher kinds are necessarily true.',
    },
  ],
  E2p42: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'KnowledgeKind2or3(h) → DistinguishesTrueFalse(h)',
      encoding_format: 'custom-fol',
      encoding: 'KnowledgeKind2or3(h) -> DistinguishesTrueFalse(h)',
      notes: 'Only the second and third kinds of knowledge teach us to distinguish truth from falsity.',
    },
  ],
  E2p43: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'TrueIdea(i) → AwareOfTruth(i)',
      encoding_format: 'custom-fol',
      encoding: 'TrueIdea(i) -> AwareOfTruth(i)',
      notes: 'Whoever has a true idea knows that it is true and cannot doubt it.',
    },
  ],
  E2p43s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'IdeaOfIdea(i) ↔ ReflexiveKnowledge(i)',
      encoding_format: 'custom-fol',
      encoding: 'IdeaOfIdea(i) <-> ReflexiveKnowledge(i)',
      notes: 'The mind can form an idea of an idea, yielding reflexive certainty.',
    },
  ],
  E2p44: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Reason(i) → PerceivesNecessary(i)',
      encoding_format: 'custom-fol',
      encoding: 'Reason(i) -> PerceivesNecessary(i)',
      notes: 'Reason views things as necessary rather than contingent.',
    },
  ],
  E2p44c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Imagination(i) → ConsidersContingent(i)',
      encoding_format: 'custom-fol',
      encoding: 'Imagination(i) -> ConsidersContingent(i)',
      notes: 'Contingency arises from imagination’s temporal perspective.',
    },
  ],
  E2p44s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'TemporalIgnorance → ContingencyAppearance',
      encoding_format: 'custom-fol',
      encoding: 'TemporalIgnorance -> ContingencyAppearance',
      notes: 'Ignorance of causes and temporal limitation make events seem contingent.',
    },
  ],
  E2p44c2: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Reason(i) → PerceivesSubSpecieAeternitatis(i)',
      encoding_format: 'custom-fol',
      encoding: 'Reason(i) -> PerceivesSubSpecieAeternitatis(i)',
      notes: 'Reason perceives things under a form of eternity.',
    },
  ],
  E2p45: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀i(IdeaOf(i,BodyOrThing) → InvolvesEssenceOf(G,i))',
      encoding_format: 'custom-fol',
      encoding: 'forall i: IdeaOf(i, BodyOrThing) -> InvolvesEssenceOf(G, i)',
      notes: 'Every idea of an actual thing involves the eternal and infinite essence of God.',
    },
  ],
  E2p45s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'ExistenceNotDuration(i)',
      encoding_format: 'custom-fol',
      encoding: 'ExistenceNotDuration(i)',
      notes: 'Existence refers to the actuality of a thing, not mere duration measured abstractly.',
    },
  ],
  E2p46: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀i(InvolvesEssenceOf(G,i) → AdequateKnowledge(i))',
      encoding_format: 'custom-fol',
      encoding: 'forall i: InvolvesEssenceOf(G, i) -> AdequateKnowledge(i)',
      notes: 'The knowledge of God’s essence contained in any idea is adequate.',
    },
  ],
  E2p47: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'HumanMind(h) → AdequateKnowledgeOf(h,G)',
      encoding_format: 'custom-fol',
      encoding: 'HumanMind(h) -> AdequateKnowledgeOf(h, G)',
      notes: 'The human mind has adequate knowledge of God’s eternal and infinite essence.',
    },
  ],
  E2p47s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'KnowledgeOf(G) → KnowAllInGod',
      encoding_format: 'custom-fol',
      encoding: 'KnowledgeOf(G) -> KnowAllInGod',
      notes: 'Knowing God allows inference of what follows from his nature.',
    },
  ],
  E2p48: [
    {
      system: 'FOL',
      version: 'v1',
      display: '¬FreeWillInMind(h)',
      encoding_format: 'custom-fol',
      encoding: '~FreeWillInMind(h)',
      notes: 'The mind’s volitions are determined by prior causes without absolute free will.',
    },
  ],
  E2p48s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'UnderstandingDesireEtc = ParticularActs',
      encoding_format: 'custom-fol',
      encoding: 'UnderstandingDesireEtc = ParticularActs',
      notes: 'So-called faculties like understanding or desire are nothing beyond particular acts determined by causes.',
    },
  ],
  E2p49: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'WillAct(i) ↔ Idea(i)',
      encoding_format: 'custom-fol',
      encoding: 'WillAct(i) <-> Idea(i)',
      notes: 'Affirmation and negation belong only to ideas themselves; there is no separate faculty of will.',
    },
  ],
  E2p49c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Will = Understanding',
      encoding_format: 'custom-fol',
      encoding: 'Will = Understanding',
      notes: 'Will and understanding are one and the same.',
    },
  ],
  E2p49s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Error = PrivationOfKnowledge',
      encoding_format: 'custom-fol',
      encoding: 'Error = PrivationOfKnowledge',
      notes: 'Error stems from privation of knowledge, not from an independent power of will.',
    },
  ],
};
