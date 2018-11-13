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

const base = {
  ax: random(-1, 1) * 50,
  ay: random(-1, 1) * 50
};

export const createCircles = (width, height) => [
  {
    ...base,
    color: [0, 255, 140],
    radius: 40,
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0
  },
  {
    ...base,
    color: [0, 255, 170],
    radius: 70,
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0
  },
  {
    ...base,
    color: [255, 255, 0],
    radius: 60,
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0
  },
  {
    ...base,
    color: [0, 255, 140],
    radius: 50,
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0
  }
  // {
  //   ...base,
  //   color: [255, 255, 0],
  //   radius: 60,
  //   x: width / 2,
  //   y: height / 2,
  //   vx: 0,
  //   vy: 0
  // },
  // {
  //   ...base,
  //   color: [255, 255, 0],
  //   radius: 60,
  //   x: width / 2,
  //   y: height / 2,
  //   vx: 0,
  //   vy: 0
  // }
];
