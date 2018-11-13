import runWithFPS from 'run-with-fps';
import { createGradientDrawer } from './src/gradientDrawer';
import { createMetaballsDrawer } from './src/metaballsDrawer';
import { initGridUI, drawGrid } from './src/gridUI';
import {
  createCircles,
  orbitalUpdater,
  pulsarUpdater
} from './src/circles';
import { distFast, random } from './src/utils';

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

const springs = [];
circles.forEach(c1 => {
  circles.forEach(c2 => {
    if (c1 !== c2) {
      springs.push({
        points: [c1, c2],
        length: 0,
        v12: [0, 0],
        dir12: [0, 0]
      });
    }
  });
});

function norm(vector) {
  var sum = 0;
  var i;
  for (i in vector) sum += vector[i] * vector[i];
  return Math.sqrt(sum);
}

function diff(p1, p2) {
  var res = [];
  var i = 0;
  for (i = 0; i < p1.length; ++i) res[i] = p1[i] - p2[i];
  return res;
}

function dot(v1, v2) {
  var sum = 0;
  var i;
  for (i in v1) sum += v1[i] * v2[i];
  return sum;
}

const grav = {
  x: width / 2,
  y: height / 2,
  vx: random(-10, 10),
  vy: random(-10, 10)
};

// circles.forEach(c1 => {
//   c1.ax = 0;
//   c1.ay = 0;
// });
function draw() {
  ctx.fillStyle = '#000';
  canvas.width = width;

  pulsarUpdater(circles);

  springs.forEach(spring => {
    const [c1, c2] = spring.points;
    spring.v12 = [c2.x - c1.x, c2.y - c1.y];
    spring.length = norm(spring.v12);
    if (spring.length === 0) {
      spring.v12 = [
        Math.random() / 10 - 0.05,
        Math.random() / 10 - 0.05
      ];
      spring.length = norm(spring.v12);
    }
    spring.dir12 = [
      spring.v12[0] / spring.length,
      spring.v12[1] / spring.length
    ];

    const { dir12 } = spring;
    const springDamping = 0.2;
    const springStiffness = 0.2;
    const restLength = (c1.radius + c2.radius) / 1.2;
    const cte =
      springStiffness * (spring.length - restLength) -
      springDamping *
        dot(diff([c1.vx, c1.vy], [c2.vx, c2.vy]), dir12);
    var force1 = [cte * dir12[0], cte * dir12[1]];
    var force2 = [-force1[0], -force1[1]];
    c1.ax += force1[0] * 0.2;
    c1.ay += force1[1] * 0.2;
    c2.ax += force2[0] * 0.2;
    c2.ay += force2[1] * 0.2;
  });

  let hasCollision = false;
  circles.forEach((c1, i) => {
    // const dx = grav.x - c1.x || 0.0001;
    // const dy = grav.y - c1.y || 0.0001;
    // const d = distFast(grav.x, grav.y, c1.x, c1.y);
    // console.log(d);
    // c1.ax += (dx / Math.pow(d, 2)) * 0.001;
    // c1.ay += (dy / Math.pow(d, 2)) * 0.001;

    // c1.radius = c1.or / c1.ax;
    c1.vx += c1.ax * 0.3;
    c1.vy += c1.ay * 0.3;
    c1.vx *= 0.3;
    c1.vy *= 0.3;
    c1.x += c1.vx;
    c1.y += c1.vy;

    if (c1.x - c1.radius * 1.1 < 0) {
      c1.x = c1.radius * 1.1;
      c1.vy = 0;
      c1.vx *= -1;
      c1.ax *= -2;
      hasCollision = [-1, 1];
    }

    if (c1.y - c1.radius * 1.1 < 0) {
      c1.y = c1.radius * 1.1;
      c1.vx = 0;
      c1.vy *= -1;
      c1.ay *= -2;
      hasCollision = [1, -1];
    }
    if (c1.x + c1.radius * 1.1 > width) {
      c1.x = width - c1.radius * 1.1;
      c1.vy = 0;
      c1.vx *= -1;
      c1.ax *= -2;
      hasCollision = [-1, 1];
    }
    if (c1.y + c1.radius * 1.1 > height) {
      c1.y = height - c1.radius * 1.1;
      c1.vy *= -1;
      c1.vx = 0;
      c1.ay *= -2;
      hasCollision = [1, -1];
    }
  });

  ctx.drawImage(metaballsDrawer(width, height), 0, 0);
  ctx.globalCompositeOperation = 'source-in';

  ctx.drawImage(gradientDrawer(width, height), 0, 0);
  ctx.globalCompositeOperation = 'source-over';

  // springs.forEach(spring => {
  //   const [c1, c2] = spring.points;
  //   ctx.beginPath();
  //   ctx.moveTo(c1.x, c1.y);
  //   ctx.lineTo(c2.x, c2.y);
  //   ctx.stroke();
  // });

  // ctx.fillStyle = '#000';
  // ctx.fillRect(grav.x - 2, grav.y - 2, 4, 4);

  if (grid.visible) {
    drawGrid(ctx, grid);
  }
}

runWithFPS(draw, 30);
// draw(Date.now());

function drawCircles() {
  circles.forEach(circle => {
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 360);
    ctx.stroke();
  });
}
