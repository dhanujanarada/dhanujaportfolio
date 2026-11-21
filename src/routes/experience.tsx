import { getContent } from "../cms/content";
import { Page } from "../components/Page";
import { pageMeta } from "../content/meta";

export function meta() {
  return pageMeta(
    "Experience — Dhanuja Narada Udurawana",
    "Industry experience at HCL Technologies and BEng education.",
  );
}

export async function loader() {
  const content = await getContent();
  return { experience: content.experience, education: content.education };
}

export default function ExperiencePage({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <Page kicker="Experience" title="Where the work happened">
      {loaderData.experience.map((entry) => (
        <section key={entry.id}>
          <h2 className="font-display text-2xl text-pearl">{entry.company}</h2>
          <div className="mt-6 space-y-8 border-l border-pearl/15 pl-6">
            {entry.roles.map((role) => (
              <article key={`${entry.id}-${role.title}`}>
                <h3 className="font-display text-lg text-pearl">{role.title}</h3>
                <p className="mt-1 font-ui text-xs text-champagne">
                  {role.start} – {role.end}
                </p>
                <ul className="mt-3 space-y-2 font-body text-base leading-relaxed text-pearl/75">
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ))}

      {loaderData.education.length > 0 && (
        <section>
          <h2 className="font-display text-2xl text-pearl">Education</h2>
          {loaderData.education.map((entry) => (
            <div key={entry.id} className="mt-6 border-l border-pearl/15 pl-6">
              <h3 className="font-display text-lg text-pearl">
                {entry.degree}
              </h3>
              <p className="mt-1 font-ui text-xs text-champagne">
                {entry.start} – {entry.end} · {entry.classification}
              </p>
              <p className="mt-2 font-body text-base text-pearl/75">
                {entry.institution}
              </p>
              <p className="mt-4 font-ui text-xs leading-relaxed text-pearl/70">
                Dissertation: {entry.dissertationTitle}
                {entry.dissertationNote ? ` (${entry.dissertationNote})` : ""}
              </p>
            </div>
          ))}
        </section>
      )}
    </Page>
  );
}
