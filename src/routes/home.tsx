import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { useStore } from "zustand";

import { Atmosphere } from "../components/Atmosphere";
import { Parchment } from "../components/Parchment";
import { SplitText } from "../components/SplitText";
import { getContent } from "../cms/content";
import { pageMeta } from "../content/meta";
import { roman } from "../content/roman";
import { useScrollEngine } from "../motion/useScrollEngine";
import { scrollStore } from "../store/scroll";
import { strikeStore } from "../store/strike";
import type { Route } from "./+types/home";

export function meta() {
  return pageMeta(
    "Dhanuja Narada Udurawana — Machine Learning Engineer",
    "Machine Learning Engineer building deep learning, LLM, RAG, computer vision and NLP systems.",
  );
}

export async function loader() {
  const content = await getContent();
  return {
    projects: [...content.projects].sort((a, b) => a.order - b.order),
    about: content.about,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  useScrollEngine();
  useGhostDrift();

  const activeIndex = useStore(scrollStore, (state) => state.activeIndex);
  const { projects, about } = loaderData;

  const chapters = [
    "Prologue",
    ...projects.map((project) => project.title.split(" - ")[0]),
    "Chronicle",
    "Contact",
  ];

  return (
    <main id="main" className="pointer-events-none relative text-pearl">
      <Atmosphere fixed />
      <ChapterRail chapters={chapters} activeIndex={activeIndex} />

      <Section id="hero" index={0} activeIndex={activeIndex} align="left" ghost="I" placement="center">
        {(active) => (
          <Parchment variant={0} tilt={-0.7} className="parchment--enter">
            <p className="line-clamp-2 font-display text-[0.68rem] uppercase tracking-[0.18em] text-leather md:line-clamp-none">
              {about.headline}
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.9rem,5.4vw,5.2rem)] font-medium leading-[0.95] text-ink">
              <SplitText text="Dhanuja" active={active} />
            </h1>
            <p className="mt-5 line-clamp-6 max-w-lg font-body text-[1.15rem] leading-relaxed text-ink/75 md:line-clamp-none">
              {about.summary}
            </p>
            <div className="mt-9 flex items-center gap-3 text-leather/90">
              <span aria-hidden className="h-10 w-px bg-leather/35" />
              <span className="font-display text-[0.68rem] uppercase tracking-[0.3em]">
                Descend
              </span>
            </div>
          </Parchment>
        )}
      </Section>

      {projects.map((project, index) => (
        <Section
          id={project.slug}
          key={project.id}
          index={index + 1}
          activeIndex={activeIndex}
          align={index % 2 === 0 ? "right" : "left"}
          ghost={roman(index + 2)}
        >
          {(active) => (
            <ProjectCard
              project={project}
              index={index}
              active={active}
            />
          )}
        </Section>
      ))}

      <Section
        id="about"
        index={projects.length + 1}
        activeIndex={activeIndex}
        align="left"
        ghost={roman(projects.length + 3)}
      >
        {(active) =>
          <ChronicleLink
            to="/about"
            kicker="The chronicle"
            title="The long way here"
            body="Education, industry experience, skills and credentials, gathered in one place and readable without the sword."
            cta="Read the full chronicle"
            active={active}
            variant={2}
            tilt={0.5}
          />
        }
      </Section>

      <Section
        id="contact"
        index={projects.length + 2}
        activeIndex={activeIndex}
        align="right"
        ghost={roman(projects.length + 4)}
      >
        {(active) => (
          <ChronicleLink
            to="/contact"
            kicker="Send word"
            title="Let's talk"
            body="Email, LinkedIn and GitHub are one page away."
            cta="Open contact"
            active={active}
            variant={3}
            tilt={-0.45}
          />
        )}
      </Section>
    </main>
  );
}

function ProjectCard({
  project,
  index,
  active,
}: {
  project: Awaited<ReturnType<typeof loader>>["projects"][number];
  index: number;
  active: boolean;
}) {
  const navigate = useNavigate();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    // Modified clicks and keyboard activation keep the plain link.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.detail === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();
    strikeStore.getState().fire(project.transitionPreset);
    window.setTimeout(() => navigate(`/projects/${project.slug}`), 420);
  }

  return (
    <Link
      to={`/projects/${project.slug}`}
      onClick={onClick}
      aria-label={`Read the ${project.title} case study`}
      className="group block w-full"
    >
      <Parchment
        interactive
        variant={index % 4}
        tilt={index % 2 === 0 ? -0.6 : 0.55}
      >
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-[3px] opacity-80"
          style={{ backgroundColor: project.accent }}
        />
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-display text-[0.68rem] uppercase tracking-[0.28em] text-leather">
            Project {roman(index + 2)}
          </p>
          <p className="font-ui text-[0.68rem] tracking-[0.04em] text-leather/90">
            {project.period}
          </p>
        </div>

        <h2
          className="mt-4 font-display text-[clamp(1.85rem,3.1vw,2.9rem)] leading-[1.03] text-ink"
          data-hover-title
        >
          <SplitText text={project.title} active={active} />
        </h2>

        <p className="mt-3 font-ui text-[0.72rem] leading-relaxed text-leather">
          {project.projectType}
        </p>
        <p className="mt-4 font-ui text-[0.72rem] leading-relaxed text-ink/70">
          {project.stack.join(" · ")}
        </p>

        <div className="mt-7 flex items-center justify-between gap-4 border-t border-leather/20 pt-4">
          <span className="font-display text-[0.68rem] uppercase tracking-[0.22em] text-leather transition-colors group-hover:text-ink">
            Read the case study
          </span>
          <span
            aria-hidden
            className="text-lg text-leather transition-transform duration-500 group-hover:translate-x-1.5"
          >
            →
          </span>
        </div>
      </Parchment>
    </Link>
  );
}

