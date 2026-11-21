import { getContent } from "../cms/content";
import { Page } from "../components/Page";
import { SectionHeading } from "../components/SectionHeading";
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
  const { experience, education } = loaderData;

  return (
    <Page
      kicker="Experience"
      title="Where the work happened"
      ghost="Path"
      intro="Industry roles, and the degree behind them."
    >
      <section>
        <SectionHeading index="I">Industry</SectionHeading>

        {experience.map((entry) => (
          <div key={entry.id} className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] text-pearl">
                {entry.company}
              </h3>
              <span className="font-display text-[0.6rem] uppercase tracking-[0.2em] text-champagne/55">
                {entry.roles[0]?.start} – {entry.roles[0]?.end}
              </span>
            </div>

            <div className="timeline mt-8 space-y-9">
              {entry.roles.map((role) => (
                <article key={`${entry.id}-${role.title}`}>
                  <h4 className="font-display text-lg text-pearl">
                    {role.title}
                  </h4>
                  <p className="mt-1 font-display text-[0.6rem] uppercase tracking-[0.2em] text-champagne">
                    {role.start} – {role.end}
                  </p>
                  <ul className="rune-list mt-4 space-y-2.5 font-body text-[1.05rem] leading-relaxed text-pearl/75">
                    {role.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      {education.length > 0 && (
        <section>
          <SectionHeading index="II">Education</SectionHeading>

          <div className="timeline mt-8 space-y-9">
            {education.map((entry) => (
              <div key={entry.id}>
                <h3 className="font-display text-[clamp(1.35rem,2.3vw,1.8rem)] text-pearl">
                  {entry.degree}
                </h3>
                <p className="mt-1 font-display text-[0.62rem] uppercase tracking-[0.2em] text-champagne">
                  {entry.start} – {entry.end} · {entry.classification}
                </p>
                <p className="mt-3 font-body text-[1.05rem] text-pearl/75">
                  {entry.institution}
                </p>
                <p className="mt-4 border-l border-champagne/30 pl-4 font-ui text-[0.74rem] leading-relaxed text-pearl/60">
                  Dissertation: {entry.dissertationTitle}
                  {entry.dissertationNote
                    ? ` (${entry.dissertationNote})`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </Page>
  );
}
