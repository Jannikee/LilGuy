/* === Telemetry Display Logic === */
function updateTelemetry(data) {
  // Example data:
  // {
  //   leftDir: "forward" | "backward" | "still",
  //   rightDir: "forward" | "backward" | "still",
  //   leftPct: 60,
  //   rightPct: 40,
  //   batteryPct: 85,
  //   batteryVolt: 7.42,
  //   power: true,
  //   connected: true
  // }

  // === LEFT MOTOR ===
  const leftFill = document.getElementById("leftFill");
  const leftPct = document.getElementById("leftPct");
  const leftDir = document.getElementById("leftDir");

  leftFill.style.height = (data.leftPct || 0) + "%";
  leftPct.textContent = (data.leftPct || 0) + "%";

  leftDir.classList.remove("forward", "backward", "still");
  leftDir.classList.add(data.leftDir || "still");

  // === RIGHT MOTOR ===
  const rightFill = document.getElementById("rightFill");
  const rightPct = document.getElementById("rightPct");
  const rightDir = document.getElementById("rightDir");

  rightFill.style.height = (data.rightPct || 0) + "%";
  rightPct.textContent = (data.rightPct || 0) + "%";

  rightDir.classList.remove("forward", "backward", "still");
  rightDir.classList.add(data.rightDir || "still");

  // === BATTERY ===
  const batteryIcon = document.querySelector(".battery-icon");
  const batteryPct = document.getElementById("batteryPct");
  const batteryVolt = document.getElementById("batteryVolt");

  const pct = data.batteryPct || 0;
  batteryPct.textContent = pct;
  batteryVolt.textContent = (data.batteryVolt || 0).toFixed(2);

  let frame = 0;
  if (pct > 80) frame = 4;
  else if (pct > 60) frame = 3;
  else if (pct > 40) frame = 2;
  else if (pct > 20) frame = 1;
  batteryIcon.style.backgroundPosition = `${-frame * 100}% 0`;

  // === POWER & CONNECTION STATUS ===
  const powerBtn = document.getElementById("powerButton");
  const connBtn = document.getElementById("connectionButton");

  if (data.power) {
    powerBtn.classList.add("on");
    powerBtn.classList.remove("off");
    powerBtn.textContent = "Power: ON";
  } else {
    powerBtn.classList.add("off");
    powerBtn.classList.remove("on");
    powerBtn.textContent = "Power: OFF";
  }

  if (data.connected) {
    connBtn.classList.add("connected");
    connBtn.classList.remove("disconnected");
    connBtn.textContent = "Connection: Connected";
  } else {
    connBtn.classList.add("disconnected");
    connBtn.classList.remove("connected");
    connBtn.textContent = "Connection: Disconnected";
  }
}

/* === Example Simulation for Testing === */
setInterval(() => {
  updateTelemetry({
    leftDir: Math.random() > 0.5 ? "forward" : "backward",
    rightDir: Math.random() > 0.5 ? "forward" : "backward",
    leftPct: Math.floor(Math.random() * 100),
    rightPct: Math.floor(Math.random() * 100),
    batteryPct: Math.floor(Math.random() * 100),
    batteryVolt: 6.5 + Math.random() * 1.5,
    power: Math.random() > 0.2,
    connected: Math.random() > 0.1
  });
}, 2000);
