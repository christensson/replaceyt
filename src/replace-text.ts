export type Replacement = {
  id: string;
  pattern: string;
  replacement: string;
  patternIsRegex: boolean;
  ignoreCodeBlocks: boolean;
  ignoreLinks: boolean;
  ignoreInlineCode: boolean;
  enabled: boolean;
  enabledForArticles: boolean;
  enabledForIssues: boolean;
};

export type Replacements = Replacement[];

type ProtectedRange = {
  start: number;
  end: number;
  type: "codeBlock" | "link" | "inlineCode";
};

const findProtectedRanges = (
  text: string,
  ignoreCodeBlocks: boolean,
  ignoreLinks: boolean,
  ignoreInlineCode: boolean
): ProtectedRange[] => {
  const ranges: ProtectedRange[] = [];

  if (ignoreCodeBlocks) {
    // Find all fenced code blocks
    const codeBlockRegex = /```[\s\S]*?```/g;
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      ranges.push({
        start: match.index,
        end: match.index + match[0].length,
        type: "codeBlock",
      });
    }
  }

  if (ignoreLinks) {
    // Find all markdown links [text](url) - we want to protect the text and url parts
    const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      const linkText = match[1];
      const linkUrl = match[2];
      const linkStart = match.index;

      // Protect [text] part: from '[' to ']'
      const textStart = linkStart + 1; // after '['
      const textEnd = textStart + linkText.length;

      ranges.push({
        start: textStart,
        end: textEnd,
        type: "link",
      });

      // Protect (url) part: from '(' to ')'
      const urlStart = textEnd + 2; // after ']('
      const urlEnd = urlStart + linkUrl.length;

      ranges.push({
        start: urlStart,
        end: urlEnd,
        type: "link",
      });
    }
  }

  if (ignoreInlineCode) {
    // Find all inline code `text`
    const inlineCodeRegex = /`([^`]+)`/g;
    let match;
    while ((match = inlineCodeRegex.exec(text)) !== null) {
      const codeText = match[1];
      const codeStart = match.index + 1; // after first '`'
      const codeEnd = codeStart + codeText.length;

      ranges.push({
        start: codeStart,
        end: codeEnd,
        type: "inlineCode",
      });
    }
  }

  // Sort ranges by start position
  ranges.sort((a, b) => a.start - b.start);

  return ranges;
};

const isPositionProtected = (pos: number, ranges: ProtectedRange[]): boolean => {
  for (const range of ranges) {
    if (pos >= range.start && pos < range.end) {
      return true;
    }
  }
  return false;
};

const applyReplacementWithProtection = (
  text: string,
  item: Replacement,
  protectedRanges: ProtectedRange[]
): string => {
  let pattern: RegExp;
  if (item.patternIsRegex) {
    pattern = new RegExp(item.pattern, "g");
  } else {
    const escapedPattern = item.pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    pattern = new RegExp(escapedPattern, "g");
  }

  if (protectedRanges.length === 0) {
    // No protection needed, do simple replacement
    return text.replace(pattern, item.replacement);
  }

  // Find all matches
  let result = "";
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;

    // Check if any part of this match is within a protected range
    let isProtected = false;
    for (let i = matchStart; i < matchEnd; i++) {
      if (isPositionProtected(i, protectedRanges)) {
        isProtected = true;
        break;
      }
    }

    // Add text before this match
    result += text.substring(lastIndex, matchStart);

    if (isProtected) {
      // Keep the original match
      result += match[0];
    } else {
      // Apply the replacement by re-running replace on just this match
      // This naturally handles capture groups
      const singleMatchPattern = new RegExp(item.patternIsRegex ? item.pattern : pattern.source);
      result += match[0].replace(singleMatchPattern, item.replacement);
    }

    lastIndex = matchEnd;
  }

  // Add remaining text
  result += text.substring(lastIndex);

  return result;
};

export const replaceText = (
  text: string,
  replacements: Replacements,
  enabledOnly: boolean,
  kind: "article" | "issue" | "any"
): string => {
  if (!text) return text;

  let outputText = text;

  for (const item of replacements) {
    // Skip disabled items if enabled only.
    if (enabledOnly && !item.enabled) {
      continue;
    }

    if (kind === "article" && !item.enabledForArticles) {
      continue;
    }

    if (kind === "issue" && !item.enabledForIssues) {
      continue;
    }

    // Find protected ranges for this replacement
    const protectedRanges = findProtectedRanges(
      outputText,
      item.ignoreCodeBlocks,
      item.ignoreLinks,
      item.ignoreInlineCode
    );

    // Apply replacement with protection
    outputText = applyReplacementWithProtection(outputText, item, protectedRanges);
  }

  return outputText;
};

export const replaceIssueText = (
  text: string,
  replacements: Replacements,
  enabledOnly: boolean
): string => {
  return replaceText(text, replacements, enabledOnly, "issue");
};

export const replaceArticleText = (
  text: string,
  replacements: Replacements,
  enabledOnly: boolean
): string => {
  return replaceText(text, replacements, enabledOnly, "article");
};
