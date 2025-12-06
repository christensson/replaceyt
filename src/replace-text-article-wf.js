/* YouTrack Workflow API example */
var entities = require('@jetbrains/youtrack-scripting-api/entities');
const utils = require('./replace-text');

exports.rule = entities.Article.onChange({
  title: 'Replace article text according to configuration',
  guard: function(ctx) {
    return ctx.article.content;
  },
  action: function(ctx) {
    const replacementsJson = ctx.globalStorage.extensionProperties.replacements;
    const projectReplacementsJson = ctx.project.extensionProperties.replacements;
    const replacements = replacementsJson ? JSON.parse(replacementsJson) : [];
    const projectReplacements = projectReplacementsJson ? JSON.parse(projectReplacementsJson) : [];
    replacements.push(...projectReplacements);
    console.log("Replacements", replacements);
    ctx.article.content = utils.replaceArticleText(ctx.article.content, replacements, true);
  },
  requirements: {}
});