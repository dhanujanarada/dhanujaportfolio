import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "skillGroup",
  title: "Skill group",
  type: "document",
  fields: [
    defineField({
      name: "group",
      type: "string",
      description: "As written in the CV, e.g. Machine Learning & AI",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
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
    select: { title: "group" },
  },
});
