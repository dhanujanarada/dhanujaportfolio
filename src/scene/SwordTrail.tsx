import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  DynamicDrawUsage,
  Vector3,
  type Group,
  type MeshBasicMaterial,
} from "three";

const HISTORY = 24;
const RIBBON_WIDTH = 0.035;
const MAX_OPACITY = 0.5;

/**
 * Ribbon through the blade tip's recent world positions. Opacity follows the
 * tip's speed, so it appears while the sword is in flight and vanishes at rest.
 * Colour is a placeholder until the project accent reaches the scene.
 */
export function SwordTrail({ target }: { target: RefObject<Group | null> }) {
  const material = useRef<MeshBasicMaterial>(null);
  const opacity = useRef(0);
  const tip = useMemo(() => new Vector3(), []);
  const previousTip = useMemo(() => new Vector3(), []);
  const tangent = useMemo(() => new Vector3(), []);
  const view = useMemo(() => new Vector3(), []);
  const side = useMemo(() => new Vector3(), []);

  const history = useMemo(
    () => Array.from({ length: HISTORY }, () => new Vector3()),
    [],
  );

  const geometry = useMemo(() => {
    const next = new BufferGeometry();
    const attribute = new BufferAttribute(new Float32Array(HISTORY * 2 * 3), 3);
    attribute.setUsage(DynamicDrawUsage);
    next.setAttribute("position", attribute);

    const indices: number[] = [];
    for (let i = 0; i < HISTORY - 1; i += 1) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    next.setIndex(indices);
    return next;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const rig = target.current;
    if (!rig) return;

    tip.set(0, 1.15, 0).applyQuaternion(rig.quaternion).add(rig.position);
    const speed = delta > 0 ? tip.distanceTo(previousTip) / delta : 0;
    previousTip.copy(tip);

    for (let i = HISTORY - 1; i > 0; i -= 1) {
      history[i].copy(history[i - 1]);
    }
    history[0].copy(tip);

    const targetOpacity =
      Math.min(1, Math.max(0, (speed - 1.5) / 6)) * MAX_OPACITY;
    opacity.current += (targetOpacity - opacity.current) * Math.min(1, delta * 8);

    const ribbon = material.current;
    if (!ribbon) return;
    ribbon.opacity = opacity.current;

    if (opacity.current < 0.005) return;

    const positions = geometry.getAttribute("position") as BufferAttribute;
    for (let i = 0; i < HISTORY; i += 1) {
      const point = history[i];
      const next = history[Math.min(i + 1, HISTORY - 1)];

      tangent.subVectors(next, point);
      if (tangent.lengthSq() < 1e-8) tangent.set(0, 1, 0);
      view.subVectors(state.camera.position, point).normalize();
      side
        .crossVectors(tangent, view)
        .normalize()
        .multiplyScalar(RIBBON_WIDTH * (1 - i / HISTORY));

      positions.setXYZ(i * 2, point.x + side.x, point.y + side.y, point.z + side.z);
      positions.setXYZ(
        i * 2 + 1,
        point.x - side.x,
        point.y - side.y,
        point.z - side.z,
      );
    }
    positions.needsUpdate = true;
  });

  return (
    <mesh geometry={geometry} frustumCulled={false} renderOrder={1}>
      <meshBasicMaterial
        ref={material}
        color="#cfe8ff"
        transparent
        opacity={0}
        depthWrite={false}
        blending={AdditiveBlending}
        side={DoubleSide}
      />
    </mesh>
  );
}
