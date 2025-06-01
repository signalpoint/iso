export const iso = {
  toScreen: ({x, y, z = 0}, tileW, tileH) => ({
    sx: (x - y) * (tileW / 2),
    sy: (x + y) * (tileH / 2) - z
  }),
  toWorld: ({sx, sy}, tileW, tileH) => ({
    x: (sy / (tileH / 2) + sx / (tileW / 2)) / 2,
    y: (sy / (tileH / 2) - sx / (tileW / 2)) / 2
  })
};
