import runWithFPS from 'run-with-fps';
import { random } from './utils';

const gridSizeInput = document.getElementById('gridSize');
const gridVisInput = document.getElementById('gridVisibility');
const gridSizeValue = document.getElementById('gridSizeValue');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = window.innerWidth;
const height = window.innerHeight;

const grid = {
  size: 1,
  visible: gridVisInput.checked,
  get cols() {
    return width / this.size;
  },
  get rows() {
    return height / this.size;
  }
};

const updateGrid = input => {
  grid.size = Number(input.value);
  gridSizeValue.innerText = `Grid: ${grid.size}px`;
};
updateGrid(gridSizeInput);
gridSizeInput.addEventListener('input', e => {
  updateGrid(e.target);
});
gridVisInput.addEventListener('change', e => {
  grid.visible = e.target.checked;
});

const ballsCanvas = document.createElement('canvas');
const ballsCtx = ballsCanvas.getContext('2d');
ballsCanvas.width = width;
ballsCanvas.height = height;

const gradCanvas = document.createElement('canvas');
const gradCtx = gradCanvas.getContext('2d');

const cornersByIndex = i => (i >>> 0).toString(2).padStart(4, '0');
const square_types = Array.from(new Array(16), (_, n) =>
  cornersByIndex(n)
    .split('')
    .map(Number)
);

const corners = [[0, 0], [1, 0], [1, 1], [0, 1]];

