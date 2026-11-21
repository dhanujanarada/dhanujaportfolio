import type { Project } from "../types";
import { clusteringDemandForecasting } from "./clustering-demand-forecasting";
import { silmarillionRag } from "./silmarillion-rag";
import { slidel } from "./slidel";
import { vibeshift } from "./vibeshift";

/** Order is the order of the journey. Edit one project in its own file. */
export const projects: Project[] = [
  vibeshift,
  slidel,
  silmarillionRag,
  clusteringDemandForecasting,
];

export { caseSections } from "./helpers";
