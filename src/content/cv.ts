/**
 * CV content, transcribed from docs/content/cv-data.md.
 *
 * These files are the content source. Project case studies live in
 * `src/content/projects/<slug>.ts`; everything else lives here. Nothing may
 * contain a claim the CV does not make; missing detail is a marked TODO.
 */

import { projects } from "./projects";
import type { Content } from "./types";

export type {
  About,
  Award,
  CaseBlock,
  CaseSection,
  Certification,
  Content,
  Education,
  Experience,
  Leadership,
  Project,
  ProjectAward,
  Role,
  SiteSettings,
  SkillGroup,
} from "./types";

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
  projects,
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
