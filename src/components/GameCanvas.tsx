import { RotateCcw, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiUrl } from "../api";
import { useGameStore } from "../store/gameStore";
import type { Direction } from "../types";

const KEY_TO_DIR: Record<string, Direction> = {
  ArrowUp: "U",
  w: "U",
  ArrowDown: "D",
  s: "D",
  ArrowLeft: "L",
  a: "L",
  ArrowRight: "R",
  d: "R"
};

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { engine, level, reset } = useGameStore();
  const [snapshot, setSnapshot] = useState(engine.snapshot());
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    engine.draw(context, rect.width, rect.height);
    setSnapshot(engine.snapshot());
  }, [engine]);

  useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIR[event.key];
      if (!direction) return;
      event.preventDefault();
      if (engine.move(direction)) draw();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [draw, engine]);

  const submit = async () => {
    setSubmitState("sending");
    try {
      const body = {
        level,
        levelId: level.id,
        replay: engine.serializeReplay(),
        timeMs: snapshot.elapsedMs,
        steps: snapshot.steps
      };
      const response = await fetch(apiUrl("/submit"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      setSubmitState(response.ok ? "done" : "error");
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <section className="game-shell">
      <div className="game-header">
        <div>
          <h1>Sokorace</h1>
          <p>{level.name} · {level.difficulty}</p>
        </div>
        <div className="stats">
          <span>{snapshot.steps} steps</span>
          <span>{(snapshot.elapsedMs / 1000).toFixed(1)}s</span>
        </div>
      </div>
      <canvas ref={canvasRef} className="game-canvas" aria-label="Sokoban board" tabIndex={0} />
      <div className="game-actions">
        <button title="Reset" onClick={() => { reset(); setSubmitState("idle"); }}>
          <RotateCcw size={18} />
        </button>
        <button title="Submit run" disabled={!snapshot.won || submitState === "sending"} onClick={submit}>
          <Send size={18} />
          <span>{submitState === "done" ? "Submitted" : "Submit"}</span>
        </button>
      </div>
    </section>
  );
}
