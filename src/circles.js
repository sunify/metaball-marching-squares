import { random } from './utils';

export function pulsarUpdater(circles) {
  circles.forEach((circle, i) => {
    const t = Date.now() / 1000;
    circle.oradius = circle.oradius || circle.radius;
    circle.radius =
      circle.oradius + (i % 2 ? Math.sin : Math.cos)(t * 2) * 5;
  });
}

export function orbitalUpdater(circles) {
  circles.forEach(circle => {
    const t = Date.now() / 1000;
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
    color: [44, 249, 172],
    radius: 60,
    x: width / 2 - 100,
    y: height / 2 + 150,
    vx: -8,
    vy: 0,
    ax: 0,
    ay: 0
  },
  {
    color: [255, 255, 0],
    radius: 60,
    x: width / 2 + 100,
    y: height / 2 - 150,
    vx: 8,
    vy: 0,
    ax: 0,
    ay: 0
  }
];
