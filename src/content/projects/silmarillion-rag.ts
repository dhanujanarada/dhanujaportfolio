import type { Project } from "../types";
import { caseSections } from "./helpers";

export const silmarillionRag: Project = {
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
};
