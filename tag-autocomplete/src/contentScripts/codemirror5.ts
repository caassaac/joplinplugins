export default (context: { postMessage: Function }) => ({
  plugin: async (cm: any) => {
    if ((cm as any).cm6) return;
    cm.defineOption("tagSuggestions", false, () => {
      cm.on("inputRead", async (_cm: any, change: any) => {
        if (change.text[0] !== "#") return;
        const tags: string[] = await context.postMessage("getTags");
        (_cm as any).showHint({
          hint: () => ({
            from: _cm.getCursor(),
            to: _cm.getCursor(),
            list: tags.map((t) => ({ text: t })),
          }),
        });
      });
    });
    cm.setOption("tagSuggestions", true);
  },
});
