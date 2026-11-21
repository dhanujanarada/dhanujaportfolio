import type { Project } from "../types";
import { caseSections } from "./helpers";

export const vibeshift: Project = {
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
};
