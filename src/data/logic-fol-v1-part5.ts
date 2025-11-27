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

export const LOGIC_FOL_V1_PART5: Record<string, LogicEncoding[]> = {
  // Axioms
  E5Ax1: [
    fol(
      '∀x∀a∀b((Contrary(a,b) ∧ In(a,x) ∧ In(b,x)) → (Changes(a,x) ∨ Changes(b,x)))',
      'forall x forall a forall b: (Contrary(a, b) & In(a, x) & In(b, x)) -> (Changes(a, x) | Changes(b, x))',
      'Contrary actions in one subject force alteration until contrariety ceases.',
    ),
  ],
  E5Ax2: [
    fol(
      '∀c∀e(CauseOf(c,e) → Power(e) ≤ Power(c))',
      'forall c forall e: CauseOf(c, e) -> Power(e) <= Power(c)',
      'An effect’s force is bounded by the causal power that defines it.',
    ),
  ],
  E5Ax3: [
    fol(
      'DistinctUnderstanding(e) → SurpassesInTime(e,ConfusedEmotions)',
      'forall e: EmotionFromClearIdea(e) -> StrongerOverTimeThanConfused(e)',
      'Emotions tied to clear understanding outlast confused ones.',
    ),
  ],
  E5Ax4: [
    fol(
      'MoreCommonCauses(mod) → GreaterFostering(mod)',
      'forall m: MoreCommonCauses(m) -> MoreSustained(m)',
      'Shared or divine properties multiply sustaining causes for our modifications.',
    ),
  ],
  E5Ax5: [
    fol(
      'OrdersEmotionsByMind(m) → IncreasedPowerOverEmotions(m)',
      'forall m: Mind(m) & CanOrderEmotions(m) -> StrongerControl(m)',
      'The mind’s capacity to order its emotions enhances its dominion over them.',
    ),
  ],

  // Early propositions on ordering ideas and emotions
  E5p1: [
    fol(
      'MindOf(m,b) → (OrderIdeas(m) ↔ OrderBodyMods(b))',
      'forall m forall b: MindOf(m, b) -> (OrderIdeas(m) <-> OrderBodyModifications(b))',
      'Mental order of ideas mirrors bodily order of images and vice versa.',
    ),
  ],
  E5p2: [
    fol(
      'DetachEmotionFromExternalCause(e) → DestroyLoveHateTiedToCause(e)',
      'forall e: Emotion(e) & RemovedExternalIdea(e) -> EliminatesAttachedLoveHate(e)',
      'Re-associating an emotion away from an external cause dissolves love or hate toward that cause.',
    ),
  ],
  E5p3: [
    fol(
      'Passion(e) ∧ ClearDistinctIdea(e) → ¬Passion(e)',
      'forall e: Passion(e) & ClearDistinctIdea(e) -> ~Passion(e)',
      'A passive emotion stops being passion once grasped clearly.',
    ),
  ],
  E5p3c1: [
    fol(
      'MoreKnowledge(e) → GreaterControl(e)',
      'forall e: KnowsBetter(e) -> MorePowerOver(e)',
      'Control rises with how well we know a passion.',
    ),
  ],
  E5p4: [
    fol(
      '∀m(BodyModification(m) → CanFormClearIdea(m))',
      'forall m: BodyModification(m) -> CanFormClearIdea(m)',
      'Every bodily modification admits a clear and distinct conception.',
    ),
  ],
  E5p4c1: [
    fol(
      '∀e(Emotion(e) → CanFormClearIdea(e))',
      'forall e: Emotion(e) -> CanFormClearIdea(e)',
      'Hence every emotion can be clearly conceived.',
    ),
  ],
  E5p4s1: [
    fol(
      'UnderstandsSelfAndEmotions(m) → LessSubjectToEmotions(m)',
      'forall m: Mind(m) & ClearSelfKnowledge(m) -> ReducesPassivity(m)',
      'Knowing oneself and one’s emotions lets the mind redirect them toward truth.',
    ),
  ],
  E5p5: [
    fol(
      'EmotionTowardSimplyConceived(x) → StrongestEmotion(x)',
      'forall x: EmotionTowardSimplyConceived(x) -> MaxIntensity(x)',
      'Emotion at a thing conceived freely (without necessity) is strongest.',
    ),
  ],
  E5p6: [
    fol(
      'UnderstandsNecessity(m,AllThings) → GreaterPowerOverEmotions(m)',
      'forall m: UnderstandsNecessityOfAll(m) -> LessSubjectToEmotions(m)',
      'Seeing everything as necessary diminishes emotional bondage.',
    ),
  ],
  E5p6s1: [
    fol(
      'AppliesNecessityToParticulars(m) → MitigatesPain(m)',
      'forall m: AppliesNecessityToLoss(m) -> LessensSorrow(m)',
      'Applying necessity to vivid particulars eases harmful emotions.',
    ),
  ],
  E5p7: [
    fol(
      'EmotionFromReason(e) → StrongerThanAbsentObjectEmotion(e)',
      'forall e: EmotionFromReason(e) -> OutlastsEmotionFromAbsentObject(e)',
      'Rational emotions outweigh those tied to absent particulars.',
    ),
  ],
  E5p8: [
    fol(
      'MoreConcurrentCauses(e) → StrongerEmotion(e)',
      'forall e: MultipleSimultaneousCauses(e) -> Stronger(e)',
      'Emotion intensity grows with simultaneous causes.',
    ),
  ],
  E5p8s1: [
    fol(
      'MultipleCauses(e) ↔ ExplainedByAx2(e)',
      'forall e: MultipleSimultaneousCauses(e) -> UsesAxiom2ForStrength(e)',
      'Strength from many causes follows from the power of causes.',
    ),
  ],
  E5p9: [
    fol(
      'EmotionFromManyCauses(e) → LessHarmful(e) ∧ LessSubjection(e)',
      'forall e: EmotionFromManyCauses(e) -> (LessHurtful(e) & LessSubjectToEachCause(e))',
      'Distributed emotions harm and enslave less than focused ones.',
    ),
  ],
  E5p10: [
    fol(
      '¬ContraryEmotions(m) → CanOrderBodyModsIntellectually(m)',
      'forall m: Mind(m) & NoContraryPassions(m) -> OrdersBodyByIntellect(m)',
      'When unhindered by contrary passions, we can order bodily images intellectually.',
    ),
  ],
  E5p10s1: [
    fol(
      'OrdersBodyByIntellect(m) → ResistsEvilEmotions(m)',
      'forall m: OrdersBodyByIntellect(m) -> HarderToStirEvilPassions(m)',
      'Right ordering of images protects against troublesome emotions.',
    ),
  ],
  E5p11: [
    fol(
      'MoreObjectsReferred(image) → MoreFrequentAndDominant(image)',
      'forall i: RefersToMany(i) -> (MoreFrequent(i) & OccupiesMind(i))',
      'Images tied to many objects recur more and fill the mind.',
    ),
  ],
  E5p12: [
    fol(
      'ClearIdeas(x) → EasierAssociationOfImages(x)',
      'forall x: ClearDistinctIdeas(x) -> ImagesAssociateMoreEasilyWith(x)',
      'Images link more easily to clearly understood things.',
    ),
  ],
  E5p13: [
    fol(
      'MoreImageAssociations(i) → GreaterVividness(i)',
      'forall i: ManyAssociations(i) -> MoreVivid(i)',
      'An image grows vivid as its associations multiply.',
    ),
  ],
  E5p14: [
    fol(
      'MindOf(m,b) → CanReferAllImagesToGod(m)',
      'forall m forall b: MindOf(m, b) -> CanReferImagesToIdeaOfGod(m)',
      'The mind can relate every bodily image to the idea of God.',
    ),
  ],
  E5p15: [
    fol(
      'UnderstandsSelfClearly(m) → LovesGod(m) ∧ Degree ∝ SelfUnderstanding(m)',
      'forall m: ClearUnderstandingOfSelf(m) -> (LovesGod(m) & LoveIntensity(m, God) ~ UnderstandingSelf(m))',
      'Clear knowledge of self and emotions yields proportional love of God.',
    ),
  ],
  E5p16: [
    fol(
      'LovesGod(m) ∧ FromUnderstanding(m) → ChiefEmotion(m)',
      'forall m: LoveOfGodFromUnderstanding(m) -> DominantAffect(m)',
      'The intellectual love of God holds first place in the mind.',
    ),
  ],
  E5p17: [
    fol(
      '¬Passion(God) ∧ ¬(Pleasure(God) ∨ Pain(God))',
      '~Passion(God) & ~(Pleasure(God) | Pain(God))',
      'All ideas in God are adequate; God is impassive.',
    ),
  ],
  E5p17c1: [
    fol(
      '¬(Loves(God,x) ∨ Hates(God,x))',
      'forall x: ~(Love(God, x) | Hate(God, x))',
      'Strictly speaking God neither loves nor hates as passions.',
    ),
  ],
  E5p18: [
    fol(
      '∀m ¬Hate(m,God)',
      'forall m: Mind(m) -> ~Hate(m, God)',
      'No one can hate God.',
    ),
  ],
  E5p18c1: [
    fol(
      'Love(m,God) → ¬TurnsToHate(m,God)',
      'forall m: Love(m, God) -> ~CanTransformToHate(m, God)',
      'Love of God cannot be converted into hate.',
    ),
  ],
  E5p18s1: [
    fol(
      'UnderstandsGodAsCauseOfAll(m) → UnderstandsPainNecessarily(m)',
      'forall m: UnderstandsGodAsCause(m) -> RegardsPainAsNecessary(m)',
      'Viewing God as necessary cause removes grounds for hatred.',
    ),
  ],
  E5p19: [
    fol(
      'LovesGod(m) → ¬DesiresReciprocalLove(m)',
      'forall m: Love(m, God) -> ~Desires(GodLoves(m))',
      'One who loves God does not seek God’s love in return.',
    ),
  ],
  E5p20: [
    fol(
      'Love(m,God) ∧ OthersLoveGod → JoyWithoutEnvy(m)',
      'forall m forall n: (Love(m, God) & Love(n, God)) -> (JoyAtUnion(m, n) & ~Envy(m, n))',
      'Love of God is unstained by envy and grows as others share it.',
    ),
  ],
  E5p20s1: [
    fol(
      '¬∃e(ContraryToLoveOfGod(e))',
      'not exists e: ContraryToLoveOfGod(e)',
      'No contrary emotion can destroy the intellectual love of God.',
    ),
  ],

  // Eternity of the mind and higher knowledge
  E5p21: [
    fol(
      'Imagines(m,x) ∨ Remembers(m,x) → BodyEndures(m)',
      'forall m forall x: (Imagines(m, x) | Remembers(m, x)) -> BodyExists(m)',
      'Imagination and memory depend on the body’s endurance.',
    ),
  ],
  E5p22: [
    fol(
      '∃i(IdeaInGod(i) ∧ ExpressesEssenceEternally(i,HumanBody))',
      'exists i: IdeaInGod(i) & ExpressesEssenceEternally(i, HumanBody)',
      'In God there is an eternal idea of each human body’s essence.',
    ),
  ],
  E5p23: [
    fol(
      'Mind(m) → ∃p(EternalPartOfMind(m,p))',
      'forall m: Mind(m) -> exists p: EternalPartOfMind(m, p)',
      'Something of the human mind remains eternal when the body perishes.',
    ),
  ],
  E5p23s1: [
    fol(
      'EternalIdeaOfBody(i,m) → ModeOfThinking(i) ∧ InMindEssence(i,m)',
      'forall i forall m: EternalIdeaOfBody(i, m) -> (ModeOfThinking(i) & BelongsToEssence(i, m))',
      'The eternal idea of the body is a thinking mode belonging to the mind’s essence.',
    ),
  ],
  E5p24: [
    fol(
      'UnderstandsMoreParticulars(m) → UnderstandsGodMore(m)',
      'forall m: UnderstandsManyParticulars(m) -> IncreasesKnowledgeOfGod(m)',
      'Understanding particulars increases understanding of God.',
    ),
  ],
  E5p25: [
    fol(
      'HighestVirtue(m) ↔ StrivesForThirdKindKnowledge(m)',
      'forall m: HighestVirtue(m) <-> EndeavourThirdKnowledge(m)',
      'The supreme endeavour and virtue is to grasp things by the third kind of knowledge.',
    ),
  ],
  E5p26: [
    fol(
      'MoreCapableThirdKnowledge(m) → GreaterDesireForThirdKnowledge(m)',
      'forall m: CapabilityThirdKnowledge(m) -> DesireThirdKnowledge(m)',
      'Ability for intuitive knowledge breeds desire for it.',
    ),
  ],
  E5p27: [
    fol(
      'ThirdKindKnowledge(m) → HighestAcquiescence(m)',
      'forall m: UsesThirdKindKnowledge(m) -> HighestAcquiescence(m)',
      'The third kind of knowledge yields maximal mental acquiescence.',
    ),
  ],
  E5p28: [
    fol(
      'DesireThirdKnowledge(m) → ArisesFromSecondKnowledge(m)',
      'forall m: DesireThirdKnowledge(m) -> OriginatesFromSecondKind(m)',
      'The drive toward intuitive knowledge springs from rational (second kind) knowledge.',
    ),
  ],
  E5p29: [
    fol(
      'UnderstandsUnderEternity(m,x) → NotViaPresentBody(x)',
      'forall m forall x: UnderstandsUnderEternity(m, x) -> ~DependsOnPresentBody(x)',
      'Eternal understanding is not derived from imagining present bodily existence.',
    ),
  ],
  E5p29s1: [
    fol(
      'ConceivesTemporal(x) ∨ ConceivesEternal(x)',
      'forall x: ConceivesAsTemporal(x) | ConceivesAsEternal(x)',
      'We conceive things either temporally or as contained in God eternally.',
    ),
  ],
  E5p30: [
    fol(
      'KnowsSelfUnderEternity(m) → KnowsInGod(m)',
      'forall m: KnowsSelfUnderEternity(m) -> (KnowsGod(m) & KnowsBeingInGod(m))',
      'Knowing self and body under eternity entails knowing God and our being in God.',
    ),
  ],
  E5p31: [
    fol(
      'ThirdKindKnowledge(m) → CausedByMindAsEternal(m)',
      'forall m: ThirdKindKnowledge(m) -> FormalCauseIsEternalMind(m)',
      'The mind insofar as eternal formally causes intuitive knowledge.',
    ),
  ],
  E5p31s1: [
    fol(
      'MoreThirdKnowledge(m) → GreaterSelfAndGodConsciousness(m)',
      'forall m: ExpandsThirdKnowledge(m) -> HeightensAwarenessOfSelfAndGod(m)',
      'Growth in intuitive knowledge heightens awareness of self and God.',
    ),
  ],
  E5p32: [
    fol(
      'UnderstandsByThirdKind(m,x) → DelightWithIdeaOfGodAsCause(m,x)',
      'forall m forall x: UnderstandsByThirdKind(m, x) -> (PleasureFrom(m, x) & IdeaOfGodAsCause(m, x))',
      'Third-kind understanding yields delight accompanied by God as cause.',
    ),
  ],
  E5p32c1: [
    fol(
      'ThirdKindKnowledge(m) → IntellectualLoveOfGod(m)',
      'forall m: ThirdKindKnowledge(m) -> IntellectualLoveOfGod(m)',
      'The intellectual love of God necessarily flows from intuitive knowledge.',
    ),
  ],
  E5p33: [
    fol(
      'IntellectualLoveOfGod(m) → Eternal(m)',
      'forall m: IntellectualLoveOfGod(m) -> EternalLove(m)',
      'The intellectual love of God is eternal.',
    ),
  ],
  E5p33s1: [
    fol(
      'EternalIntellectualLove(m) → PossessesAllPerfectionsOfLove(m)',
      'forall m: EternalIntellectualLove(m) -> FullPerfectionAsLove(m)',
      'Though beginningless, intellectual love retains the character of love.',
    ),
  ],
  E5p34: [
    fol(
      'PassionEmotionsAffect(m) → OnlyWhileBodyEndures(m)',
      'forall m: PassionEmotionsAffect(m) -> BodyExists(m)',
      'Passional emotions touch the mind only while the body lasts.',
    ),
  ],
  E5p34c1: [
    fol(
      'EternalLove(m) ↔ IntellectualLoveOfGod(m)',
      'forall m: EternalLove(m) <-> IntellectualLoveOfGod(m)',
      'Only intellectual love is eternal.',
    ),
  ],
  E5p34s1: [
    fol(
      '∀p(CommonOpinion(p) → Confuses(p,Eternity,Duration))',
      'forall p: CommonOpinion(p) -> Confuses(p, Eternity, Duration)',
      'People mistakenly treat eternity as endless duration tied to imagination.',
    ),
  ],
  E5p35: [
    fol(
      'Love(God,God) ∧ IntellectualLove(God,God) ∧ Infinite(Love(God,God))',
      'IntellectualLove(God, God) & Infinite(IntellectualLove(God, God))',
      'God loves himself with infinite intellectual love.',
    ),
  ],
  E5p36: [
    fol(
      'IntellectualLoveOfMindForGod(m) = Restriction(IntellectualLove(God,God),m)',
      'forall m: IntellectualLoveOfGod(m) = RestrictSelfLoveOfGodToEssence(m)',
      'The mind’s intellectual love of God is the very self-love of God expressed through human essence.',
    ),
  ],
  E5p36c1: [
    fol(
      'SelfLoveOfGod → LoveForHumans',
      'SelfLoveOfGod -> forall m: Love(God, m)',
      'God’s self-love entails love for humans; our love for God and God’s for us coincide.',
    ),
  ],
  E5p36s1: [
    fol(
      'Blessedness(m) ↔ ConstantEternalLoveOfGod(m)',
      'forall m: Blessed(m) <-> ConstantEternalLoveOfGod(m)',
      'Salvation and freedom consist in enduring intellectual love of God.',
    ),
  ],
  E5p37: [
    fol(
      '¬∃x(ContraryTo(IntellectualLoveOfGod,x))',
      'not exists x: ContraryTo(IntellectualLoveOfGod, x)',
      'Nothing in nature opposes or removes the intellectual love of God.',
    ),
  ],
  E5p37s1: [
    fol(
      '∀x(TemporalThing(x) → ContrarietyApplies(x))',
      'forall x: TemporalThing(x) -> ContrarietyApplies(x)',
      'Contraries apply to temporal particulars, not to eternal love.',
    ),
  ],
  E5p38: [
    fol(
      'KnowledgeSecondOrThirdKind(m) ↑ → (FewerEvilEmotions(m) ∧ LessFearOfDeath(m))',
      'forall m: IncreasesSecondThirdKnowledge(m) -> (DecreasesEvilPassions(m) & LessFearOfDeath(m))',
      'Advancing in higher knowledge reduces evil passions and fear of death.',
    ),
  ],
  E5p38s1: [
    fol(
      'ClearMind(m) → DeathLessHurtful(m)',
      'forall m: ClearUnderstandingOfLife(m) -> DeathSeenAsMinor(m)',
      'The clearer the mind, the less harmful death appears.',
    ),
  ],
  E5p39: [
    fol(
      'BodyWithManyActivities(b) → MindWithGreaterEternalPart(m)',
      'forall b forall m: (Body(b) & MindOf(m, b) & CapableOfManyActivities(b)) -> LargerEternalMindPortion(m)',
      'A body fit for many activities corresponds to a mind largely eternal.',
    ),
  ],
  E5p39s1: [
    fol(
      'HumanBodiesCanReachGreatCapacity',
      'exists b: HumanBody(b) & CapableOfGreatestActivities(b)',
      'Human bodies can attain very high powers of activity.',
    ),
  ],
  E5p40: [
    fol(
      'MorePerfection(x) ↔ (MoreActive(x) ∧ LessPassive(x))',
      'forall x: Perfection(x) <-> (ActivityLevel(x) - PassivityLevel(x))',
      'Perfection rises with activity and declines with passivity.',
    ),
  ],
  E5p40c1: [
    fol(
      'EternalPartOfMind(m,p) → MorePerfectThanTemporal(m)',
      'forall m forall p: EternalPartOfMind(m, p) -> MorePerfectThanTemporalMind(m)',
      'Whatever of the mind endures eternally is the most perfect part.',
    ),
  ],
  E5p40s1: [
    fol(
      'PracticesContemplation(m) → IncreasesEternalMind(m)',
      'forall m: CultivatesUnderstanding(m) -> GrowsEternalMindPortion(m)',
      'Cultivating understanding enlarges the enduring part of mind.',
    ),
  ],
  E5p41: [
    fol(
      '∀m(Pious(m) → PracticesFromReason(m) ∧ ValuesPietyWithoutImmortality(m))',
      'forall m: Pious(m) -> (PracticesFromReason(m) & ValuesPietyWithoutImmortality(m))',
      'Piety and virtue remain primary even without knowing the mind is eternal.',
    ),
  ],
  E5p41s1: [
    fol(
      'MultitudeThinksLustIsFreedom',
      'forall p: Multitude(p) -> ThinksFreedomIsLust(p)',
      'Common people mistake obedience to passions for freedom.',
    ),
  ],
  E5p42: [
    fol(
      'Blessedness = Virtue ∧ JoyEnablesSelfControl',
      'forall m: Blessed(m) <-> Virtuous(m) & JoyEmpowersControl(m)',
      'Blessedness is virtue itself; rejoicing empowers mastery of lusts.',
    ),
  ],
  E5p42s1: [
    fol(
      'WiseManGreatPower(m)',
      'forall m: Wise(m) -> GreatPower(m)',
      'The wise person wields great power and surpasses the ignorant.',
    ),
  ],
};
