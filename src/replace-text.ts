export type Replacement = {
  id: string;
  pattern: string;
  replacement: string;
  patternIsRegex: boolean;
  ignoreCodeBlocks: boolean;
  ignoreLinks: boolean;
};

export type Replacements = Replacement[];

export const replaceText = (text: string, replacements: Replacements): string => {
  if (!text) return text;
  let outputText = text;
  for (const item of replacements) {
    if (item.patternIsRegex) {
      const pattern = new RegExp(item.pattern, "g");
      outputText = outputText.replace(pattern, item.replacement);
    } else {
      outputText = outputText.replace(item.pattern, item.replacement);
    }
  }
  return outputText;
};
