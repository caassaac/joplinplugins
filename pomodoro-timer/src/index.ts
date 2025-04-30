import joplin from 'api';

joplin.plugins.register({
  onStart: async () => {
    // 1) Create panel
    const panel = await joplin.views.panels.create('pomodoroPanel');

    // 2) Set HTML skeleton (no <script> here)
    await joplin.views.panels.setHtml(panel, `
      <div id="pomodoro" style="font-family:sans-serif;padding:1em;">
        <h2>Pomodoro Timer</h2>
        <div id="display" style="font-size:2em;margin:0.5em 0;">25:00</div>
        <button id="start">Start</button>
        <button id="pause">Pause</button>
        <button id="reset">Reset</button>
      </div>
    `);

    // 3) Inject your external timer logic
    await joplin.views.panels.addScript(panel, './webview/timer.js');
  }
});
