import { create } from "zustand";
import { GameEngine } from "../game/GameEngine";
import { officialLevels } from "../levels/officialLevels";
import type { LevelData } from "../types";

interface GameStore {
  level: LevelData;
  engine: GameEngine;
  selectLevel: (level: LevelData) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  level: officialLevels[0],
  engine: new GameEngine(officialLevels[0]),
  selectLevel: (level) => set({ level, engine: new GameEngine(level) }),
  reset: () => set({ engine: new GameEngine(get().level) })
}));
