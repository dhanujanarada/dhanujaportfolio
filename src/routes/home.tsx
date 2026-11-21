import type { ReactNode } from "react";

import { useScrollEngine } from "../motion/useScrollEngine";

const placeholderProjects = [
  { id: "project-one", title: "Project One", meta: "2025 · Frontend", preset: "slash" },
  { id: "project-two", title: "Project Two", meta: "2024 · Full stack", preset: "thrust" },
  { id: "project-three", title: "Project Three", meta: "2024 · Design system", preset: "sweep" },
];

export function meta() {
  return [{ title: "Dhanuja Portfolio" }];
}

// Placeholder copy: replaced by Sanity content in the content phase.
export default function Home() {
  useScrollEngine();

  return (
    <main className="relative text-neutral-100">
      <Section id="hero">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
          Placeholder
        </p>
        <h1 className="mt-6 max-w-3xl text-5xl font-medium leading-tight sm:text-7xl">
          Dhanuja
        </h1>
        <p className="mt-6 max-w-xl text-base text-neutral-300">
          Hero copy arrives from Sanity. This section exists to prove the scroll
          pipeline: global progress, active index, and local progress.
        </p>
      </Section>

      {placeholderProjects.map((project, index) => (
        <Section id={project.id} key={project.id}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
            Project {index + 1} · {project.preset}
          </p>
          <h2 className="mt-6 text-4xl font-medium sm:text-6xl">{project.title}</h2>
          <p className="mt-4 font-mono text-sm text-neutral-400">{project.meta}</p>
        </Section>
      ))}

      <Section id="about">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
          About
        </p>
        <h2 className="mt-6 text-4xl font-medium sm:text-6xl">About section</h2>
        <p className="mt-6 max-w-xl text-base text-neutral-300">
          Timeline, skills, and portrait come from the about singleton in the
          content phase. No infographic yet.
        </p>
      </Section>

      <Section id="contact">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
          Contact
        </p>
        <h2 className="mt-6 text-4xl font-medium sm:text-6xl">Contact section</h2>
        <p className="mt-6 max-w-xl text-base text-neutral-300">
          Links and email come from siteSettings later. Terminal section so the
          active index has a clean end state.
        </p>
      </Section>
    </main>
  );
}

function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section
      data-section={id}
      className="flex h-svh flex-col justify-center px-6 md:px-16"
    >
      {children}
    </section>
  );
}
