(() => {
  const btn = document.getElementById("quick-notebook-btn");
  btn.addEventListener("click", () => {
    console.log("Button clicked, sending message to plugin");
    webviewApi.postMessage({ name: "createQuick" });
  });
})();
