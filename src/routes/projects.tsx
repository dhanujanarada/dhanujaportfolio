import { Link } from "react-router";

import { Page } from "../components/Page";
import { getProjects } from "../cms/content";

export function meta() {
  return [
    { title: "Projects — Dhanuja Narada Udurawana" },
    {
      name: "description",
      content:
        "Machine learning, generative audio, computer vision and data science projects.",
    },
  ];
}

export async function loader() {
  return { projects: await getProjects() };
}

export default function Projects({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <Page
      kicker="Projects"
      title="Selected work"
      intro="Four projects from the CV. Case studies carry a marked placeholder wherever the source does not supply detail."
    >
      <ul className="grid gap-6 md:grid-cols-2">
        {loaderData.projects.map((project) => (
          <li key={project.id}>
            <Link
              to={`/projects/${project.slug}`}
              className="group block h-full border border-pearl/12 bg-ink-soft p-6 transition-colors hover:border-champagne/60 focus-visible:border-champagne"
            >
              <p className="font-ui text-xs tracking-[0.06em] text-champagne">
                {project.period}
              </p>
              <h2 className="mt-3 font-display text-2xl leading-tight text-pearl group-hover:text-champagne">
                {project.title}
              </h2>
              <p className="mt-2 font-ui text-xs text-pearl/50">
                {project.projectType}
              </p>
              <p className="mt-4 font-ui text-xs leading-relaxed text-pearl/65">
                {project.stack.join(" · ")}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-ui text-xs tracking-[0.06em] text-pearl/80">
                Read the case study <span aria-hidden>→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}
