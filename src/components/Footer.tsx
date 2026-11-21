import { Link } from "react-router";

import type { SiteSettings } from "../content/cv";
import { FOOTER_LINKS } from "../content/nav";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative z-10 border-t border-pearl/10 bg-ink px-5 py-10 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-display text-lg tracking-[0.08em] text-pearl">
            {settings.title}
          </p>
          <p className="mt-2 max-w-md font-body text-base text-pearl/60">
            {settings.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-ui text-xs tracking-[0.06em] text-pearl/60 hover:text-pearl"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap gap-x-5 gap-y-2 font-ui text-xs text-pearl/60">
            <a href={`mailto:${settings.email}`} className="hover:text-champagne">
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

          <p className="font-ui text-[0.6875rem] tracking-[0.08em] text-pearl/35">
            © {new Date().getFullYear()} {settings.title}
          </p>
        </div>
      </div>
    </footer>
  );
}
