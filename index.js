import runWithFPS from 'run-with-fps';
import { createGradientDrawer } from './src/gradientDrawer';
import { createMetaballsDrawer } from './src/metaballsDrawer';
import { initGridUI, drawGrid } from './src/gridUI';
import { createCircles, pulsarUpdater } from './src/circles';
import { dist, distFast } from './src/utils';

const width = window.innerWidth;
const height = window.innerHeight;

const canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

const circles = createCircles(width, height);
const grid = {
  size: 1,
  visible: false,
  get cols() {
    return width / this.size;
  },
  get rows() {
    return height / this.size;
  }
};

initGridUI(grid);
const gradientDrawer = createGradientDrawer(circles);
const metaballsDrawer = createMetaballsDrawer(circles, grid);

function applyToCircle(circle, cf) {
  const dx = circle.x - cf.x;
  const dy = circle.y - cf.y;

  const dist = Math.max(30, distFast(circle.x, circle.y, cf.x, cf.y));
  if (dist < Math.max(circle.radius, cf.radius)) {
    // circle.ax *= 0.99;
    // circle.ay *= 0.99;
    circle.vx *= 0.995;
    circle.vy *= 0.995;
    // return;
  }
  const forceValue =
    (-circle.radius * cf.radius) / Math.pow(dist, 2) / 100;
  circle.ax += forceValue * dx;
  circle.ay += forceValue * dy;
}

const mouse = {
  x: width / 2,
  y: height / 2,
  radius: 200
};

// document.addEventListener('mousemove', e => {
//   mouse.x = e.pageX;
//   mouse.y = e.pageY;
// });

document.getElementById('force').innerText = mouse.radius;
document.addEventListener('click', e => {
  if (e.altKey) {
    mouse.radius -= 100;
  } else {
    mouse.radius += 100;
  }
  document.getElementById('force').innerText = mouse.radius;
});

const circlesCanvas = document.createElement('canvas');
circlesCanvas.width = width;
circlesCanvas.height = height;
const circlesCtx = circlesCanvas.getContext('2d');

function draw() {
  ctx.fillStyle = '#000';
  canvas.width = width;

  // pulsarUpdater(circles);

  circles.forEach(circle => {
    circles.forEach(cf => {
      if (cf !== circle) {
        applyToCircle(circle, cf);
      }
    });
    applyToCircle(circle, mouse);
    circle.ax *= 0.3;
    circle.ay *= 0.3;

    circle.vx += circle.ax;
    circle.vy += circle.ay;
    circle.x += circle.vx;
    circle.y += circle.vy;

    if (
      circle.y + circle.radius + 5 > height ||
      circle.y - circle.radius - 5 < 0
    ) {
      circle.vy *= -1;
    }

    if (
      circle.x + circle.radius + 5 > width ||
      circle.x - circle.radius - 5 < 0
    ) {
      circle.vx *= -1;
    }
  });

  circlesCtx.drawImage(metaballsDrawer(width, height), 0, 0);
  circlesCtx.globalCompositeOperation = 'source-in';

  circlesCtx.drawImage(gradientDrawer(width, height), 0, 0);
  circlesCtx.globalCompositeOperation = 'source-over';

  if (grid.visible) {
    drawGrid(ctx, grid);
  }

  const gravSize = 20;
  const gravCols = Math.ceil(width / gravSize);
  const gravRows = Math.ceil(height / gravSize);
  const field = [];
  for (let i = 0; i < gravCols; i += 1) {
    field[i] = [];
    for (let j = 0; j < gravRows; j += 1) {
      const x = i * gravSize;
      const y = j * gravSize;
      const [ax, ay] = circles
        .map(circle => {
          const dx = circle.x - x;
          const dy = circle.y - y;
          const d = Math.max(20, dist(circle.x, circle.y, x, y));
          const f = (circle.radius / Math.pow(d, 2)) * 10;
          return [dx * f, dy * f];
        })
        .reduce((a, b) => [a[0] + b[0], a[1] + b[1]]);
      field[i][j] = [ax, ay];
    }
  }

  ctx.drawImage(circlesCanvas, 0, 0);

  // ctx.fillRect(x + ax - 1, y + ay - 1, 2, 2);
  const posAt = (i, j) => {
    const [ax, ay] = field[Math.min(i, gravCols)][
      Math.min(j, gravRows)
    ];
    return [i * gravSize - ax, j * gravSize - ay];
  };
  ctx.lineWidth = 0.1;
  for (let i = 0; i < gravCols - 1; i += 1) {
    for (let j = 0; j < gravRows - 1; j += 1) {
      const [x1, y1] = posAt(i, j);

      if (i !== 0) {
        const [x2, y2] = posAt(i, j + 1);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      if (j !== 0) {
        const [x3, y3] = posAt(i + 1, j);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x3, y3);
        ctx.stroke();
      }
    }
  }
}

runWithFPS(draw, 30);

function drawCircles() {
  circles.forEach(circle => {
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 360);
    ctx.stroke();
  });
}
