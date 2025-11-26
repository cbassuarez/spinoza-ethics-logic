import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';
import type {
  Dependency,
  EthicsCorpus,
  EthicsItem,
  LogicEncoding,
  ProofInfo,
} from '../src/data/types';

const CANONICAL_LATIN_SOURCE_URL =
  'https://www.thelatinlibrary.com/spinoza.ethica1.html';
const CANONICAL_ENGLISH_SOURCE_URL =
  'https://www.marxists.org/reference/subject/philosophy/works/ne/ethics.htm';

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

const RAW_ENGLISH_PATH = path.join(process.cwd(), 'data', 'raw', 'english-ethics.html');
const RAW_LATIN_PATH = path.join(process.cwd(), 'data', 'raw', 'latin-part1.html');
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'ethics.json');

const ALLOWED_KINDS: EthicsItem['kind'][] = [
  'definition',
  'axiom',
  'postulate',
  'proposition',
  'scholium',
  'corollary',
  'lemma',
];

type ConceptRule = {
  concept: string;
  patterns: RegExp[];
};

function getPropositionIndexFromId(id: string): { part: number; index: number } | null {
  // Matches e.g. "E1p1", "E1p10", "E2p3", etc.
  const match = id.match(/^E(\d+)p(\d+)(?:[cs]\d+)?$/);
  if (!match) return null;
  const part = parseInt(match[1], 10);
  const index = parseInt(match[2], 10);
  if (!Number.isFinite(part) || !Number.isFinite(index)) return null;
  return { part, index };
}

const CONCEPT_RULES: ConceptRule[] = [
  {
    concept: 'Substance',
    patterns: [/substance\b/i, /\bsubstantia\b/i],
  },
  {
    concept: 'Attribute',
    patterns: [/attribute\b/i, /\battributum\b/i],
  },
  {
    concept: 'Mode',
    patterns: [/\bmode\b/i, /\bmodus\b/i],
  },
  {
    concept: 'God',
    patterns: [/\bgod\b/i, /\bdeus\b/i],
  },
  {
    concept: 'Causa sui',
    patterns: [/self-caused\b/i, /\bcausa\s+sui\b/i],
  },
  {
    concept: 'Essence',
    patterns: [/\bessence\b/i, /\bessentia\b/i],
  },
  {
    concept: 'Existence',
    patterns: [/\bexistence\b/i, /\bexistentia\b/i, /\bexistens\b/i],
  },
  {
    concept: 'Infinity',
    patterns: [/\binfinite\b/i, /\binfinit(y|e)\b/i, /\binfinitum\b/i],
  },
  {
    concept: 'Mind',
    patterns: [/\bmind\b/i, /\bmens\b/i],
  },
  {
    concept: 'Body',
    patterns: [/\bbody\b/i, /\bcorpus\b/i],
  },
  {
    concept: 'Power',
    patterns: [/\bpower\b/i, /\bpotentia\b/i],
  },
  {
    concept: 'Freedom',
    patterns: [/\bfreedom\b/i, /\bliber(ty|a|um)\b/i],
  },
];

const PROOF_SKETCHES_PART1_P1_10: Record<string, string> = {
  E1p1:
    'Spinoza notes that modes presuppose the substance whose affections they are (Def. 5), while substance is conceived through itself (Def. 3); therefore substance is by nature prior to its modifications.',
  E1p2:
    'Because each substance must be conceived through itself (Def. 3) and an attribute expresses its essence (Def. 4), substances with different attributes share no common nature and thus have nothing in common.',
  E1p3:
    'If two things have nothing in common, the conception of one does not involve the other (Ax. 5); therefore neither can serve as the cause of the other.',
  E1p4:
    'Distinct things must differ either in their attributes or in the affections that follow from those attributes; otherwise they would lack any ground for distinction and collapse into one.',
  E1p5:
    'Suppose two substances shared the same attribute; by Prop. 2 they would have nothing in common, which contradicts the shared attribute, so no two substances can possess the same nature or attribute.',
  E1p6:
    'If a substance were produced by another, they would share an attribute and thus be indistinguishable (Prop. 5), but a substance is conceived through itself (Def. 3), so no substance can be produced by another.',
  E1p7:
    'Every substance must exist either in itself or be produced by another (Ax. 1); Prop. 6 rules out external production, leaving self-causation, whose essence (Def. 1) involves existence, so existence belongs to substance’s nature.',
  E1p8:
    'A finite substance would be limited by another of the same nature (Def. 2), but Prop. 5 denies multiple substances of one attribute; therefore any substance that exists (Prop. 7) must be infinite.',
  E1p9:
    'An attribute expresses the essence of a substance (Def. 4), so the more reality or being a thing has, the more ways its essence can be expressed; hence greater reality entails a greater number of attributes.',
  E1p10:
    'Each attribute expresses substance’s essence (Def. 4) and is conceived through itself, so no attribute can be explained through another; consequently every attribute must be conceived through itself.',
};

const DEPENDENCIES_PART1_P1_10: Record<string, Dependency[]> = {
  E1p1: [
    { id: 'E1D3', role: 'definition' },
    { id: 'E1D5', role: 'definition' },
  ],
  E1p2: [
    { id: 'E1D3', role: 'definition' },
    { id: 'E1D4', role: 'definition' },
  ],
  E1p3: [
    { id: 'E1Ax5', role: 'axiom' },
  ],
  E1p4: [
    { id: 'E1D4', role: 'definition' },
    { id: 'E1D5', role: 'definition' },
  ],
  E1p5: [
    { id: 'E1p2', role: 'proposition' },
    { id: 'E1D4', role: 'definition' },
  ],
  E1p6: [
    { id: 'E1p5', role: 'proposition' },
    { id: 'E1D1', role: 'definition' },
    { id: 'E1D3', role: 'definition' },
  ],
  E1p7: [
    { id: 'E1Ax1', role: 'axiom' },
    { id: 'E1D1', role: 'definition' },
    { id: 'E1p6', role: 'proposition' },
  ],
  E1p8: [
    { id: 'E1D2', role: 'definition' },
    { id: 'E1p5', role: 'proposition' },
    { id: 'E1p7', role: 'proposition' },
  ],
  E1p9: [
    { id: 'E1D4', role: 'definition' },
  ],
  E1p10: [
    { id: 'E1D4', role: 'definition' },
    { id: 'E1p5', role: 'proposition' },
  ],
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
};

