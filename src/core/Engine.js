export class Engine {
  constructor() {
    this.last = 0;
    this.entities = new Set();
    this.systems = [];
  }

  add(entity) { this.entities.add(entity); }
  use(system) { this.systems.push(system); }

  start() { requestAnimationFrame(this.tick); }

  tick = (ts) => {
    const dt = (ts - this.last) / 1000;
    this.last = ts;
    for (const sys of this.systems) sys(this.entities, dt);
    requestAnimationFrame(this.tick);
  };
}
