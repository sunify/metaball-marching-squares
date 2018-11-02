import {
  calcCirclesWeight,
  interpolateLines,
  getSquareLines
} from './metaballs';

const corners = [[0, 0], [1, 0], [1, 1], [0, 1]];

export function createMetaballsDrawer(circles, grid) {
  const ballsCanvas = document.createElement('canvas');
  const ballsCtx = ballsCanvas.getContext('2d');

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

  return (width, height) => {
    ballsCanvas.width = width;
    ballsCanvas.height = height;

    ballsCtx.fillStyle = '#000';
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
                circles,
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

    return ballsCanvas;
  };
}