// FOL v1 encodings for a structural spine of Part I propositions (Tier A).
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
      display: '∀α∀β[(Attribute(α) ∧ Attribute(β) ∧ α ≠ β) → ¬ConceivedThrough(α,β)]',
      encoding_format: 'custom-fol',
      encoding: 'forall a forall b: (Attribute(a) & Attribute(b) & a != b) -> not ConceivedThrough(a, b)',
      notes:
        'Distinct attributes (Attribute) do not explain one another; each is self-conceived (¬ConceivedThrough).',
    },
  ],
};

// FOL v1 encodings for the remaining Part I propositions (Tier B).
// Tier A handles a small "structural spine" subset; everything else in Part I
// that is kind === "proposition" should be captured here.
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
      display: '∀m[(M(m) ∧ Necessary(m) ∧ Infinite(m)) → (FollowsFromAbsAttr(m) ∨ FollowsFromInfiniteMode(m))]',
      encoding_format: 'custom-fol',
      encoding:
        'forall m: (M(m) & Necessary(m) & Infinite(m)) -> (FollowsFromAbsAttr(m) | FollowsFromInfiniteMode(m))',
      notes:
        'Any necessary infinite mode (M, Necessary, Infinite) either flows directly from an attribute or from another infinite mode (FollowsFromInfiniteMode).',
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

// FOL v1 encodings for Part I postulates.
// NOTE: Part I may have zero postulates in this corpus; it's okay for this map to start empty.
// Later passes can extend this map, and analogues for Parts II–V, with hand-crafted encodings.
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

// FOL v1 encodings for Part I lemmas.
// Same pattern as postulates: may be empty if Part I has no lemmas in the parsed corpus.
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

const PREDICATE_LOGIC_CLUSTER_PART1_DEFS: Record<string, LogicEncoding> = {
  E1D1: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D2: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D3: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D4: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D5: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D6: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D7: PREDICATE_LOGIC_CLUSTER_ENCODING,
  E1D8: PREDICATE_LOGIC_CLUSTER_ENCODING,
};

type ParsedItem = {
  part: number;
  kind: EthicsItem['kind'];
  number: number; // primary number (definition/axiom/prop/etc.)
  ofProposition?: number; // for scholia/corollaries
  subIndex?: number; // corollary/scholium number when multiple
  textParts: string[];
};

type ParsedEnglishItem = ParsedItem & {
  translation: string;
};

type LatinMap = Map<string, string>;

type LatinItemKind =
  | 'definition'
  | 'axiom'
  | 'postulate'
  | 'proposition'
  | 'scholium'
  | 'corollary'
  | 'lemma';

type LatinHeadingInfo = {
  kind: LatinItemKind;
  index: number;
};

function romanToInt(roman: string): number {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let prev = 0;
  for (const char of roman.toUpperCase()) {
    const value = map[char];
    if (!value) return 0;
    if (value > prev) {
      total += value - 2 * prev;
    } else {
      total += value;
    }
    prev = value;
  }
  return total;
}

