// Importación de módulos necesarios
import joplin from 'api';
import * as os from 'os';

// Registro del plugin principal
joplin.plugins.register({
  onStart: async () => {
    // Creación del panel para el creador de plantillas
    const panelId = await joplin.views.panels.create('templatePanel');

    // Estilos adaptados al tema de Joplin
    const sharedCss = `
      <style>
        :root {
          --primary-bg: var(--joplin-background-color);
          --panel-bg: var(--joplin-background-color);
          --accent: var(--joplin-color-accent);
          --text-color: var(--joplin-color);
          --font-family: var(--joplin-font-family);
        }
        #template-container {
          background: var(--panel-bg);
          padding: 1rem;
          font-family: var(--font-family);
          color: var(--text-color);
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid var(--joplin-divider-color);
        }
        #template-container button {
          background: var(--accent);
          color: var(--joplin-color-button-text);
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 1rem;
          transition: filter 0.2s ease;
          min-width: 180px;
        }
        #template-container button:hover {
          filter: brightness(0.9);
        }
      </style>
    `;

    // Configuración de la interfaz de usuario
    await joplin.views.panels.setHtml(panelId, `
      ${sharedCss}
      <div id="template-container">
        <button id="createButton">Crear desde Plantilla</button>
      </div>
    `);

    // Carga del script y visualización del panel
    await joplin.views.panels.addScript(panelId, 'webview/webview.js');
    await joplin.views.panels.show(panelId, true);

    // Manejador de mensajes desde la interfaz
    await joplin.views.panels.onMessage(panelId, async (message: any) => {
      if (message.command === 'createNote') {
        try {
          // Obtención de información del sistema y contexto
          const now = new Date();
          const fecha = now.toLocaleDateString();
          const hora = now.toLocaleTimeString();
          const fechaHora = now.toLocaleString();
          const usuario = process.env.USER || process.env.USERNAME || 'Usuario';
          const defaultTitle = 'Nueva Nota';

          // Obtención del cuaderno actual seleccionado
          const folder = await joplin.workspace.selectedFolder();
          const notebookName = folder.title;

          // Configuración de etiquetas predeterminadas
          const tagList = 'reunión, diario';

          // Información del sistema operativo
          const osName = os.type();

          // Conteo de notas existentes en el cuaderno
          const notesRes = await joplin.data.get(
            ['folders', folder.id, 'notes'],
            { fields: ['id'] }
          );
          const noteCount = notesRes.items.length + 1;

          // Plantilla base con marcadores de posición
          const template = `
# {{titulo}}

**Cuaderno:** {{notebook}}  
**Etiquetas:** {{tags}}  
**Sistema Operativo:** {{os}}  
**Notas existentes:** {{note_count}}  

**Fecha:** {{fecha}}  
**Hora:** {{hora}}  
**Fecha y hora:** {{fecha_hora}}  
**Usuario:** {{usuario}}

*(Escribe aquí tu contenido…)* 
`;

          // Reemplazo de variables en la plantilla
          const body = template
            .replace(/{{titulo}}/g, defaultTitle)
            .replace(/{{notebook}}/g, notebookName)
            .replace(/{{tags}}/g, tagList)
            .replace(/{{os}}/g, osName)
            .replace(/{{note_count}}/g, String(noteCount))
            .replace(/{{fecha}}/g, fecha)
            .replace(/{{hora}}/g, hora)
            .replace(/{{fecha_hora}}/g, fechaHora)
            .replace(/{{usuario}}/g, usuario);

          // Creación de la nueva nota
          await joplin.data.post(['notes'], null, {
            title: defaultTitle,
            body: body,
            parent_id: folder.id,
          });

          console.info('Nota creada exitosamente desde plantilla');
        } catch (error) {
          console.error('Error al crear nota desde plantilla:', error);
        }
      }
    });
  }
});