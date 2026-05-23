"use client";

import { cn } from "@/lib/utils";
import type { RoomLayout } from "@/lib/types";

interface RoomProps {
  layout: RoomLayout;
  children: React.ReactNode;
  darknessLevel?: number;
  className?: string;
}

export default function Room({ layout, children, darknessLevel = 0, className }: RoomProps) {
  return (
    <div
      className={cn("relative mx-auto border border-game-border rounded", className)}
      style={{
        width: layout.width,
        height: layout.height,
      }}
    >
      {/* Grid floor */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, #0d1a2a 1px, transparent 1px),
            linear-gradient(to bottom, #0d1a2a 1px, transparent 1px)
          `,
          backgroundSize: `${layout.width / layout.gridCols}px ${layout.height / layout.gridRows}px`,
        }}
      />

      {/* Wall hints */}
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-r from-game-border to-transparent" />
      <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-l from-game-border to-transparent" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-b from-game-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-t from-game-border to-transparent" />

      {children}

      {/* Darkness overlay */}
      {darknessLevel > 0 && (
        <div
          className="absolute inset-0 pointer-events-none z-20 rounded transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at 65% 50%, transparent ${Math.max(0, (1 - darknessLevel) * 40)}%, rgba(0,0,0,${darknessLevel * 0.85}) ${Math.max(10, darknessLevel * 80)}%)`,
          }}
        />
      )}

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none z-30 rounded" />
    </div>
  );
}
