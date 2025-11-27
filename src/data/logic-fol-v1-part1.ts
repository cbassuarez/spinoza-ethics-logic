import type { LogicEncoding } from './types.js';

const PREDICATE_BLOCK_PART1_DEFS = [
  'predicate logic',
  'S(G)∧E(G)∧∀α[A(G,α)→Ess(α)]',
  '∀x∀y[(S(x)∧S(y)∧∃α(A(x,α)∧A(y,α)))→x=y]',
  '→∀x[(S(x)∧x≠G)→¬E(x)]',
  '→∀x[(S(x)∧x≠G)→¬C(x)]',
  '∴∀x[S(x)→x=G]',
  '∴∃!G[S(G)]',
  '∴∀x[(Ext(x)∨Cog(x))→∃α((A(G,α)∧(x=α))∨M(x,α))]',
].join('\n');


const PREDICATE_LOGIC_CLUSTER_ENCODING: LogicEncoding = {
  system: 'FOL',
  version: 'v1',
  display: PREDICATE_BLOCK_PART1_DEFS,
  encoding_format: 'derivation-block',
  encoding: PREDICATE_BLOCK_PART1_DEFS,
  notes:
    'Cluster-level derivation for Part I definitions (God, substance, attributes, modes) using S,G,E,A,Ess,M,Ext,Cog,C,… notation.',
};


const LOGIC_FOL_V1_DEFINITIONS_PART1: Record<string, LogicEncoding[]> = {
  // E1D1: Self-caused (causa sui)
  E1D1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (C(x) ↔ E(x))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: C(x) <-> E(x)',
      notes:
        'C(x): x is causa sui (self-caused). E(x): x\'s essence involves existence (its nature necessitates existence).',
    },
  ],

  // E1D2: Finite in its kind
  E1D2: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (F(x) ↔ ∃y (Same(x,y) ∧ Limits(y,x)))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: F(x) <-> exists y: Same(x, y) & Limits(y, x)',
      notes:
        'F(x): x is finite in its kind. Same(x, y): x and y share the same nature. Limits(y, x): y bounds or limits x\'s nature.',
    },
  ],

  // E1D3: Substance
  E1D3: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (S(x) ↔ (InSelf(x) ∧ SelfConceived(x)))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: S(x) <-> (InSelf(x) & SelfConceived(x))',
      notes:
        'S(x): x is a substance. InSelf(x): x exists in itself. SelfConceived(x): x is conceived through itself (its concept does not require another).',
    },
  ],

  // E1D4: Attribute
  E1D4: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀α (Attr(α) ↔ ∃s (S(s) ∧ A(s,α) ∧ Ess(α)))',
      encoding_format: 'custom-fol',
      encoding: 'forall alpha: Attr(alpha) <-> exists s: S(s) & A(s, alpha) & Ess(alpha)',
      notes:
        'Attr(α): α is an attribute. S(s): s is a substance. A(s, α): α belongs to substance s. Ess(α): α expresses or constitutes the essence of the substance.',
    },
  ],

  // E1D5: Mode
  E1D5: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀m∀s∀α (M(m,α) ↔ (A(s,α) ∧ InOther(m,s) ∧ ConceivedThrough(m,s)))',
      encoding_format: 'custom-fol',
      encoding:
        'forall m forall s forall alpha: M(m, alpha) <-> (A(s, alpha) & InOther(m, s) & ConceivedThrough(m, s))',
      notes:
        'M(m, α): m is a mode under attribute α. A(s, α): α is an attribute of substance s. InOther(m, s): m exists in s. ConceivedThrough(m, s): m is conceived through s.',
    },
  ],

  // E1D6: God
  E1D6: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'S(G) ∧ E(G) ∧ ∀α (A(G,α) → Ess(α))',
      encoding_format: 'custom-fol',
      encoding: 'S(G) & E(G) & forall a: A(G,a) -> Ess(a)',
      notes:
        'E1D6 (God): S(x): x is a substance; G: constant for God; E(x): x exists; A(x,a): a is an attribute of x; Ess(a): a expresses eternal and infinite essence.',
    },
  ],

  // E1D7: Free
  E1D7: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (Free(x) ↔ (FromNature(x) ∧ ActsFromNature(x)))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Free(x) <-> (FromNature(x) & ActsFromNature(x))',
      notes:
        'Free(x): x is free. FromNature(x): x exists solely from the necessity of its own nature. ActsFromNature(x): x is determined to act by itself alone (not by external compulsion).',
    },
  ],

  // E1D8: Eternal
  E1D8: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (Eternal(x) ↔ (DefImpliesExistence(x) ∧ Atemporal(x)))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Eternal(x) <-> (DefImpliesExistence(x) & Atemporal(x))',
      notes:
        'Eternal(x): x is eternal. DefImpliesExistence(x): x\'s existence follows solely from its definition. Atemporal(x): x\'s existence is conceived without relation to time.',
    },
  ],
};


