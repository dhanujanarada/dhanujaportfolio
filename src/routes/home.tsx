import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { useStore } from "zustand";

import { getProjects } from "../cms/content";
import { useScrollEngine } from "../motion/useScrollEngine";
import { scrollStore } from "../store/scroll";
import type { Route } from "./+types/home";

const TEAR_PATH =
  "M0 48 L3 35 L8 39 L13 30 L18 34 L24 26 L30 31 L36 24 L42 29 L48 22 " +
  "L54 28 L60 21 L66 27 L72 23 L78 30 L84 26 L90 32 L95 28 L100 45 " +
  "L97 60 L92 68 L86 63 L80 71 L74 66 L68 74 L62 68 L56 76 L50 70 " +
  "L44 77 L38 71 L32 78 L26 72 L20 78 L14 73 L9 77 L4 71 L1 62 Z";

export function meta() {
  return [
    { title: "Dhanuja Narada Udurawana — Machine Learning Engineer" },
    {
      name: "description",
      content:
        "Machine Learning Engineer building deep learning, LLM, RAG, computer vision and NLP systems.",
    },
  ];
}

export async function loader() {
  return { projects: await getProjects() };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  useScrollEngine();
  const activeIndex = useStore(scrollStore, (state) => state.activeIndex);
  const { projects } = loaderData;

  return (
    <main className="pointer-events-none relative text-pearl">
      <PaperDefs />

      <Section id="hero" index={0} activeIndex={activeIndex} align="left">
        {(active) => (
          <>
            <p className="font-ui text-xs tracking-[0.08em] text-champagne">
              Machine Learning Engineer
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-display font-medium text-ink">
              <SplitText text="Dhanuja" active={active} />
            </h1>
            <p
              className={`mt-4 max-w-md font-body text-body text-ink/80 ${fade(active)}`}
            >
              First Class Honours BEng, Distinction dissertation in generative
              audio AI, and 2+ years building software in industry.
            </p>
            <p
              className={`mt-10 font-ui text-xs tracking-[0.08em] text-ink/50 ${fade(active, "slow")}`}
            >
              Keep scrolling
            </p>
          </>
        )}
      </Section>

      {projects.map((project, index) => (
        <Section
          id={project.slug}
          key={project.id}
          index={index + 1}
          activeIndex={activeIndex}
          align={index % 2 === 0 ? "right" : "left"}
        >
          {(active) => (
            <>
              <p className="font-ui text-xs tracking-[0.08em] text-champagne">
                Project {index + 1}
              </p>
              <h2
                className="mt-2 font-display text-title text-ink"
                data-hover-title
              >
                <SplitText text={project.title} active={active} />
              </h2>
              <p
                className={`mt-3 font-ui text-xs text-ink/60 ${fade(active)}`}
              >
                {project.period}
              </p>
              <div className="mt-6">
                <CaseStudyCta
                  slug={project.slug}
                  sectionIndex={index + 1}
                  title={project.title}
                />
              </div>
            </>
          )}
        </Section>
      ))}

      <Section id="about" index={projects.length + 1} activeIndex={activeIndex} align="left">
        {(active) => (
          <>
            <p className="font-ui text-xs tracking-[0.08em] text-champagne">
              About
            </p>
            <h2 className="mt-2 font-display text-title text-ink">
              <SplitText text="The long way here" active={active} />
            </h2>
            <p
              className={`mt-4 max-w-md font-body text-body text-ink/80 ${fade(active)}`}
            >
              Education, industry experience and six skill groups, all readable
              without the sword.
            </p>
            <Link
              to="/about"
              className={`mt-6 inline-block font-ui text-xs tracking-[0.06em] text-ink underline underline-offset-4 ${fade(active)}`}
            >
              Read the full about page
            </Link>
          </>
        )}
      </Section>

      <Section
        id="contact"
        index={projects.length + 2}
        activeIndex={activeIndex}
        align="right"
      >
        {(active) => (
          <>
            <p className="font-ui text-xs tracking-[0.08em] text-champagne">
              Contact
            </p>
            <h2 className="mt-2 font-display text-title text-ink">
              <SplitText text="Let's talk" active={active} />
            </h2>
            <Link
              to="/contact"
              className={`mt-6 inline-block font-ui text-xs tracking-[0.06em] text-ink underline underline-offset-4 ${fade(active)}`}
            >
              Email, LinkedIn and GitHub
            </Link>
          </>
        )}
      </Section>

      <ProgressReadout />
    </main>
  );
}

