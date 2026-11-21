import { cvContent, type Content, type Project } from "./cv";

/**
 * The content driver. Typed files under `src/content/` are the source of
 * truth; the async surface stays so routes do not care where the data comes
 * from. Reintroducing a CMS later means changing this file only.
 */
export async function getContent(): Promise<Content> {
  return cvContent;
}

export async function getProjects(): Promise<Project[]> {
  const content = await getContent();
  return [...content.projects].sort((a, b) => a.order - b.order);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

/** Used by prerender. Duplicate or empty sets fail the build instead of shipping. */
export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();

  if (projects.length === 0) {
    throw new Error(
      "No projects returned by the content driver. Prerendering a project-less site is a build failure, not a fallback.",
    );
  }

  const slugs = projects.map((project) => project.slug);
  const duplicate = slugs.find((slug, index) => slugs.indexOf(slug) !== index);
  if (duplicate) {
    throw new Error(
      `Duplicate project slug "${duplicate}". Slugs must be unique.`,
    );
  }

  return slugs;
}
