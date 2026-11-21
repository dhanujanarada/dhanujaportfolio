import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Quaternion, Vector3, type Group } from "three";

import { scrollStore } from "../store/scroll";
import { Sword } from "./Sword";
import { SwordTrail } from "./SwordTrail";
import { sampleTransition, type SwordPose, type TransitionPreset } from "./swordPath";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const IDLE_PERIOD = 4;

// Temporary: presets are positional until the CMS feeds them through the store.
const PRESET_BY_INDEX: Partial<Record<number, TransitionPreset>> = {
  1: "slash",
  2: "thrust",
  3: "sweep",
};

export function SwordRig() {
  const group = useRef<Group>(null);
  const reducedMotion = useRef(false);
  const invalidate = useThree((state) => state.invalidate);
  const pose = useMemo<SwordPose>(
    () => ({ position: new Vector3(), quaternion: new Quaternion() }),
    [],
  );

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    reducedMotion.current = query.matches;

    const onChange = (event: MediaQueryListEvent) => {
      reducedMotion.current = event.matches;
    };
    query.addEventListener("change", onChange);

    return () => query.removeEventListener("change", onChange);
  }, []);

  useFrame((state) => {
    const object = group.current;
    if (!object) return;

    if (reducedMotion.current) {
      object.position.set(0, 0, 0);
      object.quaternion.identity();
      return;
    }

    const { activeIndex, sections } = scrollStore.getState();
    const progress = sections[activeIndex]?.progress ?? 0;
    const preset = PRESET_BY_INDEX[activeIndex];

    if (preset) {
      sampleTransition(preset, progress, pose);
    } else {
      pose.position.set(0, 0, 0);
      pose.quaternion.identity();
    }

    // Drift only near the resting pose; it fades out while the blade is in flight.
    const idleWeight = 1 - Math.min(1, pose.position.length() / 0.3);
    const time = state.clock.elapsedTime;
    const phase = activeIndex * 0.9;

    object.position.copy(pose.position);
    object.position.y +=
      (Math.sin((time * Math.PI * 2) / IDLE_PERIOD + phase) * 0.06 * idleWeight);
    object.quaternion.copy(pose.quaternion);
    object.rotateY(Math.sin(time * 0.9 + phase) * 0.04 * idleWeight);

    invalidate();
  });

  return (
    <>
      <group ref={group} name="sword-rig">
        <Sword />
      </group>
      <SwordTrail target={group} />
    </>
  );
}
