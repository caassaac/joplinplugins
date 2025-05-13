import joplin from "api";
import { ContentScriptType } from "api/types";

async function fetchActiveTagTitles(): Promise<string[]> {
  const result = await joplin.data.get(["tags"], { fields: ["id", "title"] });
  const active: string[] = [];

  for (const tag of result.items as { id: string; title: string }[]) {
    const notes = await joplin.data.get(["tags", tag.id, "notes"], {
      limit: 1,
    });
    if ((notes.items as any[]).length > 0) active.push(tag.title);
  }

  return active;
}

joplin.plugins.register({
  onStart: async () => {
    await joplin.contentScripts.register(
      ContentScriptType.CodeMirrorPlugin,
      "tagSuggestionsCM6",
      "./contentScripts/codeMirror6.js"
    );
    await joplin.contentScripts.register(
      ContentScriptType.CodeMirrorPlugin,
      "tagSuggestionsCM5",
      "./contentScripts/codeMirror5.js"
    );

    joplin.contentScripts.onMessage("tagSuggestionsCM6", async (msg) => {
      if (msg === "getTags") return await fetchActiveTagTitles();
    });
    joplin.contentScripts.onMessage("tagSuggestionsCM5", async (msg) => {
      if (msg === "getTags") return await fetchActiveTagTitles();
    });
  },
});
