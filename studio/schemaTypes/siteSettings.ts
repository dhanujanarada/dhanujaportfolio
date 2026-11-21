import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      type: "string",
      validation: (rule) =>
        rule.required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          name: "email",
        }),
    }),
    defineField({
      name: "linkedin",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "github",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "cvFile",
      type: "file",
      description: "PDF placed at public/cv/ until uploaded here.",
    }),
    defineField({
      name: "defaultOgImage",
      type: "image",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
