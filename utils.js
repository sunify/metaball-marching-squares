export function random(a, b) {
  return (b - a) * Math.random() + a;
}

export function dist(x, y, x1, y1) {
  return Math.hypot(x - x1, y - y1);
}

export function distFast(x1, y1, x2, y2) {
  // Approximation by using octagons approach
  const x = x2 - x1;
  const y = y2 - y1;
  return (
    1.426776695 *
    Math.min(
      0.7071067812 * (Math.abs(x) + Math.abs(y)),
      Math.max(Math.abs(x), Math.abs(y))
    )
  );
}
