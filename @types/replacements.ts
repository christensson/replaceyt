export type Replacement = {
  id: string;
  pattern: string;
  replacement: string;
  patternIsRegex: boolean;
  ignoreCodeBlocks: boolean;
  ignoreLinks: boolean;
};

export type Replacements = Replacement[];
