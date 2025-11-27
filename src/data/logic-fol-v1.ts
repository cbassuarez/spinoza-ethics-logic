import type { LogicEncoding } from './types.js';
import { LOGIC_FOL_V1_PART1, PREDICATE_LOGIC_CLUSTER_PART1_DEFS } from './logic-fol-v1-part1.js';
import { LOGIC_FOL_V1_PART2 } from './logic-fol-v1-part2.js';
import { LOGIC_FOL_V1_PART3 } from './logic-fol-v1-part3.js';
import { LOGIC_FOL_V1_PART4 } from './logic-fol-v1-part4.js';

export const LOGIC_FOL_V1: Record<string, LogicEncoding[]> = {
  ...LOGIC_FOL_V1_PART1,
  ...LOGIC_FOL_V1_PART2,
  ...LOGIC_FOL_V1_PART3,
  ...LOGIC_FOL_V1_PART4,
};

export { PREDICATE_LOGIC_CLUSTER_PART1_DEFS };
