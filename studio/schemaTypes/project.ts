import { defineArrayMember, defineField, defineType } from "sanity";

const CASE_SECTIONS = [
  { title: "Problem", value: "problem" },
  { title: "Approach", value: "approach" },
  { title: "Architecture", value: "architecture" },
  { title: "Results", value: "results" },
  { title: "What I learned", value: "learned" },
];

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "period",
      type: "string",
      description: "As written in the CV, e.g. Apr 2025 - 2026",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projectType",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "stack",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "repoUrl",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "awards",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "award" }] })],
    }),
    defineField({
      name: "cover",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "caption", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "accent",
      type: "string",
      description: "Hex colour, e.g. #c9a86a",
      validation: (rule) =>
        rule.required().regex(/^#[0-9a-fA-F]{6}$/, { name: "hex colour" }),
    }),
    defineField({
      name: "order",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "transitionPreset",
      type: "string",
      options: {
        list: [
          { title: "Slash", value: "slash" },
          { title: "Thrust", value: "thrust" },
          { title: "Sweep", value: "sweep" },
          { title: "Spiral", value: "spiral" },
        ],
      },
    }),
    defineField({
      name: "caseStudy",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "section",
              type: "string",
              options: { list: CASE_SECTIONS },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "body",
              type: "array",
              of: [defineArrayMember({ type: "block" })],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "section" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  orderings: [
    {
      title: "Journey order",
      name: "journeyOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "period" },
  },
});
