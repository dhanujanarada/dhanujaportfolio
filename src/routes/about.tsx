import { getContent } from "../cms/content";
import { Page } from "../components/Page";

export function meta() {
  return [
    { title: "About — Dhanuja Narada Udurawana" },
    { name: "description", content: "Machine Learning Engineer based in Sri Lanka." },
  ];
}

export async function loader() {
  const content = await getContent();
  return { about: content.about, skills: content.skills };
}

export default function About({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { about, skills } = loaderData;

  return (
    <Page kicker="About" title="Dhanuja Narada Udurawana" intro={about.headline}>
      <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <div className="space-y-4 font-body text-body leading-relaxed text-pearl/80">
          <p>{about.summary}</p>
        </div>
        <figure className="flex aspect-[3/4] items-center justify-center border border-dashed border-pearl/20 font-ui text-xs text-pearl/40">
          [TODO: portrait]
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
