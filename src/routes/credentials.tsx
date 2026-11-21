import { getContent } from "../cms/content";
import { Page } from "../components/Page";

export function meta() {
  return [
    { title: "Credentials — Dhanuja Narada Udurawana" },
    {
      name: "description",
      content: "Certifications, awards and leadership from the CV.",
    },
  ];
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
    <Page kicker="Credentials" title="Certifications, awards, leadership">
      <section>
        <h2 className="font-display text-2xl text-pearl">Certifications</h2>
        <ul className="mt-6 space-y-4">
          {certifications.map((entry) => (
            <li key={entry.id} className="border-b border-pearl/10 pb-4">
              <p className="font-display text-lg text-pearl">{entry.title}</p>
              <p className="mt-1 font-ui text-xs text-champagne">
                {entry.issuer}
              </p>
              {entry.note && (
                <p className="mt-2 font-body text-base text-pearl/70">
                  {entry.note}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-pearl">Awards & competitions</h2>
        <ul className="mt-6 space-y-4">
          {awards.map((entry) => (
            <li key={entry.id} className="border-b border-pearl/10 pb-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-display text-lg text-pearl">{entry.title}</p>
                {entry.year && (
                  <span className="font-ui text-xs text-champagne">
                    {entry.year}
                  </span>
                )}
              </div>
              {entry.note && (
                <p className="mt-1 font-body text-base text-pearl/70">
                  {entry.note}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-pearl">Leadership</h2>
        <ul className="mt-6 space-y-4">
          {leadership.map((entry) => (
            <li key={entry.id} className="border-b border-pearl/10 pb-4">
              <p className="font-display text-lg text-pearl">{entry.role}</p>
              <p className="mt-1 font-ui text-xs text-champagne">
                {entry.organization} · {entry.start}–{entry.end}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}
