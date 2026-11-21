import { Link } from "react-router";

import type { SiteSettings } from "../content/cv";
import { FOOTER_LINKS } from "../content/nav";
import { RuneDivider } from "./RuneDivider";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative z-10 overflow-hidden bg-ink px-5 pb-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <RuneDivider className="opacity-60" />

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto]">
          <div className="flex items-start gap-5">
            <span
              aria-hidden
              className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-champagne/40 font-display text-lg text-champagne/80"
            >
              D
            </span>
            <div>
              <p className="font-display text-lg uppercase tracking-[0.14em] text-pearl">
                {settings.title}
              </p>
              <p className="mt-2 max-w-md font-body text-base text-pearl/55">
                {settings.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="nav-link font-display text-[0.64rem] uppercase tracking-[0.18em] text-pearl/60 hover:text-pearl"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-wrap gap-x-5 gap-y-2 font-ui text-xs text-pearl/60">
              <a
                href={`mailto:${settings.email}`}
                className="hover:text-champagne"
              >
                {settings.email}
              </a>
              {settings.linkedin && (
                <a
                  href={settings.linkedin}
                  className="hover:text-champagne"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              )}
              {settings.github && (
                <a
                  href={settings.github}
                  className="hover:text-champagne"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              )}
              {settings.cvFile && (
                <a href={settings.cvFile} className="hover:text-champagne">
                  CV
                </a>
              )}
            </div>

            <p className="font-display text-[0.6rem] uppercase tracking-[0.18em] text-pearl/30">
              © {new Date().getFullYear()} {settings.title}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
