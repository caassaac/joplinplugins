import joplin from 'api';
import { ContentScriptType } from 'api/types';

joplin.plugins.register({
  onStart: async function () {

    const panel = await joplin.views.panels.create('quickNotebookPanel');

    await joplin.views.panels.setHtml(panel, `
      <div id="quick-notebook-container" style="
        position: absolute;
        bottom: 20px;
        right: 20px;
        z-index: 1000;">
        <button id="quick-notebook-btn" style="
          padding: 0.6em 1em;
          border-radius: 5px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          background: #4CAF50;
          color: white;
          border: none;
          cursor: pointer;">
          Quick Notebook
        </button>
      </div>
    `);


    await joplin.views.panels.addScript(panel, './webview/quickNotebook.js');


    await joplin.views.panels.show(panel);


    await joplin.views.panels.onMessage(panel, async (message: any) => {
      if (message.name === 'createQuick') {
        console.log('Handling createQuick message');

        const baseTitle = 'Quick Notebook';
        let notebookTitle = baseTitle;
        let index = 1;

        try {

          const allFolders = await joplin.data.get(['folders'], { fields: ['id', 'title'] });
          const existingTitles = allFolders.items.map((folder: any) => folder.title);


          while (existingTitles.includes(notebookTitle)) {
            index += 1;
            notebookTitle = `${baseTitle} ${index}`;
          }


          const notebook = await joplin.data.post(['folders'], null, { title: notebookTitle });


          const noteTitle = 'Quick Note';
          const noteBody = `# Quick Note

This is a quick note created in ${notebookTitle}. You can start writing your thoughts here.`;

          await joplin.data.post(['notes'], null, {
            parent_id: notebook.id,
            title: noteTitle,
            body: noteBody,
          });

          console.log(`Created notebook "${notebookTitle}" with a new note.`);
        } catch (error) {
          console.error('Error creating notebook or note:', error);
        }
      }
    });
  },
});
