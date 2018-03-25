const width = 400;
const height = 400;
const gridSize = 20;

const circles = [
  { radius: 30, x: 50, y: 100, vx: random(-10, 10), vy: random(-10, 10) },
  { radius: 20, x: 120, y: 100, vx: random(-10, 10), vy: random(-10, 10) },
];

canvas.width = width;
canvas.height = height;

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  updateCircles();
  drawGrid();

  ctx.strokeStyle = '#FFF';
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 360);
    ctx.stroke();
  });
}

function drawGrid() {
  const cols = Math.floor(width / gridSize);
  const rows = Math.floor(height / gridSize);
  ctx.strokeStyle = '#555';
  ctx.fillStyle = '#373';
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      const x = (i + 0.5) * gridSize;
      const y = (j + 0.5) * gridSize;
      ctx.beginPath();
      ctx.rect(i * gridSize, j * gridSize, gridSize, gridSize);

      if (inCircles(x, y)) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    }
  }
}

function inCircles(x, y) {
  return circles.reduce((sum, circle) => {
    return sum + (circle.radius / dist(x, y, circle.x, circle.y));
  }, 0) >= 1;
}

function updateCircles() {
  circles.forEach(circle => {
    circle.x += circle.vx;
    circle.y += circle.vy;
    if (
      (circle.x + circle.radius) > width ||
      (circle.x - circle.radius) < 0
    ) {
      circle.vx *= -1;
    }

    if (
      (circle.y + circle.radius) > height ||
      (circle.y - circle.radius) < 0
    ) {
      circle.vy *= -1;
    }
  });
}