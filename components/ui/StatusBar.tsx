"use client";

import { useGameStore } from "@/lib/game-store";
import type { Level1State, Level3State } from "@/lib/types";

function FearBar({ fear }: { fear: number }) {
  const width = Math.max(0, Math.min(100, fear));
  const color = fear > 70 ? "bg-danger" : fear > 40 ? "bg-warning" : "bg-safe";
  return (
    <div className="flex items-center gap-2">
      <span className="text-hud-dim text-xs font-mono">恐惧</span>
      <div className="progress-bar w-24">
        <div className={`progress-bar-fill ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function StatusBar() {
  const { currentLevel, levelState, trust } = useGameStore();

  const getObjective = () => {
    if (currentLevel === 1) {
      const ls = levelState as Level1State;
      return ls.powerOn ? "门已解锁，点击门离开" : "引导 Stella 拉下电闸";
    }
    if (currentLevel === 2) {
      return "指挥 Stella 穿过地砖矩阵";
    }
    if (currentLevel === 3) {
      const ls = levelState as Level3State;
      return `维持安全区间 ${ls.timeInSafeZone}/${ls.requiredSafeTime}s`;
    }
    return "";
  };

  const fear = trust > 70 ? 20 : trust > 40 ? 50 : 80;

  return (
    <div className="status-bar">
      <div className="flex items-center gap-6">
        <FearBar fear={fear} />
        <span className="text-hud-dim text-xs font-mono">
          信任: {trust}%
        </span>
      </div>
      <span className="text-warning text-xs font-mono">
        目标: {getObjective()}
      </span>
    </div>
  );
}