function intToRoman(value: number): string {
  const numerals: Array<[number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let remaining = value;
  let result = '';
  for (const [n, sym] of numerals) {
    while (remaining >= n) {
      result += sym;
      remaining -= n;
    }
  }
  return result || value.toString();
}

function normalizeBlock(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function normalizeParagraphs(parts: string[]): string {
  const cleaned = parts
    .map((p) => normalizeBlock(p))
    .filter((p) => p.length > 0);
  return cleaned.join('\n\n');
}

function normalizeLatinHeading(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/[\.\:\;]+$/g, '')
    .trim();
}

function parseLatinHeadingInfo(normalized: string): LatinHeadingInfo | null {
  const match = normalized.match(
    /^(DEFINITIO|AXIOMA|PROPOSITIO|SCHOLIUM|COROLLARIUM|POSTULATUM)\s*([IVXLCDM]+)?$/
  );
  if (!match) return null;
  const [, tag, roman] = match;
  const index = roman ? romanToInt(roman) : 0;

  let kind: LatinItemKind;
  switch (tag) {
    case 'DEFINITIO':
      kind = 'definition';
      break;
    case 'AXIOMA':
      kind = 'axiom';
      break;
    case 'PROPOSITIO':
      kind = 'proposition';
      break;
    case 'SCHOLIUM':
      kind = 'scholium';
      break;
    case 'COROLLARIUM':
      kind = 'corollary';
      break;
    case 'POSTULATUM':
      kind = 'postulate';
      break;
    default:
      return null;
  }

  return { kind, index };
}

function detectLatinSection(normalized: string): LatinItemKind | null {
  if (normalized === 'DEFINITIONES') return 'definition';
  if (normalized === 'AXIOMATA') return 'axiom';
  if (normalized === 'POSTULATA') return 'postulate';
  return null;
}

function stripLatinHeading(raw: string, heading: LatinHeadingInfo): string {
  const headingWordMap: Record<LatinItemKind, string> = {
    definition: 'DEFINITIO',
    axiom: 'AXIOMA',
    postulate: 'POSTULATUM',
    proposition: 'PROPOSITIO',
    scholium: 'SCHOLIUM',
    corollary: 'COROLLARIUM',
    lemma: 'LEMMA',
  };

  const headingWord = headingWordMap[heading.kind];
  const roman = heading.index > 0 ? intToRoman(heading.index) : '';
  const candidates: RegExp[] = [];

  if (headingWord && roman) {
    candidates.push(new RegExp(`^\s*${headingWord}\s+${roman}[\s\.:;\-–—]*`, 'i'));
  }
  if (headingWord) {
    candidates.push(new RegExp(`^\s*${headingWord}\s*[\s\.:;\-–—]*`, 'i'));
  }
  if (roman) {
    candidates.push(new RegExp(`^\s*${roman}[\s\.:;\-–—]*`, 'i'));
  }

  let result = raw.trim();
  for (const pattern of candidates) {
    if (pattern.test(result)) {
      result = result.replace(pattern, '').trim();
      break;
    }
  }
  return result.trim();
}

function mergeEnglishSegments(segments: ParsedEnglishItem[]): ParsedEnglishItem[] {
  const merged = new Map<string, ParsedEnglishItem>();
  const order: string[] = [];
  for (const seg of segments) {
    const id = makeId(seg);
    if (!merged.has(id)) {
      merged.set(id, { ...seg });
      order.push(id);
    } else {
      const existing = merged.get(id)!;
      const combined = [existing.translation, seg.translation].filter(Boolean).join('\n\n');
      merged.set(id, { ...existing, translation: combined });
    }
  }
  return order.map((id) => merged.get(id)!).filter(Boolean);
}

function mergeParsedSegments(segments: ParsedItem[]): ParsedItem[] {
  const merged = new Map<string, ParsedItem>();
  const order: string[] = [];
  for (const seg of segments) {
    const id = makeId(seg);
    if (!merged.has(id)) {
      merged.set(id, { ...seg, textParts: [...seg.textParts] });
      order.push(id);
    } else {
      const existing = merged.get(id)!;
      merged.set(id, { ...existing, textParts: [...existing.textParts, ...seg.textParts] });
    }
  }
  return order.map((id) => merged.get(id)!).filter(Boolean);
}

function ensureRawFilesExist(): void {
  const missing: string[] = [];
  if (!fs.existsSync(RAW_ENGLISH_PATH)) missing.push(RAW_ENGLISH_PATH);
  if (!fs.existsSync(RAW_LATIN_PATH)) missing.push(RAW_LATIN_PATH);
  if (missing.length) {
    const message = [
      'Missing required raw HTML files for Ethics corpus builder.',
      'Expected files:',
      ...missing.map((m) => `  - ${m}`),
      'Please run `npm run fetch:raw` to download the sources before building the corpus.',
    ].join('\n');
    throw new Error(message);
  }
}

function loadFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function extractBlocks(html: string): string[] {
  const dom = new JSDOM(html);
  const blocks: string[] = [];
  const selectors = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'div',
    'center',
    'article',
    'section',
    'pre',
    'blockquote',
  ];
  const elements = Array.from(
    dom.window.document.body.querySelectorAll(selectors.join(','))
  ) as Array<{ textContent: string | null }>;
  for (const el of elements) {
    const text = el.textContent?.replace(/\s+/g, ' ').trim();
    if (text) {
      blocks.push(text);
    }
  }
  return blocks;
}

function detectPart(text: string): number | null {
  const match = text.trim().toUpperCase().match(/^PART\s+([IVXLCDM]+)/);
  if (!match) return null;
  const value = romanToInt(match[1]);
  if (value < 1 || value > 5) return null;
  return value;
}

function isSectionHeading(text: string, keyword: string): boolean {
  const pattern = new RegExp(`^${keyword}s?\.?:?$`, 'i');
  return pattern.test(text.trim());
}

