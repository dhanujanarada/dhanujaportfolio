import { getContent } from "../cms/content";
import { Page } from "../components/Page";
import { pageMeta } from "../content/meta";

export function meta() {
  return pageMeta(
    "About — Dhanuja Narada Udurawana",
    "Machine Learning Engineer based in Sri Lanka.",
  );
}

export async function loader() {
  const content = await getContent();
  return { about: content.about, skills: content.skills, settings: content.settings };
}

export default function About({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { about, skills, settings } = loaderData;

  return (
    <Page kicker="About" title="Dhanuja Narada Udurawana" intro={about.headline}>
      <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <div className="space-y-4 font-body text-body leading-relaxed text-pearl/80">
          <p>{about.summary}</p>
          {about.location && (
            <p className="font-ui text-xs text-pearl/50">{about.location}</p>
          )}
          <div className="flex flex-wrap gap-5 font-ui text-xs">
            {settings.linkedin && (
              <a
                href={settings.linkedin}
                rel="noreferrer"
                className="text-champagne underline-offset-4 hover:underline"
              >
                LinkedIn
              </a>
            )}
            {settings.github && (
              <a
                href={settings.github}
                rel="noreferrer"
                className="text-champagne underline-offset-4 hover:underline"
              >
                GitHub
              </a>
            )}
            <a
              href={`mailto:${settings.email}`}
              className="text-champagne underline-offset-4 hover:underline"
            >
              Email
            </a>
          </div>
        </div>
        <figure className="flex aspect-[3/4] items-center justify-center border border-dashed border-pearl/20 font-ui text-xs text-pearl/40">
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
        </figure>
      </div>

      <section>
        <h2 className="font-display text-2xl text-pearl">Skills</h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          {skills.map((group) => (
            <div key={group.id}>
              <dt className="font-ui text-xs tracking-[0.06em] text-champagne">
                {group.group}
              </dt>
              <dd className="mt-2 font-ui text-xs leading-relaxed text-pearl/70">
                {group.items.join(" · ")}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </Page>
  );
}
