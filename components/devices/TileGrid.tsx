"use client";

import { cn } from "@/lib/utils";
import type { Position } from "@/lib/types";

interface TileGridProps {
  size: number;
  safePath: Position[];
  steppedTiles: Position[];
  stellaPos: Position;
  onTileClick?: (pos: Position) => void;
}

export default function TileGrid({ size, safePath, steppedTiles, stellaPos, onTileClick }: TileGridProps) {
  const isSafe = (x: number, y: number) =>
    safePath.some((p) => p.x === x && p.y === y);

  const isStepped = (x: number, y: number) =>
    steppedTiles.some((p) => p.x === x && p.y === y);

  const isStella = (x: number, y: number) =>
    stellaPos.x === x && stellaPos.y === y;

  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${size}, 48px)`,
        gridTemplateRows: `repeat(${size}, 48px)`,
      }}
    >
      {Array.from({ length: size * size }).map((_, idx) => {
        const x = idx % size;
        const y = Math.floor(idx / size);
        const safe = isSafe(x, y);
        const stepped = isStepped(x, y);
        const stella = isStella(x, y);

        return (
          <div
            key={idx}
            onClick={() => onTileClick?.({ x, y })}
            className={cn(
              "w-12 h-12 rounded border transition-all duration-300 flex items-center justify-center text-xs font-mono",
              stella && "z-10",
              safe && stepped && "bg-safe/20 border-safe/50 shadow-md shadow-safe/10",
              safe && !stepped && "bg-game-surface border-game-border hover:border-safe/30",
              !safe && "bg-danger/5 border-danger/20",
              !safe && stepped && "animate-laser-blink bg-danger/30 border-danger"
            )}
          >
            {stella && (
              <div className="w-4 h-4 rounded-full bg-stella border border-stella/50 shadow-lg shadow-stella/30" />
            )}
          </div>
        );
      })}
    </div>
  );
}
