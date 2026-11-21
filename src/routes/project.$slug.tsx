import { redirect } from "react-router";

import type { Route } from "./+types/project.$slug";

/**
 * Legacy singular URL. A `clientLoader` rather than a `loader` because
 * `ssr:false` forbids server loaders on non-prerendered routes, and this route
 * is deliberately not an HTML page — it always redirects.
 */
export function clientLoader({ params }: Route.ClientLoaderArgs) {
  throw redirect(`/projects/${params.slug}`, 301);
}

clientLoader.hydrate = true as const;

export default function LegacyProjectRedirect() {
  return null;
}
