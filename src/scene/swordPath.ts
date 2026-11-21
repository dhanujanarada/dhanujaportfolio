import { CatmullRomCurve3, Quaternion, Vector3 } from "three";

export const TRANSITION_PRESETS = ["slash", "thrust", "sweep", "spiral"] as const;
export type TransitionPreset = (typeof TRANSITION_PRESETS)[number];

export type SwordPose = {
  position: Vector3;
  quaternion: Quaternion;
};

/** Fraction of a section's local progress the transition occupies. */
const DURATION: Record<TransitionPreset, number> = {
  slash: 0.55,
  thrust: 0.5,
  sweep: 0.75,
  spiral: 0.9,
};

const REST = new Vector3(0, 0, 0);
const UP = new Vector3(0, 1, 0);

/**
 * All gaps start and end at the resting pose, so the curve is the flourish
 * itself. When sections get distinct anchors, pass them in and key the cache by
 * gap instead of preset.
 */
const POINTS: Record<TransitionPreset, Vector3[]> = {
  slash: [
    [0, 0, 0], [0.35, 0.25, 0.1], [0.9, 0.55, 0.2], [1.15, 0.15, 0.05],
    [0.6, -0.25, -0.1], [0.15, -0.1, 0], [0, 0, 0],
  ].map(toVector),
  thrust: [
    [0, 0, 0], [0, 0.03, 0.5], [0, 0.05, 0.62], [0, 0.08, -0.9],
    [0, 0.02, -0.35], [0, 0, 0],
  ].map(toVector),
  sweep: [
    [0, 0, 0], [0.5, 0.35, 0.1], [0.95, 0.15, 0.25], [0.2, -0.35, 0.1],
    [-0.75, -0.3, 0.15], [-1, 0.05, 0.05], [-0.4, 0.2, 0], [0, 0, 0],
  ].map(toVector),
  spiral: [
    [0, 0, 0], [0.18, 0.28, -0.15], [0.42, 0.1, -0.35], [0.28, -0.2, -0.55],
    [-0.12, -0.3, -0.75], [-0.4, -0.05, -0.9], [-0.28, 0.25, -1.05],
    [0.1, 0.3, -1.2], [0.3, 0.05, -1.3], [0.08, -0.15, -1.4], [0, 0, 0],
  ].map(toVector),
};

const ROLL_ANGLE: Record<TransitionPreset, number> = {
  slash: 0.45,
  thrust: 0,
  sweep: -0.35,
  spiral: 0.2,
};

const curves = new Map<TransitionPreset, CatmullRomCurve3>();

export function getTransitionCurve(preset: TransitionPreset) {
  let curve = curves.get(preset);
  if (!curve) {
    curve = new CatmullRomCurve3(POINTS[preset], false, "catmullrom", 0.5);
    curves.set(preset, curve);
  }
  return curve;
}

const tangent = new Vector3();
const bladeDirection = new Vector3();
const targetOrientation = new Quaternion();
const rollQuaternion = new Quaternion();

/**
 * Writes the pose for `localProgress` (0-1 across the incoming section) into
 * the caller's vectors, so nothing is allocated per frame.
 */
export function sampleTransition(
  preset: TransitionPreset,
  localProgress: number,
  pose: SwordPose,
) {
  const t = easeInOutCubic(clamp01(localProgress / DURATION[preset]));
  const curve = getTransitionCurve(preset);

  curve.getPointAt(t, pose.position);
  curve.getTangentAt(t, tangent).normalize();

  if (preset === "thrust" || preset === "spiral") {
    // Point-leading: the blade follows the tangent.
    targetOrientation.setFromUnitVectors(UP, tangent);
  } else {
    // Edge-leading: keep the blade near vertical, projected perpendicular to
    // the motion, so a turning tangent cannot flip it upside down.
    bladeDirection
      .copy(UP)
      .addScaledVector(tangent, -UP.dot(tangent));

    if (bladeDirection.lengthSq() < 1e-6) bladeDirection.set(0, 0, 1);
    bladeDirection.normalize();
    targetOrientation.setFromUnitVectors(UP, bladeDirection);
  }

  // Start and end upright; the flourish orientation only owns the middle.
  const ramp = Math.max(0, Math.min(1, t / 0.15, (1 - t) / 0.15));
  pose.quaternion.identity().slerp(targetOrientation, ramp);
  pose.quaternion.multiply(
    rollQuaternion.setFromAxisAngle(UP, ROLL_ANGLE[preset] * ramp),
  );
}

function toVector([x, y, z]: number[]) {
  return new Vector3(x, y, z);
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export { REST };
