// Importa el objeto principal de la API de Joplin
import joplin from 'api';
import { ContentScriptType } from 'api/types';

// Registra el plugin en Joplin
joplin.plugins.register({
  // Función que se ejecuta al iniciar el plugin
  onStart: async function () {

    // Crea un panel web lateral (webview) con ID 'quickNotebookPanel'
    const panel = await joplin.views.panels.create('quickNotebookPanel');

    // Define el contenido HTML que se mostrará en el panel
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
          Cuaderno Rápido
        </button>
      </div>
    `);

    // Agrega el script JavaScript al panel que maneja los eventos del botón
    await joplin.views.panels.addScript(panel, './webview/quickNotebook.js');

    // Muestra el panel al usuario
    await joplin.views.panels.show(panel);

    // Escucha mensajes enviados desde el script del webview
    await joplin.views.panels.onMessage(panel, async (message: any) => {
      // Si el mensaje recibido tiene nombre 'createQuick', se ejecuta la lógica de creación
      if (message.name === 'createQuick') {
        console.log('Procesando mensaje createQuick'); // Mensaje de depuración

        const baseTitle = 'Cuaderno Rápido'; // Título base del cuaderno
        let notebookTitle = baseTitle;       // Título actual que puede variar si hay duplicados
        let index = 1;                        // Contador para evitar duplicados

        try {
          // Obtiene todos los cuadernos existentes y sus títulos
          const allFolders = await joplin.data.get(['folders'], { fields: ['id', 'title'] });
          const existingTitles = allFolders.items.map((folder: any) => folder.title);

          // Mientras ya exista un cuaderno con ese nombre, le añade un número incremental
          while (existingTitles.includes(notebookTitle)) {
            index += 1;
            notebookTitle = `${baseTitle} ${index}`;
          }

          // Crea un nuevo cuaderno con un título único
          const notebook = await joplin.data.post(['folders'], null, { title: notebookTitle });

          // Define el título y contenido de la nota por defecto
          const noteTitle = 'Nota Rápida';
          const noteBody = `# Nota Rápida

Espacio creado automáticamente dentro del cuaderno "${notebookTitle}" para que puedas anotar cualquier cosa que necesites capturar de inmediato.

## ¿Qué puedes hacer aquí?

- Escribir pensamientos espontáneos.
- Anotar ideas antes de que se te olviden.
- Planificar tareas o actividades.
- Registrar cualquier información útil al instante.

> Sugerencia: puedes reorganizar esta nota más tarde o moverla a otro cuaderno si lo necesitas.

---

¡Empieza a escribir aquí!

---
`;

          // Crea una nota dentro del cuaderno recién creado
          await joplin.data.post(['notes'], null, {
            parent_id: notebook.id, // Asocia la nota al nuevo cuaderno
            title: noteTitle,
            body: noteBody,
          });

          console.log(`Cuaderno "${notebookTitle}" creado con una nueva nota.`); // Confirmación en consola
        } catch (error) {
          // Captura y muestra errores si falla la creación
          console.error('Error al crear cuaderno o nota:', error);
        }
      }
    });
  },
});
