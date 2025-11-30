exports.httpHandler = {
  endpoints: [
    {
      method: 'GET',
      path: 'globalConfig',
      handle: function handle(ctx) {
        const replacements = JSON.parse(ctx.globalStorage.extensionProperties.replacements);
        const testInput = ctx.globalStorage.extensionProperties.testInput || "";
        ctx.response.json({ replacements: replacements, testInput: testInput });
      }
    },
    {
      method: 'POST',
      path: 'globalConfig',
      handle: function handle(ctx) {
        const body = JSON.parse(ctx.request.body);
        ctx.globalStorage.extensionProperties.replacements = JSON.stringify(body.replacements);
        if (body.hasOwnProperty('testInput') && body.testInput !== undefined) {
          ctx.globalStorage.extensionProperties.testInput = body.testInput;
        }
        ctx.response.json({ success: true });
      }
    }
  ]
};
