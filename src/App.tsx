import { Environment } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { useStore } from "zustand";

import { DebugOverlay } from "./components/DebugOverlay";
import { SmokeWisp } from "./components/SmokeWisp";
import { Halo } from "./scene/Halo";
import { ProjectHover } from "./scene/ProjectHover";
import { qualityStore, setQuality, TIER_SETTINGS } from "./scene/quality";
import { Smoke } from "./scene/Smoke";
import { SwordRig } from "./scene/SwordRig";
import { scrollStore } from "./store/scroll";

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
 * Samples frame time once, after shaders and textures have settled, and picks a
 * tier for the session. Reduced motion skips straight to low.
 */
function QualityMonitor() {
  const done = useRef(false);
  const warmup = useRef(0);
  const total = useRef(0);
  const frames = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setQuality("low", 0);
      done.current = true;
    }
  }, []);

  useFrame((_, delta) => {
    if (done.current) return;

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

export function App() {
  const tier = useStore(qualityStore, (state) => state.tier);
  const settings = TIER_SETTINGS[tier];

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <Canvas
          frameloop="demand"
          dpr={settings.dpr}
          camera={{ position: [0, 0, 4], fov: 45, near: 0.1, far: 50 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#0a111c"]} />
          <Environment preset="studio" />
          <ambientLight intensity={0.55} color="#dfe8f5" />
          <directionalLight
            position={[3, 4, 5]}
            intensity={1.3}
            color="#fff3dd"
          />
          <directionalLight
            position={[-3, 2, -3]}
            intensity={0.35}
            color="#8fb4d9"
          />

          <SwordRig />
          <Smoke />
          <ProjectHover />

          <Halo />
          <QualityMonitor />
          <InvalidateOnScroll />
        </Canvas>
      </div>

      <Outlet />
      <SmokeWisp />
      <DebugOverlay />
    </>
  );
}
