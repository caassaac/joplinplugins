// Obtención del botón de creación
const btn = document.getElementById('createButton');

// Validación de existencia del elemento
if (!btn) {
  console.error('Plugin Plantillas: Botón no encontrado');
} else {
  // Manejador de evento click
  btn.addEventListener('click', async () => {
    console.info('Plugin Plantillas: Iniciando creación de nota...');
    try {
      await webviewApi.postMessage({ command: 'createNote' });
    } catch (error) {
      console.error('Error en comunicación con el plugin:', error);
    }
  });
}