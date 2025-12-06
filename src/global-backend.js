exports.httpHandler = {
  endpoints: [
    {
      method: 'GET',
      path: 'globalConfig',
      handle: function handle(ctx) {
        const props = ctx.globalStorage.extensionProperties;
        if (props.replacements == null) {
          props.replacements = JSON.stringify([]);
        }
        if (props.testInput == null) {
          props.testInput = "";
        }
        let replacements = JSON.parse(props.replacements);
        if (replacements == null) {
          replacements = [];
        }
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
