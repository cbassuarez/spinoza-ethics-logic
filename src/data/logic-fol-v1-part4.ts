import type { LogicEncoding } from './types.js';

export const LOGIC_FOL_V1_PART4: Record<string, LogicEncoding[]> = {
  E4Ax1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(JudgesGood(p,x) → Desires(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: JudgesGood(p, x) -> Desires(p, x)',
      notes: 'Whatever we judge to be good, we consequently desire.',
    },
  ],
  E4Ax2: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(JudgesEvil(p,x) → Averses(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: JudgesEvil(p, x) -> Averses(p, x)',
      notes: 'Whatever we judge to be evil, we strive to avoid.',
    },
  ],
  E4Ax3: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(ImaginesFutureGood(p,x) → Desires(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: ImaginesFutureGood(p, x) -> Desires(p, x)',
      notes: 'Anticipated good arouses desire.',
    },
  ],
  E4Ax4: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(ImaginesFutureEvil(p,x) → Averses(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: ImaginesFutureEvil(p, x) -> Averses(p, x)',
      notes: 'Imagined future evil arouses aversion.',
    },
  ],
  E4Ax5: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x∃y(JudgesGood(p,x) ∧ Causes(x,y) → Loves(p,y))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x exists y: (JudgesGood(p, x) & Causes(x, y)) -> Loves(p, y)',
      notes: 'We love the cause of what we judge good.',
    },
  ],
  E4Ax6: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x∃y(JudgesEvil(p,x) ∧ Causes(x,y) → Hates(p,y))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x exists y: (JudgesEvil(p, x) & Causes(x, y)) -> Hates(p, y)',
      notes: 'We hate the cause of what we judge evil.',
    },
  ],
  E4Ax7: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Loves(p,x) → SeeksPresence(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: Loves(p, x) -> SeeksPresence(p, x)',
      notes: 'Love tends toward union with its object.',
    },
  ],
  E4Ax8: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Hates(p,x) → SeeksAbsence(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: Hates(p, x) -> SeeksAbsence(p, x)',
      notes: 'Hate tends toward the removal of its object.',
    },
  ],
  E4Ax9: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Love(p,x) → JoinsJoy(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: Love(p, x) -> JoinsJoy(p, x)',
      notes: 'Love joins the lover to joy with the loved object.',
    },
  ],
  E4Ax10: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Hate(p,x) → JoinsSadness(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: Hate(p, x) -> JoinsSadness(p, x)',
      notes: 'Hate joins the hater to sadness at the hated object.',
    },
  ],
  E4Ax11: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(ImaginesBelovedLost(p,x) → FearsLoss(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: ImaginesBelovedLost(p, x) -> FearsLoss(p, x)',
      notes: 'Imagining the loss of what we love produces fear.',
    },
  ],
  E4Ax12: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(ImaginesHatedRemoved(p,x) → HopesRelief(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: ImaginesHatedRemoved(p, x) -> HopesRelief(p, x)',
      notes: 'Imagining the removal of what we hate produces hope.',
    },
  ],
  E4Ax13: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Love(p,x) ∧ Perishes(x) → Grief(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: (Love(p, x) & Perishes(x)) -> Grief(p, x)',
      notes: 'The destruction of what is loved causes grief.',
    },
  ],
  E4Ax14: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Hate(p,x) ∧ Perishes(x) → Joy(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: (Hate(p, x) & Perishes(x)) -> Joy(p, x)',
      notes: 'The destruction of what is hated causes joy.',
    },
  ],
  E4Ax15: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Love(p,x) ∧ AnotherLoves(p,x) → Favor(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: (Love(p, x) & AnotherLoves(p, x)) -> Favor(p, x)',
      notes: 'We favor those who share our loves.',
    },
  ],
  E4Ax16: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Hate(p,x) ∧ AnotherHates(p,x) → Alliance(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: (Hate(p, x) & AnotherHates(p, x)) -> Alliance(p, x)',
      notes: 'We ally with those who share our hates.',
    },
  ],
  E4Ax17: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Love(p,x) ∧ AnotherHates(p,x) → Conflict(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: (Love(p, x) & AnotherHates(p, x)) -> Conflict(p, x)',
      notes: 'Opposed affections toward the same object generate conflict.',
    },
  ],
  E4Ax18: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Love(p,x) ∧ PerceivedGoodness(x) → Exaltation(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: (Love(p, x) & PerceivedGoodness(x)) -> Exaltation(p, x)',
      notes: 'Love combined with perceived excellence raises joyful admiration.',
    },
  ],
  E4Ax19: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Hate(p,x) ∧ PerceivedPower(x) → Humiliation(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: (Hate(p, x) & PerceivedPower(x)) -> Humiliation(p, x)',
      notes: 'Hate directed at something powerful produces humiliation.',
    },
  ],
  E4Ax20: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(LovesSelf(p) → DesiresRespect(p))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: LovesSelf(p) -> DesiresRespect(p)',
      notes: 'Self-love seeks esteem from others.',
    },
  ],
  E4Ax21: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p(LovesSelf(p) → AversesContempt(p))',
      encoding_format: 'custom-fol',
      encoding: 'forall p: LovesSelf(p) -> AversesContempt(p)',
      notes: 'Self-love recoils from contempt.',
    },
  ],
  E4Ax22: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(SeesAnotherLove(x,p) → Reciprocates(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: SeesAnotherLove(x, p) -> Reciprocates(p, x)',
      notes: 'Perceived love tends to be reciprocated.',
    },
  ],
  E4Ax23: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(SeesAnotherHate(x,p) → ReturnsHate(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: SeesAnotherHate(x, p) -> ReturnsHate(p, x)',
      notes: 'Perceived hatred tends to be returned.',
    },
  ],
  E4Ax24: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(SeesGratitude(x,p) → DesiresBenefit(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: SeesGratitude(x, p) -> DesiresBenefit(p, x)',
      notes: 'Gratitude encourages beneficence.',
    },
  ],
  E4Ax25: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(SeesIngratitude(x,p) → WithholdsBenefit(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: SeesIngratitude(x, p) -> WithholdsBenefit(p, x)',
      notes: 'Ingratitude dampens beneficence.',
    },
  ],
  E4Ax26: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Hopes(p,x) → PerceivesFutureGood(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: Hopes(p, x) -> PerceivesFutureGood(p, x)',
      notes: 'Hope involves perception of future good.',
    },
  ],
  E4Ax27: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Fears(p,x) → PerceivesFutureEvil(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: Fears(p, x) -> PerceivesFutureEvil(p, x)',
      notes: 'Fear involves perception of future evil.',
    },
  ],
  E4Ax28: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(Hopes(p,x) ∧ Fears(p,x) → Vacillation(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: (Hopes(p, x) & Fears(p, x)) -> Vacillation(p, x)',
      notes: 'Mixed hope and fear produces vacillation of mind.',
    },
  ],
  E4Ax29: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(RecollectsPastGood(p,x) → JoyfulMemory(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: RecollectsPastGood(p, x) -> JoyfulMemory(p, x)',
      notes: 'Remembered goods produce joy.',
    },
  ],
  E4Ax30: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(RecollectsPastEvil(p,x) → SadMemory(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: RecollectsPastEvil(p, x) -> SadMemory(p, x)',
      notes: 'Remembered evils produce sadness.',
    },
  ],
  E4Ax31: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(SadMemory(p,x) → DesiresAvoidance(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: SadMemory(p, x) -> DesiresAvoidance(p, x)',
      notes: 'Sad recollections reinforce aversion.',
    },
  ],
  E4Ax32: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀x(JoyfulMemory(p,x) → DesiresRenewal(p,x))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall x: JoyfulMemory(p, x) -> DesiresRenewal(p, x)',
      notes: 'Joyful recollections reinforce desire to renew the experience.',
    },
  ],
  E4p1: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀x(Minds(x) → InadequateIdeas(x) → Passive(x))',
      encoding_format: 'custom-fol',
      encoding: 'forall x: Minds(x) -> InadequateIdeas(x) -> Passive(x)',
      notes: 'Human minds begin with inadequate ideas and so are passive in part.',
    },
  ],
  E4p18: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p(Rational(p) → Pursues(CommonGood(p)))',
      encoding_format: 'custom-fol',
      encoding: 'forall p: Rational(p) -> Pursues(CommonGood(p))',
      notes: 'A rational person seeks the common good as part of self-preservation.',
    },
  ],
  E4p36: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p∀q(Rational(p) ∧ Rational(q) → MutualAid(p,q))',
      encoding_format: 'custom-fol',
      encoding: 'forall p forall q: (Rational(p) & Rational(q)) -> MutualAid(p, q)',
      notes: 'Rational agents mutually assist one another.',
    },
  ],
  E4p37: [
    {
      system: 'FOL',
      version: 'v1',
      display: '∀p(Virtue(p) ↔ StrivingAccordingToReason(p))',
      encoding_format: 'custom-fol',
      encoding: 'forall p: Virtue(p) <-> StrivingAccordingToReason(p)',
      notes: 'Virtue is the power of acting according to reason.',
    },
  ],
};
