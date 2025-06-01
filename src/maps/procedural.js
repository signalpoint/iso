// src/maps/procedural.js
import palette from './palette.js';
import * as ID from '../maps/tileIds.js';


export function generate(rows = 60, cols = 60) {
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );

  // quick noise: water blobs + asphalt stripe
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const noise = Math.random();
//      grid[y][x] = noise < 0.05      ? 4   // water
//                 : noise < 0.35      ? 1   // mid grass
//                 : noise < 0.55      ? 2   // light grass
//                 : 0;                       // dark grass
//      grid[y][x] = noise < 0.03      ? 4   // water
//                 : noise < 0.46      ? 1   // mid grass
//                 : noise < 0.46      ? 2   // light grass
//                 : 0;                       // dark grass
      grid[y][x] = noise < 0.05      ? ID.WATER   // water
                 : noise < 0.35      ? ID.GRASS_MID   // mid grass
                 : noise < 0.55      ? ID.GRASS_LIGHT   // light grass
                 : ID.GRASS_DARK;                       // dark grass
    }
  }

  // asphalt road
  const roadY = Math.floor(rows / 2);
//  for (let x = 0; x < cols; x++) grid[roadY][x] = 3;
  for (let x = 0; x < cols; x++) grid[roadY][x] = ID.ASPHALT;

  return grid;
}
