const width = 400;
const height = 400;
const gridSize = 10;
const cols = Math.floor(width / gridSize);
const rows = Math.floor(height / gridSize);

const cornersByIndex = i => (i >>> 0).toString(2).padStart(4, '0');
const square_types = Array.from(new Array(16), (_, n) =>
  cornersByIndex(n)
    .split('')
    .map(Number)
);

const corners = [[0, 0], [1, 0], [1, 1], [0, 1]];

const circles = [
  {
    radius: 30,
    x: 100,
    y: 100,
    vx: random(-2, 2),
    vy: random(-2, 2)
  },
  {
    radius: 20,
    x: 120,
    y: 100,
    vx: random(-2, 2),
    vy: random(-2, 2)
  },
  {
    radius: 30,
    x: 120,
    y: 100,
    vx: random(-2, 2),
    vy: random(-2, 2)
  }
];

canvas.width = width;
canvas.height = height;

function draw() {
  ctx.fillStyle = '#000';
  canvas.width = width;
  // ctx.fillRect(0, 0, width, height);

  updateCircles();

  // drawGrid();
  drawMetaballs();
  // drawCircles();
}

function drawWeights(i, j, weights) {
  weights.forEach((w, idx) => {
    const cy = Math.floor(idx / 2);
    const cx = (idx - cy) % 2;
    ctx.fillText(
      Math.round(w * 10) / 10,
      (cx + i) * gridSize,
      (cy + j) * gridSize
    );
  });
}

function drawCircles() {
  ctx.strokeStyle = '#FFF';
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 360);
    ctx.stroke();
  });
}

function drawMetaballs() {
  ctx.fillStyle = '#000';
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      const cornerWeights = corners.map(([cx, cy]) =>
        calcCirclesWeight((cx + i) * gridSize, (cy + j) * gridSize)
      );
      // drawWeights(i, j, cornerWeights);
      const lines = getSquareLines(cornerWeights);
      if (lines) {
        drawLines(i, j, interpolateLines(lines, cornerWeights));
      }
    }
  }
}

function drawLines(i, j, lines) {
  ctx.strokeStyle = '#0f0';
  lines.forEach(line => {
    ctx.beginPath();
    ctx.moveTo((i + line[0]) * gridSize, (j + line[1]) * gridSize);
    for (let l = 2; l < line.length; l += 2) {
      ctx.lineTo(
        (i + line[l]) * gridSize,
        (j + line[l + 1]) * gridSize
      );
    }
    ctx.fill();
  });
}

function interpolateLines(lines, cornerWeights) {
  // return lines;
  return lines.map(line => {
    for (let i = 0; i < line.length; i += 2) {
      const x = line[i];
      const y = line[i + 1];

      if ((x === 0 || x === 1) && (y === 0 || y === 1)) {
        // it's corner
        continue;
      }

      if (x === 0 || x === 1) {
        line[i + 1] = lerp(
          ...(x === 0
            ? [cornerWeights[0], cornerWeights[3]]
            : [cornerWeights[1], cornerWeights[2]])
        );
      }

      if (y === 0 || y === 1) {
        line[i] = lerp(
          ...(y === 0
            ? [cornerWeights[0], cornerWeights[1]]
            : [cornerWeights[3], cornerWeights[2]])
        );
      }
    }
    return line;
  });
}

function drawGrid() {
  ctx.strokeStyle = '#555';
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      ctx.beginPath();
      ctx.rect(i * gridSize, j * gridSize, gridSize, gridSize);
      ctx.stroke();
    }
  }
}

function calcCirclesWeight(x, y) {
  return circles.reduce((sum, circle) => {
    return sum + circle.radius / dist(x, y, circle.x, circle.y);
  }, 0);
}

function updateCircles() {
  const threshold = 30;
  circles.forEach(circle => {
    circle.x += circle.vx;
    circle.y += circle.vy;
    if (
      circle.x + circle.radius + threshold > width ||
      circle.x - circle.radius - threshold < 0
    ) {
      circle.vx *= -1;
    }

    if (
      circle.y + circle.radius + threshold > height ||
      circle.y - circle.radius - threshold < 0
    ) {
      circle.vy *= -1;
    }
  });
}

function cornersIsEq(c1, c2) {
  return c1.reduce((eq, ci, i) => eq && ci === c2[i], true);
}

function cornersSign(cornersArr) {
  return cornersByIndex(
    square_types.findIndex(cornersIsEq.bind(null, cornersArr))
  );
}

function getSquareLines(weights) {
  const corners = cornersSign(weights.map(n => (n >= 1 ? 1 : 0)));
  switch (corners) { // easier to read corners configuration
    case '0001':
      return [[0, 0.5, 0.5, 1, 0, 1]];
    case '0010':
      return [[1, 0.5, 0.5, 1, 1, 1]];
    case '0011':
      return [[0, 0.5, 1, 0.5, 1, 1, 0, 1]];
    case '0100':
      return [[0.5, 0, 1, 0.5, 1, 0]];
    case '0101':
      return [[0, 0.5, 0.5, 0, 1, 0, 1, 0.5, 0.5, 1, 0, 1]];
    case '0110':
      return [[0.5, 0, 0.5, 1, 1, 1, 1, 0]];
    case '0111':
      return [[0, 0.5, 0.5, 0, 1, 0, 1, 1, 0, 1]];
    case '1000':
      return [[0, 0.5, 0.5, 0, 0, 0]];
    case '1001':
      return [[0.5, 0, 0.5, 1, 0, 1, 0, 0]];
    case '1010':
      return [[0, 0.5, 0.5, 1, 1, 1, 1, 0.5, 0.5, 0, 0, 0]];
    case '1011':
      return [[0.5, 0, 1, 0.5, 1, 1, 0, 1, 0, 0]];
    case '1100':
      return [[0, 0.5, 1, 0.5, 1, 0, 0, 0]];
    case '1101':
      return [[0.5, 1, 1, 0.5, 1, 0, 0, 0, 0, 1]];
    case '1110':
      return [[0, 0.5, 0.5, 1, 1, 1, 1, 0, 0, 0]];
    case '1111':
      return [[0, 0, 1, 0, 1, 1, 0, 1]];
  }
}

// Linear interpolation
function lerp(b_w, d_w, by = 0, dy = 1) {
  if (b_w === d_w) {
    return null;
  }

  return by + (dy - by) * (1 - b_w) / (d_w - b_w);
}
