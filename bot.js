function setBar(fillEl, pctEl, value) {
  // Clamp value between 0–100
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  fillEl.style.width = v + "%";
  pctEl.textContent = v.toFixed(0) + "%";
}

function setArrow(imgEl, dir) {
  // dir: -1 = down, 0 = stop, 1 = up
  const base = "https://yourname.github.io/telemetry-ui/icons/"; // change to your actual URL
  let src;
  if (dir > 0) src = base + "up.svg";
  else if (dir < 0) src = base + "down.svg";
  else src = base + "stop.svg";
  if (imgEl.getAttribute("src") !== src) imgEl.setAttribute("src", src);
}

function setMotor(side, pct, dir) {
  setBar(
    document.getElementById(side + "Fill"),
    document.getElementById(side + "Pct"),
    pct
  );
  setArrow(document.getElementById(side + "Dir"), dir);
}

async function poll() {
  try {
    const r = await fetch("/telemetry", { cache: "no-store" });
    const data = await r.json();
    setMotor("left", data.left.pct, data.left.dir);
    setMotor("right", data.right.pct, data.right.dir);
  } catch (e) {
    console.error("Telemetry fetch failed:", e);
  }
}

// Initial and periodic update
poll();
setInterval(poll, 500);