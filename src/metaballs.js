import { lerp } from './utils';

export const cornersByIndex = i =>
  (i >>> 0).toString(2).padStart(4, '0');
const square_types = Array.from(new Array(16), (_, n) =>
  cornersByIndex(n)
    .split('')
    .map(Number)
);

export function interpolateLines(lines, cornerWeights) {
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

export function calcCirclesWeight(circles, x, y) {
  return circles.reduce((sum, circle) => {
    return (
      sum +
      Math.pow(circle.radius, 2) /
        (Math.pow(circle.x - x, 2) + Math.pow(circle.y - y, 2))
    );
  }, 0);
}

function cornersIsEq(c1, c2) {
  return (
    c1[0] === c2[0] &&
    c1[1] === c2[1] &&
    c1[2] === c2[2] &&
    c1[3] === c2[3]
  );
}

function cornersSign(cornersArr) {
  return cornersByIndex(
    square_types.findIndex(cornersIsEq.bind(null, cornersArr))
  );
}

const cornersMap = {
  '0001': [[0, 0.5, 0.5, 1, 0, 1]],
  '0010': [[1, 0.5, 0.5, 1, 1, 1]],
  '0011': [[0, 0.5, 1, 0.5, 1, 1, 0, 1]],
  '0100': [[0.5, 0, 1, 0.5, 1, 0]],
  '0101': [[0, 0.5, 0.5, 0, 1, 0, 1, 0.5, 0.5, 1, 0, 1]],
  '0110': [[0.5, 0, 0.5, 1, 1, 1, 1, 0]],
  '0111': [[0, 0.5, 0.5, 0, 1, 0, 1, 1, 0, 1]],
  '1000': [[0, 0.5, 0.5, 0, 0, 0]],
  '1001': [[0.5, 0, 0.5, 1, 0, 1, 0, 0]],
  '1010': [[0, 0.5, 0.5, 1, 1, 1, 1, 0.5, 0.5, 0, 0, 0]],
  '1011': [[0.5, 0, 1, 0.5, 1, 1, 0, 1, 0, 0]],
  '1100': [[0, 0.5, 1, 0.5, 1, 0, 0, 0]],
  '1101': [[0.5, 1, 1, 0.5, 1, 0, 0, 0, 0, 1]],
  '1110': [[0, 0.5, 0.5, 1, 1, 1, 1, 0, 0, 0]],
  '1111': [[0, 0, 1, 0, 1, 1, 0, 1]]
};
export function getSquareLines(weights) {
  const corners = cornersSign(weights.map(n => (n >= 1 ? 1 : 0)));
  return cornersMap[corners];
}
