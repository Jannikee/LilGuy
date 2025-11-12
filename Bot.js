/* === Telemetry Display Logic === */
function updateTelemetry(data) {
  // data fromat:
  // {
  //   leftDir: "forward"  "backward"  "still",
  //   rightDir: "forward"  "backward"  "still",
  //   leftDeadzone: [true, false],
  //   rightDeadzone: [true, false],
  //   leftMotorSpeed: [0-255],
  //   rightMotorSpeed: [0-255],
  //   batteryVolt: [0.00-13.00],
  //   weaponStatus: [-1, 0, 1],
  //   power: [true, false],
  //   connected: [true, false]
  // }

  // === LEFT MOTOR ===
  const leftFill = document.getElementById("leftFill");
  const leftPct = document.getElementById("leftPct");
  const leftDir = document.getElementById("leftDir");

  if (data.leftDeadzone){
    leftFill.style.height = 0 + "%";
    leftPct.textContent = "0%";
  } else {
    leftFill.style.height = ((data.leftMotorSpeed || 0)/255*100).toFixed(0)  + "%";
    leftPct.textContent = ((data.leftMotorSpeed || 0)/255*100).toFixed(0)  + "%";
  }


  leftDir.classList.remove("forward", "backward", "still");
  leftDir.classList.add(data.leftDir || "still");

  // === RIGHT MOTOR ===
  const rightFill = document.getElementById("rightFill");
  const rightPct = document.getElementById("rightPct");
  const rightDir = document.getElementById("rightDir");

  if (data.rightDeadzone){
    rightFill.style.height = 0 + "%";
    rightPct.textContent = "0%";
  } else {
    rightFill.style.height = ((data.rightMotorSpeed || 0)/255*100).toFixed(0)  + "%";
    rightPct.textContent = ((data.rightMotorSpeed || 0)/255*100).toFixed(0)  + "%";
  }

  rightDir.classList.remove("forward", "backward", "still");
  rightDir.classList.add(data.rightDir || "still");

  // === BATTERY ===
  const batteryIcon = document.querySelector(".battery-icon");
  const batteryPct = document.getElementById("batteryPct");
  const batteryVolt = document.getElementById("batteryVolt");
  const batteryLevelImg = document.getElementById("battery-level");

  batteryVolt.textContent = (data.batteryVolt/1000 || 0).toFixed(2);

  const pct= Number(((data.batteryVolt/1000 -6 || 0)/ 7.0 * 100).toFixed(0)); //Max 13.0 v, min 7v
  batteryPct.textContent = pct;

  let frame = 0;
  if (pct > 80) frame = 4;
  else if (pct > 60) frame = 3;
  else if (pct > 40) frame = 2;
  else if (pct > 20) frame = 1;
  batteryIcon.style.backgroundPosition = `${frame * 25}% 0`;
  
  if (pct < 40) { 
    batteryLevelImg.classList.add = "batteryLevel-Low";
    batteryLevelImg.classList.remove = "batteryLevel-Ok";
  } else {
    batteryLevelImg.classList.remove = "batteryLevel-Low";
    batteryLevelImg.classList.add = "batteryLevel-Ok";
  }

  // === POWER & CONNECTION STATUS ===
  const powerBtn = document.getElementById("powerButton");
  const connBtn = document.getElementById("connectionButton");
  const weaponBtn = document.getElementById("weaponButton"); 
  
  if (data.weaponStatus == 1) {
    weaponBtn.classList.add("connected");
    weaponBtn.classList.remove("disconnected");
    weaponBtn.textContent = "Weapon: Rising";
  } else if (data.weaponStatus == -1) {
    weaponBtn.classList.add("connected");
    weaponBtn.classList.remove("disconnected");
    weaponBtn.textContent = "Weapon: Retracting"; 
  }
  else {
    weaponBtn.classList.add("disconnected");
    weaponBtn.classList.remove("connected");
    weaponBtn.textContent = "Weapon: Still";
  }

  if (data.kill_switch) {
    powerBtn.classList.add("disconnected");
    powerBtn.classList.remove("connected");
    powerBtn.textContent = "Killswitch: ENGAGED";

        // Motors
    leftFill.style.height = 0 + "%";
    leftPct.textContent = "0%";
    
    leftDir.classList.remove("forward", "backward", "still");
    leftDir.classList.add("still");

    rightFill.style.height = 0 + "%";
    rightPct.textContent = "0%";

    rightDir.classList.remove("forward", "backward", "still");
    rightDir.classList.add("still");

    // Weapon
    weaponBtn.classList.add("disconnected");
    weaponBtn.classList.remove("connected");
    weaponBtn.textContent = "Weapon: UNAVAILABLE";

  } else {
    powerBtn.classList.add("connected");
    powerBtn.classList.remove("disconnected");
    powerBtn.textContent = "Killswitch: DISENGAGED";
  }

  if (data.connected) {
    connBtn.classList.add("connected");
    connBtn.classList.remove("disconnected");
    connBtn.textContent = "Connection: Connected";
  } else {
    connBtn.classList.add("disconnected");
    connBtn.classList.remove("connected");
    connBtn.textContent = "Connection: Disconnected";

    // Killswitch
    powerBtn.classList.add("disconnected");
    powerBtn.classList.remove("connected");
    powerBtn.textContent = "Killswitch: UNAVAILABLE";

    // Motors
    leftFill.style.height = 0 + "%";
    leftPct.textContent = "0%";
    
    leftDir.classList.remove("forward", "backward", "still");
    leftDir.classList.add("still");

    rightFill.style.height = 0 + "%";
    rightPct.textContent = "0%";

    rightDir.classList.remove("forward", "backward", "still");
    rightDir.classList.add("still");

    // Weapon
    weaponBtn.classList.add("disconnected");
    weaponBtn.classList.remove("connected");
    weaponBtn.textContent = "Weapon: UNAVAILABLE";


  }
}

// /* === AI Example Simulation for Testing === */
// setInterval(() => {
//   updateTelemetry({
//     leftDir: Math.random() > 0.5 ? "forward" : "backward",
//     rightDir: Math.random() > 0.5 ? "forward" : "backward",
//     leftPct: Math.floor(Math.random() * 100),
//     rightPct: Math.floor(Math.random() * 100),
//     batteryVolt: 6.5 + Math.random() * 1.5,
//     power: Math.random() > 0.2,
//     weapon: Math.random() > 0.2,
//     connected: Math.random() > 0.1
//   });
// }, 2000);

/* === Real Data Fetching Logic === */
async function updateTelemetryLoop() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    updateTelemetry(data); 
  } catch (e) {
    console.error('Failed to get data', e);
  }
}

setInterval(updateTelemetryLoop, 1000);
updateTelemetryLoop();
