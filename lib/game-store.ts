import { create } from "zustand";
import type {
  GameState,
  LevelState,
  Level1State,
  Level2State,
  Level3State,
  Message,
  Position,
} from "./types";

interface GameActions {
  startLevel: (level: 1 | 2 | 3) => void;
  completeLevel: () => void;
  nextLevel: () => void;
  updateEmotion: (fearDelta?: number, trustDelta?: number) => void;
  updateAffinity: (delta: number) => void;
  addMessage: (message: Message) => void;
  clearChat: () => void;
  updateLevelState: (partial: Partial<LevelState>) => void;
  updateStellaPosition: (position: Position) => void;
}

const initialLevelStates: Record<number, LevelState> = {
  1: {
    powerOn: false,
    doorUnlocked: false,
    messagesRemaining: 5,
  } as Level1State,
  2: {
    gridSize: 5,
    stellaGridPos: { x: 0, y: 0 },
    safePath: [],
    steppedTiles: [],
  } as Level2State,
  3: {
    oxygenLevel: 50,
    neutralizerLevel: 50,
    oxygenTarget: 60,
    neutralizerTarget: 40,
    safeZoneMin: 35,
    safeZoneMax: 65,
    timeInSafeZone: 0,
    requiredSafeTime: 30,
  } as Level3State,
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  currentLevel: 1,
  affinity: 30,
  trust: 30,
  levelState: initialLevelStates[1],
  chatHistory: [],
  isLevelComplete: false,
  showLevelComplete: false,
  levelStartTime: Date.now(),

  startLevel: (level) =>
    set({
      currentLevel: level,
      levelState: initialLevelStates[level],
      chatHistory: [],
      isLevelComplete: false,
      showLevelComplete: false,
      levelStartTime: Date.now(),
    }),

  completeLevel: () =>
    set({
      isLevelComplete: true,
      showLevelComplete: true,
    }),

  nextLevel: () => {
    const { currentLevel } = get();
    if (currentLevel < 3) {
      const next = (currentLevel + 1) as 1 | 2 | 3;
      get().startLevel(next);
    }
  },

  updateEmotion: (fearDelta, trustDelta) =>
    set((state) => ({
      trust: Math.max(0, Math.min(100, state.trust + (trustDelta || 0))),
    })),

  updateAffinity: (delta) =>
    set((state) => ({
      affinity: Math.max(0, Math.min(100, state.affinity + delta)),
    })),

  addMessage: (message) =>
    set((state) => ({
      chatHistory: [...state.chatHistory.slice(-19), message],
    })),

  clearChat: () => set({ chatHistory: [] }),

  updateLevelState: (partial) =>
    set((state) => ({
      levelState: { ...state.levelState, ...partial },
    })),

  updateStellaPosition: (position) =>
    set((state) => {
      const ls = state.levelState as Level2State;
      if (state.currentLevel === 2) {
        return { levelState: { ...ls, stellaGridPos: position } };
      }
      return state;
    }),
}));
