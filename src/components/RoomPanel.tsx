import { Copy, LogOut, Plus, RefreshCw, Users } from "lucide-react";
import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { useRoomStore } from "../store/roomStore";

export function RoomPanel() {
  const { level, selectLevel } = useGameStore();
  const { playerName, setPlayerName, room, status, createRoom, joinRoom, refreshRoom, leaveRoom } = useRoomStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const onCreate = async () => {
    setError("");
    try {
      await createRoom(level);
    } catch {
      setError("Could not create room.");
    }
  };

  const onJoin = async () => {
    setError("");
    try {
      const joined = await joinRoom(code);
      selectLevel(joined.level);
    } catch {
      setError("Room code not found.");
    }
  };

  return (
    <aside className="panel room-panel">
      <h2><Users size={18} /> Race Room</h2>
      <label className="field">
        <span>Name</span>
        <input value={playerName} onChange={(event) => setPlayerName(event.target.value)} maxLength={24} />
      </label>

      {room ? (
        <div className="room-active">
          <div className="room-code">
            <strong>{room.code}</strong>
            <button title="Copy room code" onClick={() => navigator.clipboard?.writeText(room.code)}>
              <Copy size={16} />
            </button>
          </div>
          <p className="muted">Level: {room.level.name}</p>
          <div className="room-actions">
            <button title="Refresh room" onClick={refreshRoom}><RefreshCw size={16} /></button>
            <button title="Leave room" onClick={leaveRoom}><LogOut size={16} /></button>
          </div>
          <div className="room-list">
            <strong>Players</strong>
            {room.players.map((player) => <span key={player.id}>{player.name}</span>)}
          </div>
          <div className="room-list">
            <strong>Results</strong>
            {room.results.length === 0 ? <span>No finish yet</span> : room.results.map((result, index) => (
              <span key={result.player_id}>
                #{index + 1} {result.player_name} - {(result.time_ms / 1000).toFixed(2)}s / {result.steps}
              </span>
            ))}
          </div>
          {room.winner ? <p className="winner">Winner: {room.winner.player_name}</p> : null}
        </div>
      ) : (
        <div className="room-create">
          <button className="wide-button" onClick={onCreate}>
            <Plus size={16} />
            <span>Create room</span>
          </button>
          <div className="join-row">
            <input placeholder="Room code" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} />
            <button onClick={onJoin}>Join</button>
          </div>
        </div>
      )}

      {status ? <p className="muted">{status}</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </aside>
  );
}
