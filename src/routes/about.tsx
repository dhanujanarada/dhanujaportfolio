import { getContent } from "../content/content";
import { Page } from "../components/Page";
import { SectionHeading } from "../components/SectionHeading";
import { pageMeta } from "../content/meta";

export function meta() {
  return pageMeta(
    "About — Dhanuja Narada Udurawana",
    "Machine Learning Engineer based in Sri Lanka.",
  );
}

export async function loader() {
  const content = await getContent();
  return {
    about: content.about,
    skills: content.skills,
    settings: content.settings,
  };
}

export default function About({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { about, skills, settings } = loaderData;

  return (
    <Page
      kicker="About"
      title="Dhanuja Narada Udurawana"
      ghost="About"
      intro={about.headline}
    >
      <div className="grid gap-12 md:grid-cols-[2fr_1fr] md:gap-16">
        <div className="space-y-6 font-body text-[1.12rem] leading-relaxed text-pearl/80">
          <p>{about.summary}</p>
          {about.location && (
            <p className="font-display text-[0.64rem] uppercase tracking-[0.24em] text-champagne/70">
              {about.location}
            </p>
          )}

          <div className="flex flex-wrap gap-6 pt-2">
            {settings.linkedin && (
              <a
                href={settings.linkedin}
                rel="noreferrer"
                className="nav-link font-display text-[0.66rem] uppercase tracking-[0.2em] text-champagne"
              >
                LinkedIn
              </a>
            )}
            {settings.github && (
              <a
                href={settings.github}
                rel="noreferrer"
                className="nav-link font-display text-[0.66rem] uppercase tracking-[0.2em] text-champagne"
              >
                GitHub
              </a>
            )}
            <a
              href={`mailto:${settings.email}`}
              className="nav-link font-display text-[0.66rem] uppercase tracking-[0.2em] text-champagne"
            >
              Email
            </a>
          </div>
        </div>

        <figure className="relative border border-champagne/25 p-2">
          <span
            aria-hidden
            className="absolute -left-px -top-px h-4 w-4 border-l border-t border-champagne/80"
          />
          <span
            aria-hidden
            className="absolute -right-px -top-px h-4 w-4 border-r border-t border-champagne/80"
          />
          <span
            aria-hidden
            className="absolute -bottom-px -left-px h-4 w-4 border-b border-l border-champagne/80"
          />
          <span
            aria-hidden
            className="absolute -bottom-px -right-px h-4 w-4 border-b border-r border-champagne/80"
          />
          <div className="flex aspect-[3/4] items-center justify-center bg-ink-soft/45 font-ui text-xs text-pearl/40">
            {about.portrait ? (
              <img
                src={about.portrait.url}
                alt={about.portrait.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              "[TODO: portrait]"
            )}
          </div>
        </figure>
      </div>

      <section>
        <SectionHeading index="I">Skills</SectionHeading>
        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          {skills.map((group, index) => (
            <div
              key={group.id}
              className="group border border-pearl/10 bg-ink-soft/30 p-5 transition-colors duration-500 hover:border-champagne/35"
            >
              <dt className="flex items-baseline justify-between gap-3 font-display text-[0.62rem] uppercase tracking-[0.2em] text-champagne">
                <span>{group.group}</span>
                <span aria-hidden className="text-pearl/25">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </dt>
              <dd className="mt-3 font-ui text-[0.74rem] leading-relaxed text-pearl/65">
                {group.items.join(" · ")}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </Page>
  );
}
