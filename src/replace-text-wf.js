/* YouTrack Workflow API example */
var entities = require('@jetbrains/youtrack-scripting-api/entities');

// Define list of [RegExp, replacement] tuples
var REPLACEMENTS = [
  [/[Ii]ssue!(\d+)/g, '[Issue!$1](https://github.com/christensson/issuedepyt/issues/$1)']
];

function replaceText(text) {
  if (!text) return text;
  for (const [search, replacement] of REPLACEMENTS) {
    text = text.replace(search, replacement);
  }
  return text;
}

exports.rule = entities.Issue.onChange({
  title: 'Replace text according to configuration',
  guard: function(ctx) {
    return ctx.issue.isReported && ctx.issue.description;
  },
  action: function(ctx) {
    console.log("Replacements", ctx.settings.replacements);
    ctx.issue.description = replaceText(ctx.issue.description);
  },
  requirements: {}
});