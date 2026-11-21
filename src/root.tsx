import type { ReactNode } from "react";
import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import { App } from "./App";
import { getContent } from "./content/content";

import "./app.css";

export async function loader() {
  const content = await getContent();
  return { settings: content.settings, about: content.about };
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="preload"
          href="/models/katana.glb"
          as="fetch"
          crossOrigin="anonymous"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  const { settings, about } = useLoaderData<typeof loader>();

  return <App settings={settings} headline={about.headline} />;
}
