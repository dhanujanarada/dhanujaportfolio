import { createClient } from "@sanity/client";

import {
  cvContent,
  type About,
  type Award,
  type CaseBlock,
  type Certification,
  type Content,
  type Education,
  type Experience,
  type Leadership,
  type Project,
  type SiteSettings,
  type SkillGroup,
} from "../content/cv";

/**
 * Sanity is the intended source. Until a project ID exists, the CV file drives
 * every route so the site still builds, prerenders and can be reviewed.
 * This fallback is recorded in docs/DISCREPANCIES.md.
 */
function readEnv(key: string): string | undefined {
  const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string> })
    .env;
  const fromVite = viteEnv?.[key];
  if (fromVite) return fromVite;
  if (typeof process !== "undefined") return process.env[key];
  return undefined;
}

const projectId = readEnv("VITE_SANITY_PROJECT_ID");
const dataset = readEnv("VITE_SANITY_DATASET") ?? "production";

export const usingSanity = Boolean(projectId);

const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2025-01-01",
      useCdn: true,
      perspective: "published",
    })
  : null;

const PROJECT_FIELDS = /* groq */ `
  "id": _id,
  title,
  "slug": slug.current,
  summary,
  period,
  projectType,
  stack,
  repoUrl,
  accent,
  order,
  transitionPreset,
  "awards": awards[]->{ title, event, note, year },
  "caseStudy": caseStudy[]{
    section,
    "body": body[]{ "text": children[].text }
  }
`;

type RawBlock = { section: string; body: { text?: string[] }[] };

function toCaseStudy(raw: RawBlock[] | undefined): CaseBlock[] {
  return (raw ?? []).map((entry) => ({
    section: entry.section as CaseBlock["section"],
    body: entry.body
      .map((block) => (block.text ?? []).join("").trim())
      .filter(Boolean),
  }));
}

export async function getContent(): Promise<Content> {
  if (!client) return cvContent;

  const [
    about,
    settings,
    projects,
    experience,
    education,
    skills,
    certifications,
    awards,
    leadership,
  ] = await Promise.all([
    client.fetch<About | null>(`*[_id == "about"][0]{ headline, summary }`),
    client.fetch<SiteSettings | null>(
      `*[_id == "siteSettings"][0]{ title, description, email, linkedin, github }`,
    ),
    client.fetch<(Project & { caseStudy?: RawBlock[] })[]>(
      `*[_type == "project"] | order(order asc) { ${PROJECT_FIELDS} }`,
    ),
    client.fetch<Experience[]>(
      `*[_type == "experience"] | order(order asc) { "id": _id, company, roles, order }`,
    ),
    client.fetch<Education[]>(
      `*[_type == "education"] | order(order asc) { "id": _id, institution, degree, classification, start, end, dissertationTitle, dissertationNote, order }`,
    ),
    client.fetch<SkillGroup[]>(
      `*[_type == "skillGroup"] | order(order asc) { "id": _id, group, items, order }`,
    ),
    client.fetch<Certification[]>(
      `*[_type == "certification"] | order(order asc) { "id": _id, title, issuer, note, order }`,
    ),
    client.fetch<Award[]>(
      `*[_type == "award"] | order(order asc) { "id": _id, title, event, note, year, order }`,
    ),
    client.fetch<Leadership[]>(
      `*[_type == "leadership"] | order(order asc) { "id": _id, role, organization, start, end, order }`,
    ),
  ]);

  return {
    about: about ?? cvContent.about,
    settings: settings ?? cvContent.settings,
    projects: projects.map((project) => ({
      ...project,
      awards: project.awards ?? [],
      caseStudy: toCaseStudy(project.caseStudy),
    })),
    experience,
    education,
    skills,
    certifications,
    awards,
    leadership,
  };
}

export async function getProjects(): Promise<Project[]> {
  const content = await getContent();
  return [...content.projects].sort((a, b) => a.order - b.order);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

/** Used by prerender. Duplicated slugs fail the build instead of silently winning. */
export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();
  const slugs = projects.map((project) => project.slug);
  const duplicate = slugs.find((slug, index) => slugs.indexOf(slug) !== index);
  if (duplicate) {
    throw new Error(
      `Duplicate project slug "${duplicate}". Slugs must be unique; Sanity 6 cannot enforce it in schema validation.`,
    );
  }
  return slugs;
}
