import type { LogicEncoding } from './types.js';

const fol = (
  display: string,
  encoding: string,
  notes?: string,
): LogicEncoding => ({
  system: 'FOL',
  version: 'v1',
  display,
  encoding_format: 'custom-fol',
  encoding,
  notes,
});

export const LOGIC_FOL_V1_PART3: Record<string, LogicEncoding[]> = {
  E3D1: [
    fol(
      'AdequateCause(c,e) ↔ (CauseOf(c,e) ∧ ClearDistinct(e,c))',
      'AdequateCause(c, e) <-> (CauseOf(c, e) & ClearDistinct(e, c))',
      'Adequate causes render their effects intelligible.',
    ),
  ],
  E3D2: [
    fol(
      'Act(x) ↔ AdequateCause(x,Effect(x)) ∧ Passion(x) ↔ ¬AdequateCause(x,Effect(x))',
      '(Act(x) <-> AdequateCause(x, Effect(x))) & (Passion(x) <-> ~AdequateCause(x, Effect(x)))',
      'Acting is producing effects adequately; passion follows from inadequate causation.',
    ),
  ],
  E3D3: [
    fol(
      'Emotion(ε,x) ↔ (ModifiesBody(ε,x) ∧ AdjustsPower(ε,x) ∧ IdeaOf(ε,x))',
      'Emotion(e, x) <-> (ModifiesBody(e, x) & AdjustsPower(e, x) & IdeaOf(e, x))',
      'An emotion modifies body, shifts power, and involves an accompanying idea.',
    ),
  ],

  E3Post1: [
    fol(
      '∀h(Human(h) → ∃ε Emotion(ε,h) ∧ (IncreasesPower(ε,h) ∨ DecreasesPower(ε,h) ∨ Neutral(ε,h)))',
      'forall h: Human(h) -> exists e: Emotion(e, h) & (IncreasesPower(e, h) | DecreasesPower(e, h) | Neutral(e, h))',
      'The human body can be affected in ways that raise, lower, or leave unchanged its power.',
    ),
  ],
  E3Post2: [
    fol(
      '∀h(Human(h) → (ManyChanges(h) ∧ RetainsTraces(h) ∧ KeepsImages(h)))',
      'forall h: Human(h) -> (ManyChanges(h) & RetainsTraces(h) & KeepsImages(h))',
      'Human bodies undergo many changes yet retain traces and resulting images.',
    ),
  ],

  E3p1: [
    fol(
      '∀m[(Mind(m) ∧ AdequateIdeas(m)) → Active(m)] ∧ ∀m[(Mind(m) ∧ InadequateIdeas(m)) → Passive(m)]',
      'forall m: (Mind(m) & AdequateIdeas(m) -> Active(m)) & (Mind(m) & InadequateIdeas(m) -> Passive(m))',
      'Adequate ideas make the mind active; inadequate ones make it passive.',
    ),
  ],
  E3p1c1: [
    fol(
      'LiabilityPassive(m) ∝ InadequateIdeaShare(m) ∧ LiabilityActive(m) ∝ AdequateIdeaShare(m)',
      'forall m: Mind(m) -> (MoreInadequate(m) -> MorePassive(m)) & (MoreAdequate(m) -> MoreActive(m))',
      'Passivity rises with inadequate ideas, activity with adequate ones.',
    ),
  ],
  E3p2: [
    fol(
      '∀b∀m[(Body(b) ∧ MindOf(m,b)) → (¬Determines(b,m) ∧ ¬Determines(m,b))]',
      'forall b forall m: (Body(b) & MindOf(m, b)) -> (~Determines(b, m) & ~Determines(m, b))',
      'Body and its mind do not causally determine one another across attributes.',
    ),
  ],
  E3p2s1: [
    fol(
      '∀b∀m[(Body(b) ∧ MindOf(m,b)) → OneModeTwoAttributes(m,b)]',
      'forall b forall m: (Body(b) & MindOf(m, b)) -> OneModeTwoAttributes(m, b)',
      'Mind and body are one mode seen under thought and extension.',
    ),
  ],
  E3p3: [
    fol(
      'Activities(m) = {i | Idea(i) ∧ InMind(i,m) ∧ Adequate(i)} ∧ Passions(m) = {i | Idea(i) ∧ InMind(i,m) ∧ Inadequate(i)}',
      'forall m: Mind(m) -> (forall i: (InMind(i, m) & Adequate(i) -> CausesAction(i, m))) & (forall i: (InMind(i, m) & Inadequate(i) -> CausesPassion(i, m)))',
      'Mental activities come from adequate ideas; passions from inadequate ideas.',
    ),
  ],
  E3p3s1: [
    fol(
      'Passive(m) ↔ ∃i(InMind(i,m) ∧ Inadequate(i) ∧ NegatesPower(i,m))',
      'forall m: Mind(m) -> (Passive(m) <-> exists i: InMind(i, m) & Inadequate(i) & NegatesPower(i, m))',
      'Passivity signals an inadequate idea involving privation.',
    ),
  ],
  E3p4: [
    fol('∀x (Destruction(x) → ∃c ExternalCause(c,x))', 'forall x: Destruction(x) -> exists c: ExternalCause(c, x)', 'Whatever is destroyed has an external cause.'),
  ],
  E3p5: [
    fol(
      '∀x∀y[(CanDestroy(x,y) ∨ CanDestroy(y,x)) → ContraryNatures(x,y)]',
      'forall x forall y: (CanDestroy(x, y) | CanDestroy(y, x)) -> ContraryNatures(x, y)',
      'Things whose powers exclude each other are contrary.',
    ),
  ],
  E3p6: [
    fol('∀x (Thing(x) → StrivesToPersist(x))', 'forall x: Thing(x) -> StrivesToPersist(x)', 'Every individual strives to persist.'),
  ],
  E3p7: [
    fol('∀x (Essence(x) = Striving(x))', 'forall x: Essence(x) = Striving(x)', 'The conatus equals the thing’s actual essence.'),
  ],
  E3p8: [
    fol(
      '∀x(StrivesToPersist(x) → ∀t(Duration(t) → PersistsDuring(x,t)))',
      'forall x: StrivesToPersist(x) -> forall t: Duration(t) -> PersistsDuring(x, t)',
      'The striving involves indefinite duration.',
    ),
  ],
  E3p9: [
    fol(
      '∀m[(Mind(m) ∧ (AdequateIdeas(m) ∨ InadequateIdeas(m))) → StrivesToPersist(m)]',
      'forall m: (Mind(m) & (AdequateIdeas(m) | InadequateIdeas(m))) -> StrivesToPersist(m)',
      'Minds strive to persist regardless of idea quality.',
    ),
  ],
  E3p9s1: [
    fol(
      'Will(m) ↔ StrivingOfMind(m) ∧ Appetite(m) ↔ StrivingOfMindBody(m) ∧ Desire(m,a) ↔ (Appetite(m) ∧ ConsciousOf(m,Appetite(m)))',
      'forall m: (Will(m) <-> StrivingOfMind(m)) & (Appetite(m) <-> StrivingOfMindBody(m)) & forall a: Desire(m, a) <-> (Appetite(m) & ConsciousOf(m, Appetite(m)) & DirectedTo(m, a))',
      'Will is the mind’s striving; appetite is striving of mind and body; desire is conscious appetite toward an act.',
    ),
  ],
  E3p10: [
    fol(
      '¬∃i (Idea(i) ∧ InMind(i,Me) ∧ ExcludesBodyExistence(i))',
      '~exists i: Idea(i) & InMind(i, Me) & ExcludesBodyExistence(i)',
      'Ideas that exclude our body’s existence cannot be in our mind.',
    ),
  ],
  E3p11: [
    fol(
      '∀b∀m[(Body(b) ∧ MindOf(m,b)) → ∀ε(EmotionIdea(ε,b,m) → AdjustsPower(ε,b) ∧ AdjustsPower(ε,m))]',
      'forall b forall m: (Body(b) & MindOf(m, b)) -> forall e: (EmotionIdea(e, b, m) -> AdjustsPower(e, b) & AdjustsPower(e, m))',
      'Ideas of bodily changes parallel changes in the mind.',
    ),
  ],
  E3p11s1: [
    fol(
      '∀m(Mind(m) → ∃ε₁,ε₂(Emotion(ε₁,m) ∧ Emotion(ε₂,m) ∧ ε₁ LeadsToGreaterPerfection m ∧ ε₂ LeadsToLesserPerfection m))',
      'forall m: Mind(m) -> exists e1 exists e2: Emotion(e1, m) & Emotion(e2, m) & MovesTowardPerfection(e1, m) & MovesAwayPerfection(e2, m)',
      'The mind can move to greater or lesser perfection through emotions.',
    ),
  ],
  E3p12: [
    fol(
      '∀m∀x[(Mind(m) ∧ HelpsPower(x,m)) → DesiresToConceive(m,x)]',
      'forall m forall x: (Mind(m) & HelpsPower(x, m)) -> DesiresToConceive(m, x)',
      'Mind seeks to conceive what aids bodily power.',
    ),
  ],
  E3p13: [
    fol(
      '∀m∀x[(Mind(m) ∧ HindersPower(x,m)) → StrivesToForget(m,x) ∧ RemembersContraryHelps(m)]',
      'forall m forall x: (Mind(m) & HindersPower(x, m)) -> (StrivesToForget(m, x) & exists y: HelpsPower(y, m) & RecallsInstead(m, y))',
      'Mind shuns imagining what hinders power and recalls aids.',
    ),
  ],
  E3p13c1: [
    fol('AvoidsConceiving(m,x) ← HindersPower(x,m)', 'forall m forall x: HindersPower(x, m) -> AvoidsConceiving(m, x)', 'The mind shrinks from conceiving hindering things.'),
  ],
  E3p13s1: [
    fol(
      'Love(m,x) ↔ PleasureFrom(m,x) ∧ IdeaOfCause(m,x) ∧ Hate(m,x) ↔ PainFrom(m,x) ∧ IdeaOfCause(m,x)',
      'forall m forall x: (Love(m, x) <-> (PleasureFrom(m, x) & IdeaOfCause(m, x))) & (Hate(m, x) <-> (PainFrom(m, x) & IdeaOfCause(m, x)))',
      'Defines love and hate as pleasure or pain with the idea of an external cause.',
    ),
  ],
  E3p14: [
    fol(
      '∀m∀ε₁∀ε₂[(Simultaneous(ε₁,ε₂,m)) → (Later(ε₁,m) → TendsTo(ε₂,m))]',
      'forall m forall e1 forall e2: Simultaneous(e1, e2, m) -> (OccursLater(e1, m) -> CoOccurs(e2, m))',
      'Emotions linked once tend to reappear together.',
    ),
  ],
  E3p15: [
    fol('∀x AccidentalCause(x,Pleasure|Pain|Desire)', 'forall x: AccidentalCause(x, Pleasure) | AccidentalCause(x, Pain) | AccidentalCause(x, Desire)', 'Anything can accidentally cause pleasure, pain, or desire.'),
  ],
  E3p15c1: [
    fol(
      'SeenWithAffect(x,ε,m) → ImagesOf(x,m) TendsToRecreate(ε,m)',
      'forall m forall x forall e: SeenWithAffect(x, e, m) -> RecallsWith(m, x, e)',
      'Once viewed with pleasure or pain, a thing is imagined with that affect even if not causal.',
    ),
  ],
  E3p15s1: [
    fol(
      '∃x(Love(m,x) ∧ ¬KnownCause(m,x)) ∨ ∃x(Hate(m,x) ∧ ¬KnownCause(m,x))',
      'forall m: Mind(m) -> (exists x: Love(m, x) & ~KnowsCause(m, x)) | (exists x: Hate(m, x) & ~KnowsCause(m, x))',
      'We may love or hate without knowing the cause due to associative affects.',
    ),
  ],
  E3p16: [
    fol(
      'Resemblance(x,y) ∧ AffectsWith(ε,y,m) → AccidentalAffect(ε,x,m)',
      'forall m forall x forall y forall e: (Resembles(x, y) & AffectsWith(e, y, m)) -> AccidentalAffect(e, x, m)',
      'Resemblance transfers associated affects.',
    ),
  ],
  E3p17: [
    fol(
      'PainSource(y,m) ∧ Resembles(x,y) → InclinedToAvoid(m,x)',
      'forall m forall x forall y: (PainSource(y, m) & Resembles(x, y)) -> InclinedToAvoid(m, x)',
      'Resemblance to a painful thing arouses aversion.',
    ),
  ],
  E3p17s1: [
    fol(
      'Vacillation(m,ε₁,ε₂) ↔ (Contrary(ε₁,ε₂) ∧ BothIncline(m,ε₁,ε₂))',
      'forall m forall e1 forall e2: Vacillation(m, e1, e2) <-> (Contrary(e1, e2) & Inclines(m, e1) & Inclines(m, e2))',
      'Vacillation is simultaneous pull of contrary emotions.',
    ),
  ],
  E3p18: [
    fol(
      '∀m∀x[(ImagePastFuture(x,m) → SameAffectStrength(x,Present,m))]',
      'forall m forall x: ImagePastFuture(x, m) -> SameAffect(x, Present(x), m)',
      'Images of past or future move us as present ones.',
    ),
  ],
  E3p18s1: [
    fol(
      'PastFuture(m,x) ↔ (Affects(x,m) ∧ (WasAffected(m,x) ∨ WillBeAffected(m,x)))',
      'forall m forall x: PastFutureLabel(m, x) <-> (Affects(x, m) & (WasAffected(m, x) | WillBeAffected(m, x)))',
      'Past and future named by relation to our affective experience.',
    ),
  ],
  E3p18s2: [
    fol(
      'Hope(m,x) ↔ (PleasureFrom(m,x) ∧ Doubt(m,x) ∧ Future(x)) ∧ Fear(m,x) ↔ (PainFrom(m,x) ∧ Doubt(m,x) ∧ Future(x))',
      'forall m forall x: (Hope(m, x) <-> (PleasureFrom(m, x) & Doubt(m, x) & Future(x))) & (Fear(m, x) <-> (PainFrom(m, x) & Doubt(m, x) & Future(x)))',
      'Defines fluctuating emotions tied to uncertain future good or evil.',
    ),
  ],
  E3p19: [
    fol('Love(m,x) ∧ ConceivesDestroyed(m,x) → Pain(m,x)', 'forall m forall x: Love(m, x) & ConceivesDestroyed(m, x) -> FeelsPain(m, x)', 'Thinking loved thing lost causes pain; preservation brings pleasure.'),
    fol('Love(m,x) ∧ ConceivesPreserved(m,x) → Pleasure(m,x)', 'forall m forall x: Love(m, x) & ConceivesPreserved(m, x) -> FeelsPleasure(m, x)'),
  ],
  E3p20: [
    fol('Hate(m,x) ∧ ConceivesDestroyed(m,x) → Pleasure(m,x)', 'forall m forall x: Hate(m, x) & ConceivesDestroyed(m, x) -> FeelsPleasure(m, x)', 'Destruction of hated object pleases.'),
  ],
  E3p21: [
    fol(
      'Love(m,x) ∧ ConceivesAffecting(x,y,ε) → SharesAffect(m,ε,y)',
      'forall m forall x forall y forall e: (Love(m, x) & ConceivesAffecting(x, y, e)) -> SharesAffect(m, e, y)',
      'We mirror affects of loved things.',
    ),
  ],
  E3p22: [
    fol(
      'Love(m,a) ∧ CausesPleasure(b,a) → Love(m,b) ∧ Love(m,a) ∧ CausesPain(b,a) → Hate(m,b)',
      'forall m forall a forall b: (Love(m, a) & CausesPleasure(b, a) -> Love(m, b)) & (Love(m, a) & CausesPain(b, a) -> Hate(m, b))',
      'Helpers of loved objects are loved; hurters are hated.',
    ),
  ],
  E3p22s1: [
    fol(
      'Pity(m,y) ↔ (Pain(m,y) ∧ ConceivesHarm(y) ∧ LikeUs(y)) ∧ Kindness(m,y) ↔ (Love(m,y) ∧ ConceivesBenefit(y) ∧ LikeUs(y))',
      'forall m forall y: (Pity(m, y) <-> (Pain(m, y) & ConceivesHarm(y) & LikeUs(y))) & (Kindness(m, y) <-> (Love(m, y) & ConceivesBenefit(y) & LikeUs(y)))',
      'Defines pity and analogous pleasure toward loved objects.',
    ),
  ],
  E3p23: [
    fol(
      'Hate(m,a) ∧ ConceivesHarm(a) → Pleasure(m,a) ∧ Hate(m,a) ∧ ConceivesBenefit(a) → Pain(m,a)',
      'forall m forall a: (Hate(m, a) & ConceivesHarm(a) -> FeelsPleasure(m, a)) & (Hate(m, a) & ConceivesBenefit(a) -> FeelsPain(m, a))',
      'Harm to hated pleases; benefit pains.',
    ),
  ],
  E3p23s1: [
    fol(
      'Hate(m,a) ∧ Love(m,a) → MixedAffect(m,a)',
      'forall m forall a: Hate(m, a) & Love(m, a) -> MixedAffect(m, a)',
      'Reciprocal affects can conflict, tempering pleasure.',
    ),
  ],
  E3p24: [
    fol(
      'Hate(m,a) ∧ CausesPleasure(b,a) → Hate(m,b) ∧ Hate(m,a) ∧ CausesPain(b,a) → Love(m,b)',
      'forall m forall a forall b: (Hate(m, a) & CausesPleasure(b, a) -> Hate(m, b)) & (Hate(m, a) & CausesPain(b, a) -> Love(m, b))',
      'Helpers of hated are hated; hurters of hated are loved.',
    ),
  ],
  E3p24s1: [
    fol('Envy(m,x) ↔ (Hate(m,x) ∧ PainAtGood(m,x) ∧ PleasureAtHarm(m,x))', 'forall m forall x: Envy(m, x) <-> (Hate(m, x) & PainAtGood(m, x) & PleasureAtHarm(m, x))', 'Envy mixes hatred with responses to another’s fortunes.'),
  ],
  E3p25: [
    fol(
      'Love(m,x) → StrivesToAffirmPleasant(m,x) ∧ Love(m,x) → AvoidsAffirmingPainful(m,x)',
      'forall m forall x: Love(m, x) -> StrivesToAttributePleasant(m, x) & Love(m, x) -> AvoidsAttributePainful(m, x)',
      'We affirm of ourselves and loved things whatever we imagine pleasurable.',
    ),
  ],
  E3p26: [
    fol(
      'Hate(m,x) → StrivesToAffirmPainful(m,x) ∧ Hate(m,x) → AvoidsAffirmingPleasant(m,x)',
      'forall m forall x: Hate(m, x) -> StrivesToAttributePainful(m, x) & Hate(m, x) -> AvoidsAttributePleasant(m, x)',
      'We ascribe harms to what we hate and deny its goods.',
    ),
  ],
  E3p26s1: [
    fol(
      'Love(m,x) ∧ InflatedView(m,x) ∨ Hate(m,x) ∧ DepreciatedView(m,x)',
      'forall m forall x: (Love(m, x) -> Overestimates(m, x)) & (Hate(m, x) -> Underestimates(m, x))',
      'Love inflates esteem, hate depresses it.',
    ),
  ],
  E3p27: [
    fol(
      'Resembles(x,Self(m)) ∧ ConceivesAffected(x,ε) → MimicsAffect(m,ε,x)',
      'forall m forall x forall e: (Resembles(x, Self(m)) & ConceivesAffected(x, e)) -> MimicsAffect(m, e, x)',
      'We imitate affects of similar others.',
    ),
  ],
  E3p27s1: [
    fol(
      'Compassion(m,x) ↔ MimicsAffect(m,Pain,x) ∧ Emulation(m,x) ↔ MimicsAffect(m,Desire,x)',
      'forall m forall x: (Compassion(m, x) <-> MimicsAffect(m, Pain, x)) & (Emulation(m, x) <-> MimicsAffect(m, Desire, x))',
      'Defines compassion and emulation as affective imitation.',
    ),
  ],
  E3p27c1: [
    fol('PleasureToSimilar(x) → Love(m,x)', 'forall m forall x: PleasureToSimilar(x) -> Love(m, x)', 'We love those who delight similar beings.'),
  ],
  E3p27c2: [
    fol('Pity(m,x) → ¬Hate(m,x)', 'forall m forall x: Pity(m, x) -> ~Hate(m, x)', 'Pity blocks hatred toward its object.'),
  ],
  E3p27c3: [
    fol('Pity(m,x) → StrivesToAid(m,x)', 'forall m forall x: Pity(m, x) -> StrivesToAid(m, x)', 'Pity motivates aid.'),
  ],
  E3p27s2: [
    fol('Benevolence(m,x) ↔ (Pity(m,x) ∧ DesireToBenefit(m,x))', 'forall m forall x: Benevolence(m, x) <-> (Pity(m, x) & DesireToBenefit(m, x))', 'Benevolence is desire from pity to help.'),
  ],
  E3p28: [
    fol(
      'ConceivesConducive(m,x,Pleasure) → StrivesFor(m,x) ∧ ConceivesConducive(m,x,Pain) → StrivesAgainst(m,x)',
      'forall m forall x: (ConceivesConducive(m, x, Pleasure) -> StrivesFor(m, x)) & (ConceivesConducive(m, x, Pain) -> StrivesAgainst(m, x))',
      'We seek perceived goods and avoid perceived evils.',
    ),
  ],
  E3p29: [
    fol(
      'ConceivesPraisedByOthers(m,x) → StrivesFor(m,x) ∧ ConceivesBlamedByOthers(m,x) → Avoids(m,x)',
      'forall m forall x: (ConceivesPraisedByOthers(m, x) -> StrivesFor(m, x)) & (ConceivesBlamedByOthers(m, x) -> Avoids(m, x))',
      'We aim to do what we think pleases others and avoid what displeases.',
    ),
  ],
  E3p29s1: [
    fol('Ambition(m) ↔ DesireToPlease(m,Others)', 'forall m: Ambition(m) <-> DesireToPlease(m, Others)', 'Ambition seeks others’ approval.'),
  ],
  E3p30: [
    fol(
      'ActsPleasingOthers(m,a) → Pleasure(m,a) ∧ PleasureFromGlory(m)',
      'forall m forall a: ActsPleasingOthers(m, a) -> (FeelsPleasure(m, a) & GloryIdea(m, a))',
      'Pleasure follows believing one has pleased others (glory).',
    ),
  ],
  E3p30s1: [
    fol(
      'Glory(m) ↔ LoveSelfFromOthers(m) ∧ Shame(m) ↔ HateSelfFromOthers(m)',
      'forall m: (Glory(m) <-> (LoveSelf(m) & IdeaOfOthersPraise(m))) & (Shame(m) <-> (HateSelf(m) & IdeaOfOthersBlame(m)))',
      'Defines glory and shame as self-love or self-hate with social idea.',
    ),
  ],
  E3p31: [
    fol(
      'SharesAffection(m,n,x) → AltersAffect(m,x)',
      'forall m forall n forall x: (Conceives(n, LovesOrHates(n, x)) & LovesOrHates(m, x)) -> ReinforcesLikeAffect(m, x)',
      'Knowing others share our loves or hates strengthens ours.',
    ),
  ],
  E3p31c1: [
    fol('StrivesToAlignOthers(m,x) ← LovesOrHates(m,x)', 'forall m forall x: LovesOrHates(m, x) -> StrivesToMakeOthersAgree(m, x)', 'We try to make others feel likewise.'),
  ],
  E3p31s1: [
    fol('Ambition(m) ↔ DesireOthersShareJudgment(m)', 'forall m: Ambition(m) <-> DesireOthersShareJudgment(m)', 'Ambition seeks universal approval for one’s likes and dislikes.'),
  ],
  E3p32: [
    fol(
      'GoodsExclusive(x) ∧ SeesEnjoyedByOther(m,x) → TriesToRemoveOther(m,x)',
      'forall m forall x: (ExclusiveGood(x) & SeesOtherEnjoy(m, x)) -> StrivesToPreventOther(m, x)',
      'Scarce goods provoke rivalry and envy.',
    ),
  ],
  E3p32s1: [
    fol('PityForUnfortunate(m) ∧ EnvyForFortunate(m)', 'forall m: (SeesOthersSuffer(m) -> Pity(m, Others)) & (SeesOthersProsper(m) -> Envy(m, Others))', 'Human nature tends to pity the unlucky and envy the lucky.'),
  ],
  E3p33: [
    fol(
      'BenefitsSimilar(m,x) → Love(m,x) ∧ HarmsSimilar(m,x) → Hate(m,x)',
      'forall m forall x: (BenefitsSimilar(x, m) -> Love(m, x)) & (HarmsSimilar(x, m) -> Hate(m, x))',
      'We love helpers of our kind and hate those harming them.',
    ),
  ],
  E3p34: [
    fol(
      'PleasureOfHated(m) → Hate(m, PleasureSource) ∧ PainOfLoved(m) → Hate(m, PainSource)',
      'forall m forall x: (Hate(m, x) & SeesPleasure(x) -> HatesCause(m, Pleasure(x))) & (Love(m, x) & SeesPain(x) -> HatesCause(m, Pain(x)))',
      'We oppose causes of joy to hated and causes of pain to loved.',
    ),
  ],
  E3p35: [
    fol(
      'PleasureWithIdeaOfCause(m,x) → Love(m,Cause(x)) ∧ PainWithIdeaOfCause(m,x) → Hate(m,Cause(x))',
      'forall m forall x: (PleasureFrom(m, x) -> Love(m, CauseOf(x))) & (PainFrom(m, x) -> Hate(m, CauseOf(x)))',
      'Pleasure or pain shifts affection to conceived causes.',
    ),
  ],
  E3p35s1: [
    fol('FormerCauses(m,x) PersistInImagination(m) → RenewedAffect(m,x)', 'forall m forall x: RememberedCause(m, x) -> RekindlesAffect(m, x)', 'Remembered causes keep love or hate alive.'),
  ],
  E3p36: [
    fol(
      'Love(m,x) ∧ NewPleasureFrom(m,y) → Love(m,y) ∧ Weakens(Love(m,x))',
      'forall m forall x forall y: (Love(m, x) & NewPleasureFrom(m, y)) -> (Love(m, y) & Weakens(Love(m, x)))',
      'New pleasure can diminish previous love.',
    ),
  ],
  E3p36c1: [
    fol('PleasureFrom(m,y) ∧ Love(m,x) → StrivesToUnite(y,x)', 'forall m forall x forall y: PleasureFrom(m, y) & Love(m, x) -> StrivesToJoin(m, y, x)', 'We try to connect new pleasures to loved objects.'),
  ],
  E3p36s1: [
    fol('LoveCanShift(m,x,y) basedOn PleasureFlows(m)', 'forall m forall x forall y: FlowOfPleasures(m, x, y) -> AltersAttachment(m, x, y)', 'Narrates how shifting pleasures redirect love.'),
  ],
  E3p37: [
    fol(
      'Love(m,x) ∧ ImaginesPossessionThreat(m,x) → Jealous(m,x)',
      'forall m forall x: Love(m, x) & ThreatenedSharing(m, x) -> Jealous(m, x)',
      'Jealousy arises from fear of losing exclusive possession of the loved.',
    ),
  ],
  E3p38: [
    fol(
      'Hate(m,x) ∧ ImaginesMutualHate(x,m) → GreaterHate(m,x)',
      'forall m forall x: Hate(m, x) & Imagines(x, Hate(x, m)) -> Intensifies(Hate(m, x))',
      'Reciprocal hatred increases hatred.',
    ),
  ],
  E3p39: [
    fol(
      'Hate(m,x) ∧ Love(x,m) → Vacillation(m,x)',
      'forall m forall x: Hate(m, x) & Love(x, m) -> Vacillation(m, x)',
      'Hating one who loves us causes vacillation.',
    ),
  ],
  E3p39s1: [
    fol(
      'FearOfHarm(m,x) ∧ HopeOfBenefit(m,x) → Vacillation(m,x)',
      'forall m forall x: FearOfHarm(m, x) & HopeOfBenefit(m, x) -> Vacillation(m, x)',
      'Mixed hope and fear explain the oscillation.',
    ),
  ],
  E3p40: [
    fol(
      'Love(m,x) ∧ ImaginesReturn(love,x,m) → GreaterLove(m,x)',
      'forall m forall x: Love(m, x) & Imagines(Love(x, m)) -> Intensifies(Love(m, x))',
      'Thinking oneself loved strengthens love.',
    ),
  ],
  E3p40s1: [
    fol('IdeaBeingLoved(m,x) → Pleasure(m) ∧ PridePossible(m)', 'forall m forall x: Imagines(Love(x, m)) -> FeelsPleasure(m) & MayFeelPride(m)', 'Being loved brings pleasure and may feed pride.'),
  ],
  E3p40c1: [
    fol('Love(m,x) ∧ LovesOther(x,y) → Hate(m,y)', 'forall m forall x forall y: Love(m, x) & Love(x, y) -> Hate(m, y)', 'We hate rivals to the loved.'),
  ],
  E3p40c2: [
    fol('Love(m,x) ∧ Love(y,x) → EnvyBetween(m,y)', 'forall m forall x forall y: Love(m, x) & Love(y, x) -> EnvyPair(m, y)', 'Mutual lovers of same object envy one another.'),
  ],
  E3p40s2: [
    fol('MutualJealousy(m,y,x) ↔ Love(m,x) ∧ Love(y,x) ∧ Rivalry(m,y,x)', 'forall m forall y forall x: MutualJealousy(m, y, x) <-> (Love(m, x) & Love(y, x) & Rivalry(m, y, x))', 'Scholium elaborates rivalry from shared love.'),
  ],
  E3p41: [
    fol('Love(m,x) ∧ ImaginesLove(x,another) → Hate(m,x)', 'forall m forall x forall y: Love(m, x) & Imagines(Love(x, y)) -> Hate(m, x)', 'Imagining beloved loving another turns love to hate.'),
  ],
  E3p41s1: [
    fol('BeliefJustCauseOfLove(m,x) → Pride(m)', 'forall m forall x: BelievesDeservingLove(m, x) -> Pride(m)', 'Feeling deserving of love yields pride.'),
  ],
  E3p41c1: [
    fol('LoveTowardHater(m,x) → LoveHateConflict(m,x)', 'forall m forall x: Imagines(Love(x, m)) & Hate(m, x) -> ConflictLoveHate(m, x)', 'Imagining love from someone we hate creates conflict.'),
  ],
  E3p41s2: [
    fol('PrevailingHatred(m,x) → CrueltyToward(x)', 'forall m forall x: ConflictLoveHate(m, x) & DominatesHatred(m, x) -> Cruelty(m, x)', 'If hatred dominates, cruelty follows.'),
  ],
  E3p42: [
    fol('GivesBenefitFromLove(m,x) ∧ ReceivesIngratitude(m,x) → Pain(m,x)', 'forall m forall x: GivesBenefitFromLove(m, x) & SeesIngratitude(x, m) -> FeelsPain(m, x)', 'Unrequited benefits cause pain.'),
  ],
  E3p43: [
    fol('ReciprocalHatred(m,x) → IncreasesHatred(m,x) ∧ OpposedByLove(x) → DiminishesHatred(m,x)', 'forall m forall x: (HatredReturned(m, x) -> Intensifies(Hate(m, x))) & (LoveOffered(x, m) -> Weakens(Hate(m, x)))', 'Hatred grows when reciprocated and can be undone by love.'),
  ],
  E3p44: [
    fol('HatredVanquishedByLove(m,x) → StrongerLove(m,x)', 'forall m forall x: HatredVanquishedByLove(m, x) -> StrongerLove(m, x)', 'Love following conquered hatred is greater.'),
  ],
  E3p44s1: [
    fol('NoOneSeeksPainForGreaterPleasureLater', 'forall m: Mind(m) -> ~SeeksPainForLaterPleasure(m)', 'No one chooses hatred just to enjoy its reversal.'),
  ],
  E3p45: [
    fol('SeesSimilarHatingLoved(m,x) → Hate(m,x)', 'forall m forall x: SeesSimilarHatingLoved(m, x) -> Hate(m, x)', 'We hate one like us who hates what we love.'),
  ],
  E3p46: [
    fol('PastAffectFromStranger(m,x,ε) ∧ AssociatesClass(x,k) → TransfersAffectToClass(m,k,ε)', 'forall m forall x forall k forall e: PastAffectFromClass(m, x, k, e) -> TransfersAffectToClass(m, k, e)', 'Affects from individuals extend to their class or nation.'),
  ],
  E3p47: [
    fol('JoyAtEnemyHarm(m,x) → MixedWithPain(m)', 'forall m forall x: JoyAtHarmOfHated(m, x) -> ContainsPain(m)', 'Joy at a foe’s hurt is tinged with pain.'),
  ],
  E3p47s1: [
    fol('RememberedEvil(m,x) → RenewedPain(m) evenWithoutExistence(x)', 'forall m forall x: RememberedEvil(m, x) -> PainFromIdeaOnly(m, x)', 'Memory alone revives pain or joy.'),
  ],
  E3p48: [
    fol('Love(m,x) ∧ CeasesPleasureFrom(x) → CeasesLove(m,x) ∧ Hate(m,x) ∧ CeasesPainFrom(x) → CeasesHate(m,x)', 'forall m forall x: (Love(m, x) & PleasureCeases(m, x) -> ~Love(m, x)) & (Hate(m, x) & PainCeases(m, x) -> ~Hate(m, x))', 'When pleasure or pain ceases, love or hate fades.'),
  ],
  E3p49: [
    fol('FreeObject(x) → StrongerLoveOrHate(m,x) than TowardNecessitated(x)', 'forall m forall x: ConceivesFree(x) -> StrongerAffect(m, x)', 'Affects toward the free are stronger than toward the necessary.'),
  ],
  E3p49s1: [
    fol('HumansAsFreeImagined → IntensifiedMutualAffects', 'forall m forall n: ImaginesFree(m, n) -> (StrongerLoveOrHate(m, n))', 'Belief in human freedom intensifies interpersonal love or hate.'),
  ],
  E3p50: [
    fol('∀x AccidentalCause(x,Hope) ∨ AccidentalCause(x,Fear)', 'forall x: AccidentalCause(x, Hope) | AccidentalCause(x, Fear)', 'Anything can accidentally induce hope or fear.'),
  ],
  E3p50s1: [
    fol('Omen(x) ↔ (AccidentalCause(x,Hope) ∨ AccidentalCause(x,Fear))', 'forall x: Omen(x) <-> (AccidentalCause(x, Hope) | AccidentalCause(x, Fear))', 'Omens are accidental causes of hope or fear.'),
  ],
  E3p51: [
    fol('SameObject(o) → DifferentAffectsAcrossPersons', 'forall o: Object(o) -> exists m exists n: Mind(m) & Mind(n) & DifferentAffect(m, n, o)', 'Same object can affect people differently or same person at times.'),
  ],
  E3p51s1: [
    fol('DifferencesExplainOppositeLoveHateFear', 'forall o forall m forall n: DifferentConstitutions(m, n) -> OppositeAffectsPossible(m, n, o)', 'Temperament differences yield opposite responses.'),
  ],
  E3p52: [
    fol('ImageOfCommonObjectWithoutDistinctProperties → Wonder(m)', 'forall m forall x: ImaginesOnly(x, m) & NoCommonLink(x) -> Wonder(m, x)', 'Isolated images provoke wonder.'),
  ],
  E3p52s1: [
    fol('Wonder(m,x) ∧ NewOccasions → DoubtOrContempt(m,x)', 'forall m forall x: Wonder(m, x) -> (FrequentExposure(x) -> Contempt(m, x))', 'Wonder fades with familiarity into contempt.'),
  ],
  E3p53: [
    fol('MindRegardsOwnPower(m) → Pleasure(m) ∧ Clarity↑ ⇒ Pleasure↑', 'forall m: Mind(m) -> (RegardsOwnPower(m) -> Pleasure(m) & (MoreDistinct(m) -> GreaterPleasure(m)))', 'Self-contemplation of power yields pleasure proportional to clarity.'),
  ],
  E3p53c1: [
    fol('BelievesPraisedByOthers(m) → IncreasesSelfPleasure(m)', 'forall m: BelievesPraisedByOthers(m) -> Increases(SelfPleasure(m))', 'Praise belief augments self-pleasure.'),
  ],
  E3p54: [
    fol('MindSeeksOnlyIdeasAffirmingPower(m)', 'forall m: Mind(m) -> StrivesForIdeasAffirmingPower(m)', 'Mind endeavours to conceive what asserts its power.'),
  ],
  E3p55: [
    fol('MindRegardsWeakness(m) → Pain(m)', 'forall m: Mind(m) -> RegardsWeakness(m) -> Pain(m)', 'Reflecting on weakness causes pain.'),
  ],
  E3p55c1: [
    fol('BelievesBlamedByOthers(m) → IncreasesSelfPain(m)', 'forall m: BelievesBlamedByOthers(m) -> Increases(SelfPain(m))', 'Blame belief increases pain.'),
  ],
  E3p55s1: [
    fol(
      'Humility(m) ↔ (Pain(m) ∧ IdeaOfOwnWeakness(m)) ∧ SelfContentment(m) ↔ (Pleasure(m) ∧ IdeaOfOwnPower(m))',
      'forall m: (Humility(m) <-> (Pain(m) & IdeaOfOwnWeakness(m))) & (SelfContentment(m) <-> (Pleasure(m) & IdeaOfOwnPower(m)))',
      'Defines humility and self-contentment.',
    ),
  ],
  E3p55c2: [
    fol('EnvyRequiresEquality → ¬EnviesSuperiorVirtue', 'forall m forall x: SuperiorVirtue(x) -> ~Envies(m, x)', 'No one envies virtue of one not seen as equal.'),
  ],
  E3p55s2: [
    fol('Veneration(m,x) arisesFromWonderAtVirtue(x)', 'forall m forall x: WondersAtVirtue(m, x) -> Venerates(m, x)', 'Veneration stems from wonder at prudence or fortitude.'),
  ],
  E3p56: [
    fol('Emotions = VariationsOf(Pleasure,Pain,Desire)', 'forall e: Emotion(e) -> CombinationOf(e, Pleasure, Pain, Desire)', 'All emotions derive from pleasure, pain, and desire.'),
  ],
  E3p56s1: [
    fol('Luxury,Drunkenness,Lust,Avarice,Ambition ⊆ ExcessiveFormsOfDesire', 'forall e: (Luxury(e) | Drunkenness(e) | Lust(e) | Avarice(e) | Ambition(e)) -> ExcessiveDesire(e)', 'Lists major excessive desires.'),
  ],
  E3p57: [
    fol('EmotionOf(m) differsWithEssence(m)', 'forall m forall n forall e: (EmotionOf(m, e) & EmotionOf(n, e)) -> DifferentOnlyIfEssenceDiffers(m, n)', 'Emotions differ only by individual essence differences.'),
  ],
  E3p57s1: [
    fol('AnimalsHaveMinds → ShareEmotions', 'forall a: Animal(a) -> Mind(a) -> EmotionsApply(a)', 'So-called irrational animals feel analogous emotions.'),
  ],
  E3p58: [
    fol('ActiveEmotionsFromPleasureOrDesire(m) ↔ (AdequateIdea(m) ∧ Emotion(m))', 'forall m forall e: (Emotion(e, m) & AdequateIdeaOf(e, m)) -> ActiveEmotion(e, m)', 'Active emotions derive from adequate ideas tied to pleasure or desire.'),
  ],
  E3p59: [
    fol('ActiveEmotions ⊆ {PleasureForms, DesireForms}', 'forall e: ActiveEmotion(e) -> (PleasureForm(e) | DesireForm(e))', 'All active emotions reduce to pleasure or desire forms.'),
  ],
  E3p59s1: [
    fol('ActionsFromUnderstanding(m) = StrengthOfCharacter(m)', 'forall m: ActionsFromUnderstanding(m) = StrengthOfCharacter(m)', 'Actions from adequate understanding manifest strength of character.'),
  ],

  E3Post3: [fol('Pain(x) ↔ Transition(x,GreaterPerfection,LessPerfection)', 'forall x: Pain(x) <-> Transition(x, GreaterPerfection, LessPerfection)', 'Pain is transition to lesser perfection.')],
  E3Post4: [fol('Wonder(x) ↔ (Imagination(x) ∧ NoConnection(x))', 'forall x: Wonder(x) <-> (Imagination(x) & NoConnection(x))', 'Wonder arises from isolated conception.')],
  E3Post5: [fol('Contempt(x) ↔ (Imagination(x) ∧ NegligibleEffect(x))', 'forall x: Contempt(x) <-> (Imagination(x) & NegligibleEffect(x))', 'Contempt is a feeble idea leading to slight regard.')],
  E3Post6: [fol('Love(m,x) ↔ (PleasureFrom(m,x) ∧ IdeaOfCause(m,x))', 'forall m forall x: Love(m, x) <-> (PleasureFrom(m, x) & IdeaOfCause(m, x))', 'Love defined as pleasure with cause idea.')],
  E3Post7: [fol('Hatred(m,x) ↔ (PainFrom(m,x) ∧ IdeaOfCause(m,x))', 'forall m forall x: Hatred(m, x) <-> (PainFrom(m, x) & IdeaOfCause(m, x))', 'Hatred defined as pain with cause idea.')],
  E3Post8: [fol('Inclination(m,x) ↔ (PleasureFrom(m,x) ∧ AccidentalCause(x))', 'forall m forall x: Inclination(m, x) <-> (PleasureFrom(m, x) & AccidentalCause(x))', 'Inclination is pleasure tied to accidental cause.')],
  E3Post9: [fol('Aversion(m,x) ↔ (PainFrom(m,x) ∧ AccidentalCause(x))', 'forall m forall x: Aversion(m, x) <-> (PainFrom(m, x) & AccidentalCause(x))', 'Aversion is pain tied to accidental cause.')],
  E3Post10: [fol('Devotion(m,x) ↔ (Love(m,x) ∧ Admiration(m,x))', 'forall m forall x: Devotion(m, x) <-> (Love(m, x) & Admiration(m, x))', 'Devotion is loving an admired object.')],
  E3Post11: [fol('Derision(m,x) ↔ (Pleasure(m) ∧ ImaginesDespisedQuality(m,x) ∧ Hate(m,x))', 'forall m forall x: Derision(m, x) <-> (Pleasure(m) & ImaginesDespisedQuality(m, x) & Hate(m, x))', 'Derision mixes pleasure at despised trait in hated object.')],
  E3Post12: [fol('Hope(m,x) ↔ (PleasureFrom(m,x) ∧ Uncertain(x))', 'forall m forall x: Hope(m, x) <-> (PleasureFrom(m, x) & Uncertain(x))', 'Hope is inconstant pleasure about uncertain outcome.')],
  E3Post13: [fol('Fear(m,x) ↔ (PainFrom(m,x) ∧ Uncertain(x))', 'forall m forall x: Fear(m, x) <-> (PainFrom(m, x) & Uncertain(x))', 'Fear is inconstant pain about uncertain outcome.')],
  E3Post14: [fol('Confidence(m,x) ↔ (PleasureFrom(m,x) ∧ Certain(x))', 'forall m forall x: Confidence(m, x) <-> (PleasureFrom(m, x) & Certain(x))', 'Confidence removes doubt from hope.')],
  E3Post15: [fol('Despair(m,x) ↔ (PainFrom(m,x) ∧ Certain(x))', 'forall m forall x: Despair(m, x) <-> (PainFrom(m, x) & Certain(x))', 'Despair is certain pain about outcome.')],
  E3Post16: [fol('Joy(m,x) ↔ (PleasureFrom(m,x) ∧ UnexpectedlyGood(x))', 'forall m forall x: Joy(m, x) <-> (PleasureFrom(m, x) & UnexpectedlyGood(x))', 'Joy is pleasure from better-than-hoped result.')],
  E3Post17: [fol('Disappointment(m,x) ↔ (PainFrom(m,x) ∧ ContraryToHope(x))', 'forall m forall x: Disappointment(m, x) <-> (PainFrom(m, x) & ContraryToHope(x))', 'Disappointment is pain from failed hope.')],
  E3Post18: [fol('Pity(m,x) ↔ (Pain(m) ∧ ConceivesEvil(x) ∧ LikeUs(x))', 'forall m forall x: Pity(m, x) <-> (Pain(m) & ConceivesEvil(x) & LikeUs(x))', 'Pity is pain at another’s misfortune.'),],
  E3Post19: [fol('Approval(m,x) ↔ (Love(m,x) ∧ BenefitedAnother(x))', 'forall m forall x: Approval(m, x) <-> (Love(m, x) & BenefitsOthers(x))', 'Approval is love for one doing good to another.')],
  E3Post20: [fol('Indignation(m,x) ↔ (Hatred(m,x) ∧ HarmedAnother(x))', 'forall m forall x: Indignation(m, x) <-> (Hatred(m, x) & HarmsOthers(x))', 'Indignation is hatred for one doing harm to another.')],
  E3Post21: [fol('Partiality(m,x) ↔ (Love(m,x) ∧ Overestimates(m,x))', 'forall m forall x: Partiality(m, x) <-> (Love(m, x) & Overestimates(m, x))', 'Partiality is overestimation due to love.')],
  E3Post22: [fol('Disparagement(m,x) ↔ (Hatred(m,x) ∧ Underestimates(m,x))', 'forall m forall x: Disparagement(m, x) <-> (Hatred(m, x) & Underestimates(m, x))', 'Disparagement is underestimation from hate.')],
  E3Post23: [fol('Envy(m,x) ↔ (Hatred(m,x) ∧ PainAtGood(m,x) ∧ PleasureAtEvil(m,x))', 'forall m forall x: Envy(m, x) <-> (Hatred(m, x) & PainAtGood(m, x) & PleasureAtEvil(m, x))', 'Envy pains at another’s good and delights in evil to them.')],
  E3Post24: [fol('Sympathy(m,x) ↔ (Love(m,x) ∧ PleasureAtGood(m,x) ∧ PainAtEvil(m,x))', 'forall m forall x: Sympathy(m, x) <-> (Love(m, x) & PleasureAtGood(m, x) & PainAtEvil(m, x))', 'Sympathy rejoices at another’s good and sorrows at their ill.'),],
  E3Post25: [fol('SelfApproval(m) ↔ (Pleasure(m) ∧ RegardsOwnPower(m))', 'forall m: SelfApproval(m) <-> (Pleasure(m) & RegardsOwnPower(m))', 'Self-approval is pleasure from contemplating one’s power.')],
  E3Post26: [fol('Humility(m) ↔ (Pain(m) ∧ RegardsOwnWeakness(m))', 'forall m: Humility(m) <-> (Pain(m) & RegardsOwnWeakness(m))', 'Humility is pain from viewing one’s weakness.')],
  E3Post27: [fol('Repentance(m,a) ↔ (PainFrom(m,a) ∧ BelievesFree(m,a))', 'forall m forall a: Repentance(m, a) <-> (PainFrom(m, a) & BelievesFree(m, a))', 'Repentance is pain from an act thought freely chosen.')],
  E3Post28: [fol('Pride(m) ↔ (SelfLove(m) ∧ Overestimates(m,self))', 'forall m: Pride(m) <-> (SelfLove(m) & Overestimates(m, m))', 'Pride is excessive self-esteem from love.'),],
  E3Post29: [fol('SelfAbasement(m) ↔ (Pain(m) ∧ Underestimates(m,self))', 'forall m: SelfAbasement(m) <-> (Pain(m) & Underestimates(m, m))', 'Self-abasement is low self-esteem from pain.'),],
  E3Post30: [fol('Honour(m,a) ↔ (Pleasure(m) ∧ BelievesPraised(m,a))', 'forall m forall a: Honour(m, a) <-> (Pleasure(m) & BelievesPraised(m, a))', 'Honour is pleasure from an act believed praised by others.')],
  E3Post31: [fol('Shame(m,a) ↔ (Pain(m) ∧ BelievesBlamed(m,a))', 'forall m forall a: Shame(m, a) <-> (Pain(m) & BelievesBlamed(m, a))', 'Shame is pain from an act believed blamed by others.')],
  E3Post32: [fol('Regret(m,x) ↔ (Desire(m,x) ∧ Memory(x) ∧ FearImpossible(m,x))', 'forall m forall x: Regret(m, x) <-> (Desire(m, x) & Remembers(m, x) & FearsImpossible(m, x))', 'Regret desires a remembered thing while fearing its loss.'),],
  E3Post33: [fol('Emulation(m,x) ↔ (Desire(m,x) ∧ SeesOthersDesire(m,x))', 'forall m forall x: Emulation(m, x) <-> (Desire(m, x) & SeesOthersDesire(m, x))', 'Emulation is desire caused by seeing others desire.'),],
  E3Post34: [fol('Thankfulness(m,x) ↔ (Love(m,x) ∧ DesireToBenefit(m,x))', 'forall m forall x: Thankfulness(m, x) <-> (Love(m, x) & DesireToBenefit(m, x))', 'Gratitude is loving zeal to benefit one who benefited us.'),],
  E3Post35: [fol('Benevolence(m,x) ↔ (Pity(m,x) ∧ DesireToBenefit(m,x))', 'forall m forall x: Benevolence(m, x) <-> (Pity(m, x) & DesireToBenefit(m, x))', 'Benevolence springs from pity to help.'),],
  E3Post36: [fol('Anger(m,x) ↔ (Hatred(m,x) ∧ DesireToInjure(m,x))', 'forall m forall x: Anger(m, x) <-> (Hatred(m, x) & DesireToInjure(m, x))', 'Anger seeks injury from hatred.'),],
  E3Post37: [fol('Revenge(m,x) ↔ (MutualHatred(m,x) ∧ DesireToInjure(m,x))', 'forall m forall x: Revenge(m, x) <-> (MutualHatred(m, x) & DesireToInjure(m, x))', 'Revenge arises from reciprocal hatred with intent to harm.'),],
  E3Post38: [fol('Cruelty(m,x) ↔ (DesireToInjure(m,x) ∧ LoveOrPity(m,x))', 'forall m forall x: Cruelty(m, x) <-> (DesireToInjure(m, x) & (Love(m, x) | Pity(m, x)))', 'Cruelty injures those we love or pity.'),],
  E3Post39: [fol('Timidity(m) ↔ (DesireToAvoidGreaterEvil(m) ∧ AcceptLesserEvil(m))', 'forall m: Timidity(m) <-> (DesireToAvoidGreaterEvil(m) & AcceptLesserEvil(m))', 'Timidity chooses a lesser evil to escape a greater.'),],
  E3Post40: [fol('Daring(m) ↔ (DesireToDoDangerous(m) ∧ OthersFear(m))', 'forall m: Daring(m) <-> (DesireToDoDangerous(m) & OthersFearToAttempt(m))', 'Daring seeks dangerous acts others fear.')],
  E3Post41: [fol('Cowardice(m) ↔ (DesireCheckedByFear(m) ∧ OthersDare(m))', 'forall m: Cowardice(m) <-> (DesireCheckedByFear(m) & OthersDareToAttempt(m))', 'Cowardice is desire blocked by fear others do not feel.')],
  E3Post42: [fol('Consternation(m) ↔ (DesireToAvoidEvil(m) ∧ AmazementBlocks(m) ∧ FearParalyzes(m))', 'forall m: Consternation(m) <-> (DesireToAvoidEvil(m) & Amazement(m) & FearParalysis(m))', 'Consternation is bewildered fear that halts avoidance.'),],
  E3Post43: [fol('Courtesy(m) ↔ (DesireToPlease(m,Men) ∧ DesireToAvoidOffence(m))', 'forall m: Courtesy(m) <-> (DesireToPlease(m, Men) & DesireToAvoidOffence(m))', 'Courtesy seeks to please and avoid offence.'),],
  E3Post44: [fol('Ambition(m) ↔ ImmoderateDesire(m,Power)', 'forall m: Ambition(m) <-> ImmoderateDesire(m, Power)', 'Ambition is immoderate desire for power.')],
  E3Post45: [fol('Luxury(m) ↔ ExcessiveDesire(m,SumptuousLiving)', 'forall m: Luxury(m) <-> ExcessiveDesire(m, SumptuousLiving)', 'Luxury is excessive desire or love of sumptuous living.')],
  E3Post46: [fol('Intemperance(m) ↔ ExcessiveDesire(m,Drinking)', 'forall m: Intemperance(m) <-> ExcessiveDesire(m, Drinking)', 'Intemperance is excessive desire and love of drinking.')],
  E3Post47: [fol('Avarice(m) ↔ ExcessiveDesire(m,Riches)', 'forall m: Avarice(m) <-> ExcessiveDesire(m, Riches)', 'Avarice is excessive desire and love of riches.')],
  E3Post48: [fol('Lust(m) ↔ (Desire(m,Intercourse) ∧ Love(m,Intercourse))', 'forall m: Lust(m) <-> (Desire(m, Intercourse) & Love(m, Intercourse))', 'Lust is desire and love of sexual union.'),],
};
