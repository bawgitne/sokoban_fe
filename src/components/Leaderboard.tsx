import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { apiUrl } from "../api";
import { useGameStore } from "../store/gameStore";
import type { LeaderboardEntry } from "../types";

export function Leaderboard() {
  const levelId = useGameStore((state) => state.level.id);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetch(apiUrl(`/leaderboard/${levelId}`))
      .then((response) => response.ok ? response.json() : [])
      .then(setEntries)
      .catch(() => setEntries([]));
  }, [levelId]);

  return (
    <aside className="panel">
      <h2><Trophy size={18} /> Global Leaderboard</h2>
      <div className="leaderboard">
        {entries.length === 0 ? (
          <p className="muted">No verified runs yet.</p>
        ) : entries.map((entry) => (
          <div key={`${entry.rank}-${entry.userName}-${entry.createdAt}`} className="leaderboard-row">
            <strong>#{entry.rank}</strong>
            <span>{entry.userName}</span>
            <span>{(entry.timeMs / 1000).toFixed(2)}s</span>
            <span>{entry.steps}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
