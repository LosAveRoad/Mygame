import type { LevelConfig } from "../types";

export const level1Config: LevelConfig = {
  id: 1,
  name: "The Awakening",
  objective: "恢复照明 — 引导 Stella 找到并拉下电闸",
  roomLayout: {
    width: 600,
    height: 360,
    gridCols: 5,
    gridRows: 3,
  },
  devices: [
    {
      id: "communicator",
      type: "communicator",
      position: { x: 280, y: 300 },
      label: "通讯仪",
      interactable: true,
    },
    {
      id: "power-switch",
      type: "power-switch",
      position: { x: 80, y: 140 },
      label: "电源闸刀",
      interactable: true,
    },
    {
      id: "door",
      type: "door",
      position: { x: 500, y: 140 },
      label: "电子门",
      interactable: true,
    },
  ],
  winCondition: "powerOn",
  commRestriction: {
    type: "char_limit",
    maxChars: 10,
    totalCharges: 5,
  },
  initialEmotion: { fear: 80, trust: 30 },
  stellaStartPosition: { x: 350, y: 180 },
};
