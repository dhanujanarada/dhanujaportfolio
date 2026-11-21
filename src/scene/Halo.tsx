import {
  Bloom,
  EffectComposer,
  GodRays,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { useState } from "react";
import type { Mesh } from "three";
import { useStore } from "zustand";

import { TIER_SETTINGS, qualityStore } from "./quality";

/**
 * Screen-space finish. God rays come from a small emissive sun placed top-back;
 * the low tier renders none of this, the medium tier drops rays and grain.
 */
export function Halo() {
  const tier = useStore(qualityStore, (state) => state.tier);
  const settings = TIER_SETTINGS[tier];
  const [sun, setSun] = useState<Mesh | null>(null);

  return (
    <>
      <mesh ref={setSun} position={[2.1, 1.9, -2.4]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial color="#fff1cf" toneMapped={false} />
      </mesh>

      {settings.bloom && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.25}
            mipmapBlur
          />
          {settings.godRays && sun && (
            <GodRays
              sun={sun}
              samples={56}
              density={0.94}
              decay={0.93}
              weight={0.35}
              exposure={0.32}
              clampMax={1}
              blur
            />
          )}
          <Vignette offset={0.28} darkness={0.55} eskil={false} />
          {settings.grain && <Noise premultiply opacity={0.04} />}
        </EffectComposer>
      )}
    </>
  );
}
