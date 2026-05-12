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

export interface RoomPlayer {
  id: string;
  name: string;
  joined_at: string;
}

export interface RoomResult {
  player_id: string;
  player_name: string;
  time_ms: number;
  steps: number;
  submitted_at: string;
}

export interface RaceRoom {
  code: string;
  mode: "solo" | "team";
  levelId: string;
  level: LevelData;
  players: RoomPlayer[];
  results: RoomResult[];
  winner: RoomResult | null;
}
