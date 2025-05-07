// Función auto-ejecutable para encapsular la lógica
(() => {
  // Obtención del botón de la interfaz
  const btn = document.getElementById("quick-notebook-btn");
  
  // Validación de existencia del elemento
  if (!btn) {
    console.error('Error en plugin Cuaderno Rápido: Botón no encontrado');
    return;
  }
  
  // Manejador de evento click
  btn.addEventListener("click", () => {
    console.info('Plugin Cuaderno Rápido: Botón presionado');
    // Envío de mensaje al backend del plugin
    webviewApi.postMessage({ name: "createQuick" });
  });
})();