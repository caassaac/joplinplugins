(() => {
  // Obtiene el botón del DOM dentro del panel HTML
  const btn = document.getElementById("quick-notebook-btn");

  // Agrega un listener para detectar clics en el botón
  btn.addEventListener("click", () => {
    console.log("Button clicked, sending message to plugin"); // Mensaje de depuración

    // Envía un mensaje al backend del plugin indicando que se debe crear un cuaderno y nota rápida
    webviewApi.postMessage({ name: "createQuick" });
  });
})();
