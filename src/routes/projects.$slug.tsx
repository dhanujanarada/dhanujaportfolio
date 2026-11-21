import { Link } from "react-router";

import { getProject, getProjects } from "../cms/content";
import { Page } from "../components/Page";
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
  return [
    { title: `${loaderData.project.title} — Dhanuja Narada Udurawana` },
    { name: "description", content: loaderData.project.summary },
    { property: "og:title", content: loaderData.project.title },
    { property: "og:description", content: loaderData.project.summary },
    { property: "og:type", content: "article" },
  ];
}

export default function ProjectDetail({ loaderData }: Route.ComponentProps) {
  const { project, previous, next } = loaderData;
  const sections = [...project.caseStudy].sort(
    (a, b) =>
      SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section),
  );

  return (
    <Page kicker={project.period} title={project.title} intro={project.summary}>
      <dl className="grid gap-4 border-y border-pearl/10 py-6 font-ui text-xs sm:grid-cols-2">
        <div>
          <dt className="text-pearl/40">Type</dt>
          <dd className="mt-1 text-pearl/80">{project.projectType}</dd>
        </div>
        <div>
          <dt className="text-pearl/40">Stack</dt>
          <dd className="mt-1 text-pearl/80">{project.stack.join(", ")}</dd>
        </div>
        {project.repoUrl && (
          <div>
            <dt className="text-pearl/40">Repository</dt>
            <dd className="mt-1">
              <a
                href={project.repoUrl}
                className="text-champagne underline-offset-4 hover:underline"
                rel="noreferrer"
              >
                {project.repoUrl.replace(/^https?:\/\//, "")}
              </a>
            </dd>
          </div>
        )}
        {project.awards.length > 0 && (
          <div>
            <dt className="text-pearl/40">Awards</dt>
            <dd className="mt-1 text-pearl/80">
              {project.awards
                .map((award) => [award.title, award.note].filter(Boolean).join(" — "))
                .join("; ")}
            </dd>
          </div>
        )}
      </dl>

      <figure className="border border-dashed border-pearl/20 px-6 py-10 text-center font-ui text-xs text-pearl/40">
        [TODO: project image]
      </figure>

      {sections.map((section) => (
        <section key={section.section}>
          <h2 className="font-display text-2xl text-pearl">
            {SECTION_LABELS[section.section] ?? section.section}
          </h2>
          <div className="mt-4 space-y-3 font-body text-body leading-relaxed text-pearl/75">
            {section.body.map((paragraph, index) => (
              <p
                key={index}
                className={
                  paragraph.startsWith("[TODO")
                    ? "font-ui text-xs text-champagne/80"
                    : undefined
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}

      <Link
        to="/"
        className="inline-block font-ui text-xs tracking-[0.06em] text-pearl/60 hover:text-champagne"
      >
        ← Back to the journey
      </Link>

      <nav
        aria-label="Project pagination"
        className="flex flex-wrap justify-between gap-4 border-t border-pearl/10 pt-6 font-ui text-xs"
      >
        {previous ? (
          <Link to={`/projects/${previous.slug}`} className="text-pearl/70 hover:text-champagne">
            ← {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/projects/${next.slug}`} className="text-right text-pearl/70 hover:text-champagne">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </Page>
  );
}
