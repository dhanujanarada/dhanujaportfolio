import { Environment } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { useStore } from "zustand";

import { DebugOverlay } from "./components/DebugOverlay";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { SmokeWisp } from "./components/SmokeWisp";
import type { SiteSettings } from "./content/cv";
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

/** One timeline per route change; the canvas is never touched. */
function RouteWipe() {
  const { pathname } = useLocation();
  const node = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const element = node.current;
    if (!element) return;

    const timeline = gsap
      .timeline()
      .set(element, { opacity: 0 })
      .to(element, { opacity: 0.9, duration: 0.16, ease: "power2.in" })
      .to(element, { opacity: 0, duration: 0.55, ease: "power2.out" });

    return () => {
      timeline.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={node}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[35] opacity-0"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 50%, rgba(201,168,106,0.35), rgba(10,17,28,0.95) 70%)",
      }}
    />
  );
}

export function App({
  settings,
  headline,
}: {
  settings: SiteSettings;
  headline: string;
}) {
  const { pathname } = useLocation();
  const ambient = pathname !== "/";
  const tier = useStore(qualityStore, (state) => state.tier);
  const settingsByTier = TIER_SETTINGS[tier];

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.title,
    headline,
    email: `mailto:${settings.email}`,
    sameAs: [settings.linkedin, settings.github].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <div className="fixed inset-0 -z-10">
        <Canvas
          frameloop="demand"
          dpr={settingsByTier.dpr}
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

          <SwordRig ambient={ambient} />
          <Smoke calm={ambient} />
          {!ambient && <ProjectHover />}

          <Halo />
          <QualityMonitor />
          <InvalidateOnScroll />
        </Canvas>
      </div>

      <Nav settings={settings} />
      <Outlet />
      <Footer settings={settings} />
      <SmokeWisp />
      <DebugOverlay />
      <RouteWipe />
    </>
  );
}
