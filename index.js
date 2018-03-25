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
  { radius: 30, x: 50, y: 100, vx: random(-5, 5), vy: random(-5, 5) },
  { radius: 20, x: 120, y: 100, vx: random(-5, 5), vy: random(-5, 5) },
  { radius: 30, x: 120, y: 100, vx: random(-5, 5), vy: random(-5, 5) }
];

canvas.width = width;
canvas.height = height;

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  updateCircles();
  // drawGrid();
  drawMetaballs();

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
      // const sign = ;
      // ctx.fillText(sign, i * gridSize, j * gridSize, gridSize);
      const lines = getSquareLines(
        corners.map(([cx, cy]) => {
          const x = (cx + i) * gridSize;
          const y = (cy + j) * gridSize;
          return inCircles(x, y) ? 1 : 0;
        })
      );
      if (lines) {
        drawLines(i, j, lines);
      }
      // console.log(sign);
      // corners.forEach(([cx, cy]) => {
      //   const x = (cx + i) * cols;
      //   const y = (cy + j) * rows;
      //   if (inCircles(x, y)) {
      //     ctx.beginPath();
      //     ctx.rect(x - 1, y - 1, 2, 2);
      //     ctx.fill();
      //   }
      // });
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

function inCircles(x, y) {
  return (
    circles.reduce((sum, circle) => {
      return sum + circle.radius / dist(x, y, circle.x, circle.y);
    }, 0) >= 1
  );
}

function updateCircles() {
  circles.forEach(circle => {
    circle.x += circle.vx;
    circle.y += circle.vy;
    if (circle.x + circle.radius > width || circle.x - circle.radius < 0) {
      circle.vx *= -1;
    }

    if (circle.y + circle.radius > height || circle.y - circle.radius < 0) {
      circle.vy *= -1;
    }
  });
}

function cornersIsEq(c1, c2) {
  return c1.reduce((eq, ci, i) => eq && ci === c2[i], true);
}

function getSquareLines(corners) {
  const squareIndex = square_types.findIndex(cornersIsEq.bind(null, corners));
  switch (cornersByIndex(squareIndex)) { // easier to read corners configuration
    case '0001':
      return [[0, 0.5, 0.5, 1]];
    case '0010':
      return [[1, 0.5, 0.5, 1]];
    case '0011':
      return [[0, 0.5, 1, 0.5]];
    case '0011':
      return [[0, 0.5, 1, 0.5]];
    case '0100':
      return [[0.5, 0, 1, 0.5]];
    case '0101':
      return [[0, 0.5, 0.5, 0], [0.5, 1, 1, 0.5]];
    case '0110':
      return [[0.5, 0, 0.5, 1]];
    case '0111':
      return [[0, 0.5, 0.5, 0]];
    case '1000':
      return [[0, 0.5, 0.5, 0]];
    case '1001':
      return [[0.5, 0, 0.5, 1]];
    case '1010':
      return [[0, 0.5, 0.5, 1], [0.5, 0, 1, 0.5]];
    case '1011':
      return [[0.5, 0, 1, 0.5]];
    case '1100':
      return [[0, 0.5, 1, 0.5]];
    case '1101':
      return [[0.5, 1, 1, 0.5]];
    case '1110':
      return [[0, 0.5, 0.5, 1]];
  }
}