function parseEnglishEthics(html: string): ParsedEnglishItem[] {
  const blocks = extractBlocks(html);
  const items: ParsedEnglishItem[] = [];

  let currentPart = 0;
  let current: ParsedItem | null = null;
  let lastProposition = 0;
  let corollaryIndex = 0;
  let scholiumIndex = 0;
  let context: 'definition' | 'axiom' | 'postulate' | null = null;

  const pushCurrent = () => {
    if (current) {
      const translation = normalizeParagraphs(current.textParts);
      items.push({ ...current, translation });
      current = null;
    }
  };

  const startItem = (segment: ParsedItem) => {
    pushCurrent();
    if (segment.kind === 'proposition') {
      lastProposition = segment.number;
      corollaryIndex = 0;
      scholiumIndex = 0;
    }
    current = { ...segment, textParts: [...segment.textParts] };
  };

  for (const raw of blocks) {
    const text = raw.trim();
    if (!text) continue;
    const partMatch = detectPart(text);
    if (partMatch) {
      pushCurrent();
      currentPart = partMatch;
      context = null;
      continue;
    }

    if (isSectionHeading(text, 'DEFINITION')) {
      pushCurrent();
      context = 'definition';
      continue;
    }
    if (isSectionHeading(text, 'AXIOM')) {
      pushCurrent();
      context = 'axiom';
      continue;
    }
    if (isSectionHeading(text, 'POSTULATE')) {
      pushCurrent();
      context = 'postulate';
      continue;
    }

    const upper = text.toUpperCase();

    const defMatch = upper.match(/^(?:DEFINITION|DEFIN\.|DEF\.)\s*([IVXLCDM]+)/);
    if (defMatch) {
      const number = romanToInt(defMatch[1]);
      const content = text.replace(/^(?:DEFINITION|DEFIN\.|DEF\.)\s*[IVXLCDM]+\.?\s*/i, '').trim();
      startItem({ part: currentPart, kind: 'definition', number, textParts: content ? [content] : [] });
      context = 'definition';
      continue;
    }

    if (context === 'definition') {
      const simpleDef = upper.match(/^([IVXLCDM]+)\./);
      if (simpleDef) {
        const number = romanToInt(simpleDef[1]);
        const content = text.replace(/^([IVXLCDM]+)\.\s*/i, '').trim();
        if (current && current.kind === 'definition' && current.part === currentPart && current.number === number) {
          if (content) current.textParts.push(content);
        } else {
          startItem({
            part: currentPart,
            kind: 'definition',
            number,
            textParts: content ? [content] : [],
          });
        }
        continue;
      }
    }

    const axiomMatch = upper.match(/^(?:AXIOM)\s*([IVXLCDM]+)/);
    if (axiomMatch) {
      const number = romanToInt(axiomMatch[1]);
      const content = text.replace(/^(?:AXIOM)\s*[IVXLCDM]+\.?\s*/i, '').trim();
      startItem({ part: currentPart, kind: 'axiom', number, textParts: content ? [content] : [] });
      context = 'axiom';
      continue;
    }

    if (context === 'axiom') {
      const simpleAxiom = upper.match(/^([IVXLCDM]+)\./);
      if (simpleAxiom) {
        const number = romanToInt(simpleAxiom[1]);
        const content = text.replace(/^([IVXLCDM]+)\.\s*/i, '').trim();
        if (current && current.kind === 'axiom' && current.part === currentPart && current.number === number) {
          if (content) current.textParts.push(content);
        } else {
          startItem({ part: currentPart, kind: 'axiom', number, textParts: content ? [content] : [] });
        }
        continue;
      }
    }

    const postMatch = upper.match(/^(?:POSTULATE)\s*([IVXLCDM]+)/);
    if (postMatch) {
      const number = romanToInt(postMatch[1]);
      const content = text.replace(/^(?:POSTULATE)\s*[IVXLCDM]+\.?\s*/i, '').trim();
      startItem({ part: currentPart, kind: 'postulate', number, textParts: content ? [content] : [] });
      context = 'postulate';
      continue;
    }

    const propMatch = upper.match(/^(?:PROP\.?|PROPOSITION)\s*([IVXLCDM]+)/);
    if (propMatch) {
      const number = romanToInt(propMatch[1]);
      const content = text.replace(/^(?:PROP\.?|PROPOSITION)\s*[IVXLCDM]+\.?\s*/i, '').trim();
      startItem({ part: currentPart, kind: 'proposition', number, textParts: content ? [content] : [] });
      continue;
    }

    const corMatch = upper.match(/^COROLLARY\s*([IVXLCDM]+)?/);
    if (corMatch) {
      corollaryIndex += 1;
      const number = corMatch[1] ? romanToInt(corMatch[1]) : corollaryIndex;
      const content = text.replace(/^COROLLARY\s*[IVXLCDM]*\.?\s*/i, '').trim();
      startItem({
        part: currentPart,
        kind: 'corollary',
        number,
        ofProposition: lastProposition,
        subIndex: number,
        textParts: content ? [content] : [],
      });
      continue;
    }

    if (upper.startsWith('SCHOLIUM')) {
      scholiumIndex += 1;
      const content = text.replace(/^SCHOLIUM\.?\s*/i, '').trim();
      startItem({
        part: currentPart,
        kind: 'scholium',
        number: scholiumIndex,
        ofProposition: lastProposition,
        subIndex: scholiumIndex,
        textParts: content ? [content] : [],
      });
      continue;
    }

    const lemmaMatch = upper.match(/^LEMMA\s*([IVXLCDM]+)/);
    if (lemmaMatch) {
      const number = romanToInt(lemmaMatch[1]);
      const content = text.replace(/^LEMMA\s*[IVXLCDM]+\.?\s*/i, '').trim();
      startItem({ part: currentPart, kind: 'lemma', number, textParts: content ? [content] : [] });
      continue;
    }

    if (current) {
      current.textParts.push(text);
    }
  }

  pushCurrent();

  items.forEach((item) => {
    if (item.translation && /^[a-z]/.test(item.translation)) {
      console.warn(`Warning: translation for part ${item.part} ${item.kind} ${item.number} may start mid-sentence`);
    }
  });

  return items;
}

function parseLatinPart1(html: string): ParsedItem[] {
  const blocks = extractBlocks(html);
  const items: ParsedItem[] = [];

  let current: ParsedItem | null = null;
  let currentSection: LatinItemKind | null = null;
  let lastProposition = 0;
  let corollaryIndex = 0;
  let scholiumIndex = 0;

  const pushCurrent = () => {
    if (current) {
      items.push({ ...current, textParts: [...current.textParts] });
      current = null;
    }
  };

  for (const raw of blocks) {
    const text = raw.trim();
    if (!text) continue;
    const normalized = normalizeLatinHeading(text);
    const headingCandidate = normalized.split(':')[0];

    const section = detectLatinSection(normalized);
    if (section) {
      pushCurrent();
      currentSection = section;
      continue;
    }

    let headingInfo = parseLatinHeadingInfo(normalized) ?? parseLatinHeadingInfo(headingCandidate);

    if (!headingInfo && currentSection) {
      const simple = normalized.match(/^([IVXLCDM]+)(?=\s|\.|\:|\)|$)/);
      if (simple) {
        headingInfo = { kind: currentSection, index: romanToInt(simple[1]) };
      }
    }

    if (headingInfo) {
      pushCurrent();

      if (headingInfo.kind === 'proposition') {
        lastProposition = headingInfo.index;
        corollaryIndex = 0;
        scholiumIndex = 0;
      }

      if (headingInfo.kind === 'corollary') {
        corollaryIndex = headingInfo.index > 0 ? headingInfo.index : corollaryIndex + 1;
      } else if (headingInfo.kind === 'scholium') {
        scholiumIndex = headingInfo.index > 0 ? headingInfo.index : scholiumIndex + 1;
      }

      const number = (() => {
        switch (headingInfo.kind) {
          case 'corollary':
            return corollaryIndex || headingInfo.index;
          case 'scholium':
            return scholiumIndex || headingInfo.index;
          default:
            return headingInfo.index || 0;
        }
      })();

      const segment: ParsedItem = {
        part: 1,
        kind: headingInfo.kind as ParsedItem['kind'],
        number,
        ofProposition:
          headingInfo.kind === 'corollary' || headingInfo.kind === 'scholium' ? lastProposition || undefined : undefined,
        subIndex:
          headingInfo.kind === 'corollary' || headingInfo.kind === 'scholium' ? number || undefined : undefined,
        textParts: [],
      };

      const body = stripLatinHeading(text, headingInfo);
      if (body) {
        segment.textParts.push(body);
      }

      current = segment;
      continue;
    }

    if (current) {
      current.textParts.push(text);
    }
  }

  pushCurrent();
  return items;
}

