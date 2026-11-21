import { useEffect, useState } from "react";

import { scrollStore } from "../store/scroll";

type Snapshot = {
  global: number;
  activeIndex: number;
  section: string;
  local: number;
  count: number;
  fps: number;
  dpr: number;
};

const percent = (value: number) => `${(value * 100).toFixed(1)}%`;

export function DebugOverlay() {
  const [visible, setVisible] = useState(false);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "d") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      setVisible((current) => !current);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!visible) {
      setSnapshot(null);
      return;
    }

    let frames = 0;
    let fps = 0;
    let sampledAt = performance.now();
    let animationFrame = 0;

    const sampleFps = (now: number) => {
      frames += 1;
      const elapsed = now - sampledAt;
      if (elapsed >= 500) {
        fps = Math.round((frames * 1000) / elapsed);
        frames = 0;
        sampledAt = now;
      }
      animationFrame = requestAnimationFrame(sampleFps);
    };
    animationFrame = requestAnimationFrame(sampleFps);

    const read = () => {
      const { global, activeIndex, sections } = scrollStore.getState();
      const active = sections[activeIndex];
      setSnapshot({
        global,
        activeIndex,
        section: active?.id ?? "—",
        local: active?.progress ?? 0,
        count: sections.length,
        fps,
        dpr: window.devicePixelRatio,
      });
    };

    read();
    const interval = window.setInterval(read, 100);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(interval);
    };
  }, [visible]);

  if (!visible || !snapshot) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-50 rounded border border-white/15 bg-black/70 px-3 py-2 font-mono text-xs leading-relaxed text-white/80">
      <div>scroll {percent(snapshot.global)}</div>
      <div>
        section {snapshot.activeIndex + 1}/{snapshot.count} · {snapshot.section}
      </div>
      <div>local {percent(snapshot.local)}</div>
      <div>
        {snapshot.fps} fps · dpr {snapshot.dpr}
      </div>
    </div>
  );
}
