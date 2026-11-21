import type { Config } from "@react-router/dev/config";

import { getProjectSlugs } from "./src/content/content";

export default {
  appDirectory: "src",
  // SPA: no runtime server. Prerendered paths get real HTML; every other
  // path hydrates from the SPA fallback written to build/client/.
  ssr: false,
  async prerender({ getStaticPaths }) {
    // Slugs come from the content driver. A duplicate or empty set throws here,
    // failing the build.
    const slugs = await getProjectSlugs();

    return [
      ...getStaticPaths(),
      "/projects",
      "/about",
      "/experience",
      "/credentials",
      "/contact",
      ...slugs.map((slug) => `/projects/${slug}`),
    ];
  },
} satisfies Config;
