// Importación de la API de Joplin
import joplin from 'api';

// Variable de estado para el modo enfoque
let focusEnabled = false;

// Registro del plugin principal
joplin.plugins.register({
  onStart: async () => {
    // Creación del panel para el modo enfoque
    const panelId = await joplin.views.panels.create('focusModePanel');

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
        #focus-container {
          background: var(--panel-bg);
          padding: 1rem;
          font-family: var(--font-family);
          color: var(--text-color);
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--joplin-divider-color);
        }
        #focusBtn {
          background: var(--accent);
          color: var(--joplin-color-button-text);
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 1rem;
          transition: filter 0.2s ease;
          min-width: 140px;
        }
        #focusBtn:hover {
          filter: brightness(0.9);
        }
      </style>
    `;

    // Configuración de la interfaz de usuario
    await joplin.views.panels.setHtml(panelId, `
      ${sharedCss}
      <div id="focus-container">
        <button id="focusBtn">
          Modo Enfoque
        </button>
      </div>
    `);

    // Carga del script y visualización del panel
    await joplin.views.panels.addScript(panelId, 'webview/webview.js');
    await joplin.views.panels.show(panelId, true);

    // Manejador de mensajes desde la interfaz
    await joplin.views.panels.onMessage(panelId, async (message: any) => {
      if (message.name === 'toggleFocus') {
        // Cambio de estado del modo enfoque
        focusEnabled = !focusEnabled;
        
        // Ejecución de comandos para ocultar/mostrar elementos
        await joplin.commands.execute('toggleSideBar');
        await joplin.commands.execute('toggleNoteList');
        
        // Registro en consola del estado actual
        console.info(`Modo enfoque ${focusEnabled ? 'ACTIVADO' : 'DESACTIVADO'}`);
      }
    });
  },
});