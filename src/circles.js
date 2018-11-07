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
  circles.forEach((circle, i) => {
    const t = Date.now() / 1000;
    circle.x += (Math.cos(t) * circle.radius * circle.vx) / 200;
    circle.y +=
      (((Math.sin(t) * circle.radius) / 2 + Math.cos(t) * 20) *
        circle.vy) /
      200;
  });
}

export const createCircles = (width, height) => [
  {
    color: [255, 255, 0],
    radius: 120,
    x: width / 2,
    y: height / 2,
    vx: 10,
    vy: 0
  },
  {
    color: [255, 255, 0],
    radius: 80,
    x: width / 2 - 100,
    y: height / 2 - 100,
    vx: 10,
    vy: 0
  },
  {
    color: [0, 255, 170],
    radius: 80,
    x: width / 2,
    y: height / 2,
    vx: 10,
    vy: 0
  },
  {
    color: [0, 255, 170],
    radius: 50,
    x: width / 2,
    y: height / 2,
    vx: 10,
    vy: 0
  }
];
