const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let stopped = false;
window.addEventListener('click', () => {
  stopped = !stopped;
});

let prevT = 0;
function runDraw(t) {
  requestAnimationFrame(runDraw);
  if (t - prevT < 1000 / 30 || stopped) return;

  if (typeof draw === 'function') {
    draw();
  }

  prevT = t;
}

requestAnimationFrame(runDraw);

function random(a, b) {
  return (b - a) * Math.random() + a;
}

function dist(x, y, x1, y1) {
  return Math.hypot(x - x1, y - y1);
}

function distFast(x1, y1, x2, y2) {
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