const LOGIC_FOL_V1_AXIOMS_PART1: Record<string, LogicEncoding[]> = {
  // Axiom 1: Everything which exists, exists either in itself or in something else.
  E1Ax1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (E(x) → (InSelf(x) ∨ ∃y InOther(x,y)))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: E(x) -> (InSelf(x) | exists y: InOther(x, y))',
      notes:
        'E1Ax1: every existent thing either exists in itself (InSelf) or in another (InOther). E(x): x exists; InSelf(x): x exists in itself; InOther(x,y): x exists in another y.',
    },
  ],

  // Axiom 2: That which cannot be conceived through anything else must be conceived through itself.
  E1Ax2: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (¬∃y ConceivedThrough(x,y) → SelfConceived(x))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: (~exists y: ConceivedThrough(x, y)) -> SelfConceived(x)',
      notes:
        'E1Ax2: if a thing’s concept does not depend on another (ConceivedThrough), it must be conceived through itself (SelfConceived).',
    },
  ],

  // Axiom 3: From a given definite cause an effect necessarily follows; without a definite cause no effect follows.
  E1Ax3: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀e[(∃c DefCause(c,e)) → □FollowsFrom(c,e)] ∧ ∀e[(¬∃c DefCause(c,e)) → ¬Possible(e)]',
      encoding_format: 'custom-fol',
      encoding:
        'forall e: (exists c: DefCause(c, e) -> Box FollowsFrom(c, e)) & ((not exists c: DefCause(c, e)) -> not Possible(e))',
      notes:
        'E1Ax3: a definite cause (DefCause) necessitates its effect (FollowsFrom); without such a cause the effect is impossible (Possible). Box marks necessity.',
    },
  ],

  // Axiom 4: The knowledge of an effect depends on and involves the knowledge of a cause.
  E1Ax4: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀e∀c (CauseOf(c,e) → (KnowEffect(e) → KnowCause(c)))',
      encoding_format: 'custom-fol',
      encoding: 'forall e forall c: CauseOf(c, e) -> (KnowEffect(e) -> KnowCause(c))',
      notes:
        'E1Ax4: to know an effect (KnowEffect) you must also know its cause (KnowCause); CauseOf links cause to effect.',
    },
  ],

  // Axiom 5: Things which have nothing in common cannot be understood through one another.
  E1Ax5: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x∀y (¬Common(x,y) → (¬InvolvesConcept(x,y) ∧ ¬InvolvesConcept(y,x)))',
      encoding_format: 'custom-fol',
      encoding:
        'forall x forall y: (not Common(x, y)) -> (~InvolvesConcept(x, y) & ~InvolvesConcept(y, x))',
      notes:
        'E1Ax5: if two things share nothing (Common), conceiving one does not involve the other (InvolvesConcept).',
    },
  ],

  // Axiom 6: A true idea must correspond with its ideate or object.
  E1Ax6: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀i∀x ((IdeaOf(i,x) ∧ True(i)) → Corresponds(i,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall i forall x: (IdeaOf(i, x) & True(i)) -> Corresponds(i, x)',
      notes:
        'E1Ax6: any true idea (True) of x (IdeaOf) must agree or correspond with x (Corresponds).',
    },
  ],

  // Axiom 7: If a thing can be conceived as non-existing, its essence does not involve existence.
  E1Ax7: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (ConceivableAsAbsent(x) → ¬EssImpliesExistence(x))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: ConceivableAsAbsent(x) -> not EssImpliesExistence(x)',
      notes:
        'E1Ax7: if x can be conceived as not existing (ConceivableAsAbsent), its essence does not entail existence (EssImpliesExistence).',
    },
  ],
};


