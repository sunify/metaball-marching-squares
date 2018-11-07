import runWithFPS from 'run-with-fps';
import { createGradientDrawer } from './src/gradientDrawer';
import { createMetaballsDrawer } from './src/metaballsDrawer';
import { initGridUI, drawGrid } from './src/gridUI';
import { createCircles, pulsarUpdater } from './src/circles';
import { distFast } from './src/utils';

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
  radius: 0
};

// document.addEventListener('mousemove', e => {
//   mouse.x = e.pageX;
//   mouse.y = e.pageY;
// });

document.addEventListener('click', e => {
  if (e.altKey) {
    mouse.radius -= 100;
  } else {
    mouse.radius += 100;
  }
  document.getElementById('force').innerText = mouse.radius;
});

function draw() {
  ctx.fillStyle = '#000';
  canvas.width = width;

  pulsarUpdater(circles);

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

  ctx.drawImage(metaballsDrawer(width, height), 0, 0);
  ctx.globalCompositeOperation = 'source-in';

  ctx.drawImage(gradientDrawer(width, height), 0, 0);
  ctx.globalCompositeOperation = 'source-over';

  if (grid.visible) {
    drawGrid(ctx, grid);
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
