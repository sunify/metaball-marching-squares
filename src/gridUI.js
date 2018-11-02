export function initGridUI(grid) {
  const gridSizeInput = document.getElementById('gridSize');
  const gridVisInput = document.getElementById('gridVisibility');
  const gridSizeValue = document.getElementById('gridSizeValue');

  grid.visible = gridVisInput.checked;
  const updateGridSize = input => {
    grid.size = Number(input.value);
    gridSizeValue.innerText = `Grid: ${grid.size}px`;
  };
  updateGridSize(gridSizeInput);
  gridSizeInput.addEventListener('input', e => {
    updateGridSize(e.target);
  });
  gridVisInput.addEventListener('change', e => {
    grid.visible = e.target.checked;
  });
}

export function drawGrid(ctx, grid) {
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
