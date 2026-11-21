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
 * Start conservative: the first frames are the most expensive and the monitor
 * can still upgrade a capable machine to high after its sample. Weak devices
 * and reduced-motion visitors start at low instead of paying for two seconds
 * of full-resolution smoke and postprocessing.
 */
function detectInitialTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";

  // Phones and tablets get the static sword. The simulated smoke is the first
  // thing to go, and the scene is largely hidden behind the parchment anyway.
  if (window.matchMedia("(pointer: coarse)").matches) return "low";

  const cores = navigator.hardwareConcurrency ?? 8;
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  if (cores <= 4 || memory <= 4) return "low";
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
