// Importa el objeto principal de la API de Joplin
import joplin from 'api';

// Registra el plugin dentro del entorno de Joplin
joplin.plugins.register({
  // Función que se ejecuta automáticamente cuando inicia
  onStart: async () => {
    // Crea un nuevo panel de vista (webview) llamado 'pomodoroPanel'
    const panel = await joplin.views.panels.create('pomodoroPanel');

    // Define el contenido HTML que se mostrará dentro del panel
    await joplin.views.panels.setHtml(panel, `
      <div id="pomodoro" style="font-family:sans-serif;padding:1em;">
        <h2>Temporizador Pomodoro</h2> <!-- Título del temporizador -->
        <div id="modeTitle" style="font-weight:bold;margin-bottom:0.5em;"></div> <!-- Modo actual (trabajo, descanso corto, descanso largo) -->
        <div id="display" style="font-size:2em;margin:0.5em 0;">25:00</div> <!-- Muestra el tiempo restante -->
        <button id="start">Iniciar</button>           <!-- Botón para iniciar -->
        <button id="pause">Pausar</button>            <!-- Botón para pausar -->
        <button id="resetTimer">Reiniciar Tiempo</button> <!-- Reinicia el temporizador actual -->
        <button id="resetCycle">Reiniciar Ciclo</button>  <!-- Reinicia el ciclo completo (modo y sesiones) -->
      </div>
    `);

    // Carga el script JavaScript que contiene la lógica del temporizador
    await joplin.views.panels.addScript(panel, './webview/timer.js');
  }
});
