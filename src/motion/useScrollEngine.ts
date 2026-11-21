import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

import { resetScroll, setSectionMetrics, updateScroll } from "../store/scroll";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Lenis -> ScrollTrigger -> scroll store. GSAP's ticker is the only ticker:
 * it advances Lenis, Lenis emits scroll, ScrollTrigger reads it and writes the
 * store. Nothing here re-renders React.
 */
export function useScrollEngine() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]"),
    );

    const measure = () => {
      setSectionMetrics(
        elements.map((element) => ({
          id: element.dataset.section ?? "",
          top: element.getBoundingClientRect().top + window.scrollY,
          height: element.offsetHeight,
        })),
      );
      updateScroll(window.scrollY, window.innerHeight);
    };

    measure();

    const lenis = reducedMotion
      ? undefined
      : new Lenis({ autoRaf: false, smoothWheel: true });
    let unsubscribeLenis: (() => void) | undefined;

    const tick = (time: number) => lenis?.raf(time * 1000);

    if (lenis) {
      unsubscribeLenis = lenis.on("scroll", () => ScrollTrigger.update());
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: "max",
      onRefresh: measure,
      onUpdate: (self) => updateScroll(self.scroll(), window.innerHeight),
    });

    return () => {
      trigger.kill();
      unsubscribeLenis?.();
      if (lenis) {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      }
      resetScroll();
    };
  }, []);
}
