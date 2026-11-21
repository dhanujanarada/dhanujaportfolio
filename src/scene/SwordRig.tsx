import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { Group, Object3D } from "three";
import { useStore } from "zustand";

import { scrollStore } from "../store/scroll";
import { strikeStore } from "../store/strike";
import { qualityStore } from "./quality";
import { Sparks } from "./Sparks";
import { Sword, drawProgress } from "./Sword";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const IDLE_PERIOD = 5;
const SCALE = 3;
const TILT = 0.14;
/** The sheathed silhouette is asymmetric; this centres it in a 16:9 frame. */
const CENTRE_OFFSET = 0.9;
/** Resting height: the blade and saya sit on the centre line. */
const CENTRE_Y = 0.04;

export function SwordRig({ ambient = false }: { ambient?: boolean }) {
  const group = useRef<Group>(null);
  const mouth = useRef<Object3D>(null);
  const reducedMotion = useRef(false);
  const kick = useRef({ value: 0 });
  const invalidate = useThree((state) => state.invalidate);
  const tier = useStore(qualityStore, (state) => state.tier);

  useEffect(() => {
    if (tier !== "medium" || ambient) return;

    // Demand rendering means a throttled invalidation needs a timer of its own.
    const id = window.setInterval(() => {
      if (!reducedMotion.current) invalidate();
    }, 1000 / 30);

    return () => window.clearInterval(id);
  }, [tier, ambient, invalidate]);

  useEffect(
    () =>
      strikeStore.subscribe((state) => {
        if (!state.preset) return;
        invalidate();
        gsap.killTweensOf(kick.current);
        gsap
          .timeline({
            onUpdate: invalidate,
            onComplete: () => strikeStore.getState().clear(),
          })
          .to(kick.current, { value: 1, duration: 0.32, ease: "power3.out" })
          .to(kick.current, { value: 0, duration: 0.5, ease: "power2.in" });
      }),
    [invalidate],
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

    if (ambient) {
      const time = state.clock.elapsedTime;
      object.scale.setScalar(SCALE);
      object.position.set(
        CENTRE_OFFSET,
        CENTRE_Y + Math.sin(time * 0.5) * 0.02,
        0,
      );
      object.rotation.z = 0.04 + Math.sin(time * 0.35) * 0.03;
      object.rotation.y = Math.sin(time * 0.25) * 0.08;
      if (tier !== "low" && !reducedMotion.current) invalidate();
      return;
    }

    const { global } = scrollStore.getState();
    const draw = drawProgress(global);
    const storm = smoothstep(0.55, 1, global);
    const time = state.clock.elapsedTime;

    object.scale.setScalar(SCALE + storm * 0.1);
    object.position.x = CENTRE_OFFSET;

    // Drawn at the top (hilt upper-right); sheathing tips it the other way.
    object.rotation.z = TILT * (draw * 2 - 1) + storm * 0.06;

    object.position.y =
      CENTRE_Y -
      storm * 0.18 +
      (reducedMotion.current
        ? 0
        : Math.sin((time * Math.PI * 2) / IDLE_PERIOD) * 0.03);

    object.position.z = storm * 1.5;
    object.rotation.y = 0;

    const k = kick.current.value;
    if (k > 0.001) {
      const preset = strikeStore.getState().preset;
      if (preset === "slash") object.rotation.z += k * 0.5;
      else if (preset === "thrust") object.position.z += k * 1.2;
      else if (preset === "sweep") object.rotation.y = k * 0.7;
      else if (preset === "spiral") object.rotation.y = k * Math.PI * 2;

      object.scale.setScalar(SCALE + storm * 0.1 + k * 0.05);
      invalidate();
    }

    if (!reducedMotion.current && tier === "high") invalidate();
  });

  return (
    <>
      <group ref={group} name="sword-rig">
        <Sword mouthRef={mouth} />
      </group>
      {!ambient && <Sparks mouth={mouth} />}
    </>
  );
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
