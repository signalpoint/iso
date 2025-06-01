// src/render/MiniMap.js
export class MiniMap {
  constructor(grid, size = 200) {
    this.grid = grid;
    this.size = size;
    this.cvs  = document.createElement('canvas');
    this.cvs.width = this.cvs.height = size;
    this.cvs.style.position = 'absolute';
    this.cvs.style.right = '10px';
    this.cvs.style.top   = '10px';
    this.cvs.style.border = '1px solid #888';
    document.body.appendChild(this.cvs);
    this.ctx = this.cvs.getContext('2d');
    this.#renderStatic();
  }

  #renderStatic() {
    const rows = this.grid.length;
    const cols = this.grid[0].length;
    const px   = this.size / cols;
    const py   = this.size / rows;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const id = this.grid[y][x];
        this.ctx.fillStyle = id === 4 ? '#3166a3' : id === 3 ? '#555' : '#5d7b44';
        this.ctx.fillRect(x * px, y * py, px, py);
      }
    }
  }

  drawPlayer(pos) {
    const rows = this.grid.length;
    const cols = this.grid[0].length;
    const px   = this.size / cols;
    const py   = this.size / rows;
    this.ctx.clearRect(0, 0, this.size, this.size);
    this.#renderStatic();
    this.ctx.fillStyle = '#ff0';
    this.ctx.fillRect(pos.x * px - 2, pos.y * py - 2, 4, 4);
  }
}
