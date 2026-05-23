import { create } from "zustand";

interface Position3D {
  x: number;
  z: number;
}

interface SwitchState {
  id: number;
  isOn: boolean;
  position: Position3D;
}

interface Store3D {
  characterPos: Position3D;
  targetPos: Position3D;
  switches: SwitchState[];
  doorOpen: boolean;

  moveCharacter: (dx: number, dz: number) => void;
  toggleSwitch: (id: number) => void;
}

const SWITCH_POSITIONS: Position3D[] = [
  { x: 0, z: 2 },
  { x: 1, z: 2 },
  { x: 2, z: 2 },
];

export const use3DStore = create<Store3D>((set, get) => ({
  characterPos: { x: 1, z: 1 },
  targetPos: { x: 1, z: 1 },
  switches: SWITCH_POSITIONS.map((pos, i) => ({
    id: i,
    isOn: false,
    position: pos,
  })),
  doorOpen: false,

  moveCharacter: (dx, dz) => {
    const { characterPos } = get();
    const nx = Math.max(0, Math.min(2, characterPos.x + dx));
    const nz = Math.max(0, Math.min(2, characterPos.z + dz));
    set({ targetPos: { x: nx, z: nz } });
    // actual position updates via animation frame
    setTimeout(() => set({ characterPos: { x: nx, z: nz } }), 200);
  },

  toggleSwitch: (id) => {
    set((state) => {
      const switches = state.switches.map((s) =>
        s.id === id ? { ...s, isOn: !s.isOn } : s
      );
      const doorOpen = switches.every((s) => s.isOn);
      return { switches, doorOpen };
    });
  },
}));
