//// src/ecs/systems/InputSystem.js
//export const InputSystem = (kb, speed = 4) => (ents) => {
//  for (const e of ents) {
//    if (!e.velocity) continue;
//    let vx = 0, vy = 0;
//    if (kb.isDown('w')) vy--;
//    if (kb.isDown('s')) vy++;
//    if (kb.isDown('a')) vx--;
//    if (kb.isDown('d')) vx++;
//    e.velocity.x = vx * speed;
//    e.velocity.y = vy * speed;
//  }
//};

// src/ecs/systems/InputSystem.js
export const InputSystem = (kb, speed = 6) => (ents) => {
  // 1. Convert pressed keys → world‑space direction
  let dx = 0;
  let dy = 0;

  if (kb.isDown('w')) { dx -= 1; dy -= 1; }
  if (kb.isDown('s')) { dx += 1; dy += 1; }
  if (kb.isDown('a')) { dx -= 1; dy += 1; }
  if (kb.isDown('d')) { dx += 1; dy -= 1; }

  // 2. Normalise so diagonal ≈ straight speed
  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy);   // √2 on diagonals, 1 on cardinals
    dx = (dx / len) * speed;
    dy = (dy / len) * speed;
  }

  // 3. Apply to every entity that owns a velocity component
  for (const e of ents) {
    if (e.velocity) {
      e.velocity.x = dx;
      e.velocity.y = dy;
    }
  }
};