const LOGIC_FOL_V1_COROLLARIES_PART1: Record<string, LogicEncoding[]> = {
  // Prop. 6 corollary: substance cannot be produced by anything external to itself.
  E1p6c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀s (S(s) → ¬∃y (ExternalTo(y,s) ∧ Produces(y,s)))',
      encoding_format: 'custom-fol',
      encoding: 'forall s: S(s) -> not exists y: ExternalTo(y, s) & Produces(y, s)',
      notes:
        'E1p6c1: no substance (S) is produced by something outside itself; ExternalTo marks being beyond the substance, Produces denotes causal production.',
    },
  ],

  // Prop. 13 corollary: no substance is divisible.
  E1p13c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀s (S(s) → ¬Divisible(s))',
      encoding_format: 'custom-fol',
      encoding: 'forall s: S(s) -> not Divisible(s)',
      notes: 'E1p13c1: substances (S) cannot be divided (Divisible) in their nature.',
    },
  ],

  // Prop. 14 corollary 1: God is the one absolutely infinite substance.
  E1p14c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'S(G) ∧ Infinite(G) ∧ ∀s (S(s) → s = G)',
      encoding_format: 'custom-fol',
      encoding: 'S(G) & Infinite(G) & forall s: S(s) -> s = G',
      notes:
        'E1p14c1: there is exactly one substance and it is God (G), who is absolutely infinite (Infinite).',
    },
  ],

  // Prop. 14 corollary 2: Extension and thought are attributes of God (or affections of those attributes).
  E1p14c2: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'A(G,ExtAttr) ∧ A(G,ThoughtAttr)',
      encoding_format: 'custom-fol',
      encoding: 'A(G, ExtAttr) & A(G, ThoughtAttr)',
      notes:
        'E1p14c2: the attributes Extension (ExtAttr) and Thought (ThoughtAttr) belong to God (A predicate).',
    },
  ],

  // Prop. 16 corollary 1: God is efficient cause of all that an infinite intellect can comprehend.
  E1p16c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (WithinInfiniteIntellect(x) → CauseOf(G,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: WithinInfiniteIntellect(x) -> CauseOf(G, x)',
      notes:
        'E1p16c1: anything graspable by an infinite intellect (WithinInfiniteIntellect) has God as its efficient cause (CauseOf).',
    },
  ],

  // Prop. 16 corollary 2: God is a cause through himself, not by accident.
  E1p16c2: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'CauseInItself(G) ∧ ¬∃a AccidentalCause(a,G)',
      encoding_format: 'custom-fol',
      encoding: 'CauseInItself(G) & not exists a: AccidentalCause(a, G)',
      notes:
        'E1p16c2: God’s causal power is intrinsic (CauseInItself) and not the result of accidental factors (AccidentalCause).',
    },
  ],

  // Prop. 16 corollary 3: God is the absolutely first cause.
  E1p16c3: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'FirstCause(G) ∧ ¬∃c (CauseOf(c,G) ∧ c ≠ G)',
      encoding_format: 'custom-fol',
      encoding: 'FirstCause(G) & not exists c: CauseOf(c, G) & c != G',
      notes:
        'E1p16c3: God is the first cause (FirstCause) with no prior distinct cause (CauseOf).',
    },
  ],

  // Prop. 17 corollary 1: nothing extrinsic or intrinsic besides God’s own perfection moves God to act.
  E1p17c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '¬∃c (CauseOf(c,G) ∧ MovesToAct(c,G) ∧ ¬FromNature(c,G))',
      encoding_format: 'custom-fol',
      encoding: 'not exists c: CauseOf(c, G) & MovesToAct(c, G) & not FromNature(c, G)',
      notes:
        'E1p17c1: no cause other than God’s own nature (FromNature) motivates divine action (MovesToAct); CauseOf captures causal influence.',
    },
  ],

  // Prop. 17 corollary 2: God is the sole free cause.
  E1p17c2: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Free(G) ∧ ∀x (Free(x) → x = G)',
      encoding_format: 'custom-fol',
      encoding: 'Free(G) & forall x: Free(x) -> x = G',
      notes:
        'E1p17c2: God alone is free (Free) and any free cause is identical with God.',
    },
  ],

  // Prop. 24 corollary: God causes things to exist and to persist in existence.
  E1p24c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (E(x) → (CauseOf(G,x) ∧ Sustains(G,x)))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: E(x) -> (CauseOf(G, x) & Sustains(G, x))',
      notes:
        'E1p24c1: for every existent x (E), God is both its originating cause (CauseOf) and sustaining cause (Sustains).',
    },
  ],

  // Prop. 25 corollary: individuals are modes of God’s attributes.
  E1p25c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (Individual(x) → ∃α (A(G,α) ∧ M(x,α)))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Individual(x) -> exists alpha: A(G, alpha) & M(x, alpha)',
      notes:
        'E1p25c1: each individual thing (Individual) is a mode (M) of some attribute α belonging to God (A(G, α)).',
    },
  ],

  // ---------------------------------------------------------------------------
  // Part I – Proposition 20, Corollary 1
  // God’s existence and essence stand as an eternal / necessary truth.
  // ---------------------------------------------------------------------------
  E1p20c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'S(G) ∧ E(G) ∧ N(G)',
      encoding_format: 'custom-fol',
      encoding: 'S(G) & E(G) & N(G)',
      notes:
        'E1p20c1: N(x) means “x exists as an eternal/necessary truth”; this cluster encodes that God, as substance, exists eternally and necessarily.',
    },
  ],

  // ---------------------------------------------------------------------------
  // Part I – Proposition 20, Corollary 2
  // No substance other than God can be granted or conceived.
  // ---------------------------------------------------------------------------
  E1p20c2: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x (S(x) → x = G)',
      encoding_format: 'custom-fol',
      encoding: 'forall x: S(x) -> x = G',
      notes:
        'E1p20c2: any substance is identical with G; there is no distinct substance besides God.',
    },
  ],

  // ---------------------------------------------------------------------------
  // Part I – Proposition 32, Corollary 1
  // God does not act from freedom of the will.
  // ---------------------------------------------------------------------------
  E1p32c1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'S(G) ∧ ¬W(G)',
      encoding_format: 'custom-fol',
      encoding: 'S(G) & ~W(G)',
      notes:
        'E1p32c1: W(x) means “x acts from freedom of the will”; the cluster asserts that God is a substance but does not act from a free will.',
    },
  ],

  // ---------------------------------------------------------------------------
  // Part I – Proposition 32, Corollary 2
  // Will and intellect stand to God as modes (like motion/rest to extension).
  // ---------------------------------------------------------------------------
  E1p32c2: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        '(W(G) ↔ I(G)) ∧ ∀x ((Ext(x) ∨ Cog(x)) → M(x, G))',
      encoding_format: 'custom-fol',
      encoding:
        '(W(G) <-> I(G)) & forall x: (Ext(x) | Cog(x)) -> M(x, G)',
      notes:
        'E1p32c2: W(x) and I(x) are will and intellect as modes of God; Ext(x)/Cog(x) are extended/mental modes; this encodes that will and intellect relate to God as other modes (e.g. motion, rest) do.',
    },
  ],
};