const circles = [
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

canvas.width = width;
canvas.height = height;
gradCanvas.width = width;
gradCanvas.height = height;

function draw() {
  ctx.fillStyle = '#000';
  canvas.width = width;
  ballsCanvas.width = width;
  gradCanvas.width = width;

  updateCircles();
  drawMetaballs();

  ctx.drawImage(ballsCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-in';

  drawGradient();

  ctx.drawImage(gradCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  // drawCircles();

  if (grid.visible) {
    drawGrid();
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

function drawMetaballs() {
  ctx.fillStyle = '#000';
  const visited = [];
  circles.forEach(circle => {
    const padding = circle.radius * 4;
    const fromI = Math.max(
      0,
      Math.floor((circle.x - padding) / grid.size)
    );
    const fromJ = Math.max(
      0,
      Math.floor((circle.y - padding) / grid.size)
    );
    const toI = Math.min(
      grid.cols,
      Math.floor((circle.x + padding) / grid.size)
    );
    const toJ = Math.min(
      grid.cols,
      Math.floor((circle.y + padding) / grid.size)
    );

    for (let i = fromI; i < toI; i += 1) {
      for (let j = fromJ; j < toJ; j += 1) {
        const index = j * grid.cols + i;
        if (!visited[index]) {
          const cornerWeights = corners.map(([cx, cy]) =>
            calcCirclesWeight(
              (cx + i) * grid.size,
              (cy + j) * grid.size
            )
          );
          const lines = getSquareLines(cornerWeights);
          if (lines) {
            drawLines(i, j, interpolateLines(lines, cornerWeights));
          }

          visited[index] = true;
        }
      }
    }
  });
}

function drawGradient() {
  circles.forEach(circle => {
    gradCtx.globalCompositeOperation = 'source-over';
    const grad = gradCtx.createRadialGradient(
      circle.x,
      circle.y,
      circle.radius * 0,
      circle.x,
      circle.y,
      circle.radius * 2.5
    );
    grad.addColorStop(0, `rgba(${circle.color.join(', ')}, 1)`);
    grad.addColorStop(1, `rgba(${circle.color.join(', ')}, 0)`);
    gradCtx.fillStyle = grad;
    gradCtx.fillRect(
      circle.x - circle.radius * 2.5,
      circle.y - circle.radius * 2.5,
      circle.radius * 5,
      circle.radius * 5
    );
    gradCtx.fillRect(
      circle.x - circle.radius * 2.5,
      circle.y - circle.radius * 2.5,
      circle.radius * 5,
      circle.radius * 5
    );
  });
}

function drawLines(i, j, lines) {
  ballsCtx.strokeStyle = '#0f0';
  lines.forEach(line => {
    ballsCtx.beginPath();
    ballsCtx.moveTo(
      (i + line[0]) * grid.size,
      (j + line[1]) * grid.size
    );
    for (let l = 2; l < line.length; l += 2) {
      ballsCtx.lineTo(
        (i + line[l]) * grid.size,
        (j + line[l + 1]) * grid.size
      );
    }
    ballsCtx.fill();
  });
}

function interpolateLines(lines, cornerWeights) {
  // return lines;
  return lines.map(line => {
    for (let i = 0; i < line.length; i += 2) {
      const x = line[i];
      const y = line[i + 1];

      if ((x === 0 || x === 1) && (y === 0 || y === 1)) {
        // it's corner
        continue;
      }

      if (x === 0 || x === 1) {
        line[i + 1] = lerp(
          ...(x === 0
            ? [cornerWeights[0], cornerWeights[3]]
            : [cornerWeights[1], cornerWeights[2]])
        );
      }

      if (y === 0 || y === 1) {
        line[i] = lerp(
          ...(y === 0
            ? [cornerWeights[0], cornerWeights[1]]
            : [cornerWeights[3], cornerWeights[2]])
        );
      }
    }
    return line;
  });
}

function drawGrid() {
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 0.1;
  for (let i = 0; i < grid.cols; i += 1) {
    for (let j = 0; j < grid.rows; j += 1) {
      ctx.beginPath();
      ctx.rect(i * grid.size, j * grid.size, grid.size, grid.size);
      ctx.stroke();
    }
  }
}

function calcCirclesWeight(x, y) {
  return circles.reduce((sum, circle) => {
    return (
      sum +
      Math.pow(circle.radius, 2) /
        (Math.pow(circle.x - x, 2) + Math.pow(circle.y - y, 2))
    );
  }, 0);
}

function updateCircles() {
  const padding = 100;
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
    // if (
    //   circle.x + circle.radius + padding > width ||
    //   circle.x - circle.radius - padding < 0
    // ) {
    //   circle.vx *= -1;
    // }

    // if (
    //   circle.y + circle.radius + padding > height ||
    //   circle.y - circle.radius - padding < 0
    // ) {
    //   circle.vy *= -1;
    // }
  });
}

function cornersIsEq(c1, c2) {
  return c1.reduce((eq, ci, i) => eq && ci === c2[i], true);
}

function cornersSign(cornersArr) {
  return cornersByIndex(
    square_types.findIndex(cornersIsEq.bind(null, cornersArr))
  );
}

function getSquareLines(weights) {
  const corners = cornersSign(weights.map(n => (n >= 1 ? 1 : 0)));
  switch (
    corners // easier to read corners configuration
  ) {
    case '0001':
      return [[0, 0.5, 0.5, 1, 0, 1]];
    case '0010':
      return [[1, 0.5, 0.5, 1, 1, 1]];
    case '0011':
      return [[0, 0.5, 1, 0.5, 1, 1, 0, 1]];
    case '0100':
      return [[0.5, 0, 1, 0.5, 1, 0]];
    case '0101':
      return [[0, 0.5, 0.5, 0, 1, 0, 1, 0.5, 0.5, 1, 0, 1]];
    case '0110':
      return [[0.5, 0, 0.5, 1, 1, 1, 1, 0]];
    case '0111':
      return [[0, 0.5, 0.5, 0, 1, 0, 1, 1, 0, 1]];
    case '1000':
      return [[0, 0.5, 0.5, 0, 0, 0]];
    case '1001':
      return [[0.5, 0, 0.5, 1, 0, 1, 0, 0]];
    case '1010':
      return [[0, 0.5, 0.5, 1, 1, 1, 1, 0.5, 0.5, 0, 0, 0]];
    case '1011':
      return [[0.5, 0, 1, 0.5, 1, 1, 0, 1, 0, 0]];
    case '1100':
      return [[0, 0.5, 1, 0.5, 1, 0, 0, 0]];
    case '1101':
      return [[0.5, 1, 1, 0.5, 1, 0, 0, 0, 0, 1]];
    case '1110':
      return [[0, 0.5, 0.5, 1, 1, 1, 1, 0, 0, 0]];
    case '1111':
      return [[0, 0, 1, 0, 1, 1, 0, 1]];
  }
}

// Linear interpolation
function lerp(b_w, d_w, by = 0, dy = 1) {
  if (b_w === d_w) {
    return null;
  }

  return by + ((dy - by) * (1 - b_w)) / (d_w - b_w);
}
