import { getContent } from "../content/content";
import { Page } from "../components/Page";
import { SectionHeading } from "../components/SectionHeading";
import { pageMeta } from "../content/meta";

export function meta() {
  return pageMeta(
    "Credentials — Dhanuja Narada Udurawana",
    "Certifications, awards and leadership from the CV.",
  );
}

export async function loader() {
  const content = await getContent();
  return {
    certifications: content.certifications,
    awards: content.awards,
    leadership: content.leadership,
  };
}

export default function Credentials({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { certifications, awards, leadership } = loaderData;

  return (
    <Page
      kicker="Credentials"
      title="Certifications, awards, leadership"
      ghost="Marks"
      intro="The paper trail and the rooms where the work was argued for."
    >
      <section>
        <SectionHeading index="I">Certifications</SectionHeading>
        <ul className="ledger mt-4">
          {certifications.map((entry) => (
            <li key={entry.id}>
              <h3 className="font-display text-lg text-pearl">{entry.title}</h3>
              <p className="mt-1 font-display text-[0.6rem] uppercase tracking-[0.18em] text-champagne">
                {entry.issuer}
              </p>
              {entry.note && (
                <p className="mt-2 font-body text-[1.02rem] text-pearl/70">
                  {entry.note}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading index="II">Awards & competitions</SectionHeading>
        <ul className="ledger mt-4">
          {awards.map((entry) => (
            <li key={entry.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg text-pearl">{entry.title}</h3>
                {entry.year && (
                  <span className="font-display text-[0.6rem] uppercase tracking-[0.18em] text-champagne">
                    {entry.year}
                  </span>
                )}
              </div>
              {entry.note && (
                <p className="mt-1 font-body text-[1.02rem] text-pearl/70">
                  {entry.note}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading index="III">Leadership</SectionHeading>
        <ul className="ledger mt-4">
          {leadership.map((entry) => (
            <li key={entry.id}>
              <h3 className="font-display text-lg text-pearl">{entry.role}</h3>
              <p className="mt-1 font-display text-[0.6rem] uppercase tracking-[0.18em] text-champagne">
                {entry.organization} · {entry.start}–{entry.end}
              </p>
              {entry.note && (
                <p className="mt-2 font-body text-[1.02rem] text-pearl/70">
                  {entry.note}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}
