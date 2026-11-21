import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { lazy, Suspense, useEffect, useRef } from "react";
import { useStore } from "zustand";

import { ProjectHover } from "./ProjectHover";
import { qualityStore, setQuality, TIER_SETTINGS } from "./quality";
import { Smoke } from "./Smoke";
import { MODEL_URL } from "./Sword";
import { SwordRig } from "./SwordRig";
import { scrollStore } from "../store/scroll";

// Start the 201 kB katana download as soon as this chunk executes, before the
// React tree has mounted. The scene chunk itself is already lazy.
useGLTF.preload(MODEL_URL, false, false);

const Halo = lazy(() =>
  import("./Halo").then((module) => ({ default: module.Halo })),
);

function InvalidateOnScroll() {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(
    () =>
      scrollStore.subscribe(() => {
        // Low tier is a held frame; scrolling must not wake the canvas.
        if (qualityStore.getState().tier !== "low") invalidate();
      }),
    [invalidate],
  );

  return null;
}

/**
 * Samples frame time once, after the model has resolved and shaders have
 * settled, then picks the session tier. Reduced motion skips straight to low.
 * It lives inside the scene Suspense boundary so a slow model load cannot be
 * mistaken for a fast renderer.
 */
function QualityMonitor() {
  const done = useRef(false);
  const warmup = useRef(0);
  const total = useRef(0);
  const frames = useRef(0);
  const stalls = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setQuality("low", 0);
      done.current = true;
    }
  }, []);

  useFrame((_, delta) => {
    if (done.current) return;

    // A shader compile or a background tab produces a huge delta. It is not
    // steady-state render cost. Repeated stalls, however, mean the device cannot
    // hold the current tier, so settle to low rather than sampling forever.
    if (delta > 0.2) {
      stalls.current += 1;
      warmup.current = 0;
      total.current = 0;
      frames.current = 0;

      if (stalls.current >= 8) {
        done.current = true;
        window.setTimeout(() => setQuality("low", delta * 1000), 0);
      }
      return;
    }

    stalls.current = 0;

    if (warmup.current < 0.5) {
      warmup.current += delta;
      return;
    }

    total.current += delta;
    frames.current += 1;
    if (total.current < 1.5) return;

    const frameMs = (total.current / frames.current) * 1000;
    const tier = frameMs > 24 ? "low" : frameMs > 19 ? "medium" : "high";
    done.current = true;
    // Leave the frame callback before touching React-visible state (rule 2).
    window.setTimeout(() => setQuality(tier, frameMs), 0);
  });

  return null;
}

export default function SceneCanvas({ ambient }: { ambient: boolean }) {
  const tier = useStore(qualityStore, (state) => state.tier);
  const settled = useStore(qualityStore, (state) => state.settled);
  const settings = TIER_SETTINGS[tier];

  return (
    <Canvas
      frameloop="demand"
      dpr={settings.dpr}
      camera={{ position: [0, 0, 4], fov: 45, near: 0.1, far: 50 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0a111c"]} />

      <ambientLight intensity={0.6} color="#dfe8f5" />
      <directionalLight position={[3, 4, 5]} intensity={2} color="#fff3dd" />
      <directionalLight
        position={[-3, 2, -3]}
        intensity={0.45}
        color="#8fb4d9"
      />
      <directionalLight
        position={[0, 2, -5]}
        intensity={0.6}
        color="#9fc3e6"
      />

      <Suspense fallback={null}>
        <SwordRig ambient={ambient} />
        {tier !== "low" && <Smoke calm={ambient} />}
        {!ambient && tier !== "low" && <ProjectHover />}
        {!ambient && <QualityMonitor />}
      </Suspense>

      {settled && !ambient && tier !== "low" && (
        <Suspense fallback={null}>
          <Halo />
        </Suspense>
      )}

      <InvalidateOnScroll />
    </Canvas>
  );
}
