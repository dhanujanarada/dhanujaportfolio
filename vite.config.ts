import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

/**
 * sitemap.xml and robots.txt from the prerendered output. Absolute URLs need a
 * real origin, so nothing is written unless SITE_URL is set; no domain is
 * invented. See docs/content/TODO.md.
 */
function seoFiles(): Plugin {
  return {
    name: "seo-files",
    closeBundle() {
      const clientDir = "build/client";
      if (!existsSync(clientDir)) return;

      const site = process.env.SITE_URL;
      if (!site) {
        console.warn("[seo] SITE_URL not set; skipping sitemap.xml and robots.txt");
        return;
      }

      const base = site.replace(/\/$/, "");
      const projectsDir = join(clientDir, "projects");
      const slugs = existsSync(projectsDir)
        ? readdirSync(projectsDir, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)
        : [];

      const paths = [
        "/",
        "/projects",
        "/about",
        "/experience",
        "/credentials",
        "/contact",
        ...slugs.map((slug) => `/projects/${slug}`),
      ];

      const urls = paths
        .map((path) => `  <url><loc>${base}${path}</loc></url>`)
        .join("\n");

      writeFileSync(
        join(clientDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
      writeFileSync(
        join(clientDir, "robots.txt"),
        `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`,
      );
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), seoFiles()],
});
