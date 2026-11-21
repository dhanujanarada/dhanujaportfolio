/**
 * Idempotent CV seed. Every document has a fixed _id, so re-running replaces
 * instead of duplicating.
 *
 * Requires SANITY_PROJECT_ID, SANITY_DATASET and SANITY_API_WRITE_TOKEN.
 * Run only after owner approval:
 *
 *   SANITY_API_WRITE_TOKEN=... pnpm seed
 *
 * The write token stays in studio/.env and never reaches the frontend.
 */

import { createClient } from "@sanity/client";

import { cvContent, type CaseBlock } from "../src/content/cv.ts";

function env(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`Missing ${key}. Set it in studio/.env or the shell.`);
    process.exit(1);
  }
  return value;
}

const client = createClient({
  projectId: env("SANITY_PROJECT_ID"),
  dataset: env("SANITY_DATASET"),
  apiVersion: "2025-01-01",
  token: env("SANITY_API_WRITE_TOKEN"),
  useCdn: false,
});

let keyCounter = 0;
const key = () => `k${(keyCounter += 1).toString(36)}`;

function block(text: string) {
  return {
    _type: "block" as const,
    _key: key(),
    style: "normal" as const,
    markDefs: [],
    children: [{ _type: "span" as const, _key: key(), text, marks: [] }],
  };
}

function caseStudy(sections: CaseBlock[]) {
  return sections.map((section) => ({
    _type: "caseStudySection",
    _key: key(),
    section: section.section,
    body: section.body.map(block),
  }));
}

async function run() {
  const awardIds = new Map(cvContent.awards.map((award) => [award.title, award.id]));

  const documents: Record<string, unknown>[] = [
    {
      _id: "about",
      _type: "about",
      headline: cvContent.about.headline,
      summary: cvContent.about.summary,
      location: cvContent.about.location,
    },
    {
      _id: "siteSettings",
      _type: "siteSettings",
      title: cvContent.settings.title,
      description: cvContent.settings.description,
      email: cvContent.settings.email,
      linkedin: cvContent.settings.linkedin,
      github: cvContent.settings.github,
    },
    ...cvContent.awards.map((award) => ({
      _id: award.id,
      _type: "award",
      title: award.title,
      event: award.event,
      note: award.note,
      year: award.year,
      order: award.order,
    })),
    ...cvContent.projects.map((project) => ({
      _id: project.id,
      _type: "project",
      title: project.title,
      slug: { _type: "slug", current: project.slug },
      summary: project.summary,
      period: project.period,
      projectType: project.projectType,
      stack: project.stack,
      repoUrl: project.repoUrl,
      accent: project.accent,
      order: project.order,
      transitionPreset: project.transitionPreset,
      caseStudy: caseStudy(project.caseStudy),
      awards: project.awards
        .map((award) => awardIds.get(award.title))
        .filter((id): id is string => Boolean(id))
        .map((id) => ({ _type: "reference", _key: key(), _ref: id })),
    })),
    ...cvContent.experience.map((entry) => ({
      _id: entry.id,
      _type: "experience",
      company: entry.company,
      order: entry.order,
      roles: entry.roles.map((role) => ({
        _type: "role",
        _key: key(),
        ...role,
      })),
    })),
    ...cvContent.education.map((entry) => ({
      _id: entry.id,
      _type: "education",
      institution: entry.institution,
      degree: entry.degree,
      classification: entry.classification,
      start: entry.start,
      end: entry.end,
      dissertationTitle: entry.dissertationTitle,
      dissertationNote: entry.dissertationNote,
      order: entry.order,
    })),
    ...cvContent.skills.map((group) => ({
      _id: group.id,
      _type: "skillGroup",
      group: group.group,
      items: group.items,
      order: group.order,
    })),
    ...cvContent.certifications.map((entry) => ({
      _id: entry.id,
      _type: "certification",
      title: entry.title,
      issuer: entry.issuer,
      note: entry.note,
      order: entry.order,
    })),
    ...cvContent.leadership.map((entry) => ({
      _id: entry.id,
      _type: "leadership",
      role: entry.role,
      organization: entry.organization,
      start: entry.start,
      end: entry.end,
      note: entry.note,
      order: entry.order,
    })),
  ];

  const transaction = client.transaction();
  for (const document of documents) transaction.createOrReplace(document as never);
  await transaction.commit();

  console.log(`Seeded ${documents.length} documents into ${client.config().dataset}.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