function makeId(segment: ParsedItem): string {
  const base = `E${segment.part}`;
  switch (segment.kind) {
    case 'definition':
      return `${base}D${segment.number}`;
    case 'axiom':
      return `${base}Ax${segment.number}`;
    case 'postulate':
      return `${base}Post${segment.number}`;
    case 'lemma':
      return `${base}L${segment.number}`;
    case 'proposition':
      return `${base}p${segment.number}`;
    case 'corollary':
      return `${base}p${segment.ofProposition ?? segment.number}c${segment.subIndex ?? segment.number}`;
    case 'scholium':
      return `${base}p${segment.ofProposition ?? segment.number}s${segment.subIndex ?? segment.number}`;
    default:
      return `${base}-${segment.number}`;
  }
}

function makeRef(segment: ParsedItem): string {
  const partLabel = `Part ${intToRoman(segment.part)}`;
  switch (segment.kind) {
    case 'definition':
      return `${partLabel}, Definition ${segment.number}`;
    case 'axiom':
      return `${partLabel}, Axiom ${segment.number}`;
    case 'postulate':
      return `${partLabel}, Postulate ${segment.number}`;
    case 'lemma':
      return `${partLabel}, Lemma ${segment.number}`;
    case 'proposition':
      return `${partLabel}, Proposition ${segment.number}`;
    case 'corollary':
      return `${partLabel}, Proposition ${segment.ofProposition ?? segment.number}, Corollary ${
        segment.subIndex ?? segment.number
      }`;
    case 'scholium':
      return `${partLabel}, Proposition ${segment.ofProposition ?? segment.number}, Scholium`;
    default:
      return partLabel;
  }
}

function makeLabel(segment: ParsedItem): string {
  switch (segment.kind) {
    case 'definition':
      return `Definition ${segment.number}`;
    case 'axiom':
      return `Axiom ${segment.number}`;
    case 'postulate':
      return `Postulate ${segment.number}`;
    case 'lemma':
      return `Lemma ${segment.number}`;
    case 'proposition':
      return `Proposition ${segment.number}`;
    case 'corollary':
      return `Corollary ${segment.subIndex ?? segment.number}`;
    case 'scholium':
      return `Scholium ${segment.subIndex ?? segment.number}`;
    default:
      return makeRef(segment);
  }
}

function buildLatinMapForPart1(rawHtml: string): LatinMap {
  const latinSegments = mergeParsedSegments(parseLatinPart1(rawHtml));
  const map: LatinMap = new Map();

  for (const seg of latinSegments) {
    if (seg.part !== 1) continue;

    if (seg.number <= 0) {
      console.warn(`[Latin WARN] Skipping ${seg.kind} with no numeral: ${JSON.stringify(seg.textParts[0] ?? '')}`);
      continue;
    }

    if ((seg.kind === 'corollary' || seg.kind === 'scholium') && !seg.ofProposition) {
      console.warn(
        `[Latin WARN] Could not map Latin ${seg.kind} ${seg.number} because parent proposition is unknown.`
      );
      continue;
    }

    const id = makeId(seg);
    const text = normalizeParagraphs(seg.textParts);
    const existing = map.get(id);
    const combined = existing ? [existing, text].filter(Boolean).join('\n\n') : text;
    map.set(id, combined);
  }

  return map;
}

function enrichE1D1(items: EthicsItem[]): void {
  const item = items.find((it) => it.id === 'E1D1' && it.part === 1 && it.kind === 'definition');
  if (!item) return;
  item.label = 'Self-caused (causa sui)';
  item.text.original_language = 'Latin';
  item.text.original =
    'Per causam sui intelligo id cujus essentia involvit existentiam sive id cujus natura non potest concipi nisi existens.';
  item.text.translation =
    'By that which is self-caused, I mean that of which the essence involves existence, or that of which the nature is only conceivable as existent.';
}

function tagConcepts(item: EthicsItem): string[] {
  const haystack = `${item.text.translation} ${item.text.original}`.toLowerCase();
  const tags: string[] = [];

  for (const rule of CONCEPT_RULES) {
    if (rule.patterns.some((re) => re.test(haystack))) {
      tags.push(rule.concept);
    }
  }

  const seen = new Set<string>();
  const uniqueTags: string[] = [];
  for (const tag of tags) {
    if (!seen.has(tag)) {
      seen.add(tag);
      uniqueTags.push(tag);
    }
  }

  return uniqueTags;
}

