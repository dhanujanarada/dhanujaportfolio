import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("projects", "routes/projects.tsx"),
  route("projects/:slug", "routes/projects.$slug.tsx"),
  route("about", "routes/about.tsx"),
  route("experience", "routes/experience.tsx"),
  route("credentials", "routes/credentials.tsx"),
  route("contact", "routes/contact.tsx"),
  route("project/:slug", "routes/project.$slug.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
