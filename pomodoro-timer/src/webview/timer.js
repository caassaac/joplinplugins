// Función anónima autoinvocada
(() => {
  // Define las duraciones (en segundos) para cada modo: trabajo, descanso corto y descanso largo
  const durations = {
    work: 25 * 60,        // 25 minutos para trabajar
    shortBreak: 5 * 60,   // 5 minutos de descanso corto
    longBreak: 15 * 60,   // 15 minutos de descanso largo
  };

  // Estado inicial
  let mode = 'work';                 // Modo actual (por defecto: trabajo)
  let remaining = durations[mode];  // Tiempo restante para el modo actual
  let intervalId = null;            // ID del intervalo activo (para poder detenerlo)
  let sessionCount = 0;             // Número de sesiones de trabajo completadas

  // Referencias a los elementos del DOM para actualizar la interfaz
  const display       = document.getElementById("display");       // Muestra el tiempo restante
  const modeTitle     = document.getElementById("modeTitle");     // Muestra el modo actual
  const startBtn      = document.getElementById("start");         // Botón iniciar
  const pauseBtn      = document.getElementById("pause");         // Botón pausar
  const resetTimerBtn = document.getElementById("resetTimer");    // Botón reiniciar temporizador
  const resetCycleBtn = document.getElementById("resetCycle");    // Botón reiniciar ciclo completo

  // Convierte un tiempo en segundos a formato mm:ss
  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0"); // Minutos con cero a la izquierda
    const s = String(sec % 60).padStart(2, "0");              // Segundos con cero a la izquierda
    return `${m}:${s}`;
  }

  // Actualiza la visualización del temporizador y del modo actual
  function updateDisplay() {
    display.textContent = formatTime(remaining); // Actualiza el tiempo restante
    // Muestra el nombre del modo actual
    modeTitle.textContent = `Modo: ${mode === 'work'
      ? 'Trabajo'
      : mode === 'shortBreak'
        ? 'Descanso Corto'
        : 'Descanso Largo'}`;
  }

  // Cambia entre modos de trabajo y descanso cuando se completa un ciclo
  function switchMode() {
    if (mode === 'work') {
      sessionCount++; // Incrementa el número de sesiones completadas
      // Cada 4 sesiones de trabajo, se hace un descanso largo
      mode = (sessionCount % 4 === 0) ? 'longBreak' : 'shortBreak';
    } else {
      // Después de un descanso, vuelve al modo de trabajo
      mode = 'work';
    }
    // Reinicia el temporizador para el nuevo modo
    remaining = durations[mode];
    updateDisplay(); // Actualiza la interfaz
    // Alerta al usuario del cambio de modo
    alert(mode === 'work' ? '¡Hora de trabajar!' : '¡Hora de descansar!');
  }

  // Función que se ejecuta cada segundo durante el conteo
  function tick() {
    if (remaining > 0) {
      remaining--;     // Reduce el tiempo restante
      updateDisplay(); // Actualiza el tiempo en pantalla
    } else {
      // Si se termina el tiempo, detiene el intervalo
      clearInterval(intervalId);
      intervalId = null;
      // Cambia de modo automáticamente
      switchMode();
    }
  }

  // Inicia el temporizador si no está ya corriendo
  startBtn.addEventListener("click", () => {
    if (!intervalId) {
      intervalId = setInterval(tick, 1000); // Ejecuta 'tick' cada segundo
    }
  });

  // Pausa el temporizador si está activo
  pauseBtn.addEventListener("click", () => {
    if (intervalId) {
      clearInterval(intervalId); // Detiene el intervalo
      intervalId = null;
    }
  });

  // Reinicia el tiempo del modo actual, sin cambiar de modo ni sesiones
  resetTimerBtn.addEventListener("click", () => {
    if (intervalId) {
      clearInterval(intervalId); // Detiene el temporizador si está activo
      intervalId = null;
    }
    remaining = durations[mode]; // Restaura el tiempo original del modo actual
    updateDisplay();
  });

  // Reinicia completamente el ciclo: modo vuelve a 'work' y sesiones a 0
  resetCycleBtn.addEventListener("click", () => {
    if (intervalId) {
      clearInterval(intervalId); // Detiene el temporizador si está activo
      intervalId = null;
    }
    mode = 'work';               // Vuelve al modo de trabajo
    sessionCount = 0;            // Reinicia el contador de sesiones
    remaining = durations[mode]; // Restaura el tiempo inicial
    updateDisplay();
  });

  // Inicializa la vista al cargar el plugin
  updateDisplay();
})();
