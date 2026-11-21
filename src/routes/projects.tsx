import { Link } from "react-router";

import { Page } from "../components/Page";
import { Parchment } from "../components/Parchment";
import { getProjects } from "../cms/content";
import { pageMeta } from "../content/meta";
import { roman } from "../content/roman";

export function meta() {
  return pageMeta(
    "Projects — Dhanuja Narada Udurawana",
    "Machine learning, generative audio, computer vision and data science projects.",
  );
}

export async function loader() {
  return { projects: await getProjects() };
}

export default function Projects({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { projects } = loaderData;

  return (
    <Page
      kicker="Projects"
      title="Selected work"
      ghost="Works"
      intro={`${projects.length} projects from the CV. Case studies carry a marked placeholder wherever the source does not supply detail.`}
    >
      <ul className="grid gap-8 md:grid-cols-2 md:gap-10">
        {projects.map((project, index) => (
          <li key={project.id} data-reveal>
            <Link
              to={`/projects/${project.slug}`}
              aria-label={`Read the ${project.title} case study`}
              className="group block h-full"
            >
              <Parchment
                interactive
                variant={index % 4}
                tilt={index % 2 === 0 ? -0.6 : 0.55}
                className="h-full"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-[3px] opacity-80"
                  style={{ backgroundColor: project.accent }}
                />

                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-[0.68rem] uppercase tracking-[0.28em] text-leather">
                    Project {roman(index + 1)}
                  </p>
                  <p className="font-ui text-[0.68rem] tracking-[0.04em] text-leather/90">
                    {project.period}
                  </p>
                </div>

                <h2 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.06] text-ink">
                  {project.title}
                </h2>
                <p className="mt-3 font-ui text-[0.72rem] leading-relaxed text-leather">
                  {project.projectType}
                </p>
                <p className="mt-4 font-ui text-[0.72rem] leading-relaxed text-ink/70">
                  {project.stack.join(" · ")}
                </p>

                <div className="mt-7 flex items-center justify-between gap-4 border-t border-leather/20 pt-4">
                  <span className="font-display text-[0.66rem] uppercase tracking-[0.2em] text-leather transition-colors group-hover:text-ink">
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
          </li>
        ))}
      </ul>
    </Page>
  );
}
