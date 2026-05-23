"use client";

import { useState, useCallback } from "react";
import { useGameStore } from "@/lib/game-store";
import type { Level2State, Position, StellaAction } from "@/lib/types";
import { level2Config, generateHessenbergPath } from "@/lib/levels/level2";
import Room from "./Room";
import Stella from "@/components/stella/Stella";
import TileGrid from "@/components/devices/TileGrid";
import CoordinatePanel from "@/components/devices/CoordinatePanel";
import LevelComplete from "@/components/game/LevelComplete";

const SAFE_PATH = generateHessenbergPath(level2Config.roomLayout.gridCols);

export default function SceneLevel2() {
  const {
    trust, affinity, levelState, chatHistory,
    isLevelComplete, showLevelComplete,
    updateLevelState, updateEmotion, updateAffinity, addMessage, completeLevel,
  } = useGameStore();

  const ls = levelState as Level2State;

  const [stellaAction, setStellaAction] = useState<StellaAction>("idle");
  const [stellaFear, setStellaFear] = useState(level2Config.initialEmotion.fear);
  const [stellaTrust, setStellaTrust] = useState(level2Config.initialEmotion.trust);

  // Parse AI action string into a sequence of directional steps
  const parseActions = (action: string): Position[] => {
    const current = useGameStore.getState().levelState as Level2State;
    const pos = current.stellaGridPos;
    const steps: Position[] = [];

    // Handle multi-step actions like "move_right,move_right,move_down"
    const parts = action.split(",").map((s: string) => s.trim());

    let cur = { ...pos };
    for (const part of parts) {
      const next = { ...cur };
      switch (part) {
        case "move_right": case "step_on": next.x += 1; break;
        case "move_left": next.x -= 1; break;
        case "move_up": next.y -= 1; break;
        case "move_down": next.y += 1; break;
        default: continue;
      }
      // Clamp to grid bounds
      next.x = Math.max(0, Math.min(level2Config.roomLayout.gridCols - 1, next.x));
      next.y = Math.max(0, Math.min(level2Config.roomLayout.gridRows - 1, next.y));
      steps.push(next);
      cur = next;
    }

    // If no steps parsed from action names, try to infer from action text
    if (steps.length === 0) {
      // Default: step right once
      steps.push({ x: Math.min(pos.x + 1, level2Config.roomLayout.gridCols - 1), y: pos.y });
    }

    return steps;
  };

  // Execute steps sequentially with animation delays
  const executeSteps = (steps: Position[]) => {
    steps.forEach((targetPos, index) => {
      setTimeout(() => {
        attemptStep(targetPos.x, targetPos.y);
      }, index * 800); // 800ms delay between each step for visible animation
    });
  };

  const handleSendMessage = useCallback(async (message: string) => {
    addMessage({ role: "player", content: message, timestamp: Date.now() });

    try {
      const gameState = useGameStore.getState();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, gameState }),
      });
      const data = await res.json();

      addMessage({ role: "stella", content: data.reply, timestamp: Date.now() });

      if (data.emotion?.fear) setStellaFear((f) => Math.max(0, Math.min(100, f + data.emotion.fear)));
      if (data.emotion?.trust) setStellaTrust((t) => Math.max(0, Math.min(100, t + data.emotion.trust)));
      updateEmotion(data.emotion?.fear, data.emotion?.trust);
      if (data.emotion?.trust > 0) updateAffinity(3);

      // Handle AI actions — support direction moves and step sequences
      if (data.action) {
        if (data.action === "run_through") {
          updateAffinity(-20);
          completeLevel();
        } else {
          // Parse action into step sequence
          const steps = parseActions(data.action);
          executeSteps(steps);
        }
      }
    } catch {
      addMessage({ role: "stella", content: "...信号...干扰...", timestamp: Date.now() });
    }
  }, [ls, addMessage, updateLevelState, updateEmotion, updateAffinity, completeLevel]);

  const attemptStep = (x: number, y: number) => {
    const isSafe = SAFE_PATH.some((p) => p.x === x && p.y === y);

    if (isSafe) {
      const newPos: Position = { x, y };
      updateLevelState({
        stellaGridPos: newPos,
        steppedTiles: [...ls.steppedTiles, newPos],
      } as Partial<Level2State>);
      setStellaAction("walking");
      setTimeout(() => setStellaAction("idle"), 500);

      if (x >= level2Config.roomLayout.gridCols - 1) {
        setTimeout(() => completeLevel(), 500);
      }
    } else {
      setStellaFear((f) => Math.min(100, f + 15));
      updateEmotion(15);
    }
  };

  if (showLevelComplete) {
    return <LevelComplete levelName={level2Config.name} onStartNext={() => useGameStore.getState().nextLevel()} />;
  }

  return (
    <div className="game-scene">
      <div className="flex flex-col items-center justify-center h-full pt-14 pb-14 gap-4">
        <Room layout={level2Config.roomLayout} darknessLevel={0}>
          <div className="absolute inset-0 flex items-center justify-center">
            <TileGrid
              size={level2Config.roomLayout.gridCols}
              safePath={SAFE_PATH}
              steppedTiles={ls.steppedTiles}
              stellaPos={ls.stellaGridPos}
            />
          </div>
        </Room>

        <div className="flex gap-4">
          {level2Config.devices.map((device) => (
            <CoordinatePanel
              key={device.id}
              position={device.position}
              restriction={level2Config.commRestriction}
              onSendMessage={handleSendMessage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
