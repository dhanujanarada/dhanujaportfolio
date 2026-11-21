import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import {
  DataTexture,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  LinearFilter,
  NormalBlending,
  PlaneGeometry,
  RGBAFormat,
  RepeatWrapping,
  ShaderMaterial,
} from "three";
import { useStore } from "zustand";

import { scrollStore } from "../store/scroll";
import { TIER_SETTINGS, qualityStore, type QualityTier } from "./quality";

const VERTEX = /* glsl */ `
  attribute vec3 aOffset;
  attribute float aScale;
  attribute float aSeed;

  uniform float uTime;
  uniform float uVelocity;

  varying vec2 vUv;
  varying float vAlpha;
  varying float vSeed;

  // Divergence-free drift from the curl of psi = sin(px) * cos(py).
  vec2 curl(vec2 p) {
    float a = 1.6;
    float b = 1.1;
    float px = p.x * a + aSeed * 6.2831 + uTime * 0.21;
    float py = p.y * b - uTime * 0.17;
    return vec2(-sin(px) * sin(py) * b, -cos(px) * cos(py) * a);
  }

  void main() {
    vUv = uv;
    vSeed = aSeed;

    vec2 p = aOffset.xy * 1.1 + aSeed * 2.7;
    vec2 drift = curl(p) * (0.35 + uVelocity * 0.9);
    vec3 point = vec3(aOffset.x + drift.x, aOffset.y + drift.y, aOffset.z);

    vec4 view = modelViewMatrix * vec4(point, 1.0);
    view.xy += position.xy * aScale;

    gl_Position = projectionMatrix * view;

    float distance = -view.z;
    vAlpha = smoothstep(0.6, 2.2, distance) * (1.0 - smoothstep(6.5, 9.5, distance));
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uNoise;
  uniform float uOpacity;
  uniform float uVelocity;

  varying vec2 vUv;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec2 uv = vUv * 1.7 + vec2(vSeed * 9.3, vSeed * 5.1);
    float fine = texture2D(uNoise, uv).r;
    float broad = texture2D(uNoise, uv * 0.45 + 0.31).r;
    float mask = smoothstep(0.22, 0.86, fine * 0.6 + broad * 0.4);

    float radial = smoothstep(0.5, 0.06, length(vUv - 0.5));
    float alpha = mask * radial * vAlpha * uOpacity * (1.0 + uVelocity * 1.4);
    if (alpha < 0.003) discard;

    vec3 warmWhite = vec3(1.0, 0.97, 0.92);
    vec3 paleGold = vec3(0.95, 0.84, 0.64);
    gl_FragColor = vec4(mix(warmWhite, paleGold, vSeed), alpha);
  }
`;

const COUNT_BY_TIER: Record<QualityTier, number> = {
  high: TIER_SETTINGS.high.smokeCount,
  medium: TIER_SETTINGS.medium.smokeCount,
  low: TIER_SETTINGS.low.smokeCount,
};

export function Smoke() {
  const tier = useStore(qualityStore, (state) => state.tier);
  const count = COUNT_BY_TIER[tier];
  const material = useRef<ShaderMaterial>(null);
  const previousGlobal = useRef(0);
  const velocity = useRef(0);

  const noise = useMemo(() => createNoiseTexture(128), []);

  const geometry = useMemo(() => {
    if (count === 0) return null;

    const plane = new PlaneGeometry(1, 1);
    const next = new InstancedBufferGeometry();
    next.index = plane.index;
    next.attributes.position = plane.attributes.position;
    next.attributes.uv = plane.attributes.uv;
    next.instanceCount = count;

    const offsets = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const offset = i * 3;
      offsets[offset] = (Math.random() * 2 - 1) * 2.9;
      offsets[offset + 1] = (Math.random() - 0.5) * 1.1;
      offsets[offset + 2] = -1.2 + Math.random() * 1.4;
      scales[i] = 0.9 + Math.random() * 1.5;
      seeds[i] = Math.random();
    }

    next.setAttribute("aOffset", new InstancedBufferAttribute(offsets, 3));
    next.setAttribute("aScale", new InstancedBufferAttribute(scales, 1));
    next.setAttribute("aSeed", new InstancedBufferAttribute(seeds, 1));
    return next;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVelocity: { value: 0 },
      uOpacity: { value: 0.16 },
      uNoise: { value: noise },
    }),
    [noise],
  );

  useEffect(
    () => () => {
      geometry?.dispose();
      noise.dispose();
    },
    [geometry, noise],
  );

  useFrame((state, delta) => {
    const shader = material.current;
    if (!shader || !geometry) return;

    const global = scrollStore.getState().global;
    const raw = delta > 0 ? Math.abs(global - previousGlobal.current) / delta : 0;
    previousGlobal.current = global;
    velocity.current += (Math.min(raw, 3) - velocity.current) * Math.min(1, delta * 4);

    shader.uniforms.uTime.value = state.clock.elapsedTime;
    shader.uniforms.uVelocity.value = velocity.current;
  });

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} frustumCulled={false} renderOrder={-1}>
      <shaderMaterial
        ref={material}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={NormalBlending}
      />
    </mesh>
  );
}

/** Tileable fbm: lattice wraps at the texture edge. */
function createNoiseTexture(size: number) {
  const data = new Uint8Array(size * size * 4);
  const hash = (x: number, y: number) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const smooth = (t: number) => t * t * (3 - 2 * t);

  const value = (x: number, y: number, period: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const wrap = (v: number) => ((v % period) + period) % period;
    const v00 = hash(wrap(xi), wrap(yi));
    const v10 = hash(wrap(xi + 1), wrap(yi));
    const v01 = hash(wrap(xi), wrap(yi + 1));
    const v11 = hash(wrap(xi + 1), wrap(yi + 1));
    const u = smooth(xf);
    const v = smooth(yf);
    return (v00 * (1 - u) + v10 * u) * (1 - v) + (v01 * (1 - u) + v11 * u) * v;
  };

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const n =
        value((x / size) * 8, (y / size) * 8, 8) * 0.55 +
        value((x / size) * 16, (y / size) * 16, 16) * 0.3 +
        value((x / size) * 32, (y / size) * 32, 32) * 0.15;
      const offset = (y * size + x) * 4;
      data[offset] = data[offset + 1] = data[offset + 2] = Math.round(n * 255);
      data[offset + 3] = 255;
    }
  }

  const texture = new DataTexture(data, size, size, RGBAFormat);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