function mergeDependencies(baseDeps: Dependency[], inferred: Dependency[]): Dependency[] {
  const merged: Dependency[] = [];
  const seen = new Set<string>();

  const add = (dep: Dependency) => {
    if (!dep.id) return;
    const key = `${dep.id}::${dep.role || ''}`;
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(dep);
  };

  for (const dep of baseDeps) add(dep);
  for (const dep of inferred) add(dep);

  return merged;
}

function inferDependencies(item: EthicsItem, corpusIds: Set<string>): Dependency[] {
  const deps: Dependency[] = [];
  const text = `${item.text.translation} ${item.text.original}`.toUpperCase();

  const addDep = (id: string, role: Dependency['role']) => {
    if (!corpusIds.has(id)) return;
    if (deps.some((d) => d.id === id)) return;
    deps.push({ id, role });
  };

  const scan = (regex: RegExp, buildId: (n: number) => string, role: Dependency['role']) => {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const raw = match[1];
      const n = /^[0-9]+$/.test(raw) ? parseInt(raw, 10) : romanToInt(raw);
      if (n > 0) {
        const candidateId = buildId(n);
        addDep(candidateId, role);
      }
    }
  };

  scan(/\bDEF\.?\s+([IVXLCDM]+|\d+)\b/g, (n) => `E${item.part}D${n}`, 'definition');
  scan(/\bAX\.?\s+([IVXLCDM]+|\d+)\b/g, (n) => `E${item.part}Ax${n}`, 'axiom');
  scan(/\bPROP\.?\s+([IVXLCDM]+|\d+)\b/g, (n) => `E${item.part}p${n}`, 'proposition');

  return deps;
}

function defaultProof(item: EthicsItem): ProofInfo {
  switch (item.kind) {
    case 'definition':
      return {
        status: 'none',
        sketch: 'Stipulative definition; no proof required.',
      };
    case 'axiom':
    case 'postulate':
      return {
        status: 'none',
        sketch: 'Axiom/postulate; accepted without proof.',
      };
    case 'proposition':
    case 'corollary':
    case 'scholium':
    case 'lemma':
    default:
      return { status: 'none' };
  }
}

function normalizeMeta(item: EthicsItem): EthicsItem['meta'] {
  const meta = item.meta ?? {
    status: 'draft',
    contributors: [],
    sources: [],
  };

  let status: 'draft' | 'reviewed' = meta.status === 'reviewed' ? 'reviewed' : 'draft';

  if (item.id === 'E1D1') {
    status = 'reviewed';
  }

  const contributors = Array.isArray(meta.contributors) ? meta.contributors : [];
  const sources = Array.isArray(meta.sources) ? meta.sources : [];

  return {
    status,
    contributors,
    sources,
  };
}

function applyCorpusEnrichments(corpus: EthicsCorpus): void {
  const corpusIds = new Set<string>(corpus.map((it) => it.id));

  for (const item of corpus) {
    item.concepts = tagConcepts(item);

    item.dependencies = item.dependencies || { uses: [] as Dependency[] };
    item.dependencies.uses = inferDependencies(item, corpusIds);

    const fallback = defaultProof(item);
    if (!item.proof || !item.proof.status) {
      item.proof = fallback;
    } else if (!['none', 'sketch', 'formal'].includes(item.proof.status)) {
      item.proof = fallback;
    } else if (item.proof.status === 'none' && fallback.sketch && !item.proof.sketch) {
      item.proof = { ...item.proof, sketch: fallback.sketch };
    }

    item.meta = normalizeMeta(item);
  }
}

function applyFOLv1DefinitionsPart1(corpus: EthicsCorpus): void {
  for (const item of corpus) {
    if (item.part !== 1 || item.kind !== 'definition') continue;

    const encodings = LOGIC_FOL_V1_DEFINITIONS_PART1[item.id];
    if (!encodings || encodings.length === 0) {
      console.warn(`[Logic WARN] No FOL v1 definition encoding for ${item.id} (${item.ref}).`);
      continue;
    }

    if (!Array.isArray(item.logic)) {
      item.logic = [];
    }

    item.logic = item.logic.filter((enc) => !(enc.system === 'FOL' && enc.version === 'v1'));

    for (const enc of encodings) {
      item.logic.push(enc);
    }
  }
}

function applyFOLv1AxiomsPart1(corpus: EthicsCorpus): void {
  for (const item of corpus) {
    // Only Part I axioms
    if (item.part !== 1 || item.kind !== 'axiom') continue;

    const encodings = LOGIC_FOL_V1_AXIOMS_PART1[item.id];
    if (!encodings || encodings.length === 0) {
      console.warn(`[Logic WARN] No FOL v1 axiom encoding for ${item.id} (${item.ref}).`);
      continue;
    }

    if (!Array.isArray(item.logic)) {
      item.logic = [];
    }

    // Remove any existing FOL v1 encodings for this item so this map is canonical
    item.logic = item.logic.filter(
      (enc) => !(enc.system === 'FOL' && enc.version === 'v1')
    );

    for (const enc of encodings) {
      item.logic.push(enc);
    }
  }
}

function applyFOLv1PropositionsPart1TierA(corpus: EthicsCorpus): void {
  for (const item of corpus) {
    if (item.part !== 1 || item.kind !== 'proposition') continue;

    const encodings = LOGIC_FOL_V1_PROPOSITIONS_PART1_TIER_A[item.id];
    if (!encodings || encodings.length === 0) continue;

    if (!Array.isArray(item.logic)) {
      item.logic = [];
    }

    item.logic = item.logic.filter((enc) => !(enc.system === 'FOL' && enc.version === 'v1'));

    for (const enc of encodings) {
      item.logic.push(enc);
    }
  }
}

