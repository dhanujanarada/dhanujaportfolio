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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-pearl/10 bg-ink/80 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8"
      >
        <Link
          to="/"
          className="font-display text-sm tracking-[0.12em] text-pearl"
        >
          Dhanuja
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `font-ui text-xs tracking-[0.08em] transition-colors ${
                  isActive ? "text-champagne" : "text-pearl/70 hover:text-pearl"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {settings.cvFile && (
            <a
              href={settings.cvFile}
              className="font-ui text-xs tracking-[0.08em] text-ink bg-champagne px-3 py-1.5"
            >
              CV
            </a>
          )}
        </div>

        <button
          ref={toggle}
          type="button"
          className="font-ui text-xs tracking-[0.08em] text-pearl md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div
          ref={panel}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="border-t border-pearl/10 bg-ink px-5 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((link, index) => (
              <li key={link.to}>
                <NavLink
                  ref={index === 0 ? firstLink : undefined}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `font-ui text-sm tracking-[0.06em] ${
                      isActive ? "text-champagne" : "text-pearl/80"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {settings.cvFile && (
              <li>
                <a
                  href={settings.cvFile}
                  className="font-ui text-sm tracking-[0.06em] text-champagne"
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
