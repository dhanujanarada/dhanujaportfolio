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
  high: { dpr: [1, 2], smokeCount: 48, bloom: true, godRays: true, grain: true },
  medium: { dpr: [1, 1.5], smokeCount: 28, bloom: true, godRays: false, grain: false },
  low: { dpr: [1, 1], smokeCount: 0, bloom: false, godRays: false, grain: false },
};

export type QualityState = {
  tier: QualityTier;
  /** Average frame time from the startup sample, or 0 before it exists. */
  frameMs: number;
};

/**
 * Chosen once per session from a startup sample. Not React state on the frame
 * path; App subscribes because DPR is a Canvas prop.
 */
export const qualityStore = createStore<QualityState>()(() => ({
  tier: "high",
  frameMs: 0,
}));

export function setQuality(tier: QualityTier, frameMs: number) {
  qualityStore.setState({ tier, frameMs });
}
