// Importación de la API de Joplin para desarrollar plugins
import joplin from 'api';

// Registro del plugin principal
joplin.plugins.register({
  // Función que se ejecuta al iniciar el plugin
  onStart: async () => {
    // Creación del panel flotante para el cuaderno rápido
    const panelId = await joplin.views.panels.create('quickNotebookPanel');

    // CSS adaptado al modo oscuro de Joplin usando variables nativas
    const sharedCss = `
      <style>
        :root {
          /* Utilización de variables CSS de Joplin para compatibilidad con temas */
          --primary-bg: var(--joplin-background-color);
          --panel-bg: var(--joplin-background-color);
          --accent: var(--joplin-color-accent);
          --text-color: var(--joplin-color);
          --font-family: var(--joplin-font-family);
        }
        #quick-notebook-container {
          background: var(--panel-bg);
          padding: 1rem;
          font-family: var(--font-family);
          color: var(--text-color);
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3); /* Sombras más intensas para contraste */
          position: absolute;
          bottom: 20px;
          right: 20px;
          border: 1px solid var(--joplin-divider-color); /* Borde para mejor definición */
        }
        #quick-notebook-btn {
          background: var(--accent);
          color: var(--joplin-color-button-text);
          border: none;
          border-radius: 4px;
          padding: 0.6em 1em;
          cursor: pointer;
          font-size: 1rem;
          transition: filter 0.2s ease; /* Transición suave para hover */
        }
        #quick-notebook-btn:hover {
          filter: brightness(0.9); /* Efecto hover más universal para temas */
        }
      </style>
    `;

    // Configuración del HTML del panel con estilos actualizados
    await joplin.views.panels.setHtml(panelId, `
      ${sharedCss}
      <div id="quick-notebook-container">
        <button id="quick-notebook-btn">Cuaderno Rápido</button>
      </div>
    `);

    // Carga del script JavaScript asociado
    await joplin.views.panels.addScript(panelId, './webview/quickNotebook.js');
    await joplin.views.panels.show(panelId, true);

    // Manejador de mensajes desde la interfaz
    await joplin.views.panels.onMessage(panelId, async (message: any) => {
      if (message.name === 'createQuick') {
        console.log('Iniciando creación de cuaderno rápido...');

        // Configuración inicial de nombres
        const baseTitle = 'Cuaderno Rápido';
        let notebookTitle = baseTitle;
        let index = 1;

        try {
          // Obtención de todos los cuadernos existentes
          const allFolders = await joplin.data.get(['folders'], { fields: ['id', 'title'] });
          const existingTitles = allFolders.items.map((f: any) => f.title);

          // Generación de título único
          while (existingTitles.includes(notebookTitle)) {
            index++;
            notebookTitle = `${baseTitle} ${index}`;
          }

          // Creación del nuevo cuaderno
          const notebook = await joplin.data.post(['folders'], null, { title: notebookTitle });

          // Configuración de la nota inicial
          const noteTitle = 'Nota Rápida';
          const noteBody = `# Nota Rápida

Este espacio fue creado automáticamente en "${notebookTitle}". ¡Empieza a capturar tus ideas aquí!

---

`;

          // Creación de la primera nota en el cuaderno
          await joplin.data.post(['notes'], null, {
            parent_id: notebook.id,
            title: noteTitle,
            body: noteBody,
          });

          console.log(`Cuaderno "${notebookTitle}" creado exitosamente con nota inicial.`);
        } catch (error) {
          console.error('Error al crear el cuaderno:', error);
        }
      }
    });
  }
});