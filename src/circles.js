import { random } from './utils';

export function orbitalUpdater(circles) {
  circles.forEach(circle => {
    const t = Date.now() / 1000;
    circle.ox = circle.ox || circle.x;
    circle.oy = circle.oy || circle.y;
    circle.x =
      circle.ox + Math.cos(t) * circle.radius * circle.vx * 0.3;
    circle.y =
      circle.oy +
      Math.sin(t) * circle.radius * circle.vy +
      Math.cos(t) * 20;
  });
}

export const createCircles = (width, height) => [
  {
    color: [0, 255, 170],
    radius: 50,
    x: width / 2 + 30,
    y: height / 2 - 30,
    vx: random(-2, 2),
    vy: random(-2, 2)
  },
  {
    color: [0, 255, 170],
    radius: 40,
    x: width / 2 + 100,
    y: height / 2 - 30,
    vx: random(-5, 2),
    vy: random(-2, 5)
  },
  {
    color: [255, 255, 0],
    radius: 75,
    x: width / 2 + 40,
    y: height / 2 + 40,
    vx: random(-5, 2),
    vy: random(-2, 5)
  },
  {
    color: [255, 255, 0],
    radius: 60,
    x: width / 2,
    y: height / 2,
    vx: random(-2, 2),
    vy: random(-2, 2)
  }
];
