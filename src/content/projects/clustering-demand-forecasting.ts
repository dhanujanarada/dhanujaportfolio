import type { Project } from "../types";
import { caseSections } from "./helpers";

export const clusteringDemandForecasting: Project = {
  id: "project.clustering-demand-forecasting",
  title: "Clustering & Electricity Demand Forecasting",
  slug: "clustering-demand-forecasting",
  summary: "[TODO: one-line project summary]",
  period: "2024",
  projectType: "Machine Learning Coursework, University of Westminster",
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
};
