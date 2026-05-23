"use client";

import { cn } from "@/lib/utils";

interface PowerSwitchProps {
  position: { x: number; y: number };
  isOn: boolean;
  onClick: () => void;
}

export default function PowerSwitch({ position, isOn, onClick }: PowerSwitchProps) {
  return (
    <div
      className="absolute z-10 device-btn"
      style={{ left: position.x, top: position.y, transform: "translate(-50%, -50%)" }}
      onClick={onClick}
    >
      <div
        className={cn(
          "border-2 rounded-md p-2 text-center transition-all duration-300",
          isOn
            ? "bg-safe/10 border-safe shadow-lg shadow-safe/20"
            : "bg-game-surface border-safe/40 hover:border-safe hover:shadow-lg hover:shadow-safe/20"
        )}
      >
        <div className="text-lg">⚡</div>
        <div className={cn("text-[8px] font-mono", isOn ? "text-safe" : "text-safe/60")}>
          POWER
        </div>
      </div>
    </div>
  );
}
