import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import {
  CanvasTexture,
  Color,
  ShaderMaterial,
  SRGBColorSpace,
  type Mesh,
} from "three";
import { useStore } from "zustand";

import { scrollStore } from "../store/scroll";
import { qualityStore } from "./quality";

/** Placeholders until Sanity supplies `accent` and `cover`. */
const PROJECT_ACCENTS = ["#c9a86a", "#7f9ec4", "#a98a9e"];

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uCover;
  uniform vec3 uAccent;
  uniform float uTime;
  uniform float uReveal;
  uniform float uRgb;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 centered = vUv - 0.5;
    float radius = length(centered);

    // Reveal grows outward from the centre; outside it the plane is gone.
    float alpha = smoothstep(0.02, -0.08, radius - uReveal * 0.62);
    if (alpha < 0.01) discard;

    float grain = hash(vUv * 24.0 + uTime * 0.15) - 0.5;
    vec2 warped = vUv + grain * 0.035 * uReveal;

    float split = 0.014 * uRgb;
    vec3 color = vec3(
      texture2D(uCover, warped + vec2(split, 0.0)).r,
      texture2D(uCover, warped).g,
      texture2D(uCover, warped - vec2(split, 0.0)).b
    );

    float rim = smoothstep(0.035, 0.0, abs(radius - uReveal * 0.62));
    color += uAccent * rim * 0.8;

    gl_FragColor = vec4(color, alpha);
  }
`;

export function ProjectHover() {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const pinned = useRef(false);
  const state = useRef({ reveal: 0, rgb: 0 });
  const invalidate = useThree((value) => value.invalidate);
  const viewport = useThree((value) => value.viewport);

  const activeIndex = useStore(scrollStore, (store) => store.activeIndex);
  const tier = useStore(qualityStore, (store) => store.tier);

  const projectIndex = activeIndex - 1;
  const visible = projectIndex >= 0 && projectIndex < 3 && tier !== "low";
  const accent = PROJECT_ACCENTS[projectIndex] ?? PROJECT_ACCENTS[0];

  const cover = useMemo(() => makeCover(accent), [accent]);
  useEffect(() => () => cover.dispose(), [cover]);

  const uniforms = useMemo(
    () => ({
      uCover: { value: cover },
      uAccent: { value: new Color(accent) },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uRgb: { value: 0 },
    }),
    [accent, cover],
  );

  useEffect(() => {
    if (!visible) {
      state.current.reveal = 0;
      state.current.rgb = 0;
      pinned.current = false;
    }
  }, [visible]);

  useFrame((root) => {
    const shader = material.current;
    if (!shader) return;
    shader.uniforms.uTime.value = root.clock.elapsedTime;
    shader.uniforms.uReveal.value = state.current.reveal;
    shader.uniforms.uRgb.value = state.current.rgb;
  });

  const reveal = (on: boolean) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.killTweensOf(state.current);

    if (reduced) {
      state.current.reveal = on ? 1 : 0;
      state.current.rgb = 0;
      invalidate();
      return;
    }

    gsap
      .timeline({ onUpdate: invalidate })
      .to(state.current, { reveal: on ? 1 : 0, duration: 0.55, ease: "power3.out" }, 0)
      .fromTo(
        state.current,
        { rgb: on ? 1.6 : state.current.rgb },
        { rgb: on ? 0.12 : 0, duration: 1.1, ease: "power2.out" },
        0,
      );

    const title = document.querySelector<HTMLElement>(
      `[data-section="${sectionIdFor(activeIndex)}"] [data-hover-title]`,
    );
    if (title) {
      const chars = title.querySelectorAll("span span");
      gsap.killTweensOf(chars);
      gsap.to(chars, {
        y: on ? -6 : 0,
        stagger: 0.012,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    }
  };

  if (!visible) return null;

  const side = activeIndex % 2 === 0 ? 1 : -1;

  return (
    <mesh
      ref={mesh}
      position={[side * (viewport.width / 2 - 1.15), -viewport.height / 2 + 1.55, 0.2]}
      onPointerOver={(event) => {
        event.stopPropagation();
        reveal(true);
      }}
      onPointerOut={() => {
        if (pinned.current) return;
        reveal(false);
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        pinned.current = !pinned.current;
        reveal(pinned.current);
      }}
    >
      <planeGeometry args={[1.55, 2.05, 1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function sectionIdFor(index: number) {
  return ["hero", "project-one", "project-two", "project-three", "about", "contact"][
    index
  ];
}

/** Procedural stand-in cover: ink ground, accent bloom, diagonal rule, grain. */
function makeCover(accent: string) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d")!;

  context.fillStyle = "#0d1420";
  context.fillRect(0, 0, size, size);

  const bloom = context.createRadialGradient(
    size * 0.35,
    size * 0.3,
    10,
    size * 0.5,
    size * 0.5,
    size * 0.75,
  );
  bloom.addColorStop(0, accent);
  bloom.addColorStop(1, "rgba(10, 17, 28, 0)");
  context.fillStyle = bloom;
  context.fillRect(0, 0, size, size);

  context.strokeStyle = "rgba(242, 237, 225, 0.18)";
  context.lineWidth = 1;
  for (let i = -size; i < size * 2; i += 18) {
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i + size, size);
    context.stroke();
  }

  for (let i = 0; i < 2400; i += 1) {
    context.fillStyle = `rgba(242, 237, 225, ${Math.random() * 0.05})`;
    context.fillRect(Math.random() * size, Math.random() * size, 1, 1);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
