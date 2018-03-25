const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let prevT = 0;
function runDraw(t) {
  requestAnimationFrame(runDraw);
  if (t - prevT < 1000 / 30) return;

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
