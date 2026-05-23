"use client";

import { cn } from "@/lib/utils";

interface MonitorProps {
  position: { x: number; y: number };
  oxygenLevel: number;
  neutralizerLevel: number;
  safeZoneMin: number;
  safeZoneMax: number;
  timeInSafeZone: number;
  requiredSafeTime: number;
}

export default function Monitor({
  position, oxygenLevel, neutralizerLevel, safeZoneMin, safeZoneMax, timeInSafeZone, requiredSafeTime,
}: MonitorProps) {
  const oxygenSafe = oxygenLevel >= safeZoneMin && oxygenLevel <= safeZoneMax;
  const neutralizerSafe = neutralizerLevel >= safeZoneMin && neutralizerLevel <= safeZoneMax;
  const bothSafe = oxygenSafe && neutralizerSafe;

  return (
    <div
      className="absolute z-10"
      style={{ left: position.x, top: position.y, transform: "translate(-50%, -50%)" }}
    >
      <div className="bg-game-bg border border-game-border rounded-lg p-3 w-64">
        <div className="text-terminal text-[8px] font-mono mb-2 text-center">MONITOR</div>

        {/* Oxygen bar */}
        <div className="mb-2">
          <div className="flex justify-between text-[9px] font-mono mb-1">
            <span className="text-hud-dim">氧气 (A)</span>
            <span className={oxygenSafe ? "text-safe" : "text-danger"}>{oxygenLevel.toFixed(0)}%</span>
          </div>
          <div className="relative h-3 bg-game-border rounded">
            <div
              className="absolute top-0 h-full bg-safe/10 border-l border-r border-safe/20"
              style={{
                left: `${safeZoneMin}%`,
                width: `${safeZoneMax - safeZoneMin}%`,
              }}
            />
            <div
              className={cn(
                "absolute top-0 h-full rounded transition-all duration-300",
                oxygenSafe ? "bg-safe/40" : "bg-danger/40"
              )}
              style={{ width: `${oxygenLevel}%` }}
            />
          </div>
        </div>

        {/* Neutralizer bar */}
        <div className="mb-2">
          <div className="flex justify-between text-[9px] font-mono mb-1">
            <span className="text-hud-dim">中和剂 (B)</span>
            <span className={neutralizerSafe ? "text-safe" : "text-danger"}>{neutralizerLevel.toFixed(0)}%</span>
          </div>
          <div className="relative h-3 bg-game-border rounded">
            <div
              className="absolute top-0 h-full bg-safe/10 border-l border-r border-safe/20"
              style={{
                left: `${safeZoneMin}%`,
                width: `${safeZoneMax - safeZoneMin}%`,
              }}
            />
            <div
              className={cn(
                "absolute top-0 h-full rounded transition-all duration-300",
                neutralizerSafe ? "bg-safe/40" : "bg-danger/40"
              )}
              style={{ width: `${neutralizerLevel}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="text-center">
          <span className={cn("text-xs font-mono", bothSafe ? "text-safe" : "text-hud-dim")}>
            {bothSafe ? "✓ " : "○ "}{timeInSafeZone}s / {requiredSafeTime}s
          </span>
        </div>
      </div>
    </div>
  );
}
