// Importación de la API de Joplin
import joplin from 'api';

// Registro del plugin del temporizador Pomodoro
joplin.plugins.register({
  onStart: async () => {
    // Creación del panel del temporizador
    const panelId = await joplin.views.panels.create('pomodoroPanel');

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
        #pomodoro {
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
        #pomodoro h2 {
          margin: 0 0 0.5rem;
          color: var(--accent);
          font-size: 1.4em;
        }
        #pomodoro #modeTitle {
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          font-size: 0.9em;
          opacity: 0.8;
        }
        #pomodoro #display {
          font-size: 2.5rem;
          margin: 0.5rem 0 1rem;
          font-family: var(--joplin-font-monospace);
          letter-spacing: 2px;
        }
        #pomodoro button {
          background: var(--accent);
          color: var(--joplin-color-button-text);
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          margin: 0.25rem;
          cursor: pointer;
          font-size: 1rem;
          transition: filter 0.2s ease;
          min-width: 100px;
        }
        #pomodoro button:hover {
          filter: brightness(0.9);
        }
        #pomodoro div:nth-last-child(1) {
          margin-top: 0.5rem;
          border-top: 1px solid var(--joplin-divider-color);
          padding-top: 0.5rem;
        }
      </style>
    `;

    // Configuración de la interfaz de usuario
    await joplin.views.panels.setHtml(panelId, `
      ${sharedCss}
      <div id="pomodoro">
        <h2>Temporizador Pomodoro</h2>
        <div id="modeTitle"></div>
        <div id="display">25:00</div>
        <div>
          <button id="start">Iniciar</button>
          <button id="pause">Pausar</button>
        </div>
        <div>
          <button id="resetTimer">Reiniciar Tiempo</button>
          <button id="resetCycle">Reiniciar Ciclo</button>
        </div>
      </div>
    `);

    // Carga del script y visualización del panel
    await joplin.views.panels.addScript(panelId, './webview/timer.js');
    await joplin.views.panels.show(panelId, true);
  }
});