/* YouTrack Workflow API example */
var entities = require('@jetbrains/youtrack-scripting-api/entities');
const utils = require('./replace-text');

exports.rule = entities.Issue.onChange({
  title: 'Replace issue text according to configuration',
  guard: function(ctx) {
    return ctx.issue.isReported && ctx.issue.description;
  },
  action: function(ctx) {
    const replacementsJson = ctx.globalStorage.extensionProperties.replacements;
    const replacements = replacementsJson ? JSON.parse(replacementsJson) : [];
    console.log("Replacements", replacements);
    ctx.issue.description = utils.replaceText(ctx.issue.description, replacements);
  },
  requirements: {}
});