import { Engine }   from './core/Engine.js';
import { DebugSystem }     from './ecs/systems/DebugSystem.js';
import { InputSystem }     from './ecs/systems/InputSystem.js';
import { MovementSystem }  from './ecs/systems/MovementSystem.js';
//import { CollisionSystem } from './ecs/systems/CollisionSystem.js';
import { CollisionSystemSlide } from './ecs/systems/CollisionSystemSlide.js';
import { IsoMap }   from './render/IsoMap.js';
import { Camera }   from './render/Camera.js';
import { MiniMap }  from './render/MiniMap.js';
import { Keyboard } from './io/Keyboard.js';
import { Mouse } from './io/Mouse.js';
import { generate } from './maps/procedural.js';
import { buildWalkMap } from './render/IsoMap.js';   // same file

// 1. Boot canvas
const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;   // pixel‑art zooming
const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
window.addEventListener('resize', resize); resize();

// 2. Generate world
const grid      = generate(60, 60);
const walkable  = buildWalkMap(grid);
const isoMap    = new IsoMap(grid);

// 3. Create ECS + player
const engine   = new Engine();
const kb       = new Keyboard();
const mouse = new Mouse(canvas);

// ── debug read‑out ────────────────────────────────────────────
const debugEl = document.createElement('div');
debugEl.style.cssText = `
  position: absolute;
  top: 6px;
  left: 8px;
  padding: 2px 6px;
  background: rgba(0,0,0,.6);
  color: #0f0;
  font: 12px monospace;
  pointer-events: none;
  z-index: 1000;
`;
document.body.appendChild(debugEl);
window.addEventListener('keydown', e => {
  if (e.key === '`') debugEl.style.display =
      debugEl.style.display === 'none' ? 'block' : 'none';
});

//const player   = {
//  position:  { x: 30, y: 30 },
//  velocity:  { x: 0,  y: 0  },
//  sprite:    { color: '#ffd700' }
//};

const rows = grid.length;
const cols = grid[0].length;
const mapSize = Math.max(rows, cols); // 60

// ── centre of the map ─────────────────────────────────────────────
let cx = Math.floor(cols / 2);
let cy = Math.floor(rows / 2);

// ── spiral‑search for the first walkable tile (optional but robust)
if (!walkable[cy][cx]) {
  const dir = [ [1,0], [0,1], [-1,0], [0,-1] ];  // right, down, left, up
  let step = 1, i = 0;
  while (!walkable[cy][cx]) {
    for (let rep = 0; rep < 2; rep++) {      // 2 lines per “ring”
      for (let s = 0; s < step; s++) {
        cx += dir[i][0];
        cy += dir[i][1];
        if (walkable[cy]?.[cx]) break;
      }
      if (walkable[cy]?.[cx]) break;
      i = (i + 1) & 3;                       // rotate dir
    }
    step++;
  }
}

const player = {
  position:  { x: cx, y: cy },              // top‑left corner in tile space
  velocity:  { x: 0,  y: 0 },
  sprite:    { color: '#ffd700' }
//  size:      { w: 1, h: 1 }                 // if you’re using AABB
};
//console.log(player);

engine.add(player);

// Camera
const camera = new Camera(canvas, player);

// ⬇ snap immediately so the first frame is correct
camera.pos.x = player.position.x;
camera.pos.y = player.position.y;

// 4. Systems
//engine.use(DebugSystem(player, debugEl, camera, grid));
engine.use(DebugSystem(player, debugEl, mouse, grid, camera));
engine.use(InputSystem(kb, 6)); // 6 tiles per second (tweak to taste)
engine.use(MovementSystem);
//engine.use(CollisionSystem(walkable));
engine.use(CollisionSystemSlide(walkable));

// camera follow
engine.use((ents, dt) => camera.update(dt));

function drawWorldBorder(ctx, camera, mapSize) {
  const pts = [
    { x: 0,            y: 0            }, // NW
    { x: mapSize-1,    y: 0            }, // NE
    { x: mapSize-1,    y: mapSize-1    }, // SE
    { x: 0,            y: mapSize-1    }  // SW
  ].map(p => camera.worldToScreen(p));

  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  ctx.lineTo(pts[1].x, pts[1].y);
  ctx.lineTo(pts[2].x, pts[2].y);
  ctx.lineTo(pts[3].x, pts[3].y);
  ctx.closePath();
  ctx.strokeStyle = '#ff0';
  ctx.stroke();
}

// render
engine.use(() => {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(camera.zoom, camera.zoom);

  isoMap.draw(ctx, camera);

  drawWorldBorder(ctx, camera, mapSize);

  // draw player
  const pScreen = camera.worldToScreen(player.position);
  ctx.fillStyle = player.sprite.color;
  ctx.beginPath();
  ctx.moveTo(pScreen.x, pScreen.y - 8);
  ctx.lineTo(pScreen.x + 8, pScreen.y);
  ctx.lineTo(pScreen.x, pScreen.y + 8);
  ctx.lineTo(pScreen.x - 8, pScreen.y);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

});

// mini‑map
//const mini = new MiniMap(grid);
//engine.use(() => mini.drawPlayer(player.position));

// 5. Start
engine.start();
