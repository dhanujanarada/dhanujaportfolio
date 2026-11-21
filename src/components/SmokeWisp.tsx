import gsap from "gsap";
import { useEffect, useRef } from "react";

const PUFFS = 22;
const COLOR = "201, 168, 106";

/**
 * Champagne wisp trailing the pointer. DOM canvas, not WebGL: it must sit above
 * the paper. Driven by gsap.ticker so the page still has one animation clock.
 */
export function SmokeWisp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const puffs = Array.from({ length: PUFFS }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
    }));
    let next = 0;
    let lastSpawn = 0;
    let pointerX = 0;
    let pointerY = 0;
    let active = false;

    const spawn = () => {
      const puff = puffs[next % PUFFS];
      next += 1;
      puff.x = pointerX;
      puff.y = pointerY;
      puff.vx = (Math.random() - 0.5) * 0.35;
      puff.vy = -(0.15 + Math.random() * 0.35);
      puff.life = 1;
      active = true;
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      const now = performance.now();
      if (now - lastSpawn < 28) return;
      lastSpawn = now;
      spawn();
    };

    const onPointerDown = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      for (let i = 0; i < 4; i += 1) spawn();
    };

    const tick = (_time: number, delta: number) => {
      if (!active) return;

      const step = Math.min(delta, 64) / 1000;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.globalCompositeOperation = "lighter";
      let alive = false;

      for (const puff of puffs) {
        if (puff.life <= 0) continue;

        puff.x += puff.vx;
        puff.y += puff.vy;
        puff.vy -= 0.08 * step;
        puff.life -= step * 1.6;

        if (puff.life <= 0) continue;
        alive = true;

        const radius = 16 + (1 - puff.life) * 34;
        const gradient = context.createRadialGradient(
          puff.x,
          puff.y,
          0,
          puff.x,
          puff.y,
          radius,
        );
        gradient.addColorStop(0, `rgba(${COLOR}, ${0.16 * puff.life})`);
        gradient.addColorStop(0.5, `rgba(${COLOR}, ${0.06 * puff.life})`);
        gradient.addColorStop(1, `rgba(${COLOR}, 0)`);

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(puff.x, puff.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      context.globalCompositeOperation = "source-over";

      if (!alive) {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        active = false;
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30"
    />
  );
}
