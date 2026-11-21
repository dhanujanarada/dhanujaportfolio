import type { CSSProperties, ReactNode } from "react";

/**
 * Deterministic torn-paper silhouettes. Generated once at module load so the
 * prerendered HTML and the hydrated client agree on the exact clip path.
 */
function tornShape(seed: number): string {
  let state = seed >>> 0;
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const points: string[] = [];
  const steps = 18;
  const tear = () => 0.25 + random() * 1.9;

  for (let i = 0; i < steps; i += 1) {
    points.push(`${((i / steps) * 100).toFixed(2)}% ${tear().toFixed(2)}%`);
  }
  for (let i = 1; i < steps; i += 1) {
    points.push(`${(100 - tear()).toFixed(2)}% ${((i / steps) * 100).toFixed(2)}%`);
  }
  for (let i = steps; i > 0; i -= 1) {
    points.push(`${((i / steps) * 100).toFixed(2)}% ${(100 - tear()).toFixed(2)}%`);
  }
  for (let i = steps - 1; i > 0; i -= 1) {
    points.push(`${tear().toFixed(2)}% ${((i / steps) * 100).toFixed(2)}%`);
  }

  return `polygon(${points.join(", ")})`;
}

const TORN_SHAPES = [tornShape(7), tornShape(23), tornShape(41), tornShape(59)];

export function Parchment({
  children,
  className = "",
  variant = 0,
  tilt = 0,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  variant?: number;
  tilt?: number;
  interactive?: boolean;
}) {
  const shape = TORN_SHAPES[variant % TORN_SHAPES.length];

  return (
    <div
      className={`parchment ${interactive ? "parchment--interactive" : ""} ${className}`}
      style={{ "--parchment-tilt": `${tilt}deg` } as CSSProperties}
    >
      <span aria-hidden className="parchment__sheet-wrap">
        <span className="parchment__sheet" style={{ clipPath: shape }}>
          <span className="parchment__fiber" />
          <span className="parchment__stain" />
        </span>
      </span>
      <div className="parchment__content">{children}</div>
    </div>
  );
}
