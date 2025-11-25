export type LogicEncoding = {
  system: string;
  version: string;
  display: string;
  encoding_format: string;
  encoding: string;
  notes?: string;
};

export type Dependency = {
  id: string;
  role: string;
};

export type ProofInfo = {
  status: 'none' | 'sketch' | 'formal';
  sketch?: string;
  formal?: {
    format: string;
    encoding: string;
  };
};

export type EthicsItem = {
  id: string;
  ref: string;
  part: 1 | 2 | 3 | 4 | 5;
  kind:
    | 'definition'
    | 'axiom'
    | 'postulate'
    | 'proposition'
    | 'scholium'
    | 'corollary'
    | 'lemma';
  label: string;
  order: number;
  text: {
    original_language: string;
    original: string;
    translation: string;
  };
  concepts: string[];
  logic: LogicEncoding[];
  dependencies: {
    uses: Dependency[];
  };
  proof: ProofInfo;
  meta: {
    status: 'draft' | 'reviewed';
    contributors: string[];
    sources: string[];
  };
};

export type EthicsCorpus = EthicsItem[];
