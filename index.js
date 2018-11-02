import runWithFPS from 'run-with-fps';
import { createGradientDrawer } from './src/gradientDrawer';
import { createMetaballsDrawer } from './src/metaballsDrawer';
import { initGridUI, drawGrid } from './src/gridUI';
import { createCircles, orbitalUpdater } from './src/circles';

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

function draw() {
  ctx.fillStyle = '#000';
  canvas.width = width;

  orbitalUpdater(circles);

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
