import type { Cell, Direction, LevelData, Point, ReplayAction } from "../types";

const DELTAS: Record<Direction, Point> = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 }
};

export interface GameSnapshot {
  grid: Cell[][];
  player: Point;
  boxes: Point[];
  steps: number;
  startedAt: number;
  elapsedMs: number;
  won: boolean;
  replay: ReplayAction[];
}

export class GameEngine {
  private grid: Cell[][] = [];
  private player: Point = { x: 0, y: 0 };
  private boxes = new Set<string>();
  private replay: ReplayAction[] = [];
  private startedAt = 0;
  private steps = 0;
  private won = false;

  constructor(private level: LevelData) {
    this.load(level);
  }

  load(level: LevelData) {
    this.level = level;
    this.boxes = new Set();
    this.grid = level.grid.map((row, y) =>
      [...row].map((char, x): Cell => {
        if (char === "#") return "wall";
        if (char === "." || char === "*" || char === "+") return "target";
        if (char === "$" || char === "*") this.boxes.add(this.key({ x, y }));
        if (char === "@" || char === "+") this.player = { x, y };
        return "floor";
      })
    );
    this.replay = [];
    this.steps = 0;
    this.won = false;
    this.startedAt = performance.now();
  }

  move(direction: Direction, at = performance.now()): boolean {
    if (this.won) return false;
    const delta = DELTAS[direction];
    const next = { x: this.player.x + delta.x, y: this.player.y + delta.y };
    if (this.isBlocked(next)) return false;

    const nextKey = this.key(next);
    if (this.boxes.has(nextKey)) {
      const beyond = { x: next.x + delta.x, y: next.y + delta.y };
      if (this.isBlocked(beyond) || this.boxes.has(this.key(beyond))) return false;
      this.boxes.delete(nextKey);
      this.boxes.add(this.key(beyond));
    }

    this.player = next;
    this.steps += 1;
    this.replay.push({ action: direction, at: Math.round(at - this.startedAt) });
    this.won = this.isSolved();
    return true;
  }

  wait(at = performance.now()) {
    this.replay.push({ action: "W", at: Math.round(at - this.startedAt) });
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const rows = this.grid.length;
    const cols = Math.max(...this.grid.map((row) => row.length));
    const tile = Math.floor(Math.min(width / cols, height / rows));
    const offsetX = Math.floor((width - cols * tile) / 2);
    const offsetY = Math.floor((height - rows * tile) / 2);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f7f4ed";
    ctx.fillRect(0, 0, width, height);

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < this.grid[y].length; x += 1) {
        const px = offsetX + x * tile;
        const py = offsetY + y * tile;
        const cell = this.grid[y][x];
        ctx.fillStyle = cell === "wall" ? "#17212b" : "#ded6c7";
        ctx.fillRect(px, py, tile, tile);
        if (cell === "target") {
          ctx.fillStyle = "#c49b4e";
          ctx.beginPath();
          ctx.arc(px + tile / 2, py + tile / 2, tile * 0.16, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    for (const box of this.getBoxes()) {
      const px = offsetX + box.x * tile;
      const py = offsetY + box.y * tile;
      ctx.fillStyle = this.cellAt(box) === "target" ? "#4f7f52" : "#b65c38";
      ctx.fillRect(px + tile * 0.14, py + tile * 0.14, tile * 0.72, tile * 0.72);
    }

    const playerX = offsetX + this.player.x * tile;
    const playerY = offsetY + this.player.y * tile;
    ctx.fillStyle = "#215e82";
    ctx.beginPath();
    ctx.arc(playerX + tile / 2, playerY + tile / 2, tile * 0.32, 0, Math.PI * 2);
    ctx.fill();
  }

  snapshot(): GameSnapshot {
    return {
      grid: this.grid.map((row) => [...row]),
      player: { ...this.player },
      boxes: this.getBoxes(),
      steps: this.steps,
      startedAt: this.startedAt,
      elapsedMs: Math.round(performance.now() - this.startedAt),
      won: this.won,
      replay: [...this.replay]
    };
  }

  serializeReplay() {
    return this.replay.map((entry) => `${entry.action}:${entry.at}`).join(",");
  }

  private isSolved() {
    return this.getBoxes().every((box) => this.cellAt(box) === "target");
  }

  private isBlocked(point: Point) {
    return this.cellAt(point) === "wall";
  }

  private cellAt(point: Point): Cell {
    return this.grid[point.y]?.[point.x] ?? "wall";
  }

  private getBoxes() {
    return [...this.boxes].map((value) => {
      const [x, y] = value.split(":").map(Number);
      return { x, y };
    });
  }

  private key(point: Point) {
    return `${point.x}:${point.y}`;
  }
}
