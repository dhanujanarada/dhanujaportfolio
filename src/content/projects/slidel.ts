import type { Project } from "../types";
import { caseSections } from "./helpers";

export const slidel: Project = {
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
};
