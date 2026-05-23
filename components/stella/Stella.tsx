"use client";

import { cn } from "@/lib/utils";
import type { Position, StellaAction } from "@/lib/types";
import EmotionIndicator from "./EmotionIndicator";

interface StellaProps {
  position: Position;
  fear: number;
  trust: number;
  action: StellaAction;
  className?: string;
}

export default function Stella({ position, fear, trust, action, className }: StellaProps) {
  const actionStyles: Record<StellaAction, string> = {
    idle: "",
    walking: "transition-all duration-700 ease-in-out",
    pulling: "scale-y-75 origin-bottom",
    cowering: "scale-90 -rotate-3",
    running: "scale-110",
  };

  return (
    <div
      className={cn(
        "absolute z-10 transition-all duration-700 ease-in-out",
        actionStyles[action],
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Emotion indicator above head */}
      <div className="mb-1">
        <EmotionIndicator fear={fear} trust={trust} />
      </div>

      {/* Character body — 2.5D placeholder */}
      <div className="flex flex-col items-center">
        {/* Head */}
        <div className="w-4 h-4 rounded-full bg-gradient-to-b from-amber-200 to-amber-100 border border-amber-300/30" />

        {/* Body */}
        <div
          className={cn(
            "w-5 h-8 rounded-b-sm bg-gradient-to-b from-stella to-stella-dark",
            "border border-stella/30 -mt-1"
          )}
        />

        {/* Shadow on ground */}
        <div className="w-8 h-2 bg-stella/10 rounded-full blur-sm -mt-0.5" />
      </div>

      {/* Name label */}
      <div className="text-center mt-1">
        <span className="text-stella text-[8px] font-mono">Stella</span>
      </div>
    </div>
  );
}
