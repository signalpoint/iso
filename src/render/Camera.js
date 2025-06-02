// src/render/Camera.js
import { TILE_W, TILE_H } from '../config/tileSize.js';
import { iso } from '../math/iso.js';

export class Camera {
  constructor(canvas, target) {
    this.canvas = canvas;
    this.target = target;      // entity to follow

//    this.pos  = { x: 0, y: 0 };
//    this.zoom = 1;

    // initialise at target so there’s no early offset
    this.pos = target?.position ? { ...target.position } : { x: 0, y: 0 };
    this.zoom = 1;

    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      this.zoom = Math.min(4, Math.max(0.5, this.zoom * factor));
    });
  }

  update(dt) {

//    // smooth follow (aka "lerp", linear interpolation)
//    const lerp = 5 * dt;       // 5 = snappiness
//    if (this.target?.position) {
//      this.pos.x += (this.target.position.x - this.pos.x) * lerp;
//      this.pos.y += (this.target.position.y - this.pos.y) * lerp;
//    }

    if (!this.didInit) {        // do this once
      this.pos.x = this.target.position.x;
      this.pos.y = this.target.position.y;
      this.didInit = true;
      return;
    }
    const k = 5 * dt;
    this.pos.x += (this.target.position.x - this.pos.x) * k;
    this.pos.y += (this.target.position.y - this.pos.y) * k;

  }

  worldToScreen(pt) {
    const { sx, sy } = iso.toScreen(pt, TILE_W, TILE_H);
    return {

//      x: (sx - this.pos.x * TILE_W / 2) * this.zoom + this.canvas.width  / 2,
//      y: (sy - this.pos.y * TILE_H / 2) * this.zoom + this.canvas.height / 2

//      x: (sx - this.pos.x) + this.canvas.width  / 2,
//      y: (sy - this.pos.y) + this.canvas.height / 2

      x: (sx - this.pos.x * TILE_W / 2) + this.canvas.width  / 2,
      y: (sy - this.pos.y * TILE_H / 2) + this.canvas.height / 2

    };
  }
}
