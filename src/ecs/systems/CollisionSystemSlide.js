// src/ecs/systems/CollisionSystemSlide.js
export const CollisionSystemSlide = (walkable, size = { w: 1, h: 1 }) =>
  (ents, dt) => {
    for (const e of ents) {
      if (!e.position || !e.velocity) continue;

      // ── attempt horizontal move ────────────────────────────
      const nextX = e.position.x + e.velocity.x * dt;
      if (isAreaClear(nextX, e.position.y, size, walkable)) {
        e.position.x = nextX;
      } else {
        e.velocity.x = 0;                 // block only X
      }

      // ── attempt vertical move ──────────────────────────────
      const nextY = e.position.y + e.velocity.y * dt;
      if (isAreaClear(e.position.x, nextY, size, walkable)) {
        e.position.y = nextY;
      } else {
        e.velocity.y = 0;                 // block only Y
      }
    }
  };

// helper – true if every tile the box touches is walkable
function isAreaClear(x, y, size, walkable) {
  const minX = Math.floor(x);
  const minY = Math.floor(y);
  const maxX = Math.floor(x + size.w - 1e-6);
  const maxY = Math.floor(y + size.h - 1e-6);

  for (let ty = minY; ty <= maxY; ty++) {
    for (let tx = minX; tx <= maxX; tx++) {
      if (!walkable[ty]?.[tx]) return false;
    }
  }
  return true;
}
