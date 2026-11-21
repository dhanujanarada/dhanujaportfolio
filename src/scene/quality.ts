import { createStore } from "zustand/vanilla";

export type QualityTier = "high" | "medium" | "low";

export type TierSettings = {
  dpr: [number, number];
  smokeCount: number;
  bloom: boolean;
  godRays: boolean;
  grain: boolean;
};

export const TIER_SETTINGS: Record<QualityTier, TierSettings> = {
  high: { dpr: [1, 1.75], smokeCount: 40, bloom: true, godRays: true, grain: true },
  medium: { dpr: [1, 1.25], smokeCount: 24, bloom: true, godRays: false, grain: false },
  low: { dpr: [1, 1], smokeCount: 0, bloom: false, godRays: false, grain: false },
};

export type QualityState = {
  tier: QualityTier;
  /** Average frame time from the startup sample, or 0 before it exists. */
  frameMs: number;
  /** True once the monitor has picked a tier, so startup effects can wait. */
  settled: boolean;
};

/**
 * Start at medium so frames flow and the monitor can sample, then upgrade or
 * keep medium. "low" is a held frame that never wakes the canvas, so it must
 * only come from a hard signal, never from a hardware guess.
 */
function detectInitialTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";

  // Phones and tablets: coarse primary pointer and no fine pointer at all.
  // Touchscreen laptops report coarse for any-pointer, so don't match on that.
  const phoneLike =
    window.matchMedia("(pointer: coarse)").matches &&
    !window.matchMedia("(any-pointer: fine)").matches;
  if (phoneLike) return "low";

  return "medium";
}

export const qualityStore = createStore<QualityState>()(() => ({
  tier: detectInitialTier(),
  frameMs: 0,
  settled: false,
}));

export function setQuality(tier: QualityTier, frameMs: number) {
  qualityStore.setState({ tier, frameMs, settled: true });
}