function ChronicleLink({
  to,
  kicker,
  title,
  body,
  cta,
  active,
  variant,
  tilt,
}: {
  to: string;
  kicker: string;
  title: string;
  body: string;
  cta: string;
  active: boolean;
  variant: number;
  tilt: number;
}) {
  return (
    <Link to={to} className="group block w-full">
      <Parchment interactive variant={variant} tilt={tilt}>
        <p className="font-display text-[0.68rem] uppercase tracking-[0.28em] text-leather">
          {kicker}
        </p>
        <h2 className="mt-4 font-display text-[clamp(1.9rem,3.1vw,2.9rem)] leading-[1.03] text-ink">
          <SplitText text={title} active={active} />
        </h2>
        <p className="mt-4 max-w-md font-body text-[1.05rem] leading-relaxed text-ink/75">
          {body}
        </p>
        <div className="mt-7 flex items-center justify-between gap-4 border-t border-leather/20 pt-4">
          <span className="font-display text-[0.68rem] uppercase tracking-[0.22em] text-leather transition-colors group-hover:text-ink">
            {cta}
          </span>
          <span
            aria-hidden
            className="text-lg text-leather transition-transform duration-500 group-hover:translate-x-1.5"
          >
            →
          </span>
        </div>
      </Parchment>
    </Link>
  );
}

function Section({
  id,
  index,
  activeIndex,
  align,
  ghost,
  placement = "end",
  children,
}: {
  id: string;
  index: number;
  activeIndex: number;
  align: "left" | "right";
  ghost: string;
  placement?: "end" | "center";
  children: (active: boolean) => ReactNode;
}) {
  const active = index === activeIndex;

  return (
    <section
      data-section={id}
      className={`pointer-events-none relative flex min-h-svh overflow-hidden px-6 pb-16 pt-28 md:px-16 md:pb-24 ${
        placement === "center" ? "items-center" : "items-end"
      }`}
    >
      <span
        aria-hidden
        data-ghost
        className={`ghost-type top-[8%] ${
          align === "right"
            ? "left-[2vw] text-left"
            : "right-[2vw] text-right"
        }`}
      >
        {ghost}
      </span>

      <div
        className={`pointer-events-auto relative z-10 w-full max-w-[34rem] ${
          align === "right" ? "ml-auto" : ""
        }`}
      >
        {children(active)}
      </div>
    </section>
  );
}

function ChapterRail({
  chapters,
  activeIndex,
}: {
  chapters: string[];
  activeIndex: number;
}) {
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = fill.current;
    if (!node) return;
    const update = () => {
      node.style.transform = `scaleY(${scrollStore.getState().global})`;
    };
    update();
    return scrollStore.subscribe(update);
  }, []);

  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 md:block"
    >
      <div className="flex flex-col items-center gap-5">
        <span className="relative h-28 w-px bg-pearl/15">
          <span
            ref={fill}
            className="absolute inset-0 origin-top bg-champagne"
          />
        </span>
        <ol className="flex flex-col items-center gap-3">
          {chapters.map((chapter, index) => (
            <li
              key={`${chapter}-${index}`}
              title={chapter}
              className={`font-display text-[0.62rem] tracking-[0.18em] transition-colors duration-500 ${
                index === activeIndex ? "text-champagne" : "text-pearl/25"
              }`}
            >
              {roman(index + 1)}
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

function useGhostDrift() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const tweens = Array.from(
      document.querySelectorAll<HTMLElement>("[data-ghost]"),
    ).map((ghost) => {
      const section = ghost.closest<HTMLElement>("[data-section]");
      return gsap.fromTo(
        ghost,
        { yPercent: 7 },
        {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: section ?? ghost,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          },
        },
      );
    });

    return () => {
      for (const tween of tweens) {
        tween.scrollTrigger?.kill();
        tween.kill();
      }
    };
  }, []);
}
