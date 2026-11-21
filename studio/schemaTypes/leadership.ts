import { defineField, defineType } from "sanity";

export default defineType({
  name: "leadership",
  title: "Leadership & activities",
  type: "document",
  fields: [
    defineField({
      name: "role",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "organization",
      type: "string",
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
      name: "note",
      type: "string",
      description: "Optional committee or remit detail from the CV.",
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
    select: { title: "role", subtitle: "organization" },
  },
});
