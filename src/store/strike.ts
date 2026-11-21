import { createStore } from "zustand/vanilla";

export type StrikePreset = "slash" | "thrust" | "sweep" | "spiral";

type StrikeState = {
  preset: StrikePreset | null;
  startedAt: number;
  fire: (preset: StrikePreset) => void;
  clear: () => void;
};

/**
 * A one-shot request for the sword to perform a preset strike before a route
 * change. The rig reads it in useFrame; nothing re-renders React.
 */
export const strikeStore = createStore<StrikeState>()((set) => ({
  preset: null,
  startedAt: 0,
  fire: (preset) =>
    set({
      preset,
      startedAt: typeof performance !== "undefined" ? performance.now() : Date.now(),
    }),
  clear: () => set({ preset: null, startedAt: 0 }),
}));
