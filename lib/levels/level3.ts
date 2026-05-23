import type { LevelConfig } from "../types";

export const level3Config: LevelConfig = {
  id: 3,
  name: "Zero-Sum Chamber",
  objective: "维持平衡 — 将氧气和中和剂保持在安全区间 30 秒",
  roomLayout: {
    width: 600,
    height: 360,
    gridCols: 3,
    gridRows: 3,
  },
  devices: [
    {
      id: "valve-a",
      type: "valve",
      position: { x: 150, y: 200 },
      label: "阀门 A — 氧气",
      interactable: true,
    },
    {
      id: "valve-b",
      type: "valve",
      position: { x: 420, y: 200 },
      label: "阀门 B — 中和剂",
      interactable: true,
    },
    {
      id: "monitor",
      type: "monitor",
      position: { x: 280, y: 80 },
      label: "监控面板",
      interactable: true,
    },
  ],
  winCondition: "bothInSafeZone30s",
  commRestriction: {
    type: "cooldown",
    cooldownMs: 3000,
  },
  initialEmotion: { fear: 60, trust: 40 },
  stellaStartPosition: { x: 280, y: 260 },
};
