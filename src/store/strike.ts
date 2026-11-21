import { createStore } from "zustand/vanilla";

export type StrikePreset = "slash" | "thrust" | "sweep" | "spiral";

type StrikeState = {
  preset: StrikePreset | null;
  fire: (preset: StrikePreset) => void;
  clear: () => void;
};

/**
 * A one-shot request for the sword to perform a preset strike before a route
 * change. The rig reads it in useFrame; nothing re-renders React.
 */
export const strikeStore = createStore<StrikeState>()((set) => ({
  preset: null,
  fire: (preset) => set({ preset }),
  clear: () => set({ preset: null }),
}));
