import type { LevelConfig, Position } from "../types";

function generateHessenbergPath(n: number): Position[] {
  const path: Position[] = [];
  for (let i = 0; i < n; i++) {
    path.push({ x: i, y: i });
    if (i + 1 < n) {
      path.push({ x: i + 1, y: i });
    }
  }
  return path;
}

export const level2Config: LevelConfig = {
  id: 2,
  name: "Hessenberg Bridge",
  objective: "穿越矩阵桥 — 踩着安全地砖到达对岸",
  roomLayout: {
    width: 600,
    height: 400,
    gridCols: 5,
    gridRows: 5,
  },
  devices: [
    {
      id: "coordinate-panel",
      type: "coordinate-panel",
      position: { x: 40, y: 340 },
      label: "坐标面板",
      interactable: true,
    },
    {
      id: "rule-board",
      type: "rule-board",
      position: { x: 260, y: 340 },
      label: "规律板",
      interactable: true,
    },
    {
      id: "emergency-btn",
      type: "emergency-btn",
      position: { x: 500, y: 340 },
      label: "紧急按钮",
      interactable: true,
    },
  ],
  winCondition: "stellaReachesEnd",
  commRestriction: {
    type: "signal_interference",
    interferenceRate: 0.3,
  },
  initialEmotion: { fear: 40, trust: 50 },
  stellaStartPosition: { x: 0, y: 0 },
};

export { generateHessenbergPath };
