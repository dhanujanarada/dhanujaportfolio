import type { CaseBlock } from "../types";

/**
 * Builds the five-section case study. `Approach` carries the CV bullets; the
 * other sections stay marked placeholders until the owner supplies copy.
 */
export function caseSections(approach: string[]): CaseBlock[] {
  return [
    { section: "problem", body: ["[TODO: problem framing]"] },
    { section: "approach", body: approach },
    { section: "architecture", body: ["[TODO: architecture detail]"] },
    { section: "results", body: ["[TODO: results / metrics]"] },
    { section: "learned", body: ["[TODO: what I learned]"] },
  ];
}
