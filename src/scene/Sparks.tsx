import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  Vector3,
  type Object3D,
} from "three";
import { useStore } from "zustand";

import { qualityStore } from "./quality";

const MOUTH_COUNT = 96;
const AMBIENT_COUNT = 140;
const GRAVITY = 3.2;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const AMBIENT_BOUNDS = { x: 3.4, y: 2.1, z: 1.2 };

/**
 * Two fields: sparks thrown from the saya mouth while the blade moves, and a
 * slow ambient drift of embers across the frame. Both are preallocated; nothing
 * is created per frame.
 */
export function Sparks({ mouth }: { mouth: RefObject<Object3D | null> }) {
  const tier = useStore(qualityStore, (state) => state.tier);
  const reducedMotion = useRef(false);
  const previous = useMemo(() => new Vector3(), []);
  const current = useMemo(() => new Vector3(), []);
  const emitAccumulator = useRef(0);

  const mouthPositions = useMemo(() => new Float32Array(MOUTH_COUNT * 3), []);
  const mouthVelocities = useMemo(() => new Float32Array(MOUTH_COUNT * 3), []);
  const mouthLives = useMemo(() => new Float32Array(MOUTH_COUNT), []);

  const ambientPositions = useMemo(() => {
    const positions = new Float32Array(AMBIENT_COUNT * 3);
    for (let i = 0; i < AMBIENT_COUNT; i += 1) {
      const offset = i * 3;
      positions[offset] = (Math.random() * 2 - 1) * AMBIENT_BOUNDS.x;
      positions[offset + 1] = (Math.random() * 2 - 1) * AMBIENT_BOUNDS.y;
      positions[offset + 2] = (Math.random() * 2 - 1) * AMBIENT_BOUNDS.z;
    }
    return positions;
  }, []);
  const ambientSpeeds = useMemo(
    () => Float32Array.from({ length: AMBIENT_COUNT }, () => 0.06 + Math.random() * 0.12),
    [],
  );

  const mouthGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const attribute = new BufferAttribute(mouthPositions, 3);
    attribute.setUsage(DynamicDrawUsage);
    geometry.setAttribute("position", attribute);
    for (let i = 0; i < MOUTH_COUNT; i += 1) attribute.setXYZ(i, 0, -999, 0);
    return geometry;
  }, [mouthPositions]);

  const ambientGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const attribute = new BufferAttribute(ambientPositions, 3);
    attribute.setUsage(DynamicDrawUsage);
    geometry.setAttribute("position", attribute);
    return geometry;
  }, [ambientPositions]);

  useEffect(
    () => () => {
      mouthGeometry.dispose();
      ambientGeometry.dispose();
    },
    [mouthGeometry, ambientGeometry],
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

  useFrame((_, delta) => {
    if (tier === "low") return;

    const ambient = ambientGeometry.getAttribute("position") as BufferAttribute;
    if (!reducedMotion.current) {
      for (let i = 0; i < AMBIENT_COUNT; i += 1) {
        const offset = i * 3;
        ambientPositions[offset + 1] += ambientSpeeds[i] * delta;
        if (ambientPositions[offset + 1] > AMBIENT_BOUNDS.y) {
          ambientPositions[offset + 1] = -AMBIENT_BOUNDS.y;
          ambientPositions[offset] = (Math.random() * 2 - 1) * AMBIENT_BOUNDS.x;
        }
        ambient.setXYZ(
          i,
          ambientPositions[offset],
          ambientPositions[offset + 1],
          ambientPositions[offset + 2],
        );
      }
      ambient.needsUpdate = true;
    }

    const node = mouth.current;
    if (!node) return;

    node.getWorldPosition(current);
    if (previous.lengthSq() === 0) previous.copy(current);
    const speed = current.distanceTo(previous) / Math.max(delta, 1e-4);
    previous.copy(current);

    if (!reducedMotion.current) {
      const emission = tier === "medium" ? 2.5 : 5;
      emitAccumulator.current += Math.min(speed, 24) * delta * emission;
      let budget = 8;
      while (emitAccumulator.current >= 1 && budget > 0) {
        emitAccumulator.current -= 1;
        budget -= 1;
        spawn(current);
      }
    }

    const sparks = mouthGeometry.getAttribute("position") as BufferAttribute;

    for (let i = 0; i < MOUTH_COUNT; i += 1) {
      if (mouthLives[i] <= 0) continue;
      mouthLives[i] -= delta;

      const offset = i * 3;
      if (mouthLives[i] <= 0) {
        sparks.setXYZ(i, 0, -999, 0);
        continue;
      }

      mouthVelocities[offset + 1] -= GRAVITY * delta;
      mouthPositions[offset] += mouthVelocities[offset] * delta;
      mouthPositions[offset + 1] += mouthVelocities[offset + 1] * delta;
      mouthPositions[offset + 2] += mouthVelocities[offset + 2] * delta;
      sparks.setXYZ(
        i,
        mouthPositions[offset],
        mouthPositions[offset + 1],
        mouthPositions[offset + 2],
      );
    }

    sparks.needsUpdate = true;
  });

  function spawn(origin: Vector3) {
    let slot = -1;
    for (let i = 0; i < MOUTH_COUNT; i += 1) {
      if (mouthLives[i] <= 0) {
        slot = i;
        break;
      }
    }
    if (slot === -1) return;

    const offset = slot * 3;
    mouthPositions[offset] = origin.x;
    mouthPositions[offset + 1] = origin.y;
    mouthPositions[offset + 2] = origin.z;

    mouthVelocities[offset] = (Math.random() - 0.35) * 2.2;
    mouthVelocities[offset + 1] = (Math.random() - 0.2) * 2.4;
    mouthVelocities[offset + 2] = (Math.random() - 0.5) * 1.2;
    mouthLives[slot] = 0.3 + Math.random() * 0.35;
  }

  if (tier === "low") return null;

  return (
    <>
      <points geometry={ambientGeometry} frustumCulled={false} renderOrder={1}>
        <pointsMaterial
          color="#ffd9a8"
          size={0.03}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
      <points geometry={mouthGeometry} frustumCulled={false} renderOrder={2}>
        <pointsMaterial
          color="#ffe3b4"
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </>
  );
}
