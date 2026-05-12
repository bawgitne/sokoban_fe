import { create } from "zustand";
import { apiUrl } from "../api";
import type { LevelData, RaceRoom } from "../types";

const PLAYER_ID_KEY = "sokorace.playerId";
const PLAYER_NAME_KEY = "sokorace.playerName";

function getPlayerId() {
  const existing = localStorage.getItem(PLAYER_ID_KEY);
  if (existing) return existing;
  const next = crypto.randomUUID();
  localStorage.setItem(PLAYER_ID_KEY, next);
  return next;
}

interface RoomStore {
  playerId: string;
  playerName: string;
  room: RaceRoom | null;
  status: string;
  setPlayerName: (name: string) => void;
  createRoom: (level: LevelData) => Promise<RaceRoom>;
  joinRoom: (code: string) => Promise<RaceRoom>;
  refreshRoom: () => Promise<void>;
  leaveRoom: () => void;
  setRoom: (room: RaceRoom) => void;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  playerId: getPlayerId(),
  playerName: localStorage.getItem(PLAYER_NAME_KEY) ?? "Player",
  room: null,
  status: "",
  setPlayerName: (name) => {
    const cleaned = name.slice(0, 24);
    localStorage.setItem(PLAYER_NAME_KEY, cleaned);
    set({ playerName: cleaned });
  },
  createRoom: async (level) => {
    set({ status: "Creating room..." });
    const { playerId, playerName } = get();
    const response = await fetch(apiUrl("/rooms"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, playerName, level, mode: "solo" })
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    set({ room: data.room, status: "Room ready" });
    return data.room;
  },
  joinRoom: async (code) => {
    set({ status: "Joining room..." });
    const { playerId, playerName } = get();
    const response = await fetch(apiUrl(`/rooms/${code.trim().toUpperCase()}/join`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, playerName })
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    set({ room: data.room, status: "Joined room" });
    return data.room;
  },
  refreshRoom: async () => {
    const room = get().room;
    if (!room) return;
    const response = await fetch(apiUrl(`/rooms/${room.code}`));
    if (!response.ok) return;
    const data = await response.json();
    set({ room: data.room });
  },
  leaveRoom: () => set({ room: null, status: "" }),
  setRoom: (room) => set({ room })
}));
