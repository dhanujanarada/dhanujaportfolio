import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Outlet } from "react-router";

import { DebugOverlay } from "./components/DebugOverlay";
import { PlaceholderCube } from "./scene/PlaceholderCube";
import { scrollStore } from "./store/scroll";

function InvalidateOnScroll() {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => scrollStore.subscribe(() => invalidate()), [invalidate]);

  return null;
}

export function App() {
  return (
    <>
      <div className="fixed inset-0 -z-10">
        <Canvas
          frameloop="demand"
          dpr={[1, 2]}
          camera={{ position: [0, 0, 4], fov: 45, near: 0.1, far: 50 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#12100e"]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 5]} intensity={1.4} />
          <PlaceholderCube />
          <InvalidateOnScroll />
        </Canvas>
      </div>

      <Outlet />
      <DebugOverlay />
    </>
  );
}