/** Last 15% of the project's own section reveals the case-study link. */
function CaseStudyCta({
  slug,
  sectionIndex,
  title,
}: {
  slug: string;
  sectionIndex: number;
  title: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      const { sections, activeIndex } = scrollStore.getState();
      const local = sections[activeIndex]?.progress ?? 0;
      setVisible(activeIndex === sectionIndex && local > 0.85);
    }, 100);
    return () => window.clearInterval(id);
  }, [sectionIndex]);

  return (
    <Link
      to={`/projects/${slug}`}
      aria-label={`Read the ${title} case study`}
      className={`inline-block border border-ink/30 px-4 py-2 font-ui text-xs tracking-[0.06em] text-ink transition-opacity duration-300 hover:border-ink ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      Read the case study →
    </Link>
  );
}

function SplitText({ text, active }: { text: string; active: boolean }) {
  return (
    <span aria-label={text}>
      {Array.from(text).map((character, index) => (
        <span
          key={`${character}-${index}`}
          aria-hidden
          className={`inline-block transition-[opacity,filter] duration-500 ease-out ${
            active ? "opacity-100 blur-0" : "opacity-0 blur-[3px]"
          }`}
          style={{ transitionDelay: active ? `${index * 18}ms` : "0ms" }}
        >
          {character === " " ? "\u00A0" : character}
        </span>
      ))}
    </span>
  );
}

const FADE = {
  fast: "transition-opacity duration-500",
  slow: "transition-opacity duration-700",
} as const;

function fade(active: boolean, speed: keyof typeof FADE = "fast") {
  return `${FADE[speed]} ${active ? "opacity-100" : "opacity-0"}`;
}

function Section({
  id,
  index,
  activeIndex,
  align,
  children,
}: {
  id: string;
  index: number;
  activeIndex: number;
  align: "left" | "right";
  children: (active: boolean) => ReactNode;
}) {
  const active = index === activeIndex;

  return (
    <section
      data-section={id}
      className="pointer-events-none relative flex h-svh items-end px-6 pb-14 md:px-16 md:pb-20"
    >
      <div
        className={`pointer-events-auto relative max-w-xl ${
          align === "right" ? "ml-auto" : ""
        }`}
      >
        <PaperSlash />
        <div className="relative px-8 py-7 md:px-10">{children(active)}</div>
      </div>
    </section>
  );
}

function PaperSlash() {
  return (
    <span aria-hidden className="pointer-events-none absolute -inset-x-10 -inset-y-5 -z-10">
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={TEAR_PATH}
          transform="translate(1.4 1.8) rotate(-1.6 50 50)"
          fill="#000000"
          opacity="0.5"
          filter="url(#tear-void)"
        />
        <path
          d={TEAR_PATH}
          transform="rotate(-1.6 50 50)"
          fill="url(#paper-fill)"
          stroke="var(--color-pearl)"
          strokeOpacity="0.35"
          strokeWidth="0.35"
          filter="url(#tear-noise)"
        />
      </svg>
    </span>
  );
}

function PaperDefs() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
      <defs>
        <linearGradient id="paper-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-pearl)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--color-pearl-deep)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-pearl)" }} />
        </linearGradient>
        <filter id="tear-noise" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.11"
            numOctaves="4"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="tear-void" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>
    </svg>
  );
}

function ProgressReadout() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setProgress(scrollStore.getState().global),
      100,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 text-right">
      <div className="font-ui text-xs tabular-nums text-pearl/70">
        {Math.round(progress * 100)}%
      </div>
      <div className="mt-2 h-px w-16 bg-pearl/15">
        <div
          className="h-px bg-champagne"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
