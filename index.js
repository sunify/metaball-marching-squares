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
    x: 50,
    y: 100,
    vx: random(-10, 10),
    vy: random(-10, 10)
  },
  {
    radius: 20,
    x: 120,
    y: 100,
    vx: random(-10, 10),
    vy: random(-10, 10)
  },
  {
    radius: 30,
    x: 120,
    y: 100,
    vx: random(-10, 10),
    vy: random(-10, 10)
  }
];

canvas.width = width;
canvas.height = height;

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  updateCircles();

  // drawGrid();
  // drawCircles();
  drawMetaballs();
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
  ctx.fillStyle = '#373';
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
    const x1 = (i + line[0]) * gridSize;
    const y1 = (j + line[1]) * gridSize;
    const x2 = (i + line[2]) * gridSize;
    const y2 = (j + line[3]) * gridSize;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
}

function interpolateLines(lines, cornerWeights) {
  // console.log(lines, cornerWeights);
  if (lines.length === 1) {
    const [x1, y1, x2, y2] = lines[0];
    // do interpolation here
    return lines;
  } else {
    return lines;
  }
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
  circles.forEach(circle => {
    circle.x += circle.vx;
    circle.y += circle.vy;
    if (
      circle.x + circle.radius > width ||
      circle.x - circle.radius < 0
    ) {
      circle.vx *= -1;
    }

    if (
      circle.y + circle.radius > height ||
      circle.y - circle.radius < 0
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
      return [
        [
          0,
          lerp(weights[0], weights[3]),
          lerp(weights[3], weights[2]),
          1
        ]
      ];
    case '0010':
      return [
        [
          1,
          lerp(weights[1], weights[2]),
          lerp(weights[3], weights[2]),
          1
        ]
      ];
    case '0011':
      return [
        [
          0,
          lerp(weights[0], weights[3]),
          1,
          lerp(weights[1], weights[2])
        ]
      ];
    case '0100':
      return [
        [
          lerp(weights[0], weights[1]),
          0,
          1,
          lerp(weights[1], weights[2])
        ]
      ];
    case '0101':
      return [
        [
          0,
          lerp(weights[0], weights[3]),
          lerp(weights[0], weights[1]),
          0
        ],
        [
          lerp(weights[3], weights[2]),
          1,
          1,
          lerp(weights[1], weights[2])
        ]
      ];
    case '0110':
      return [
        [
          lerp(weights[0], weights[1]),
          0,
          lerp(weights[3], weights[2]),
          1
        ]
      ];
    case '0111':
      return [
        [
          0,
          lerp(weights[0], weights[3]),
          lerp(weights[0], weights[1]),
          0
        ]
      ];
    case '1000':
      return [
        [
          0,
          lerp(weights[0], weights[3]),
          lerp(weights[0], weights[1]),
          0
        ]
      ];
    case '1001':
      return [
        [
          lerp(weights[0], weights[1]),
          0,
          lerp(weights[3], weights[2]),
          1
        ]
      ];
    case '1010':
      return [
        [
          0,
          lerp(weights[0], weights[3]),
          lerp(weights[2], weights[3]),
          1
        ],
        [
          lerp(weights[0], weights[1]),
          0,
          1,
          lerp(weights[1], weights[2])
        ]
      ];
    case '1011':
      return [
        [
          lerp(weights[0], weights[1]),
          0,
          1,
          lerp(weights[1], weights[2])
        ]
      ];
    case '1100':
      return [
        [
          0,
          lerp(weights[0], weights[3]),
          1,
          lerp(weights[1], weights[2])
        ]
      ];
    case '1101':
      return [
        [
          lerp(weights[3], weights[2]),
          1,
          1,
          lerp(weights[1], weights[2])
        ]
      ];
    case '1110':
      return [
        [
          0,
          lerp(weights[0], weights[3]),
          lerp(weights[3], weights[2]),
          1
        ]
      ];
  }
}

// Linear interpolation
function lerp(b_w, d_w, by = 0, dy = 1) {
  if (b_w === d_w) {
    return null;
  }

  return by + (dy - by) * (1 - b_w) / (d_w - b_w);
}
