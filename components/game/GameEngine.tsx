"use client";

import { useGameStore } from "@/lib/game-store";
import SceneLevel1 from "@/components/scenes/SceneLevel1";
import SceneLevel2 from "@/components/scenes/SceneLevel2";
import SceneLevel3 from "@/components/scenes/SceneLevel3";
import HUD from "@/components/ui/HUD";
import StatusBar from "@/components/ui/StatusBar";

export default function GameEngine() {
  const currentLevel = useGameStore((s) => s.currentLevel);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-game-bg">
      <HUD />
      <StatusBar />

      <div className="h-full">
        {currentLevel === 1 && <SceneLevel1 />}
        {currentLevel === 2 && <SceneLevel2 />}
        {currentLevel === 3 && <SceneLevel3 />}
      </div>
    </div>
  );
}
