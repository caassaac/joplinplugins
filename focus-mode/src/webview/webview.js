// Obtención del botón de la interfaz
const btn = document.getElementById('focusBtn');

// Validación de existencia del elemento
if (!btn) {
  console.error('Plugin Modo Enfoque: Botón no encontrado');
} else {
  // Manejador de evento click
  btn.addEventListener('click', async () => {
    console.info('Plugin Modo Enfoque: Botón presionado');
    // Envío de mensaje al backend del plugin
    await webviewApi.postMessage({ name: 'toggleFocus' });
  });
}