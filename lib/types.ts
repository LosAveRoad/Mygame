// === Position & Layout ===
export interface Position {
  x: number;
  y: number;
}

export interface RoomLayout {
  width: number;
  height: number;
  gridCols: number;
  gridRows: number;
}

// === Communication ===
export type CommRestrictionType = "char_limit" | "signal_interference" | "cooldown";

export interface CommRestriction {
  type: CommRestrictionType;
  maxChars?: number;
  totalCharges?: number;
  interferenceRate?: number;
  cooldownMs?: number;
}

// === Messages ===
export interface Message {
  role: "player" | "stella";
  content: string;
  timestamp: number;
}

// === AI ===
export interface AIResponse {
  reply: string;
  emotion: {
    fear?: number;
    trust?: number;
  };
  action: string | null;
}

// === Stella ===
export type StellaAction = "idle" | "walking" | "pulling" | "cowering" | "running";

export interface StellaState {
  position: Position;
  emotion: {
    fear: number;
    trust: number;
  };
  action: StellaAction;
}

// === Level Config ===
export interface DeviceConfig {
  id: string;
  type: string;
  position: Position;
  label: string;
  interactable: boolean;
}

export interface LevelConfig {
  id: number;
  name: string;
  objective: string;
  roomLayout: RoomLayout;
  devices: DeviceConfig[];
  winCondition: string;
  commRestriction: CommRestriction;
  initialEmotion: { fear: number; trust: number };
  stellaStartPosition: Position;
}

// === Per-level state ===
export interface Level1State {
  powerOn: boolean;
  doorUnlocked: boolean;
  messagesRemaining: number;
}

export interface Level2State {
  gridSize: number;
  stellaGridPos: Position;
  safePath: Position[];
  steppedTiles: Position[];
}

export interface Level3State {
  oxygenLevel: number;
  neutralizerLevel: number;
  oxygenTarget: number;
  neutralizerTarget: number;
  safeZoneMin: number;
  safeZoneMax: number;
  timeInSafeZone: number;
  requiredSafeTime: number;
}

export type LevelState = Level1State | Level2State | Level3State;

// === Game State ===
export interface GameState {
  currentLevel: 1 | 2 | 3;
  affinity: number;
  trust: number;
  levelState: LevelState;
  chatHistory: Message[];
  isLevelComplete: boolean;
  showLevelComplete: boolean;
  levelStartTime: number;
}
