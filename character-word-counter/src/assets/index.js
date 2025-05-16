["log", "warn", "info", "error"].forEach((level) => {
  const orig = console[level];
  console[level] = function (...args) {
    webviewApi.postMessage({ id: "webviewLog", level, args });
    orig.apply(console, args);
  };
});

console.log("Webview loaded");
webviewApi.postMessage({ id: "ready" });

webviewApi.onMessage((msg) => {
  if (msg.id === "update") {
    const { full, sel } = msg;
    const fullEl = document.getElementById("full");
    const selEl = document.getElementById("sel");

    if (fullEl && selEl) {
      fullEl.textContent = `Full Document: ${full.words} words | ${full.chars} chars (${full.charsNoSp} no spaces)`;
      selEl.textContent = `Selection: ${sel.words} words | ${sel.chars} chars (${sel.charsNoSp} no spaces)`;
    }
  }
});
