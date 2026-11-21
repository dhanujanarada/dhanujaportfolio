import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({
      name: "company",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "roles",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "role",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "start",
              type: "string",
              description: "As written in the CV, e.g. May 2023",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "end",
              type: "string",
              description: "As written in the CV, e.g. Apr 2025 or Present",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "bullets",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "start" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
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
    select: { title: "company" },
  },
});
