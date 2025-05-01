(() => {
  // Obtiene el botón del DOM dentro del panel HTML
  const btn = document.getElementById("quick-notebook-btn");

  // Agrega un listener para detectar clics en el botón
  btn.addEventListener("click", () => {
    console.log("Botón clicado, enviando mensaje al plugin"); // Mensaje de depuración

    // Envía un mensaje al backend del plugin indicando que se debe crear un cuaderno y nota rápida
    webviewApi.postMessage({ name: "createQuick" });
  });
})();
