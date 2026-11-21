import { Link } from "react-router";

import { getProject, getProjects } from "../content/content";
import { Page } from "../components/Page";
import { RuneDivider } from "../components/RuneDivider";
import { roman } from "../content/roman";
import type { Route } from "./+types/projects.$slug";

const SECTION_LABELS: Record<string, string> = {
  problem: "Problem",
  approach: "Approach",
  architecture: "Architecture",
  results: "Results",
  learned: "What I learned",
};

const SECTION_ORDER = [
  "problem",
  "approach",
  "architecture",
  "results",
  "learned",
];

export async function loader({ params }: Route.LoaderArgs) {
  if (!params.slug) throw new Response("Not found", { status: 404 });

  const project = await getProject(params.slug);
  if (!project) throw new Response("Not found", { status: 404 });

  const all = await getProjects();
  const index = all.findIndex((entry) => entry.slug === project.slug);

  return {
    project,
    previous: index > 0 ? all[index - 1] : null,
    next: index >= 0 && index < all.length - 1 ? all[index + 1] : null,
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: "Project — Dhanuja Narada Udurawana" }];
  const { project } = loaderData;
  const description = project.summary.startsWith("[TODO")
    ? `${project.projectType}. ${project.stack.join(", ")}.`
    : project.summary;

  return [
    { title: `${project.title} — Dhanuja Narada Udurawana` },
    { name: "description", content: description },
    { property: "og:title", content: project.title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
  ];
}

export default function ProjectDetail({ loaderData }: Route.ComponentProps) {
  const { project, previous, next } = loaderData;
  const sections = [...project.caseStudy].sort(
    (a, b) =>
      SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section),
  );
  const intro = project.summary.startsWith("[TODO")
    ? undefined
    : project.summary;

  return (
    <Page
      kicker={project.period}
      title={project.title}
      intro={intro}
      ghost="Chronicle"
    >
      <dl className="grid gap-6 border-y border-champagne/15 py-7 font-ui text-[0.75rem] sm:grid-cols-2">
        <div>
          <dt className="font-display text-[0.62rem] uppercase tracking-[0.22em] text-champagne/80">
            Type
          </dt>
          <dd className="mt-2 text-pearl/80">{project.projectType}</dd>
        </div>
        <div>
          <dt className="font-display text-[0.62rem] uppercase tracking-[0.22em] text-champagne/80">
            Stack
          </dt>
          <dd className="mt-2 text-pearl/80">{project.stack.join(", ")}</dd>
        </div>
        {project.repoUrl && (
          <div>
            <dt className="font-display text-[0.62rem] uppercase tracking-[0.22em] text-champagne/80">
              Repository
            </dt>
            <dd className="mt-2">
              <a
                href={project.repoUrl}
                className="text-frost underline-offset-4 hover:text-champagne hover:underline"
                rel="noreferrer"
              >
                {project.repoUrl.replace(/^https?:\/\//, "")}
              </a>
            </dd>
          </div>
        )}
        {project.awards.length > 0 && (
          <div>
            <dt className="font-display text-[0.62rem] uppercase tracking-[0.22em] text-champagne/80">
              Awards
            </dt>
            <dd className="mt-2 text-pearl/80">
              {project.awards
                .map((award) =>
                  [award.title, award.note].filter(Boolean).join(" — "),
                )
                .join("; ")}
            </dd>
          </div>
        )}
      </dl>

      {project.cover ? (
        <figure className="border border-champagne/20 p-2">
          <img
            src={project.cover.src}
            alt={project.cover.alt}
            className="max-h-[34rem] w-full object-cover"
            loading="lazy"
          />
        </figure>
      ) : (
        <figure className="border border-dashed border-champagne/20 bg-ink-soft/35 px-6 py-12 text-center font-ui text-xs text-pearl/40">
          [TODO: project image]
        </figure>
      )}

      {sections.map((section, index) => (
        <section key={section.section} className="relative">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-[0.62rem] uppercase tracking-[0.2em] text-champagne/60">
              {roman(index + 1)}
            </span>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] text-pearl">
              {SECTION_LABELS[section.section] ?? section.section}
            </h2>
          </div>
          <div className="mt-4 h-px w-full bg-gradient-to-r from-champagne/35 via-champagne/10 to-transparent" />
          <div className="mt-5 space-y-4 font-body text-[1.08rem] leading-relaxed text-pearl/75">
            {section.body.map((paragraph, paragraphIndex) => (
              <p
                key={paragraphIndex}
                className={
                  paragraph.startsWith("[TODO")
                    ? "border-l border-champagne/40 pl-4 font-ui text-xs leading-relaxed text-champagne/80"
                    : undefined
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}

      <RuneDivider className="opacity-50" />

      <Link
        to="/"
        className="nav-link inline-block font-display text-[0.66rem] uppercase tracking-[0.2em] text-pearl/60 hover:text-champagne"
      >
        ← Back to the journey
      </Link>

      <nav
        aria-label="Project pagination"
        className="flex flex-wrap justify-between gap-6 border-t border-pearl/10 pt-8 font-ui text-xs"
      >
        {previous ? (
          <Link
            to={`/projects/${previous.slug}`}
            className="group max-w-[45%] text-pearl/60 hover:text-champagne"
          >
            <span className="block font-display text-[0.58rem] uppercase tracking-[0.2em] text-pearl/35">
              Previous chronicle
            </span>
            <span className="mt-2 block font-body text-base text-pearl/80 group-hover:text-champagne">
              ← {previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/projects/${next.slug}`}
            className="group max-w-[45%] text-right text-pearl/60 hover:text-champagne"
          >
            <span className="block font-display text-[0.58rem] uppercase tracking-[0.2em] text-pearl/35">
              Next chronicle
            </span>
            <span className="mt-2 block font-body text-base text-pearl/80 group-hover:text-champagne">
              {next.title} →
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </Page>
  );
}
