import gsap from "gsap";
import { lazy, Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";

import { DebugOverlay } from "./components/DebugOverlay";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { SmokeWisp } from "./components/SmokeWisp";
import type { SiteSettings } from "./content/cv";

/** The whole three/drei stack is its own chunk; the DOM paints first. */
const SceneCanvas = lazy(() => import("./scene/SceneCanvas"));

if (typeof window !== "undefined") {
  // Start the scene chunk with the root bundle instead of waiting for the
  // first render. The lazy component reuses the same module promise.
  void import("./scene/SceneCanvas");
}

/** One timeline per route change; the canvas is never touched. */
function RouteWipe() {
  const { pathname } = useLocation();
  const node = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const element = node.current;
    if (!element) return;

    const timeline = gsap
      .timeline()
      .addLabel("wipe")
      .set(element, { opacity: 0 })
      .to(element, { opacity: 0.9, duration: 0.16, ease: "power2.in" })
      .addLabel("enter")
      .call(() => {
        // Content routes start at the top; the journey keeps its position.
        if (pathname !== "/") window.scrollTo(0, 0);
      })
      .to(element, { opacity: 0, duration: 0.55, ease: "power2.out" })
      .addLabel("settle");

    return () => {
      timeline.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={node}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[35] opacity-0"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 50%, rgba(201,168,106,0.35), rgba(10,17,28,0.95) 70%)",
      }}
    />
  );
}

export function App({
  settings,
  headline,
}: {
  settings: SiteSettings;
  headline: string;
}) {
  const { pathname } = useLocation();
  // Prerender emits paths with a trailing slash ("/about/"); the client does not.
  const route = pathname.replace(/\/+$/, "") || "/";
  const ambient = route !== "/";

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.title,
    headline,
    sameAs: [settings.linkedin, settings.github].filter(Boolean),
  };

  return (
    <>
      {route === "/" || route === "/about" ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      ) : null}

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-champagne focus:px-4 focus:py-2 focus:font-ui focus:text-xs focus:text-ink"
      >
        Skip to content
      </a>
      <div className="fixed inset-0 -z-10">
        <Suspense fallback={null}>
          <SceneCanvas ambient={ambient} />
        </Suspense>
      </div>

      <Nav settings={settings} />
      <Outlet />
      <Footer settings={settings} />
      <SmokeWisp />
      <DebugOverlay />
      <RouteWipe />
    </>
  );
}