const LOGIC_FOL_V1_PROPOSITIONS_PART1_TIER_A: Record<string, LogicEncoding[]> = {
  // Prop. 1: Substance is prior to its modes.
  E1p1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀m∀s[(M(m) ∧ In(m,s)) → Prior(s,m)]',
      encoding_format: 'custom-fol',
      encoding: 'forall m forall s: (M(m) & In(m, s)) -> Prior(s, m)',
      notes:
        'Modes (M) inhering in a substance (In) presuppose that substance, which is prior (Prior) in nature.',
    },
  ],

  // Prop. 2: Substances with different attributes have nothing in common.
  E1p2: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀s∀t[(S(s) ∧ S(t) ∧ DiffAttr(s,t)) → ¬CommonNature(s,t)]',
      encoding_format: 'custom-fol',
      encoding: 'forall s forall t: (S(s) & S(t) & DiffAttr(s, t)) -> not CommonNature(s, t)',
      notes:
        'Different attributes (DiffAttr) prevent two substances (S) from sharing anything (CommonNature).',
    },
  ],

  // Prop. 3: Things without a common nature cannot cause one another.
  E1p3: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x∀y[¬CommonNature(x,y) → (¬CauseOf(x,y) ∧ ¬CauseOf(y,x))]',
      encoding_format: 'custom-fol',
      encoding: 'forall x forall y: not CommonNature(x, y) -> (~CauseOf(x, y) & ~CauseOf(y, x))',
      notes:
        'Absence of shared nature (CommonNature) blocks causal relations (CauseOf) in either direction.',
    },
  ],

  // Prop. 4: Distinct things differ by attributes or affections.
  E1p4: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x∀y[x ≠ y → (DiffAttr(x,y) ∨ ∃m DiffAff(m,x,y))]',
      encoding_format: 'custom-fol',
      encoding: 'forall x forall y: x != y -> (DiffAttr(x, y) | exists m: DiffAff(m, x, y))',
      notes:
        'If two things are distinct, the difference is either in attributes (DiffAttr) or in their affections (DiffAff).',
    },
  ],

  // Prop. 5: No two substances share an attribute.
  E1p5: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀s∀t∀α[(S(s) ∧ S(t) ∧ A(s,α) ∧ A(t,α)) → s = t]',
      encoding_format: 'custom-fol',
      encoding: 'forall s forall t forall a: (S(s) & S(t) & A(s, a) & A(t, a)) -> s = t',
      notes:
        'Sharing an attribute (A) collapses two substances (S) into identity; otherwise substances cannot share the same nature.',
    },
  ],

  // Prop. 6: A substance cannot be produced by another substance.
  E1p6: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀s∀t[(S(s) ∧ S(t) ∧ CauseOf(t,s)) → t = s]',
      encoding_format: 'custom-fol',
      encoding: 'forall s forall t: (S(s) & S(t) & CauseOf(t, s)) -> t = s',
      notes:
        'No distinct substance (S) can stand as the cause (CauseOf) of another; causal production would force identity.',
    },
  ],

  // Prop. 7: Existence belongs to the nature of substance.
  E1p7: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀s[S(s) → E(s)]',
      encoding_format: 'custom-fol',
      encoding: 'forall s: S(s) -> E(s)',
      notes: 'Any substance (S) has existence (E) contained within its nature.',
    },
  ],

  // Prop. 8: Every substance is necessarily infinite.
  E1p8: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀s[(S(s) ∧ E(s)) → Infinite(s)]',
      encoding_format: 'custom-fol',
      encoding: 'forall s: (S(s) & E(s)) -> Infinite(s)',
      notes: 'A substance that exists (E) cannot be finite; it is infinite (Infinite) in its attribute.',
    },
  ],

  // Prop. 9: More reality implies more attributes.
  E1p9: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x∀y[(MoreReality(x,y)) → MoreAttributes(x,y)]',
      encoding_format: 'custom-fol',
      encoding: 'forall x forall y: MoreReality(x, y) -> MoreAttributes(x, y)',
      notes:
        'When x has more reality (MoreReality) than y, it expresses that essence through more attributes (MoreAttributes).',
    },
  ],

  // Prop. 10: Each attribute is conceived through itself.
  E1p10: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        '∀α∀β[(A(G,α) ∧ A(G,β) ∧ α ≠ β) → ¬Depends(α,β)] ∧ ∀α[A(G,α) → Ess(α)]',
      encoding_format: 'custom-fol',
      encoding:
        'forall a forall b: ((A(G, a) & A(G, b) & a != b) -> not Depends(a, b)) & forall a: (A(G, a) -> Ess(a))',
      notes:
        'Attributes of God (A(G,α)) each express an eternal essence (Ess). No distinct attributes depend on one another for their conception (¬Depends).',
    },
  ],
};


