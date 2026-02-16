import { v4 as uuidv4 } from "uuid";
import type { Replacement } from "../../replace-text";

export const defaultReplacement: Replacement = {
  id: "",
  name: "",
  pattern: "",
  replacement: "",
  patternIsRegex: false,
  ignoreCodeBlocks: true,
  ignoreLinks: true,
  ignoreInlineCode: false,
  enabled: false,
  enabledForArticles: true,
  enabledForIssues: true,
};

export const initializeReplacement = (item: Partial<Replacement>, name: string): Replacement => {
  const newItem: Replacement = { ...defaultReplacement, ...item };
  if (newItem.id == null || newItem.id === "") {
    newItem.id = uuidv4();
  }
  if (newItem.name == null || newItem.name === "") {
    newItem.name = name;
  }
  return newItem;
};
