import joplin from "api";

async function main() {
  const panel = await joplin.views.panels.create("wordCountPanel");

  await joplin.views.panels.setHtml(
    panel,
    `
    <style>
      :root {
        --panel-bg: var(--joplin-background-color);
        --text-color: var(--joplin-color);
        --font-family: var(--joplin-font-family);
      }
      #template-container {
        background: var(--panel-bg);
        padding: 1rem;
        font-family: var(--font-family);
        color: var(--text-color);
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid var(--joplin-divider-color);
      }
      #template-container div {
        margin-bottom: 0.5rem;
      }
    </style>
    <div id="template-container">
      <div id="full">Full Document: 0 words | 0 chars (0 no spaces)</div>
      <div id="sel">Selection: 0 words | 0 chars (0 no spaces)</div>
    </div>
  `
  );

  await joplin.views.panels.addScript(panel, "./assets/index.js");

  let isReady = false;

  await joplin.views.panels.onMessage(panel, async (msg: any) => {
    if (msg.id === "webviewLog") {
      const { level, args } = msg;
      (console as any)[level]("🌐 Webview:", ...args);
      return;
    }
    if (msg.id === "ready") {
      isReady = true;
      await updateCounts();
      await joplin.workspace.onNoteChange(updateCounts);
      await joplin.workspace.onNoteSelectionChange(updateCounts);
    }
  });

  async function updateCounts() {
    if (!isReady) return;
    const note = await joplin.workspace.selectedNote();
    if (!note) return;

    let selText = "";
    try {
      selText = (await joplin.commands.execute("selectedText")) as string;
    } catch {
      selText = "";
    }

    const full = count(note.body);
    const sel = count(selText);

    await joplin.views.panels.postMessage(panel, {
      id: "update",
      full,
      sel,
    });
  }
}

function count(text: string) {
  return {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSp: text.replace(/\s/g, "").length,
    paragraphs: text.split(/\n{2,}/).filter((p) => p.trim()).length,
    lines: text.split("\n").length,
  };
}

joplin.plugins.register({ onStart: main });
