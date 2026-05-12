import { officialLevels } from "../levels/officialLevels";
import { useGameStore } from "../store/gameStore";

export function LevelSelect() {
  const { level, selectLevel } = useGameStore();

  return (
    <aside className="panel">
      <h2>Official Levels</h2>
      <div className="level-list">
        {officialLevels.map((item) => (
          <button
            key={item.id}
            className={item.id === level.id ? "active" : ""}
            onClick={() => selectLevel(item)}
          >
            <span>{item.name}</span>
            <small>{item.difficulty}</small>
          </button>
        ))}
      </div>
    </aside>
  );
}
