import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

import type { SiteSettings } from "../content/cv";
import { NAV_LINKS } from "../content/nav";

export function Nav({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) {
      // Return focus to the trigger only when the menu was actually open.
      if (wasOpen.current) toggle.current?.focus();
      wasOpen.current = false;
      return;
    }

    wasOpen.current = true;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panel.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    firstLink.current?.focus();
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/70 to-transparent"
      />

      <div className="border-b border-pearl/10 bg-ink/75 backdrop-blur-md">
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5 md:px-8"
        >
          <Link
            to="/"
            aria-label="Dhanuja Narada Udurawana — home"
            className="group flex items-center gap-2.5"
          >
            <svg
              aria-hidden
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              className="text-champagne transition-transform duration-500 group-hover:rotate-90"
            >
              <path d="M10 1l7 9-7 9-7-9z" stroke="currentColor" />
              <path
                d="M10 5l3.5 5L10 15 6.5 10z"
                fill="currentColor"
                fillOpacity="0.55"
              />
            </svg>
            <span className="font-display text-[0.78rem] uppercase tracking-[0.24em] text-pearl transition-colors group-hover:text-champagne">
              Dhanuja
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `nav-link font-display text-[0.66rem] uppercase tracking-[0.2em] transition-colors ${
                    isActive
                      ? "text-champagne"
                      : "text-pearl/70 hover:text-pearl"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {settings.cvFile && (
              <a
                href={settings.cvFile}
                className="border border-champagne/50 px-3 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.2em] text-champagne transition-colors hover:bg-champagne hover:text-ink"
              >
                CV
              </a>
            )}
          </div>

          <button
            ref={toggle}
            type="button"
            className="border border-pearl/25 px-3 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.2em] text-pearl md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </div>

      {open && (
        <div
          ref={panel}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="border-b border-champagne/15 bg-abyss/95 px-5 py-5 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link, index) => (
              <li key={link.to}>
                <NavLink
                  ref={index === 0 ? firstLink : undefined}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between font-display text-[0.8rem] uppercase tracking-[0.18em] ${
                      isActive ? "text-champagne" : "text-pearl/80"
                    }`
                  }
                >
                  {link.label}
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rotate-45 border border-champagne/50"
                  />
                </NavLink>
              </li>
            ))}
            {settings.cvFile && (
              <li>
                <a
                  href={settings.cvFile}
                  className="font-display text-[0.8rem] uppercase tracking-[0.18em] text-champagne"
                >
                  Download CV
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