const LOGIC_FOL_V1_PROPOSITIONS_PART1_TIER_B: Record<string, LogicEncoding[]> = {
  E1p11: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Infinite(G) ∧ ∀α[A(G,α) → Ess(α)] → E(G)',
      encoding_format: 'custom-fol',
      encoding: 'Infinite(G) & forall a: (A(G, a) -> Ess(a)) -> E(G)',
      notes: 'God (G), possessing infinite essential attributes (A, Ess), necessarily exists (E).',
    },
  ],
  E1p12: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀α[(A(G,α) ∧ Ess(α)) → ¬Divisible(α)]',
      encoding_format: 'custom-fol',
      encoding: 'forall a: (A(G, a) & Ess(a)) -> not Divisible(a)',
      notes: 'No divine attribute (A) expressing essence (Ess) can imply divisibility (Divisible).',
    },
  ],
  E1p13: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'S(G) → ¬Divisible(G)',
      encoding_format: 'custom-fol',
      encoding: 'S(G) -> not Divisible(G)',
      notes: 'The absolutely infinite substance God (S(G)) cannot be divided (¬Divisible).',
    },
  ],
  E1p14: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀s[S(s) → s = G]',
      encoding_format: 'custom-fol',
      encoding: 'forall s: S(s) -> s = G',
      notes: 'Any substance (S) is identical with God (G); no other substance is granted or conceived.',
    },
  ],
  E1p15: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x[Exists(x) → In(x,G)]',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Exists(x) -> In(x, G)',
      notes: 'Whatever exists is in God (In) and cannot be conceived apart from the divine.',
    },
  ],
  E1p16: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Necessarily(G) ∧ ∀x[FollowsFrom(G,x) → Produced(G,x)]',
      encoding_format: 'custom-fol',
      encoding: 'Necessarily(G) & forall x: FollowsFrom(G, x) -> Produced(G, x)',
      notes: 'From the necessity of divine nature (Necessarily) infinitely many things follow (FollowsFrom) as produced by God.',
    },
  ],
  E1p17: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'ActsByNature(G) ∧ ¬∃y Constrains(y,G)',
      encoding_format: 'custom-fol',
      encoding: 'ActsByNature(G) & not exists y: Constrains(y, G)',
      notes: 'God acts solely from divine nature (ActsByNature) and is constrained by nothing external (Constrains).',
    },
  ],
  E1p18: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x[Exists(x) → (In(x,G) ∧ CauseOf(G,x))]',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Exists(x) -> (In(x, G) & CauseOf(G, x))',
      notes: 'All things existing are in God (In) and have God as immanent cause (CauseOf).',
    },
  ],
  E1p19: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Eternal(G) ∧ ∀α[A(G,α) → Eternal(α)]',
      encoding_format: 'custom-fol',
      encoding: 'Eternal(G) & forall a: A(G, a) -> Eternal(a)',
      notes: 'God and every divine attribute (A) are eternal (Eternal) without beginning or end.',
    },
  ],
  E1p20: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Ess(G) ↔ E(G)',
      encoding_format: 'custom-fol',
      encoding: 'Ess(G) <-> E(G)',
      notes: 'For God, essence (Ess) and existence (E) are one and the same reality.',
    },
  ],
  E1p21: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x[FollowsFromAbsAttr(x) → (Eternal(x) ∧ Infinite(x))]',
      encoding_format: 'custom-fol',
      encoding: 'forall x: FollowsFromAbsAttr(x) -> (Eternal(x) & Infinite(x))',
      notes: 'Whatever follows from the absolute nature of a divine attribute is eternal and infinite.',
    },
  ],
  E1p22: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x[FollowsFromModAttr(x) → (Necessary(x) ∧ Determinate(x))]',
      encoding_format: 'custom-fol',
      encoding: 'forall x: FollowsFromModAttr(x) -> (Necessary(x) & Determinate(x))',
      notes:
        'Effects following from an attribute as modified (FollowsFromModAttr) exist necessarily (Necessary) in a determinate way.',
    },
  ],
  E1p23: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        '∀m∀α[(M(m,α) ∧ Necessary(m) ∧ Infinite(m) ∧ A(G,α)) → (DirectFromAttr(m,α) ∨ ViaInfinite(m,α))]',
      encoding_format: 'custom-fol',
      encoding:
        'forall m forall a: ((M(m, a) & Necessary(m) & Infinite(m) & A(G, a)) -> (DirectFromAttr(m, a) | ViaInfinite(m, a)))',
      notes:
        'Necessary infinite modes under a divine attribute (M, Necessary, Infinite, A(G,α)) either arise immediately from that attribute (DirectFromAttr) or via another infinite mode under the same attribute (ViaInfinite).',
    },
  ],
  E1p24: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x[ProducedBy(G,x) → ¬EssImpliesExistence(x)]',
      encoding_format: 'custom-fol',
      encoding: 'forall x: ProducedBy(G, x) -> not EssImpliesExistence(x)',
      notes: 'Things produced by God (ProducedBy) do not have essences that entail existence (¬EssImpliesExistence).',
    },
  ],
  E1p25: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x[CauseOf(G,x) → (CauseEssence(G,x) ∧ CauseExistence(G,x))]',
      encoding_format: 'custom-fol',
      encoding: 'forall x: CauseOf(G, x) -> (CauseEssence(G, x) & CauseExistence(G, x))',
      notes: 'God is efficient cause (CauseOf) of both the essence and existence of whatever is caused (CauseEssence, CauseExistence).',
    },
  ],
  E1p26: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x∀m[ConditionedToAct(x,m) → ConditionedBy(G,x,m)]',
      encoding_format: 'custom-fol',
      encoding: 'forall x forall m: ConditionedToAct(x, m) -> ConditionedBy(G, x, m)',
      notes: 'Any thing conditioned to act in some way (ConditionedToAct) has been so conditioned by God (ConditionedBy).',
    },
  ],
  E1p27: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x∀m[ConditionedBy(G,x,m) → ¬CanMakeUnconditioned(x)]',
      encoding_format: 'custom-fol',
      encoding: 'forall x forall m: ConditionedBy(G, x, m) -> not CanMakeUnconditioned(x)',
      notes: 'What is conditioned by God (ConditionedBy) cannot render itself free from that conditioning (¬CanMakeUnconditioned).',
    },
  ],
  E1p28: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x[(Finite(x) ∧ Exists(x)) → ∃y(Finite(y) ∧ CauseOf(y,x))]',
      encoding_format: 'custom-fol',
      encoding: 'forall x: (Finite(x) & Exists(x)) -> exists y: (Finite(y) & CauseOf(y, x))',
      notes:
        'Any finite, conditioned thing (Finite, Exists) depends on another finite cause (CauseOf) for its existence or action.',
    },
  ],
  E1p29: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x[NecessitatedBy(G,x) ∧ ¬Contingent(x)]',
      encoding_format: 'custom-fol',
      encoding: 'forall x: NecessitatedBy(G, x) & not Contingent(x)',
      notes: 'Nothing is contingent (¬Contingent); everything is necessitated by divine nature (NecessitatedBy).',
    },
  ],
  E1p30: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀i[Intellect(i) → (∀α[A(G,α) → Comprehends(i,α)] ∧ ∀m[M(m) → Comprehends(i,m)])]',
      encoding_format: 'custom-fol',
      encoding:
        'forall i: Intellect(i) -> ((forall a: A(G, a) -> Comprehends(i, a)) & (forall m: M(m) -> Comprehends(i, m)))',
      notes: 'Any intellect (Intellect) finite or infinite comprehends divine attributes and their modes (Comprehends).',
    },
  ],
  E1p31: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀i[Intellect(i) → PassiveNature(i)]',
      encoding_format: 'custom-fol',
      encoding: 'forall i: Intellect(i) -> PassiveNature(i)',
      notes: 'The intellect and its affects (Intellect) belong to natura naturata or passive nature (PassiveNature).',
    },
  ],
  E1p32: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀w[Will(w) → NecessaryCause(w)]',
      encoding_format: 'custom-fol',
      encoding: 'forall w: Will(w) -> NecessaryCause(w)',
      notes: 'Will (Will) is not a free cause; it operates as a necessary cause (NecessaryCause).',
    },
  ],
  E1p33: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x[FollowsFrom(G,x) → ¬CouldBeOtherwise(x)]',
      encoding_format: 'custom-fol',
      encoding: 'forall x: FollowsFrom(G, x) -> not CouldBeOtherwise(x)',
      notes: 'Whatever follows from God (FollowsFrom) could not have been produced differently (¬CouldBeOtherwise).',
    },
  ],
  E1p34: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'Identical(Power(G), Essence(G))',
      encoding_format: 'custom-fol',
      encoding: 'Identical(Power(G), Essence(G))',
      notes: 'God’s power (Power(G)) is identical with the divine essence (Essence(G)).',
    },
  ],
  E1p35: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x[InPowerOf(G,x) → Exists(x)]',
      encoding_format: 'custom-fol',
      encoding: 'forall x: InPowerOf(G, x) -> Exists(x)',
      notes: 'Anything contained in God’s power (InPowerOf) necessarily exists (Exists).',
    },
  ],
  E1p36: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀c[Cause(c) → ∃e EffectOf(c,e)]',
      encoding_format: 'custom-fol',
      encoding: 'forall c: Cause(c) -> exists e: EffectOf(c, e)',
      notes: 'Every cause (Cause) produces some effect (EffectOf); nothing causal is barren.',
    },
  ],
};


