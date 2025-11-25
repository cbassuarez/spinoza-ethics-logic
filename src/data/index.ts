import type { EthicsCorpus, EthicsItem } from './types';
import corpusData from './ethics-sample.json';

export const corpus: EthicsCorpus = corpusData as EthicsCorpus;

const itemsById = new Map<string, EthicsItem>(corpus.map((item) => [item.id, item]));

export function getItemById(id: string): EthicsItem | undefined {
  return itemsById.get(id);
}

export function getItemsByPart(part: number): EthicsItem[] {
  return corpus.filter((item) => item.part === part);
}

export function findDependents(id: string): EthicsItem[] {
  return corpus.filter((item) => item.dependencies.uses.some((dep) => dep.id === id));
}
