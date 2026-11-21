import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  // SPA: no runtime server. Prerendered paths get real HTML; every other
  // path hydrates from the SPA fallback written to build/client/.
  ssr: false,
  // /project/:slug is deliberately absent: React Router can only prerender
  // concrete URLs, so the slug list is enumerated from Sanity once content
  // exists. See docs/DISCREPANCIES.md.
  prerender: ["/"],
} satisfies Config;
