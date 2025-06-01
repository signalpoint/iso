// src/ecs/systems/DebugSystem.js

import { iso } from '../../math/iso.js';
import { TILE_W, TILE_H } from '../../config/tileSize.js';

//export const DebugSystem = (player, el, camera, grid) => () => {
//  const { x, y } = player.position;
//  const tid = grid[Math.floor(y)][Math.floor(x)]; // grass, water, etc
//  // Round to nearest whole tile so it's easy to read
//  el.textContent =
//  `Player ${Math.round(x)}, ${Math.round(y)}  |  Camera ${camera.pos.x.toFixed(1)}, ${camera.pos.y.toFixed(1)} | Tile ${Math.round(x)},${Math.round(y)}  id=${tid}`;
//
//};

export const DebugSystem = (player, el, mouse, grid, camera) => () => {
  // ---- player ------------------------------------------------------
  const px = player.position.x.toFixed(2);
  const py = player.position.y.toFixed(2);
  const { x, y } = player.position;
  const playerTid = grid[Math.floor(y)][Math.floor(x)]; // grass, water, etc

  // ---- mouse screen px --------------------------------------------
  const sx = mouse.x.toFixed(0);
  const sy = mouse.y.toFixed(0);

  // ---- mouse world coords -----------------------------------------
  // 1. screen → camera‑space
  const camSpaceX = (mouse.x - camera.canvas.width / 2) / camera.zoom;
  const camSpaceY = (mouse.y - camera.canvas.height / 2) / camera.zoom;

  // 2. camera offset
  const camIso = iso.toScreen(camera.pos, TILE_W, TILE_H);
  const isoX = camSpaceX + camIso.sx;
  const isoY = camSpaceY + camIso.sy;

  // 3. iso screen → world
  const world = iso.toWorld({ sx: isoX, sy: isoY }, TILE_W, TILE_H);
  const wx = world.x;
  const wy = world.y;

  const tx = Math.floor(wx);
  const ty = Math.floor(wy);
  const tid = grid[ty]?.[tx] ?? '—';

  el.innerHTML =
    `Player ${Math.round(x)}, ${Math.round(y)} <br /> Camera ${camera.pos.x.toFixed(1)}, ${camera.pos.y.toFixed(1)} <br /> Tile ${Math.round(x)},${Math.round(y)} <br /> id=${playerTid} <br /><br />` +
    `Player  tile: ${px}, ${py}<br />` +
    `Mouse   px:   ${sx}, ${sy}<br />` +
    `Mouse   world:${wx.toFixed(2)}, ${wy.toFixed(2)}<br />` +
    `Mouse   tile: ${tx}, ${ty}  id=${tid}`;

  // ---- optional: log clicks ---------------------------------------
  if (mouse.click) {
    console.log('Mouse click',
      { screen: { x: mouse.click.x, y: mouse.click.y },
        world:  { x: wx, y: wy },
        tile:   { x: tx, y: ty, id: tid } });
    mouse.click = null;
  }
};