function applyFOLv1PropositionsPart1TierB(corpus: EthicsCorpus): void {
  for (const item of corpus) {
    if (item.part !== 1 || item.kind !== 'proposition') continue;

    // Skip propositions that are explicitly handled by Tier A.
    if (item.id in LOGIC_FOL_V1_PROPOSITIONS_PART1_TIER_A) {
      continue;
    }

    const encodings = LOGIC_FOL_V1_PROPOSITIONS_PART1_TIER_B[item.id];
    if (!encodings || encodings.length === 0) {
      // For Tier B, it's okay to silently skip missing entries; we can
      // fill them in future prompts.
      continue;
    }

    if (!Array.isArray(item.logic)) {
      item.logic = [];
    }

    // Remove any existing FOL v1 encodings for this proposition in Part I,
    // so the Tier B map is the single source of truth for these items.
    item.logic = item.logic.filter(
      (enc) => !(enc.system === 'FOL' && enc.version === 'v1')
    );

    for (const enc of encodings) {
      item.logic.push(enc);
    }
  }
}

function applyFOLv1CorollariesPart1(corpus: EthicsCorpus): void {
  for (const item of corpus) {
    // Only Part I corollaries
    if (item.part !== 1 || item.kind !== 'corollary') continue;

    const encodings = LOGIC_FOL_V1_COROLLARIES_PART1[item.id];
    if (!encodings || encodings.length === 0) {
      console.warn(`[Logic WARN] No FOL v1 corollary encoding for ${item.id} (${item.ref}).`);
      continue;
    }

    if (!Array.isArray(item.logic)) {
      item.logic = [];
    }

    // Remove any existing FOL v1 encodings for this item so this map is canonical
    item.logic = item.logic.filter((enc) => !(enc.system === 'FOL' && enc.version === 'v1'));

    for (const enc of encodings) {
      item.logic.push(enc);
    }
  }
}

function applyFOLv1PostulatesPart1(corpus: EthicsCorpus): void {
  for (const item of corpus) {
    if (item.part !== 1 || item.kind !== 'postulate') continue;

    const encodings = LOGIC_FOL_V1_POSTULATES_PART1[item.id];
    if (!encodings || encodings.length === 0) {
      console.warn(`[Logic WARN] No FOL v1 postulate encoding for ${item.id} (${item.ref}).`);
      continue;
    }

    if (!Array.isArray(item.logic)) {
      item.logic = [];
    }

    // Remove any existing FOL v1 encodings for this item before inserting the canonical ones.
    item.logic = item.logic.filter(
      (enc) => !(enc.system === 'FOL' && enc.version === 'v1')
    );

    for (const enc of encodings) {
      item.logic.push(enc);
    }
  }
}

function applyFOLv1LemmasPart1(corpus: EthicsCorpus): void {
  for (const item of corpus) {
    if (item.part !== 1 || item.kind !== 'lemma') continue;

    const encodings = LOGIC_FOL_V1_LEMMAS_PART1[item.id];
    if (!encodings || encodings.length === 0) {
      console.warn(`[Logic WARN] No FOL v1 lemma encoding for ${item.id} (${item.ref}).`);
      continue;
    }

    if (!Array.isArray(item.logic)) {
      item.logic = [];
    }

    // Remove any existing FOL v1 encodings for this item before inserting the canonical ones.
    item.logic = item.logic.filter(
      (enc) => !(enc.system === 'FOL' && enc.version === 'v1')
    );

    for (const enc of encodings) {
      item.logic.push(enc);
    }
  }
}

function applyPredicateLogicClusterForPart1Definitions(corpus: EthicsCorpus): void {
  for (const item of corpus) {
    if (item.part !== 1 || item.kind !== 'definition') continue;

    const extra = PREDICATE_LOGIC_CLUSTER_PART1_DEFS[item.id];
    if (!extra) continue;

    if (!Array.isArray(item.logic)) {
      item.logic = [];
    }

    const alreadyPresent = item.logic.some(
      (enc) =>
        enc.system === extra.system &&
        enc.version === extra.version &&
        enc.encoding_format === extra.encoding_format &&
        enc.display === extra.display
    );

    if (!alreadyPresent) {
      item.logic.push(extra);
    }
  }
}

function applyProofsAndDependenciesForPart1P1toP10(corpus: EthicsCorpus): void {
  const corpusIds = new Set<string>(corpus.map((it) => it.id));

  for (const item of corpus) {
    if (item.kind !== 'proposition') continue;
    const parsed = getPropositionIndexFromId(item.id);
    if (!parsed) continue;
    const { part, index } = parsed;
    if (part !== 1) continue;
    if (index < 1 || index > 10) continue;

    const tableDeps = DEPENDENCIES_PART1_P1_10[item.id] ?? [];
    const heuristicDeps = inferDependencies(item, corpusIds);
    const mergedDeps = mergeDependencies(tableDeps, heuristicDeps);

    if (!item.dependencies) {
      item.dependencies = { uses: [] };
    }
    item.dependencies.uses = mergedDeps;

    const sketch = PROOF_SKETCHES_PART1_P1_10[item.id];
    if (sketch && sketch.trim().length > 0) {
      item.proof = {
        status: 'sketch',
        sketch,
        ...(item.proof && item.proof.formal ? { formal: item.proof.formal } : {}),
      };
    } else {
      if (!item.proof || !item.proof.status) {
        item.proof = defaultProof(item);
      }
    }
  }
}

