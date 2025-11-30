exports.httpHandler = {
  endpoints: [
    {
      method: 'GET',
      path: 'globalConfig',
      handle: function handle(ctx) {
        const replacements = JSON.parse(ctx.globalStorage.extensionProperties.replacements);
        ctx.response.json({ replacements: replacements });
      }
    },
    {
      method: 'POST',
      path: 'globalConfig',
      handle: function handle(ctx) {
        const body = JSON.parse(ctx.request.body);
        ctx.globalStorage.extensionProperties.replacements = JSON.stringify(body.replacements);
        ctx.response.json({ success: true });
      }
    }
  ]
};
