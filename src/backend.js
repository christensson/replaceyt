exports.httpHandler = {
  endpoints: [
    {
      scope: "project",
      method: 'GET',
      path: 'projectConfig',
      handle: function handle(ctx) {
        const props = ctx.project.extensionProperties;
        const globalProps = ctx.globalStorage.extensionProperties;
        const replacements = JSON.parse(props.replacements) || [];
        const globalReplacements = JSON.parse(globalProps.replacements) || [];
        const testInput = props.testInput || "";
        ctx.response.json({
          replacements: replacements,
          globalReplacements: globalReplacements,
          testInput: testInput
        });
      }
    },
    {
      scope: "project",
      method: 'POST',
      path: 'projectConfig',
      handle: function handle(ctx) {
        let props = ctx.project.extensionProperties;
        const body = JSON.parse(ctx.request.body);
        props.replacements = JSON.stringify(body.replacements);
        if (body.hasOwnProperty('testInput') && body.testInput !== undefined) {
          props.testInput = body.testInput;
        }
        ctx.response.json({ success: true });
      }
    }
  ]
};
