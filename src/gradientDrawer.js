export function createGradientDrawer(circles) {
  const gradCanvas = document.createElement('canvas');
  const gradCtx = gradCanvas.getContext('2d');

  return (width, height) => {
    gradCanvas.width = width;
    gradCanvas.height = height;
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

    return gradCanvas;
  };
}
