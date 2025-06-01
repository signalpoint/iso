// src/ecs/systems/CollisionSystem.js
import { TILE_W, TILE_H } from '../../config/tileSize.js';

export const CollisionSystem = (walkable) => (ents) => {
  for (const e of ents) {
    if (!e.position) continue;
    const { x, y } = e.position;
    const tx = Math.round(x);
    const ty = Math.round(y);
    if (!walkable[ty]?.[tx]) {
      // simple "snap back" – reset to previous tile centre
      e.position.x = Math.max(0, Math.min(walkable[0].length - 1, tx));
      e.position.y = Math.max(0, Math.min(walkable.length - 1,  ty));
    }
  }
};
