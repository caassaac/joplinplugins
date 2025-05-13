import { autocompletion, CompletionContext } from '@codemirror/autocomplete';

export default (context: { postMessage: (msg: string) => Promise<string[]> }) => ({
  plugin: (cmWrapper: any) => {
    if (!cmWrapper.cm6) return;
    cmWrapper.addExtension(autocompletion({
      override: [async (ctx: CompletionContext) => {
        const m = ctx.matchBefore(/#[^#\s]*/);
        if (!m) return null;

        // Fetch live tags from main plugin
        const tags = await context.postMessage('getTags');

        const from = m.from + 1;
        const query = m.text.slice(1).toLowerCase();
        const options = tags
          .filter(t => t.toLowerCase().startsWith(query))
          .map(t => ({ label: t, type: 'tag' }));
        return { from, options };
      }]
    }));
  }
});
