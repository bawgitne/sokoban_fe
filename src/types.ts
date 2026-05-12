export type Cell = "wall" | "floor" | "target";
export type Direction = "U" | "D" | "L" | "R";

export interface Point {
  x: number;
  y: number;
}

export interface LevelData {
  id: string;
  name: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  author: string;
  grid: string[];
}

export interface ReplayAction {
  action: Direction | "W";
  at: number;
}

export interface LeaderboardEntry {
  rank: number;
  userName: string;
  timeMs: number;
  steps: number;
  createdAt: string;
}
