import { corpus } from '../data';
import type { EthicsItem } from '../data/types';

type CorpusItem = (typeof corpus)[number];
export type EthicsPartId = CorpusItem['part'];

type PartMeta = {
  label: string;
  subtitle: string;
  description: string;
  order: number;
};

export const PART_METADATA: Record<EthicsPartId, PartMeta> = {
  1: {
    label: 'Part I',
    subtitle: 'Of God',
    description:
      "Spinoza’s metaphysical foundation: definitions and axioms about substance, attributes, and God or Nature.",
    order: 1,
  },
  2: {
    label: 'Part II',
    subtitle: 'Of the Nature and Origin of the Mind',
    description:
      'The structure of the mind, ideas, and their relation to the body, perception, and knowledge.',
    order: 2,
  },
  3: {
    label: 'Part III',
    subtitle: 'Of the Origin and Nature of the Emotions',
    description:
      'An analysis of affects and emotions, their causes, and how they arise from our striving (conatus).',
    order: 3,
  },
  4: {
    label: 'Part IV',
    subtitle: 'Of Human Bondage, or the Strength of the Emotions',
    description:
      'How inadequate ideas and passions bind us, and what it means to be subject to external causes.',
    order: 4,
  },
  5: {
    label: 'Part V',
    subtitle: 'Of the Power of the Intellect, or of Human Liberty',
    description:
      'The role of reason and intuitive knowledge in transforming affects and realizing human freedom.',
    order: 5,
  },
};

const anyNonEmptyString = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

export function hasProof(item: CorpusItem): boolean {
  const proof = (item as any).proof as EthicsItem['proof'] | undefined;
  if (proof) {
    if (proof.status && proof.status !== 'none') return true;
    if (anyNonEmptyString(proof.sketch)) return true;
    if (proof.formal && (anyNonEmptyString(proof.formal.encoding) || anyNonEmptyString(proof.formal.format))) return true;
  }

  const sketch = (item as any).sketch;
  const sketchLatex = (item as any).sketchLatex;
  const proofLatex = (item as any).proofLatex;
  const proofs = (item as any).proofs;

  if (anyNonEmptyString(sketch) || anyNonEmptyString(sketchLatex) || anyNonEmptyString(proofLatex)) {
    return true;
  }

  if (Array.isArray(proofs) && proofs.length > 0) {
    return true;
  }

  return false;
}

export function hasLogic(item: CorpusItem): boolean {
  const logic = (item as any).logic;
  if (!logic) return false;
  if (Array.isArray(logic)) {
    return logic.length > 0;
  }
  if (typeof logic === 'string') {
    return logic.trim().length > 0;
  }
  return false;
}

export type PartStats = {
  partId: EthicsPartId;
  totalItems: number;
  logicItems: number;
  proofItems: number;
  proofCoverage: number;
};

export function computePartStats(): PartStats[] {
  const grouped = new Map<EthicsPartId, CorpusItem[]>();

  for (const item of corpus) {
    const partId = item.part as EthicsPartId;
    if (!grouped.has(partId)) grouped.set(partId, []);
    grouped.get(partId)!.push(item);
  }

  const stats: PartStats[] = [];

  for (const [partId, items] of grouped.entries()) {
    const totalItems = items.length;
    const logicItems = items.filter(hasLogic).length;
    const proofItems = items.filter(hasProof).length;
    const proofCoverage = totalItems === 0 ? 0 : proofItems / totalItems;

    stats.push({ partId, totalItems, logicItems, proofItems, proofCoverage });
  }

  stats.sort((a, b) => (PART_METADATA[a.partId]?.order ?? 0) - (PART_METADATA[b.partId]?.order ?? 0));

  return stats;
}

export function getPartLabel(partId: EthicsPartId | string | number | undefined): string {
  if (partId === undefined) return 'Part';
  const normalized = Number(partId) as EthicsPartId;
  return PART_METADATA[normalized]?.label ?? `Part ${normalized}`;
}

export function getPartSubtitle(partId: EthicsPartId | string | number | undefined): string | undefined {
  if (partId === undefined) return undefined;
  const normalized = Number(partId) as EthicsPartId;
  return PART_METADATA[normalized]?.subtitle;
}

export function getPartDescription(partId: EthicsPartId | string | number | undefined): string | undefined {
  if (partId === undefined) return undefined;
  const normalized = Number(partId) as EthicsPartId;
  return PART_METADATA[normalized]?.description;
}
