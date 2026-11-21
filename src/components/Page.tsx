import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

import { Atmosphere } from "./Atmosphere";
import { RuneDivider } from "./RuneDivider";

export function Page({
  kicker,
  title,
  intro,
  ghost,
  children,
}: {
  kicker: string;
  title: string;
  intro?: string;
  ghost?: string;
  children: ReactNode;
}) {
  const scope = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const ghost = root.querySelector<HTMLElement>(".page-ghost");
      if (ghost) {
        gsap.to(ghost, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      const marked = Array.from(
        root.querySelectorAll<HTMLElement>("[data-reveal]"),
      );
      const targets = marked.length
        ? marked
        : Array.from(content.current?.children ?? []);

      for (const target of targets) {
        gsap.from(target, {
          y: 36,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: target,
            start: "top 88%",
            once: true,
          },
        });
      }
    }, root);

    return () => context.revert();
  }, []);

  return (
    <main
      id="main"
      ref={scope}
      className="relative z-10 min-h-svh bg-ink/85"
    >
      <Atmosphere fixed ghost={ghost ?? kicker} />

      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-28 pt-32 md:px-10 md:pt-36">
        <header data-page-head className="page-head">
          <p className="font-display text-[0.68rem] uppercase tracking-[0.3em] text-champagne">
            {kicker}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[1.02] text-pearl">
            {title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-2xl font-body text-[1.2rem] italic leading-relaxed text-pearl/70">
              {intro}
            </p>
          )}
          <RuneDivider className="mt-10 max-w-2xl opacity-80" />
        </header>

        <div ref={content} className="mt-12 space-y-14 md:mt-16 md:space-y-16">
          {children}
        </div>
      </div>
    </main>
  );
}
