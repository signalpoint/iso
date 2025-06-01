// src/io/Mouse.js
export class Mouse {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = 0;        // screen px
    this.y = 0;
    this.click = null; // last click info

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      this.x = e.clientX - rect.left;
      this.y = e.clientY - rect.top;
    });

    canvas.addEventListener('click', e => {
      this.click = { x: this.x, y: this.y, time: performance.now() };
    });
  }
}