const LOGIC_FOL_V1_SCHOLIA_PART1_TIER_A: Record<string, LogicEncoding[]> = {
  // E1p8s1 – scholium to Proposition 8
  E1p8s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'S(G) ∧ ∀α∀m[(A(G,α) ∧ M(m,α)) → FromNature(G,m)]',
      encoding_format: 'custom-fol',
      encoding: 'S(G) & forall a forall m: ((A(G, a) & M(m, a)) -> FromNature(G, m))',
      notes:
        'Object-level claim: God is the unique substance (S(G)), and every mode under any divine attribute (A, M) follows from God’s nature (FromNature).',
    },
    {
      system: 'FOL',
      version: 'v1',
      display: 'Explains(E1p8s1, E1p8) ∧ Clarifies(ModeOrder, FromSubstanceNature)',
      encoding_format: 'meta-fol',
      encoding:
        'Explains(E1p8s1, E1p8) & Clarifies(ModeOrder, FromSubstanceNature)',
      notes:
        'Meta-level encoding: scholium E1p8s1 explains and clarifies how the necessity of substance’s existence entails the structured order of modes.',
    },
  ],

  // E1p8s2 – scholium to Proposition 8 (further elaboration)
  E1p8s2: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'S(G) ∧ ∀α[A(G,α) → InfModes(G,α)]',
      encoding_format: 'custom-fol',
      encoding: 'S(G) & forall a: (A(G, a) -> InfModes(G, a))',
      notes:
        'Object-level claim: for every divine attribute (A(G,α)), infinitely many modes proceed from God under that attribute (InfModes).',
    },
    {
      system: 'FOL',
      version: 'v1',
      display:
        'Explains(E1p8s2, E1p8) ∧ Emphasizes(InfinitelyManyModes, FromDivineNature)',
      encoding_format: 'meta-fol',
      encoding:
        'Explains(E1p8s2, E1p8) & Emphasizes(InfinitelyManyModes, FromDivineNature)',
      notes:
        'Meta-level encoding: scholium E1p8s2 stresses the infinitude and variety of modes grounded in divine nature.',
    },
  ],

  // E1p10s1 – scholium to Proposition 10
  E1p10s1: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        '∀α[A(G,α) → Ess(α)] ∧ ∀α∀β[(A(G,α) ∧ A(G,β) ∧ α ≠ β) → ¬DerivesFrom(α,β)]',
      encoding_format: 'custom-fol',
      encoding:
        'forall a: (A(G, a) -> Ess(a)) & forall a forall b: ((A(G, a) & A(G, b) & a != b) -> not DerivesFrom(a, b))',
      notes:
        'Object-level claim: every divine attribute expresses essence (A, Ess) and distinct attributes do not conceptually derive from one another (¬DerivesFrom).',
    },
    {
      system: 'FOL',
      version: 'v1',
      display:
        'Explains(E1p10s1, E1p10) ∧ Clarifies(IndependenceOfAttributes, ConceptualAutonomy)',
      encoding_format: 'meta-fol',
      encoding:
        'Explains(E1p10s1, E1p10) & Clarifies(IndependenceOfAttributes, ConceptualAutonomy)',
      notes:
        'Meta-level encoding: scholium E1p10s1 clarifies how attributes are conceptually autonomous expressions of the same substance.',
    },
  ],

  // E1p11s1 – scholium to Proposition 11
  E1p11s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'S(G) ∧ E(G) ∧ ∀s[S(s) → s = G]',
      encoding_format: 'custom-fol',
      encoding: 'S(G) & E(G) & forall s: S(s) -> s = G',
      notes:
        'Object-level claim: God is the self-caused substance (S(G), E(G)), and any substance collapses to that same unique God (s = G).',
    },
    {
      system: 'FOL',
      version: 'v1',
      display:
        'Explains(E1p11s1, E1p11) ∧ Clarifies(IdentityOfGodAndSubstance, UniqueInfiniteSubstance)',
      encoding_format: 'meta-fol',
      encoding:
        'Explains(E1p11s1, E1p11) & Clarifies(IdentityOfGodAndSubstance, UniqueInfiniteSubstance)',
      notes:
        'Meta-level encoding: scholium E1p11s1 clarifies that “God” and “Substance” name the same absolutely infinite being.',
    },
  ],

  // E1p13s1 – scholium to Proposition 13
  E1p13s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'S(G) ∧ ∀α∀m[(A(G,α) ∧ M(m,α)) → In(m,G)] ∧ ¬∃s[S(s) ∧ s ≠ G]',
      encoding_format: 'custom-fol',
      encoding:
        'S(G) & forall a forall m: ((A(G, a) & M(m, a)) -> In(m, G)) & not exists s: (S(s) & s != G)',
      notes:
        'Object-level claim: God is the only substance (S(G)); every mode under any attribute is in God (In), and no other substance (S) exists apart from G.',
    },
    {
      system: 'FOL',
      version: 'v1',
      display:
        'Explains(E1p13s1, E1p13) ∧ Clarifies(ImmanenceOfGod, AllModesInGod)',
      encoding_format: 'meta-fol',
      encoding:
        'Explains(E1p13s1, E1p13) & Clarifies(ImmanenceOfGod, AllModesInGod)',
      notes:
        'Meta-level encoding: scholium E1p13s1 underlines the immanence doctrine: nothing exists or is conceived without God.',
    },
  ],

  // E1p15s1 – scholium to Proposition 15
  E1p15s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'S(G) ∧ ∀α∀m[(A(G,α) ∧ M(m,α)) → FromNature(G,m)] ∧ ∀α[A(G,α) → InfModes(G,α)]',
      encoding_format: 'custom-fol',
      encoding:
        'S(G) & forall a forall m: ((A(G, a) & M(m, a)) -> FromNature(G, m)) & forall a: (A(G, a) -> InfModes(G, a))',
      notes:
        'Object-level claim: every mode under a divine attribute (A, M) follows from God’s nature (FromNature), and each attribute yields infinitely many such modes (InfModes).',
    },
    {
      system: 'FOL',
      version: 'v1',
      display:
        'Explains(E1p15s1, E1p15) ∧ Clarifies(InfinitelyManyModes, FromDivineNature)',
      encoding_format: 'meta-fol',
      encoding:
        'Explains(E1p15s1, E1p15) & Clarifies(InfinitelyManyModes, FromDivineNature)',
      notes:
        'Meta-level encoding: scholium E1p15s1 explains how the conclusion of E1p15 generalizes to infinitely many modes grounded in God.',
    },
  ],

  // E1p17s1 – scholium to Proposition 17
  E1p17s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'S(G) ∧ ∀α∀m[(A(G,α) ∧ M(m,α)) → In(m,G)] ∧ Immanent(G)',
      encoding_format: 'custom-fol',
      encoding: 'S(G) & forall a forall m: ((A(G, a) & M(m, a)) -> In(m, G)) & Immanent(G)',
      notes:
        'Object-level claim: as the sole substance (S(G)), God contains every mode within divine attributes (A, M, In) and is expressly immanent (Immanent) rather than transcendent.',
    },
    {
      system: 'FOL',
      version: 'v1',
      display:
        'Explains(E1p17s1, E1p17) ∧ Clarifies(ImmanentCause, AgainstTranscendence)',
      encoding_format: 'meta-fol',
      encoding:
        'Explains(E1p17s1, E1p17) & Clarifies(ImmanentCause, AgainstTranscendence)',
      notes:
        'Meta-level encoding: scholium E1p17s1 interprets E1p17 in explicitly immanentist, anti-transcendent terms.',
    },
  ],

  // E1p19s1 – scholium to Proposition 19
  E1p19s1: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        'S(G) ∧ ∀α∀m[(A(G,α) ∧ M(m,α)) → DeterminedBy(m,G)] ∧ ¬IndifferentWill(G)',
      encoding_format: 'custom-fol',
      encoding:
        'S(G) & forall a forall m: ((A(G, a) & M(m, a)) -> DeterminedBy(m, G)) & not IndifferentWill(G)',
      notes:
        'Object-level claim: every mode (M) under any attribute (A) is determined by God (DeterminedBy), and the scholium rejects an indifferent divine will (¬IndifferentWill).',
    },
    {
      system: 'FOL',
      version: 'v1',
      display:
        'Explains(E1p19s1, E1p19) ∧ Clarifies(DivineNecessity, RejectsIndifferentWill)',
      encoding_format: 'meta-fol',
      encoding:
        'Explains(E1p19s1, E1p19) & Clarifies(DivineNecessity, RejectsIndifferentWill)',
      notes:
        'Meta-level encoding: scholium E1p19s1 clarifies that God’s will is identical with the necessity of divine nature, not an arbitrary choice.',
    },
  ],

  // E1p25s1 – scholium to Proposition 25
  E1p25s1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'S(G) ∧ ∀α∀m[(A(G,α) ∧ M(m,α)) → FromNature(G,m)] ∧ NoFinalCauses',
      encoding_format: 'custom-fol',
      encoding: 'S(G) & forall a forall m: ((A(G, a) & M(m, a)) -> FromNature(G, m)) & NoFinalCauses',
      notes:
        'Object-level claim: everything that is a mode under a divine attribute (A, M) proceeds from God’s nature (FromNature) and the scholium rejects teleological final causes (NoFinalCauses).',
    },
    {
      system: 'FOL',
      version: 'v1',
      display:
        'Explains(E1p25s1, E1p25) ∧ Clarifies(RejectionOfTeleology, NecessityOfNature)',
      encoding_format: 'meta-fol',
      encoding:
        'Explains(E1p25s1, E1p25) & Clarifies(RejectionOfTeleology, NecessityOfNature)',
      notes:
        'Meta-level encoding: scholium E1p25s1 interprets the proposition as a denial of final causes and a defense of necessity in nature.',
    },
  ],

  // E1p28s1 – scholium to Proposition 28
  E1p28s1: [
    {
      system: 'FOL',
      version: 'v1',
      display:
        'S(G) ∧ ∀α∀m[(A(G,α) ∧ M(m,α) ∧ Finite(m)) → ∃m2(M(m2,α) ∧ Finite(m2) ∧ CauseOf(m2,m))]',
      encoding_format: 'custom-fol',
      encoding:
        'S(G) & forall a forall m: ((A(G, a) & M(m, a) & Finite(m)) -> exists m2: (M(m2, a) & Finite(m2) & CauseOf(m2, m)))',
      notes:
        'Object-level claim: finite modes within any divine attribute (A, M, Finite) depend on other finite modes as causes (CauseOf) within God (S(G)).',
    },
    {
      system: 'FOL',
      version: 'v1',
      display:
        'Explains(E1p28s1, E1p28) ∧ Clarifies(ChainOfFiniteCauses, ImmanentDeterminism)',
      encoding_format: 'meta-fol',
      encoding:
        'Explains(E1p28s1, E1p28) & Clarifies(ChainOfFiniteCauses, ImmanentDeterminism)',
      notes:
        'Meta-level encoding: scholium E1p28s1 clarifies the deterministic structure of finite things within God.',
    },
  ],
};


