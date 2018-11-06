import { random } from './utils';

export function orbitalUpdater(circles) {
  circles.forEach((circle, i) => {
    const t = Date.now() / 1000;
    circle.oradius = circle.oradius || circle.radius;
    circle.radius =
      circle.oradius + (i % 2 ? Math.sin : Math.cos)(t * 2) * 5;
    circle.ox = circle.ox || circle.x;
    circle.oy = circle.oy || circle.y;
    circle.x =
      circle.ox + (Math.cos(t) * circle.radius * circle.vx) / 2;
    circle.y =
      circle.oy +
      (Math.sin(t) * circle.radius * circle.vy) / 2 +
      Math.cos(t) * 20;
  });
}

export const createCircles = (width, height) => [
  {
    color: [0, 255, 170],
    radius: 70,
    x: width / 2 - 160,
    y: height / 2 + 130,
    vx: random(-2, 2),
    vy: random(-2, 2),
    ax: 0,
    ay: 0
  },
  {
    color: [255, 0, 120],
    radius: 80,
    x: width / 2 + 160,
    y: height / 2 + 160,
    vx: random(-2, 2),
    vy: random(-2, 2),
    ax: 0,
    ay: 0
  },
  {
    color: [255, 255, 120],
    radius: 60,
    x: width / 2 - 360,
    y: height / 2 - 260,
    vx: random(-2, 2),
    vy: random(-2, 2),
    ax: 0,
    ay: 0
  },
  {
    color: [0, 0, 255],
    radius: 50,
    x: width / 2 + 160,
    y: height / 2 + 260,
    vx: random(-2, 2),
    vy: random(-2, 2),
    ax: 0,
    ay: 0
  },
  {
    color: [255, 255, 0],
    radius: 100,
    x: width / 2 + 160,
    y: height / 2 - 130,
    vx: random(-5, 2),
    vy: random(-2, 5),
    ax: 0,
    ay: 0
  }
];
