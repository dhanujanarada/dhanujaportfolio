import type { ReactNode } from "react";

export function Page({
  kicker,
  title,
  intro,
  children,
}: {
  kicker: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main className="relative z-10 min-h-svh bg-ink">
      <div className="mx-auto max-w-4xl px-5 pb-24 pt-28 md:px-8">
        <p className="font-ui text-xs tracking-[0.08em] text-champagne">
          {kicker}
        </p>
        <h1 className="mt-3 font-display text-title text-pearl">{title}</h1>
        {intro && (
          <p className="mt-4 max-w-2xl font-body text-body text-pearl/70">
            {intro}
          </p>
        )}
        <div className="mt-12 space-y-12">{children}</div>
      </div>
    </main>
  );
}
