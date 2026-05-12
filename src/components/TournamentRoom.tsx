import { Radio } from "lucide-react";

export function TournamentRoom() {
  return (
    <aside className="panel compact">
      <h2><Radio size={18} /> Tournament Room</h2>
      <p className="muted">Team races and live room WebSockets are wired in the Worker Durable Object.</p>
    </aside>
  );
}
