import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Mesh } from "three";

import { scrollStore } from "../store/scroll";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function PlaceholderCube() {
  const mesh = useRef<Mesh>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    reducedMotion.current = query.matches;

    const onChange = (event: MediaQueryListEvent) => {
      reducedMotion.current = event.matches;
    };
    query.addEventListener("change", onChange);

    return () => query.removeEventListener("change", onChange);
  }, []);

  useFrame(() => {
    const { global, sections, activeIndex } = scrollStore.getState();
    const object = mesh.current;
    if (!object) return;

    if (reducedMotion.current) {
      object.rotation.set(0.4, 0.6, 0);
      object.position.y = 0;
      return;
    }

    const local = sections[activeIndex]?.progress ?? 0;
    object.rotation.y = global * Math.PI * 2;
    object.rotation.x = local * Math.PI * 0.25;
    object.position.y = (local - 0.5) * 1.2;
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1.1, 1.1, 1.1]} />
      <meshStandardMaterial color="#c9c4ba" roughness={0.35} metalness={0.15} />
    </mesh>
  );
}
