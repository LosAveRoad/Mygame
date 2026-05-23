"use client";

import { useGameStore } from "@/lib/game-store";

interface LevelCompleteProps {
  levelName: string;
  onStartNext: () => void;
}

export default function LevelComplete({ levelName, onStartNext }: LevelCompleteProps) {
  const { affinity, trust, levelStartTime } = useGameStore();
  const timeSpent = Math.round((Date.now() - levelStartTime) / 1000);

  return (
    <div className="popup-overlay">
      <div className="popup-panel text-center">
        <div className="text-safe text-2xl mb-2">✓</div>
        <h2 className="terminal-text text-lg font-bold mb-1">关卡完成</h2>
        <p className="text-hud-text text-sm mb-4">{levelName}</p>

        <div className="space-y-2 text-sm font-mono mb-6">
          <div className="flex justify-between">
            <span className="text-hud-dim">用时</span>
            <span className="text-terminal">{timeSpent} 秒</span>
          </div>
          <div className="flex justify-between">
            <span className="text-hud-dim">好感度</span>
            <span className="text-stella">{affinity}/100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-hud-dim">信任度</span>
            <span className="text-terminal">{trust}/100</span>
          </div>
        </div>

        <button
          onClick={onStartNext}
          className="w-full py-2 rounded bg-terminal/20 text-terminal hover:bg-terminal/30 transition-colors font-mono"
        >
          继续
        </button>
      </div>
    </div>
  );
}
