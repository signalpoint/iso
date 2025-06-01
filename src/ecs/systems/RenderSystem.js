// 2‑space indent, ES6 module
export const RenderSystem = (ctx, camera) => (entities) => {
  ctx.save();
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.scale(camera.zoom, camera.zoom);

  // ❶ Sort all sprite‑bearing entities by their on‑screen Y
  const drawable = [...entities]
    .filter(e => e.components.sprite)
    .sort((a, b) => a.components.position.y - b.components.position.y);

  // ❷ Draw in back‑to‑front order
  for (const e of drawable) {
    const {x, y} = camera.worldToScreen(e.components.position);
    e.components.sprite.draw(ctx, x, y);
  }

  ctx.restore();
};
