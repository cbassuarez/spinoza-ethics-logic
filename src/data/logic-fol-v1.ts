import type { LogicEncoding } from './types';

export const LOGIC_FOL_V1: Record<string, LogicEncoding[]> = {
  E1D1: [
    {
      system: 'FOL',
      version: 'v1',
      display: 'C(x) ↔ Ess(x)',
      encoding_format: 'meta-fol',
      encoding: 'C(x) <-> Ess(x)',
    },
  ],
};
