// src/ecs/systems/MovementSystem.js
export const MovementSystem = (ents, dt) => {
  for (const e of ents) {
    if (e.position && e.velocity) {
      e.position.x += e.velocity.x * dt;
      e.position.y += e.velocity.y * dt;
    }
  }
};
