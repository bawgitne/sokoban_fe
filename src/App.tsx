import { AuthUI } from "./components/AuthUI";
import { GameCanvas } from "./components/GameCanvas";
import { Leaderboard } from "./components/Leaderboard";
import { LevelSelect } from "./components/LevelSelect";
import { TournamentRoom } from "./components/TournamentRoom";

export default function App() {
  return (
    <main className="app">
      <AuthUI />
      <div className="layout">
        <LevelSelect />
        <GameCanvas />
        <div className="right-rail">
          <Leaderboard />
          <TournamentRoom />
        </div>
      </div>
    </main>
  );
}
