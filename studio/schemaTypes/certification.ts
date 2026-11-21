import { defineField, defineType } from "sanity";

export default defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "issuer",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      type: "text",
      rows: 2,
      description: "Optional detail the CV provides, such as the course focus.",
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
    select: { title: "title", subtitle: "issuer" },
  },
});
