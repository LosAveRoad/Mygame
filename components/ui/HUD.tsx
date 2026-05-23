"use client";

import { useGameStore } from "@/lib/game-store";

function AffinityHearts({ affinity }: { affinity: number }) {
  const hearts = 5;
  const filled = Math.round((affinity / 100) * hearts);
  return (
    <span className="text-stella">
      {Array.from({ length: hearts }).map((_, i) => (
        <span key={i}>{i < filled ? "♥" : "♡"}</span>
      ))}
    </span>
  );
}

export default function HUD() {
  const { currentLevel, affinity } = useGameStore();

  const levelNames: Record<number, string> = {
    1: "THE AWAKENING",
    2: "HESSENBERG BRIDGE",
    3: "ZERO-SUM CHAMBER",
  };

  return (
    <div className="hud-bar">
      <span className="terminal-text text-xs tracking-widest">
        LEVEL-0{currentLevel} // {levelNames[currentLevel]}
      </span>
      <div className="flex items-center gap-6">
        <span className="text-hud-dim text-xs font-mono">
          SIGNAL: ACTIVE
        </span>
        <AffinityHearts affinity={affinity} />
      </div>
    </div>
  );
}
