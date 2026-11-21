import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Group, Object3D } from "three";

import { scrollStore } from "../store/scroll";
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

export function SwordRig() {
  const group = useRef<Group>(null);
  const mouth = useRef<Object3D>(null);
  const reducedMotion = useRef(false);
  const invalidate = useThree((state) => state.invalidate);

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

    if (!reducedMotion.current) invalidate();
  });

  return (
    <>
      <group ref={group} name="sword-rig">
        <Sword mouthRef={mouth} />
      </group>
      <Sparks mouth={mouth} />
    </>
  );
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
