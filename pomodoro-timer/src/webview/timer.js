(() => {
  // Define la duración total del temporizador en segundos (25 minutos)
  const totalSeconds = 25 * 60;

  // Variable para llevar cuenta de los segundos restantes
  let remaining = totalSeconds;

  // ID del intervalo para poder detenerlo luego con clearInterval
  let intervalId = null;

  // Obtiene las referencias a los elementos del DOM dentro del panel
  const display = document.getElementById("display");   // Pantalla que muestra el tiempo
  const startBtn = document.getElementById("start");     // Botón de inicio
  const pauseBtn = document.getElementById("pause");     // Botón de pausa
  const resetBtn = document.getElementById("reset");     // Botón de reinicio

  // Función para formatear los segundos restantes en formato MM:SS
  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0"); // Minutos con dos dígitos
    const s = String(sec % 60).padStart(2, "0");              // Segundos con dos dígitos
    return `${m}:${s}`; // Retorna el string formateado
  }

  // Función que actualiza el contenido del display con el tiempo actual
  function updateDisplay() {
    display.textContent = formatTime(remaining); // Muestra el tiempo formateado
  }

  // Función que se llama cada segundo cuando el temporizador está activo
  function tick() {
    if (remaining > 0) {
      remaining--;      // Disminuye en 1 segundo
      updateDisplay();  // Actualiza la pantalla
    } else {
      // Si el tiempo llega a 0, se detiene el intervalo y muestra alerta
      clearInterval(intervalId); 
      intervalId = null;
      alert("Pomodoro session complete!"); // Mensaje al completar sesión
    }
  }

  // Evento click del botón de inicio
  startBtn.addEventListener("click", () => {
    // Solo inicia si no hay un intervalo ya corriendo
    if (!intervalId) {
      intervalId = setInterval(tick, 1000); // Llama a tick() cada segundo
    }
  });

  // Evento click del botón de pausa
  pauseBtn.addEventListener("click", () => {
    // Si hay un intervalo activo, lo detiene
    if (intervalId) {
      clearInterval(intervalId); 
      intervalId = null; // Limpia el ID para saber que ya no está corriendo
    }
  });

  // Evento click del botón de reinicio
  resetBtn.addEventListener("click", () => {
    clearInterval(intervalId); // Detiene cualquier intervalo activo
    intervalId = null;
    remaining = totalSeconds; // Reinicia el contador a 25 minutos
    updateDisplay();          // Refresca la pantalla con el nuevo valor
  });

  // Al cargar el script, actualiza el display por primera vez
  updateDisplay();
})();
