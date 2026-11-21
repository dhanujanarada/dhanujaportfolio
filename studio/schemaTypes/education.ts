import { defineField, defineType } from "sanity";

export default defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({
      name: "institution",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "degree",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "classification",
      type: "string",
      description: "As written in the CV, e.g. First Class Honours",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "start",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "end",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dissertationTitle",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dissertationNote",
      type: "text",
      rows: 3,
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
    select: { title: "institution", subtitle: "degree" },
  },
});
