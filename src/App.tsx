import { GameCanvas } from "./components/GameCanvas";
import { Leaderboard } from "./components/Leaderboard";
import { LevelSelect } from "./components/LevelSelect";
import { RoomPanel } from "./components/RoomPanel";

export default function App() {
  return (
    <main className="app">
      <div className="layout">
        <LevelSelect />
        <GameCanvas />
        <div className="right-rail">
          <RoomPanel />
          <Leaderboard />
        </div>
      </div>
    </main>
  );
}