function buildEthicsCorpus(): EthicsCorpus {
  ensureRawFilesExist();
  const englishHtml = loadFile(RAW_ENGLISH_PATH);
  const latinHtml = loadFile(RAW_LATIN_PATH);

  const englishSegments = mergeEnglishSegments(parseEnglishEthics(englishHtml));
  const latinMap = buildLatinMapForPart1(latinHtml);

  const corpus: EthicsCorpus = [];
  let currentPart = 0;
  let order = 0;

  for (const seg of englishSegments) {
    if (seg.part !== currentPart) {
      currentPart = seg.part;
      order = 0;
    }
    order += 1;
    const baseSegment: ParsedItem = {
      part: seg.part,
      kind: seg.kind,
      number: seg.number,
      ofProposition: seg.ofProposition,
      subIndex: seg.subIndex,
      textParts: [],
    };

    const id = makeId(baseSegment);
    const ref = makeRef(baseSegment);
    const label = makeLabel(baseSegment);

    const item: EthicsItem = {
      id,
      ref,
      part: seg.part as EthicsItem['part'],
      kind: seg.kind,
      label,
      order,
      text: {
        original_language: 'Latin',
        original: seg.part === 1 ? latinMap.get(id) ?? '' : '',
        translation: seg.translation,
      },
      concepts: [],
      logic: [],
      dependencies: { uses: [] as Dependency[] },
      proof: { status: 'none' } as ProofInfo,
      meta: {
        status: 'draft',
        contributors: [],
        sources: [
          `Latin source: The Latin Library (Part I: ${CANONICAL_LATIN_SOURCE_URL})`,
          `English source: R.H.M. Elwes translation as hosted by Marxists Internet Archive (${CANONICAL_ENGLISH_SOURCE_URL})`,
        ],
      },
    };

    corpus.push(item);
  }

  enrichE1D1(corpus);
  applyCorpusEnrichments(corpus);

  // Logic: Part I families in a stable order
  applyFOLv1DefinitionsPart1(corpus);
  applyPredicateLogicClusterForPart1Definitions(corpus);
  applyFOLv1AxiomsPart1(corpus);
  applyFOLv1PostulatesPart1(corpus);
  applyFOLv1LemmasPart1(corpus);
  applyFOLv1CorollariesPart1(corpus);
  applyFOLv1PropositionsPart1TierA(corpus);
  applyFOLv1PropositionsPart1TierB(corpus);
  applyProofsAndDependenciesForPart1P1toP10(corpus);

  const englishIds = new Set(corpus.filter((it) => it.part === 1).map((it) => it.id));

  latinMap.forEach((_text, id) => {
    if (!englishIds.has(id)) {
      console.warn(`[Latin WARN] Latin map has entry for ${id} but no matching English item.`);
    }
  });

  for (const item of corpus) {
    if (item.part === 1) {
      if (!item.text.original || !item.text.original.trim()) {
        console.warn(`[Latin WARN] No Latin text for ${item.id} (${item.ref}).`);
      }
    }
  }
  return corpus;
}

function validateCorpus(corpus: EthicsCorpus): void {
  const seen = new Set<string>();
  for (const item of corpus) {
    if (seen.has(item.id)) {
      throw new Error(`Duplicate id in corpus: ${item.id}`);
    }
    seen.add(item.id);
    if (![1, 2, 3, 4, 5].includes(item.part)) {
      throw new Error(`Invalid part on item ${item.id}: ${item.part}`);
    }
    if (!ALLOWED_KINDS.includes(item.kind)) {
      throw new Error(`Invalid kind on item ${item.id}: ${item.kind}`);
    }
    if (!item.proof || !item.proof.status) {
      throw new Error(`Missing proof status on item ${item.id}`);
    }

    const logicEntries = Array.isArray(item.logic) ? item.logic : [];
    for (const enc of logicEntries) {
      if (enc.system === 'FOL' && enc.version === 'v1') {
        const payload = `${enc.display ?? ''} ${enc.encoding ?? ''}`;
        if (/(God\(|Substance\(|Attribute\(|Mode\()/i.test(payload)) {
          console.warn(
            `[Logic WARN] Unnormalized FOL v1 encoding on ${item.id}: contains verbose predicates.`
          );
        }
      }
    }
  }

  const e1d1 = corpus.find((it) => it.id === 'E1D1');
  if (e1d1) {
    const folV1 = e1d1.logic.filter((enc) => enc.system === 'FOL' && enc.version === 'v1');
    if (folV1.length === 0) {
      throw new Error('E1D1 should have at least one FOL v1 encoding.');
    }
  }

  if (corpus.length < 200) {
    console.warn(`Warning: corpus only has ${corpus.length} items; expected more (check parsing)`);
  }

  const p1_1 = corpus.find((it) => it.id === 'E1p1');
  if (p1_1) {
    if (!p1_1.proof || p1_1.proof.status !== 'sketch' || !p1_1.proof.sketch) {
      console.warn('[Proof WARN] E1p1 does not have a sketch after Layer 4.');
    }
    if (!p1_1.dependencies || !Array.isArray(p1_1.dependencies.uses)) {
      console.warn('[Deps WARN] E1p1 has no dependencies after Layer 4.');
    }
  }

  const withLogic = corpus.filter((it) => it.logic && it.logic.length > 0);
  console.log('[Logic INFO] items with logic encodings:', withLogic.map((it) => it.id));
}

function writeCorpusToFile(corpus: EthicsCorpus): void {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(corpus, null, 2), 'utf8');
  console.log(`Wrote ${corpus.length} items to ${OUTPUT_PATH}`);
}

async function main(): Promise<void> {
  try {
    const corpus = buildEthicsCorpus();
    validateCorpus(corpus);
    writeCorpusToFile(corpus);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const entryUrl = pathToFileURL(process.argv[1] ?? '').href;
if (import.meta.url === entryUrl) {
  void main();
}

export {
  buildEthicsCorpus,
  mergeEnglishSegments,
  mergeParsedSegments,
  parseEnglishEthics,
  parseLatinPart1,
  validateCorpus,
  writeCorpusToFile,
};
