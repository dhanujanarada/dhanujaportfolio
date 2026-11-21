/**
 * CV content, transcribed from docs/content/cv-data.md.
 *
 * This is the fallback driver for the content layer: when Sanity env vars are
 * absent, routes read from here so the site still builds and prerenders. When
 * they are present, src/cms/content.ts reads Sanity instead. Nothing here may
 * contain a claim the CV does not make; missing detail is a marked TODO.
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
};

export type Role = {
  title: string;
  start: string;
  end: string;
  bullets: string[];
};

export type Experience = { id: string; company: string; roles: Role[]; order: number };

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

export type SkillGroup = { id: string; group: string; items: string[]; order: number };

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

const caseSections = (approach: string[]): CaseBlock[] => [
  { section: "problem", body: ["[TODO: problem framing]"] },
  { section: "approach", body: approach },
  { section: "architecture", body: ["[TODO: architecture detail]"] },
  { section: "results", body: ["[TODO: results / metrics]"] },
  { section: "learned", body: ["[TODO: what I learned]"] },
];

export const cvContent: Content = {
  about: {
    headline:
      "Machine Learning Engineer | AI Engineer | AI/ML Researcher | Data Scientist",
    summary:
      "Machine Learning Engineer with a First Class Honours BEng in Software Engineering (University of Westminster) and a Distinction-graded dissertation in generative audio AI using Flow Matching and Diffusion Transformers (DiT). Builds end-to-end deep learning, LLM, RAG, computer vision and NLP systems in Python, PyTorch and TensorFlow, from dataset construction and model training to deployment behind FastAPI REST APIs. 2+ years of industry software development experience at HCL Technologies.",
    location: "Sri Lanka",
  },
  settings: {
    title: "Dhanuja Narada Udurawana",
    description:
      "Machine Learning Engineer with a First Class Honours BEng in Software Engineering, building end-to-end deep learning, LLM, RAG, computer vision and NLP systems.",
    email: "dhanujanarada@gmail.com",
    linkedin: "https://linkedin.com/in/dhanuja-narada",
    github: "https://github.com/dhanujanarada",
  },
  projects: [
    {
      id: "project.vibeshift",
      title: "VibeShift - Punk Genre Transfer with Flow Matching & DiT",
      slug: "vibeshift",
      summary: "[TODO: one-line project summary]",
      period: "Apr 2025 - 2026",
      projectType:
        "Undergraduate Dissertation (Distinction); Cutting Edge 2026 Shortlist",
      stack: ["Python", "PyTorch", "FastAPI", "SvelteKit"],
      repoUrl: "https://github.com/dhanujanarada/VibeShift",
      awards: [
        {
          title: "Cutting Edge 2026",
          event: "Cutting Edge 2026",
          note: "Shortlisted, Research Category, for VibeShift",
          year: "2026",
        },
      ],
      accent: "#c9a86a",
      order: 1,
      transitionPreset: "slash",
      caseStudy: caseSections([
        "Designed and trained a generative AI model for audio genre transfer using Flow Matching with a Diffusion Transformer (DiT), conditioned via FiLM and RoPE attention",
        "Engineered an end-to-end audio pipeline: audio-to-MIDI transcription, FluidSynth synthesis, DAC encoding/decoding and chunked latent inference",
        "Constructed a novel paired source-target DAC latent dataset for supervised genre-transfer training",
        "Benchmarked against a retrained CycleGAN baseline across multiple audio quality metrics",
        "Deployed inference behind a FastAPI REST API with a SvelteKit front end for real-time audio upload and playback",
      ]),
    },
    {
      id: "project.slidel",
      title: "SLIDEL - Computer Vision Presentation Control",
      slug: "slidel",
      summary: "[TODO: one-line project summary]",
      period: "Sep 2023 - Apr 2024",
      projectType: "Team Project, IIT Sri Lanka; Codesprint 8.0",
      stack: ["Python", "OpenCV", "MediaPipe", "Django", "Electron.js"],
      repoUrl: "https://github.com/SlidelApp/slidel",
      awards: [
        {
          title: "Codesprint 8.0",
          event: "Codesprint 8.0",
          note: "Developed SLIDEL",
        },
      ],
      accent: "#7f9ec4",
      order: 2,
      transitionPreset: "thrust",
      caseStudy: caseSections([
        "Built a desktop app for hardware-free presentation control using real-time computer vision",
        "Real-time hand gesture recognition with OpenCV and MediaPipe, training a custom deep learning model for hand pose detection",
        "Laser pointer tracking and a keystone correction algorithm using Shi-Tomasi corner detection",
        "Django REST APIs and an Electron.js desktop interface; Agile workflow and Jira bug tracking across the full lifecycle",
      ]),
    },
    {
      id: "project.silmarillion-rag",
      title: "Silmarillion RAG - LLM Question Answering",
      slug: "silmarillion-rag",
      summary: "[TODO: one-line project summary]",
      period: "May 2025 - Jun 2025",
      projectType: "Personal Project",
      stack: ["Python", "LangChain", "Gemini 2.0", "FAISS"],
      repoUrl: "https://github.com/dhanujanarada/similarionRAG",
      awards: [],
      accent: "#a98a9e",
      order: 3,
      transitionPreset: "sweep",
      caseStudy: caseSections([
        "RAG pipeline with LangChain and Google Gemini 2.0 for contextual question answering over a PDF corpus",
        "FAISS vector indexing with Maximal Marginal Relevance (MMR) search for relevant, non-redundant context",
      ]),
    },
    {
      id: "project.clustering-demand-forecasting",
      title: "Clustering & Electricity Demand Forecasting",
      slug: "clustering-demand-forecasting",
      summary: "[TODO: one-line project summary]",
      period: "2024",
      projectType:
        "Machine Learning Coursework, University of Westminster",
      stack: ["Python", "R", "scikit-learn"],
      repoUrl: "https://github.com/dhanujanarada/ML",
      awards: [],
      accent: "#8fae9b",
      order: 4,
      transitionPreset: "spiral",
      caseStudy: caseSections([
        "K-means clustering with PCA on a vehicle dataset; evaluated with silhouette analysis and cluster validity indices",
        "Autoregressive (AR) and NARX MLP neural network models in R for electricity demand time-series forecasting, with hyperparameter tuning",
      ]),
    },
  ],
  experience: [
    {
      id: "experience.hcl",
      company: "HCL Technologies",
      order: 1,
      roles: [
        {
          title: "Associate Software Developer",
          start: "May 2023",
          end: "Apr 2025",
          bullets: [
            "Developed software solutions in C# with ASP.NET and .NET Core through structured training and applied industry case studies",
            "Worked with senior developers through code review, iteratively improving deliverables",
            "Automated repetitive workflows with PowerShell scripting, improving team efficiency",
          ],
        },
        {
          title: "Intern Software Developer",
          start: "Nov 2022",
          end: "Apr 2023",
          bullets: [
            "Built practical software engineering skills in ASP.NET and relational SQL databases through industry case studies",
          ],
        },
      ],
    },
  ],
  education: [
    {
      id: "education.westminster",
      institution:
        "University of Westminster (UK) via Informatics Institute of Technology (IIT), Sri Lanka",
      degree: "BEng (Hons) Software Engineering",
      classification: "First Class Honours",
      start: "Sep 2021",
      end: "Aug 2026",
      dissertationTitle:
        "VibeShift: An Empirical Investigation of Flow Matching Networks & Diffusion Transformers for Punk Genre Transfer with a Novel Paired DAC Latent Dataset",
      dissertationNote: "Distinction",
      order: 1,
    },
  ],
  skills: [
    {
      id: "skill.languages",
      group: "Languages",
      order: 1,
      items: ["Python", "R", "SQL", "JavaScript", "Java", "C#", "PowerShell"],
    },
    {
      id: "skill.ml-ai",
      group: "Machine Learning & AI",
      order: 2,
      items: [
        "Deep Learning",
        "Generative AI",
        "LLMs",
        "RAG",
        "AI Agents",
        "NLP",
        "Computer Vision",
        "Transformers",
        "Flow Matching",
        "Diffusion Transformers (DiT)",
        "GANs (CycleGAN)",
        "Model Training & Evaluation",
        "Hyperparameter Tuning",
      ],
    },
    {
      id: "skill.data-science",
      group: "Data Science",
      order: 3,
      items: [
        "Supervised & Unsupervised Learning",
        "K-means",
        "PCA",
        "Time-Series Forecasting (AR, NARX)",
        "Data Analysis",
      ],
    },
    {
      id: "skill.frameworks",
      group: "Frameworks & Libraries",
      order: 4,
      items: [
        "PyTorch",
        "TensorFlow",
        "Keras",
        "scikit-learn",
        "Hugging Face",
        "LangChain",
        "FAISS",
        "OpenCV",
        "MediaPipe",
        "torchaudio",
        "NumPy",
        "Pandas",
      ],
    },
    {
      id: "skill.audio",
      group: "Audio & Signal Processing",
      order: 5,
      items: [
        "Neural Audio Codecs (DAC)",
        "Mel Spectrograms",
        "Audio-to-MIDI Transcription",
        "MIDI Synthesis (FluidSynth)",
      ],
    },
    {
      id: "skill.software",
      group: "Software Engineering & Deployment",
      order: 6,
      items: [
        "FastAPI",
        "Django",
        "ASP.NET",
        ".NET Core",
        "REST API Design",
        "SvelteKit",
        "React",
        "Electron.js",
        "Docker",
        "Git",
        "Linux",
        "Jira",
        "Agile",
      ],
    },
  ],
  certifications: [
    {
      id: "cert.ml-specialization",
      title: "Machine Learning Specialization",
      issuer: "Stanford University & DeepLearning.AI (Coursera)",
      order: 1,
    },
    {
      id: "cert.hf-agents",
      title: "Hugging Face Agents Course",
      issuer: "Hugging Face",
      note: "Building and deploying AI agents with state-of-the-art LLMs",
      order: 2,
    },
    {
      id: "cert.mern",
      title: "MERN Stack Bootcamp",
      issuer: "Mozilla Club of IIT, with WSO2 and Revox",
      order: 3,
    },
  ],
  awards: [
    {
      id: "award.cutting-edge-2026",
      title: "Cutting Edge 2026",
      event: "Cutting Edge 2026",
      note: "Shortlisted, Research Category, for VibeShift",
      year: "2026",
      order: 1,
    },
    {
      id: "award.codesprint-8",
      title: "Codesprint 8.0",
      note: "Developed SLIDEL",
      order: 2,
    },
    {
      id: "award.codesprint-7",
      title: "Codesprint 7.0",
      note: "Developed habl, a productivity and communication application",
      order: 3,
    },
    {
      id: "award.ieeextreme",
      title: "IEEEXtreme 15.0, 16.0 & 17.0",
      note: "24-hour global competitive programming contest (3 years)",
      order: 4,
    },
    {
      id: "award.hash-code-2022",
      title: "Google Hash Code 2022",
      note: "Team optimisation programming competition",
      year: "2022",
      order: 5,
    },
  ],
  leadership: [
    {
      id: "leadership.toastmasters",
      role: "Vice President of Public Relations",
      organization: "IIT Toastmasters Club",
      start: "2023",
      end: "2025",
      note: "Membership & PR Committee",
      order: 1,
    },
    {
      id: "leadership.choir",
      role: "Member",
      organization: "Vocal Impact Choir of IIT",
      start: "2025",
      end: "present",
      order: 2,
    },
  ],
};
