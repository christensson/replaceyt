exports.httpHandler = {
  endpoints: [
    {
      method: 'GET',
      path: 'globalConfig',
      handle: function handle(ctx) {
        const props = ctx.globalStorage.extensionProperties;
        const replacements = JSON.parse(props.replacements) || [];
        const testInput = props.testInput || "";
        ctx.response.json({ replacements: replacements, testInput: testInput });
      }
    },
    {
      method: 'POST',
      path: 'globalConfig',
      handle: function handle(ctx) {
        const props = ctx.globalStorage.extensionProperties;
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
