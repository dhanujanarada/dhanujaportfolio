import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

/**
 * sitemap.xml and robots.txt from the prerendered output. Absolute URLs need a
 * real origin: SITE_URL wins, then the stable Vercel production domain. No
 * domain is invented. See docs/content/TODO.md.
 */
function siteOrigin(): string | undefined {
  if (process.env.SITE_URL) return process.env.SITE_URL;

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : undefined;
}

function seoFiles(): Plugin {
  return {
    name: "seo-files",
    closeBundle() {
      const clientDir = "build/client";
      if (!existsSync(clientDir)) return;

      const site = siteOrigin();
      if (!site) {
        console.warn(
          "[seo] SITE_URL not set; skipping sitemap.xml and robots.txt",
        );
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
  optimizeDeps: {
    // The scene is a lazy chunk. Without a complete list, Vite discovers
    // dependencies in waves, re-optimizes, and reloads the page mid-load with
    // "Outdated Optimize Dep" errors.
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-dev-runtime",
      "react-router",
      "gsap",
      "gsap/ScrollTrigger",
      "lenis",
      "zustand",
      "zustand/vanilla",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "@react-three/postprocessing",
      "postprocessing",
    ],
  },
});
