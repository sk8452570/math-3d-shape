// AI equation fixer
function aiFix(eq) {
  return eq
    .replace(/x2/g, "x^2")
    .replace(/y2/g, "y^2")
    .replace(/z2/g, "z^2")
    .replace(/=/g, "-");
}

// MAIN DRAW FUNCTION
function draw() {
  let raw = document.getElementById("equation").value;
  let eq = aiFix(raw);
  let mode = document.getElementById("mode").value;

  saveHistory(eq);

  document.getElementById("shape").innerText =
    "Detected Shape: " + detectShape(eq);

  if (mode === "2d") {
    implicit2D(eq);
  } else {
    implicit3D(eq);
  }
}

// ---------- 2D IMPLICIT ----------
function implicit2D(expr) {
  let x = [], y = [];

  for (let i = -10; i <= 10; i += 0.05) {
    for (let j = -10; j <= 10; j += 0.05) {
      try {
        let val = math.evaluate(expr, { x: i, y: j });
        if (Math.abs(val) < 0.05) {
          x.push(i);
          y.push(j);
        }
      } catch {}
    }
  }

  Plotly.newPlot("graph", [{
    x, y,
    type: "scatter",
    mode: "markers"
  }], {
    title: "2D Shape"
  });
}

// ---------- 3D IMPLICIT ----------
function implicit3D(expr) {
  let x = [], y = [], z = [];

  for (let i = -5; i <= 5; i += 0.5) {
    for (let j = -5; j <= 5; j += 0.5) {
      for (let k = -5; k <= 5; k += 0.5) {
        try {
          let val = math.evaluate(expr, { x: i, y: j, z: k });
          if (Math.abs(val) < 1) {
            x.push(i);
            y.push(j);
            z.push(k);
          }
        } catch {}
      }
    }
  }

  Plotly.newPlot("graph", [{
    x, y, z,
    type: "scatter3d",
    mode: "markers",
    marker: {
      size: 3,
      color: z,
      colorscale: "Viridis"
    }
  }], {
    title: "3D Shape"
  });
}

// ---------- SHAPE DETECTOR ----------
function detectShape(eq) {
  if (eq.includes("x^2") && eq.includes("y^2") && eq.includes("z^2"))
    return "Sphere / Ellipsoid";
  if (eq.includes("x^2") && eq.includes("y^2"))
    return "Circle / Ellipse";
  return "Custom Shape";
}

// ---------- HISTORY ----------
function saveHistory(eq) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift(eq);
  localStorage.setItem("history", JSON.stringify(history.slice(0,5)));
  loadHistory();
}

function loadHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  document.getElementById("history").innerHTML =
    history.map(e => `<li>${e}</li>`).join("");
}

// ---------- EXPORT ----------
function exportPNG() {
  Plotly.downloadImage('graph', {
    format: 'png',
    filename: 'math-shape'
  });
}

loadHistory();
