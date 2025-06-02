import { TILE_W, TILE_H } from '../config/tileSize.js';
import { iso } from '../math/iso.js';
import colours from '../maps/palette.js';
import * as ID from '../maps/tileIds.js';

const CHUNK = 20;  // 20×20‑tile canvas
const HALF_W = TILE_W / 2;
const HALF_H = TILE_H / 2;

export class IsoMap {
  constructor(grid) {
    this.grid = grid;
//    this.chunks = new Map();   // "cx,cy" → off‑screen canvas
    // "cx,cy" → { cvs, offX, offY }
    this.chunks = new Map();
  }

//  #renderChunk(cx, cy, camera) {
//    const cvs = new OffscreenCanvas(CHUNK * TILE_W, CHUNK * TILE_H);
//    const ctx = cvs.getContext('2d');
//    const startX = cx * CHUNK;
//    const startY = cy * CHUNK;
//
//    for (let y = 0; y < CHUNK; y++) {
//      for (let x = 0; x < CHUNK; x++) {
//
//        const gid = this.grid[startY + y]?.[startX + x];
//        if (gid == null) continue;
//
//        const sx = (x - y) * (TILE_W / 2) + CHUNK * TILE_W / 2;
//        const sy = (x + y) * (TILE_H / 2);
//
////        ctx.save();
////        ctx.translate(sx, sy);
//
//        const screen = camera.worldToScreen({ x, y });
//        // round once so the diamond’s four vertices land on whole pixels
//        const rsx = Math.round(sx);
//        const rsy = Math.round(sy);
//        ctx.save();
//        ctx.translate(rsx, rsy);
//
//        ctx.beginPath();
//        ctx.moveTo(0, -TILE_H / 2);
//        ctx.lineTo(TILE_W / 2, 0);
//        ctx.lineTo(0, TILE_H / 2);
//        ctx.lineTo(-TILE_W / 2, 0);
//        ctx.closePath();
//        ctx.fillStyle = colours[gid];
//        ctx.fill();
//
//        ctx.restore();
//
//      }
//    }
//    return cvs;
//  }

  #renderChunk(cx, cy) {
    // 1. calculate geometric bounds of this chunk in iso‑space
    //    minSx occurs at (0, CHUNK‑1):  -(CHUNK-1)·halfW
    //    maxSx occurs at (CHUNK‑1,0):  +(CHUNK-1)·halfW
    const offX = (CHUNK - 1) * HALF_W;   // we'll shift drawing right by this
    const offY = 0;                      // vertical min is always 0

    const w = CHUNK * TILE_W;            // full horizontal span
    const h = CHUNK * TILE_H;            // full vertical span

    const cvs = new OffscreenCanvas(w, h);
    const ctx = cvs.getContext('2d');

    const startX = cx * CHUNK;
    const startY = cy * CHUNK;

    for (let y = 0; y < CHUNK; y++) {
      for (let x = 0; x < CHUNK; x++) {
        const gid = this.grid[startY + y]?.[startX + x];
        if (gid == null) continue;

        // iso screen pos relative to chunk origin
        const relSx = (x - y) * HALF_W;
        const relSy = (x + y) * HALF_H;

        ctx.save();
        ctx.translate(relSx + offX, relSy + offY);
        ctx.beginPath();
        ctx.moveTo(0, -HALF_H);
        ctx.lineTo(HALF_W, 0);
        ctx.lineTo(0, HALF_H);
        ctx.lineTo(-HALF_W, 0);
        ctx.closePath();
        ctx.fillStyle = colours[gid];
        ctx.fill();
        ctx.restore();
      }
    }
//    return { cvs, offX, offY };
    return cvs;
  }

  draw(ctx, camera) {

    const cols = Math.ceil(this.grid[0].length / CHUNK);
    const rows = Math.ceil(this.grid.length     / CHUNK);

//    const padX = (CHUNK * TILE_W / 2) * camera.zoom;
    const padX = (CHUNK * TILE_W / 2);


    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const key = `${cx},${cy}`;
        if (!this.chunks.has(key)) this.chunks.set(key, this.#renderChunk(cx, cy));

        // crude visibility test – skip if way off‑screen
        const centre = camera.worldToScreen({ x: (cx + 0.5) * CHUNK, y: (cy + 0.5) * CHUNK });
        if (centre.x < -TILE_W * CHUNK || centre.x > ctx.canvas.width  + TILE_W * CHUNK ||
            centre.y < -TILE_H * CHUNK || centre.y > ctx.canvas.height + TILE_H * CHUNK) {
          continue;
        }

//        const dx = (cx * CHUNK - cy * CHUNK) * (TILE_W / 2) - camera.pos.x * TILE_W / 2 + ctx.canvas.width / 2;
//        const dy = (cx * CHUNK + cy * CHUNK) * (TILE_H / 2) - camera.pos.y * TILE_H / 2 + ctx.canvas.height / 2;

        const isoX = (cx * CHUNK - cy * CHUNK) * (TILE_W / 2);
        const isoY = (cx * CHUNK + cy * CHUNK) * (TILE_H / 2);

        const dx = isoX - padX - camera.pos.x * TILE_W / 2 + ctx.canvas.width / 2;
        const dy = isoY -        camera.pos.y * TILE_H / 2 + ctx.canvas.height / 2;

        ctx.drawImage(

          this.chunks.get(key), // image

          dx,
          dy,

          TILE_W * CHUNK, // sWidth
          TILE_H * CHUNK,  // sHeight

//          Math.round(dx), // dx
//          Math.round(dy), // dy
//
//          Math.round(TILE_W * CHUNK), // sWidth
//          Math.round(TILE_H * CHUNK),  // sHeight

        );
      }
    }
  }
}

//export function buildWalkMap(grid) {
//  // water (id 4) and asphalt (id 3) are OK; others walkable
//  return grid.map(row => row.map(id => id !== 4)); // false = blocked
//}

export function buildWalkMap(grid) {
  return grid.map(row =>
    row.map(id => id !== ID.WATER)   // every non‑water tile is walkable
  );
}
