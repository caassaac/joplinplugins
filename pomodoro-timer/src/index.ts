// Importa el objeto principal 'joplin' desde la API de plugins de Joplin
import joplin from 'api';

// Registra el plugin en Joplin
joplin.plugins.register({
  // Función que se ejecuta cuando se inicia el plugin
  onStart: async () => {
    // Crea un nuevo panel lateral (webview) con el ID 'pomodoroPanel'
    const panel = await joplin.views.panels.create('pomodoroPanel');

    // Establece el contenido HTML del panel creado
    await joplin.views.panels.setHtml(panel, `
      <div id="pomodoro" style="font-family:sans-serif;padding:1em;">
        <h2>Pomodoro Timer</h2> <!-- Título del temporizador -->
        <div id="display" style="font-size:2em;margin:0.5em 0;">25:00</div> <!-- Pantalla del tiempo -->
        <button id="start">Start</button> <!-- Botón para iniciar -->
        <button id="pause">Pause</button> <!-- Botón para pausar -->
        <button id="reset">Reset</button> <!-- Botón para reiniciar -->
      </div>
    `);

    // Agrega un script externo al panel, que manejará la lógica del timer
    await joplin.views.panels.addScript(panel, './webview/timer.js');
  }
});
