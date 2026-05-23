"use client";

import { useState, useCallback } from "react";
import { useGameStore } from "@/lib/game-store";
import type { Level1State, Message, StellaAction, Position } from "@/lib/types";
import { level1Config } from "@/lib/levels/level1";
import Room from "./Room";
import Stella from "@/components/stella/Stella";
import Communicator from "@/components/devices/Communicator";
import PowerSwitch from "@/components/devices/PowerSwitch";
import Door from "@/components/devices/Door";
import LevelComplete from "@/components/game/LevelComplete";

export default function SceneLevel1() {
  const {
    trust,
    affinity,
    levelState,
    chatHistory,
    isLevelComplete,
    showLevelComplete,
    updateLevelState,
    updateEmotion,
    updateAffinity,
    addMessage,
    completeLevel,
  } = useGameStore();

  const ls = levelState as Level1State;

  const [stellaPos, setStellaPos] = useState<Position>(level1Config.stellaStartPosition);
  const [stellaAction, setStellaAction] = useState<StellaAction>("cowering");
  const [stellaFear, setStellaFear] = useState(level1Config.initialEmotion.fear);
  const [stellaTrust, setStellaTrust] = useState(level1Config.initialEmotion.trust);

  const darknessLevel = Math.max(0, Math.min(1, stellaFear / 100));

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (ls.messagesRemaining <= 0) return;

      addMessage({ role: "player", content: message, timestamp: Date.now() });
      updateLevelState({ messagesRemaining: ls.messagesRemaining - 1 } as Partial<Level1State>);

      const comfortWords = ["别怕", "我在", "没事", "放心", "不怕", "安全"];
      const isComfort = comfortWords.some((w) => message.includes(w));
      if (isComfort) {
        setStellaFear((f) => Math.max(0, f - 15));
        setStellaTrust((t) => Math.min(100, t + 10));
        updateEmotion(undefined, 10);
        updateAffinity(5);
      }

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
        if (data.emotion?.trust && data.emotion.trust > 0) updateAffinity(3);

        if (data.action) {
          handleStellaAction(data.action);
        }
      } catch {
        addMessage({
          role: "stella",
          content: "...信号...干扰...",
          timestamp: Date.now(),
        });
      }
    },
    [ls.messagesRemaining, addMessage, updateLevelState, updateEmotion, updateAffinity]
  );

  const handleStellaAction = (action: string) => {
    switch (action) {
      case "move_left":
        setStellaAction("walking");
        setStellaPos((p) => ({ ...p, x: Math.max(60, p.x - 80) }));
        setTimeout(() => setStellaAction("idle"), 700);
        break;
      case "move_right":
        setStellaAction("walking");
        setStellaPos((p) => ({ ...p, x: Math.min(540, p.x + 80) }));
        setTimeout(() => setStellaAction("idle"), 700);
        break;
      case "pull_switch":
        setStellaAction("walking");
        setStellaPos({ x: 100, y: 160 });
        setTimeout(() => {
          setStellaAction("pulling");
          setTimeout(() => {
            updateLevelState({ powerOn: true, doorUnlocked: true } as Partial<Level1State>);
            setStellaFear((f) => Math.max(0, f - 30));
            setStellaAction("idle");
          }, 1000);
        }, 700);
        break;
    }
  };

  const handlePowerSwitchClick = () => {
    const dist = Math.abs(stellaPos.x - level1Config.devices[1].position.x) +
                 Math.abs(stellaPos.y - level1Config.devices[1].position.y);
    if (dist < 120) {
      handleStellaAction("pull_switch");
    }
  };

  const handleDoorClick = () => {
    if (ls.doorUnlocked) {
      completeLevel();
    }
  };

  if (showLevelComplete) {
    return <LevelComplete levelName={level1Config.name} onStartNext={() => useGameStore.getState().nextLevel()} />;
  }

  return (
    <div className="game-scene">
      <div className="flex items-center justify-center h-full pt-14 pb-14">
        <Room layout={level1Config.roomLayout} darknessLevel={darknessLevel}>
          <PowerSwitch
            position={level1Config.devices[1].position}
            isOn={ls.powerOn}
            onClick={handlePowerSwitchClick}
          />

          <Door
            position={level1Config.devices[2].position}
            isUnlocked={ls.doorUnlocked}
            onClick={handleDoorClick}
          />

          <Stella
            position={stellaPos}
            fear={stellaFear}
            trust={stellaTrust}
            action={stellaAction}
          />

          <Communicator
            position={level1Config.devices[0].position}
            restriction={level1Config.commRestriction}
            onSendMessage={handleSendMessage}
          />
        </Room>
      </div>
    </div>
  );
}