const LOGIC_FOL_V1_POSTULATES_PART1: Record<string, LogicEncoding[]> = {
  // Example shape (keep commented-out as a template until we have a real Part I postulate id):
  // E1Post1: [
  //   {
  //     system: 'FOL',
  //     version: 'v1',
  //     display: '…pretty LaTeX-style formula…',
  //     encoding_format: 'custom-fol',
  //     encoding: '...ascii version...',
  //     notes: 'Short gloss explaining the predicates for this postulate.',
  //   },
  // ],
};


const LOGIC_FOL_V1_LEMMAS_PART1: Record<string, LogicEncoding[]> = {
  // Example shape (again, a template placeholder until we map real ids):
  // E1L1: [
  //   {
  //     system: 'FOL',
  //     version: 'v1',
  //     display: '…pretty LaTeX-style formula…',
  //     encoding_format: 'custom-fol',
  //     encoding: '...ascii version...',
  //     notes: 'Short gloss explaining the predicates for this lemma.',
  //   },
  // ],
};

export const LOGIC_FOL_V1_PART1: Record<string, LogicEncoding[]> = {
  ...LOGIC_FOL_V1_DEFINITIONS_PART1,
  ...LOGIC_FOL_V1_AXIOMS_PART1,
  ...LOGIC_FOL_V1_POSTULATES_PART1,
  ...LOGIC_FOL_V1_LEMMAS_PART1,
  ...LOGIC_FOL_V1_COROLLARIES_PART1,
  ...LOGIC_FOL_V1_PROPOSITIONS_PART1_TIER_A,
  ...LOGIC_FOL_V1_PROPOSITIONS_PART1_TIER_B,
  ...LOGIC_FOL_V1_SCHOLIA_PART1_TIER_A,
};

export const PREDICATE_LOGIC_CLUSTER_PART1_DEFS: Record<string, LogicEncoding> = {
  E1D1: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D2: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D3: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D4: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D5: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D6: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D7: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D8: PREDICATE_LOGIC_CLUSTER_ENCODING,
};
