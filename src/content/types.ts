/**
 * The content model. These types are the schema: routes render them, and the
 * project files under `src/content/projects/` supply them. No field exists
 * without a route or a design that uses it.
 */

export type CaseSection =
  | "problem"
  | "approach"
  | "architecture"
  | "results"
  | "learned";

export type CaseBlock = { section: CaseSection; body: string[] };

export type ProjectAward = {
  title: string;
  event?: string;
  note?: string;
  year?: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  period: string;
  projectType: string;
  stack: string[];
  repoUrl?: string;
  awards: ProjectAward[];
  accent: string;
  order: number;
  transitionPreset: "slash" | "thrust" | "sweep" | "spiral";
  caseStudy: CaseBlock[];
  /** Optional case-study image served from `public/projects/<slug>/`. */
  cover?: { src: string; alt: string };
};

export type Role = {
  title: string;
  start: string;
  end: string;
  bullets: string[];
};

export type Experience = {
  id: string;
  company: string;
  roles: Role[];
  order: number;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  classification: string;
  start: string;
  end: string;
  dissertationTitle: string;
  dissertationNote?: string;
  order: number;
};

export type SkillGroup = {
  id: string;
  group: string;
  items: string[];
  order: number;
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  note?: string;
  order: number;
};

export type Award = {
  id: string;
  title: string;
  event?: string;
  note?: string;
  year?: string;
  order: number;
};

export type Leadership = {
  id: string;
  role: string;
  organization: string;
  start: string;
  end: string;
  note?: string;
  order: number;
};

export type About = {
  headline: string;
  summary: string;
  location?: string;
  bio?: string[];
  portrait?: { url: string; alt: string };
};

export type SiteSettings = {
  title: string;
  description: string;
  email: string;
  linkedin?: string;
  github?: string;
  cvFile?: string;
};

export type Content = {
  about: About;
  settings: SiteSettings;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  certifications: Certification[];
  awards: Award[];
  leadership: Leadership[];
};
