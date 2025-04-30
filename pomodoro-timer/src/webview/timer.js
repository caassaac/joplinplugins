(() => {
  const totalSeconds = 25 * 60;
  let remaining = totalSeconds;
  let intervalId = null;

  const display = document.getElementById("display");
  const startBtn = document.getElementById("start");
  const pauseBtn = document.getElementById("pause");
  const resetBtn = document.getElementById("reset");

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateDisplay() {
    display.textContent = formatTime(remaining);
  }

  function tick() {
    if (remaining > 0) {
      remaining--;
      updateDisplay();
    } else {
      clearInterval(intervalId);
      intervalId = null;
      // Optional: use Notification API here
      alert("Pomodoro session complete!");
    }
  }

  startBtn.addEventListener("click", () => {
    if (!intervalId) {
      intervalId = setInterval(tick, 1000);
    }
  });
  pauseBtn.addEventListener("click", () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });
  resetBtn.addEventListener("click", () => {
    clearInterval(intervalId);
    intervalId = null;
    remaining = totalSeconds;
    updateDisplay();
  });

  // Initialize
  updateDisplay();
})();
