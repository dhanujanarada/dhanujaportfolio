import type { ReactNode } from "react";

/** A content heading with an optional chapter numeral and a fading gold rule. */
export function SectionHeading({
  index,
  children,
  className = "",
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-baseline gap-4">
        {index ? (
          <span className="font-display text-[0.62rem] uppercase tracking-[0.2em] text-champagne/60">
            {index}
          </span>
        ) : null}
        <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] text-pearl">
          {children}
        </h2>
      </div>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-champagne/35 via-champagne/10 to-transparent" />
    </div>
  );
}
