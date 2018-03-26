const width = window.innerWidth;
const height = window.innerHeight;
const gridSize = 15;
const cols = Math.floor(width / gridSize);
const rows = Math.floor(height / gridSize);

const ballsCanvas = document.createElement('canvas');
const ballsCtx = ballsCanvas.getContext('2d');
ballsCanvas.width = width;
ballsCanvas.height = height;

const cornersByIndex = i => (i >>> 0).toString(2).padStart(4, '0');
const square_types = Array.from(new Array(16), (_, n) =>
  cornersByIndex(n)
    .split('')
    .map(Number)
);

const corners = [[0, 0], [1, 0], [1, 1], [0, 1]];

const circles = [
  {
    radius: 50,
    x: width / 2,
    y: height / 2,
    vx: random(-2, 2),
    vy: random(-2, 2)
  },
  {
    radius: 40,
    x: width / 2,
    y: height / 2,
    vx: random(-5, 2),
    vy: random(-2, 5)
  },
  {
    radius: 75,
    x: width / 2,
    y: height / 2,
    vx: random(-5, 10),
    vy: random(-12, 5)
  },
  {
    radius: 60,
    x: width / 2,
    y: height / 2,
    vx: random(-2, 2),
    vy: random(-2, 2)
  }
];

canvas.width = width;
canvas.height = height;

const gradient = ctx.createLinearGradient(0, 0, width, 0);
gradient.addColorStop(0, '#0cf');
gradient.addColorStop(1, '#ff0');

function draw() {
  ctx.fillStyle = '#000';
  canvas.width = width;
  ballsCanvas.width = width;

  updateCircles();
  drawMetaballs();

  ctx.fillStyle = gradient;
  ctx.drawImage(ballsCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
  // drawCircles();
}

function drawCircles() {
  circles.forEach(circle => {
    ctx.strokeStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 360);
    ctx.stroke();
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius * 4, 0, 360);
    ctx.stroke();
  });
}

function drawMetaballs() {
  ctx.fillStyle = '#000';
  const visited = [];
  circles.forEach(circle => {
    const padding = circle.radius * 4;
    const fromI = Math.max(
      0,
      Math.floor((circle.x - padding) / gridSize)
    );
    const fromJ = Math.max(
      0,
      Math.floor((circle.y - padding) / gridSize)
    );
    const toI = Math.min(
      cols,
      Math.floor((circle.x + padding) / gridSize)
    );
    const toJ = Math.min(
      cols,
      Math.floor((circle.y + padding) / gridSize)
    );

    for (let i = fromI; i < toI; i += 1) {
      for (let j = fromJ; j < toJ; j += 1) {
        const index = j * cols + i;
        if (!visited[index]) {
          const cornerWeights = corners.map(([cx, cy]) =>
            calcCirclesWeight(
              (cx + i) * gridSize,
              (cy + j) * gridSize
            )
          );
          const lines = getSquareLines(cornerWeights);
          if (lines) {
            drawLines(i, j, interpolateLines(lines, cornerWeights));
          }

          visited[index] = true;
        }
      }
    }
  });
}

function drawLines(i, j, lines) {
  ballsCtx.strokeStyle = '#0f0';
  lines.forEach(line => {
    ballsCtx.beginPath();
    ballsCtx.moveTo(
      (i + line[0]) * gridSize,
      (j + line[1]) * gridSize
    );
    for (let l = 2; l < line.length; l += 2) {
      ballsCtx.lineTo(
        (i + line[l]) * gridSize,
        (j + line[l + 1]) * gridSize
      );
    }
    ballsCtx.fill();
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
    return (
      sum +
      Math.pow(circle.radius, 2) /
        (Math.pow(circle.x - x, 2) + Math.pow(circle.y - y, 2))
    );
  }, 0);
}

function updateCircles() {
  const padding = 100;
  circles.forEach(circle => {
    circle.x += circle.vx;
    circle.y += circle.vy;
    if (
      circle.x + circle.radius + padding > width ||
      circle.x - circle.radius - padding < 0
    ) {
      circle.vx *= -1;
    }

    if (
      circle.y + circle.radius + padding > height ||
      circle.y - circle.radius - padding < 0
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
