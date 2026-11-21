import { defineField, defineType } from "sanity";

export default defineType({
  name: "award",
  title: "Award & competition",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "event",
      type: "string",
      description: "Optional event or organiser, e.g. Cutting Edge 2026",
    }),
    defineField({
      name: "note",
      type: "text",
      rows: 2,
      description: "Result or contribution, exactly as the CV states it.",
    }),
    defineField({
      name: "year",
      type: "string",
      description: "String on purpose: the CV mixes years, ranges and no date.",
    }),
    defineField({
      name: "order",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "CV order",
      name: "cvOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "year" },
  },
});
