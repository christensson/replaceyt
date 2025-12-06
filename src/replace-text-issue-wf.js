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
    const projectReplacementsJson = ctx.project.extensionProperties.replacements;
    const replacements = replacementsJson ? JSON.parse(replacementsJson) : [];
    const projectReplacements = projectReplacementsJson ? JSON.parse(projectReplacementsJson) : [];
    replacements.push(...projectReplacements);
    console.log("Replacements", replacements);
    ctx.issue.description = utils.replaceIssueText(ctx.issue.description, replacements, true);
  },
  requirements: {}
});