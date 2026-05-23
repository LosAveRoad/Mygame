"use client";

import { cn } from "@/lib/utils";

interface DoorProps {
  position: { x: number; y: number };
  isUnlocked: boolean;
  onClick: () => void;
}

export default function Door({ position, isUnlocked, onClick }: DoorProps) {
  return (
    <div
      className="absolute z-10 device-btn"
      style={{ left: position.x, top: position.y, transform: "translate(-50%, -50%)" }}
      onClick={isUnlocked ? onClick : undefined}
    >
      <div
        className={cn(
          "border-2 rounded-md p-2 text-center transition-all duration-500",
          isUnlocked
            ? "bg-safe/10 border-safe shadow-lg shadow-safe/20 cursor-pointer"
            : "bg-game-surface/50 border-danger/40 opacity-60 cursor-not-allowed"
        )}
      >
        <div className="text-lg">🚪</div>
        <div className={cn("text-[8px] font-mono", isUnlocked ? "text-safe" : "text-danger/60")}>
          {isUnlocked ? "OPEN" : "LOCKED"}
        </div>
      </div>
    </div>
  );
}
