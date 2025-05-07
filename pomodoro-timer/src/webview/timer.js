// Configuración principal del temporizador
(() => {
  // Duración en segundos para cada modo
  const durations = { 
    work: 1500,        // 25 minutos (trabajo)
    shortBreak: 300,   // 5 minutos (descanso corto)
    longBreak: 900     // 15 minutos (descanso largo)
  };
  
  // Estado del temporizador
  let mode = 'work';          // Modo actual
  let remaining = durations[mode]; // Tiempo restante
  let intervalId = null;      // Referencia del intervalo
  let sessionCount = 0;       // Contador de sesiones

  // Elementos de la interfaz
  const display = document.getElementById("display");
  const modeTitle = document.getElementById("modeTitle");
  const startBtn = document.getElementById("start");
  const pauseBtn = document.getElementById("pause");
  const resetTimerBtn = document.getElementById("resetTimer");
  const resetCycleBtn = document.getElementById("resetCycle");

  // Formatea segundos a MM:SS
  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  // Actualiza la interfaz con el estado actual
  function updateDisplay() {
    display.textContent = formatTime(remaining);
    modeTitle.textContent = mode === 'work'
      ? 'Trabajo'
      : mode === 'shortBreak'
        ? 'Descanso Corto'
        : 'Descanso Largo';
  }

  // Cambia entre modos de trabajo/descanso
  function switchMode() {
    if (mode === 'work') {
      sessionCount++;
      mode = (sessionCount % 4 === 0) ? 'longBreak' : 'shortBreak';
    } else {
      mode = 'work';
    }
    remaining = durations[mode];
    updateDisplay();
    alert(mode === 'work' ? '¡Hora de trabajar!' : '¡Hora de descansar!');
  }

  // Función principal del temporizador
  function tick() {
    if (remaining > 0) {
      remaining--;
      updateDisplay();
    } else {
      clearInterval(intervalId);
      intervalId = null;
      switchMode();
    }
  }

  // Event Listeners
  startBtn.addEventListener("click", () => {
    if (!intervalId) intervalId = setInterval(tick, 1000);
  });

  pauseBtn.addEventListener("click", () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });

  resetTimerBtn.addEventListener("click", () => {
    clearInterval(intervalId);
    intervalId = null;
    remaining = durations[mode];
    updateDisplay();
  });

  resetCycleBtn.addEventListener("click", () => {
    clearInterval(intervalId);
    intervalId = null;
    mode = 'work';
    sessionCount = 0;
    remaining = durations[mode];
    updateDisplay();
  });

  // Inicialización
  updateDisplay();
})();