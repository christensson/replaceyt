exports.replaceText = (text, replacements) => {
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
}