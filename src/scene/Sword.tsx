import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, type RefObject } from "react";
import { MeshStandardMaterial, type Mesh, type Object3D } from "three";

import { scrollStore } from "../store/scroll";

export const MODEL_URL = "/models/katana.glb";

/** Parent-space distance from a sheathed blade to a fully drawn one. */
const DRAW_TRAVEL = 1.117;
/** Blade and saya split the travel, half each, moving apart. */
const DRAW_SPLIT = 0.5;
const DRAW_START = 0.06;
const DRAW_SPAN = 0.62;

export function drawProgress(global: number) {
  // 1 at the top (fully drawn), 0 once the blade is sheathed again.
  return 1 - clamp01((global - DRAW_START) / DRAW_SPAN);
}

export function Sword({ mouthRef }: { mouthRef?: RefObject<Object3D | null> }) {
  const { scene } = useGLTF(MODEL_URL, false, false);
  const model = useMemo(() => scene.clone(true), [scene]);
  const katana = useMemo(() => model.getObjectByName("Katana"), [model]);
  const sheath = useMemo(() => model.getObjectByName("Sheath"), [model]);
  const katanaBase = useMemo(() => katana?.position.x ?? 0, [katana]);
  const sheathBase = useMemo(() => sheath?.position.x ?? 0, [sheath]);

  const materials = useMemo(() => {
    // One standard material program for all five parts keeps shader compilation
    // cheap. Clearcoat was subtle on a sword this size and doubled the variants.
    const blade = new MeshStandardMaterial({
      color: "#f0f4f8",
      metalness: 0.55,
      roughness: 0.2,
    });
    const handle = new MeshStandardMaterial({
      color: "#191b1d",
      metalness: 0.05,
      roughness: 0.82,
    });
    const lacquer = new MeshStandardMaterial({
      color: "#12100f",
      metalness: 0.2,
      roughness: 0.3,
    });
    const cord = new MeshStandardMaterial({
      color: "#2a2925",
      metalness: 0,
      roughness: 0.95,
    });
    const wrap = new MeshStandardMaterial({
      color: "#3a3226",
      metalness: 0,
      roughness: 0.9,
    });

    return {
      Katana: blade,
      KatanaHandle: handle,
      Sheath: lacquer,
      Rope: cord,
      Winding: wrap,
    };
  }, []);

  useEffect(() => {
    if (mouthRef) mouthRef.current = sheath ?? null;
  }, [mouthRef, sheath]);

  useEffect(() => {
    model.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      const source = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      const next = source ? materials[source.name as keyof typeof materials] : undefined;
      if (next) mesh.material = next;
    });
  }, [model, materials]);

  useEffect(
    () => () => Object.values(materials).forEach((material) => material.dispose()),
    [materials],
  );

  useFrame(() => {
    const draw = drawProgress(scrollStore.getState().global);
    const travel = DRAW_TRAVEL * DRAW_SPLIT * draw;

    if (katana) katana.position.x = katanaBase + travel;
    if (sheath) {
      sheath.position.x = sheathBase - travel;
      // One full unwind as the blade returns home, like the reference's saya pivot.
      sheath.rotation.x = draw * Math.PI * 2;
    }
  });

  return <primitive object={model} />;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}
