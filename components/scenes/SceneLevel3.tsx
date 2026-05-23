"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useGameStore } from "@/lib/game-store";
import type { Level3State, StellaAction } from "@/lib/types";
import { level3Config } from "@/lib/levels/level3";
import Room from "./Room";
import Stella from "@/components/stella/Stella";
import ValveControl from "@/components/devices/ValveControl";
import Monitor from "@/components/devices/Monitor";
import LevelComplete from "@/components/game/LevelComplete";

export default function SceneLevel3() {
  const {
    trust, affinity, levelState, chatHistory,
    isLevelComplete, showLevelComplete,
    updateLevelState, updateEmotion, updateAffinity, addMessage, completeLevel,
  } = useGameStore();

  const ls = levelState as Level3State;
  const [stellaAction, setStellaAction] = useState<StellaAction>("idle");
  const [stellaFear, setStellaFear] = useState(level3Config.initialEmotion.fear);
  const [stellaTrust, setStellaTrust] = useState(level3Config.initialEmotion.trust);
  const [cooldown, setCooldown] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const state = useGameStore.getState();
      const current = state.levelState as Level3State;

      const oxygenSafe = current.oxygenLevel >= current.safeZoneMin && current.oxygenLevel <= current.safeZoneMax;
      const neutralizerSafe = current.neutralizerLevel >= current.safeZoneMin && current.neutralizerLevel <= current.safeZoneMax;

      if (oxygenSafe && neutralizerSafe) {
        const newTime = current.timeInSafeZone + 1;
        state.updateLevelState({ timeInSafeZone: newTime } as Partial<Level3State>);
        if (newTime >= current.requiredSafeTime) {
          state.completeLevel();
        }
      } else {
        if (current.timeInSafeZone > 0) {
          state.updateLevelState({ timeInSafeZone: 0 } as Partial<Level3State>);
        }
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleValveChange = (valveId: string, newValue: number) => {
    const current = useGameStore.getState().levelState as Level3State;

    if (valveId === "valve-a") {
      const bDrift = -(newValue - current.oxygenLevel) * 0.6;
      const newB = Math.max(0, Math.min(100, current.neutralizerLevel + bDrift));
      updateLevelState({
        oxygenLevel: newValue,
        neutralizerLevel: newB,
      } as Partial<Level3State>);
    } else {
      const aDrift = -(newValue - current.neutralizerLevel) * 0.4;
      const newA = Math.max(0, Math.min(100, current.oxygenLevel + aDrift));
      updateLevelState({
        neutralizerLevel: newValue,
        oxygenLevel: newA,
      } as Partial<Level3State>);
    }
  };

  const handleSendMessage = useCallback(async (message: string) => {
    if (cooldown) return;

    addMessage({ role: "player", content: message, timestamp: Date.now() });

    setCooldown(true);
    setTimeout(() => setCooldown(false), level3Config.commRestriction.cooldownMs || 3000);

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

      if (data.action?.startsWith("adjust_valve")) {
        const current = useGameStore.getState().levelState as Level3State;
        if (data.action.includes("a_up")) handleValveChange("valve-a", current.oxygenLevel + 3);
        if (data.action.includes("a_down")) handleValveChange("valve-a", current.oxygenLevel - 3);
        if (data.action.includes("b_up")) handleValveChange("valve-b", current.neutralizerLevel + 3);
        if (data.action.includes("b_down")) handleValveChange("valve-b", current.neutralizerLevel - 3);
      }
    } catch {
      addMessage({ role: "stella", content: "...信号...干扰...", timestamp: Date.now() });
    }
  }, [cooldown, addMessage, updateEmotion, updateAffinity]);

  if (showLevelComplete) {
    return <LevelComplete levelName={level3Config.name} onStartNext={() => {
      alert("游戏通关！感谢游玩 Blind Room: Mind Link");
    }} />;
  }

  return (
    <div className="game-scene">
      <div className="flex items-center justify-center h-full pt-14 pb-14">
        <Room layout={level3Config.roomLayout} darknessLevel={0}>
          <Monitor
            position={level3Config.devices[2].position}
            oxygenLevel={ls.oxygenLevel}
            neutralizerLevel={ls.neutralizerLevel}
            safeZoneMin={ls.safeZoneMin}
            safeZoneMax={ls.safeZoneMax}
            timeInSafeZone={ls.timeInSafeZone}
            requiredSafeTime={ls.requiredSafeTime}
          />

          <ValveControl
            position={level3Config.devices[0].position}
            label="阀门A-氧气"
            value={ls.oxygenLevel}
            min={0}
            max={100}
            onChange={(v) => handleValveChange("valve-a", v)}
            onSendMessage={handleSendMessage}
          />

          <ValveControl
            position={level3Config.devices[1].position}
            label="阀门B-中和剂"
            value={ls.neutralizerLevel}
            min={0}
            max={100}
            onChange={(v) => handleValveChange("valve-b", v)}
            onSendMessage={handleSendMessage}
          />

          <Stella
            position={level3Config.stellaStartPosition}
            fear={stellaFear}
            trust={stellaTrust}
            action={stellaAction}
          />

          <div className="absolute inset-0 pointer-events-none z-15 opacity-20">
            <div className="absolute bottom-0 left-1/4 w-32 h-20 bg-gradient-to-t from-gray-500/30 to-transparent rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-4 right-1/3 w-24 h-16 bg-gradient-to-t from-gray-400/20 to-transparent rounded-full blur-xl animate-pulse-glow" />
          </div>
        </Room>
      </div>
    </div>
  );
}
