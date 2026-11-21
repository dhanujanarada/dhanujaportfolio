import { useState, type FormEvent } from "react";

import { getContent } from "../content/content";
import { Page } from "../components/Page";
import { SectionHeading } from "../components/SectionHeading";
import { pageMeta } from "../content/meta";

export function meta() {
  return pageMeta(
    "Contact — Dhanuja Narada Udurawana",
    "Email, LinkedIn and GitHub.",
  );
}

export async function loader() {
  const content = await getContent();
  return { settings: content.settings };
}

export default function Contact({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { settings } = loaderData;
  const [ready, setReady] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`;
    setReady(true);
  }

  return (
    <Page
      kicker="Contact"
      title="Start a conversation"
      ghost="Word"
      intro="The form composes an email in your mail client. Nothing is stored or posted."
    >
      <div className="grid gap-14 md:grid-cols-[3fr_2fr] md:gap-16">
        <form onSubmit={onSubmit}>
          <SectionHeading index="I">Compose a message</SectionHeading>
          <p className="mt-5 max-w-md font-body text-[1.05rem] leading-relaxed text-pearl/65">
            Tell me what you are building, researching, or hiring for.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="contact-name"
                className="font-display text-[0.62rem] uppercase tracking-[0.2em] text-pearl/55"
              >
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
                className="mt-2 w-full border border-pearl/20 bg-ink-soft/40 px-4 py-3 font-body text-base text-pearl outline-none transition-colors placeholder:text-pearl/25 focus:border-champagne/70"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="font-display text-[0.62rem] uppercase tracking-[0.2em] text-pearl/55"
              >
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-2 w-full border border-pearl/20 bg-ink-soft/40 px-4 py-3 font-body text-base text-pearl outline-none transition-colors placeholder:text-pearl/25 focus:border-champagne/70"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="font-display text-[0.62rem] uppercase tracking-[0.2em] text-pearl/55"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={6}
                placeholder="What would you like to talk about?"
                className="mt-2 w-full resize-y border border-pearl/20 bg-ink-soft/40 px-4 py-3 font-body text-base text-pearl outline-none transition-colors placeholder:text-pearl/25 focus:border-champagne/70"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 border border-champagne bg-champagne px-6 py-2.5 font-display text-[0.66rem] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-champagne-soft"
          >
            Compose email
          </button>

          {ready && (
            <p
              role="status"
              className="mt-5 border-l border-champagne/50 pl-4 font-ui text-xs leading-relaxed text-champagne"
            >
              Your mail app should open. If it does not, email {settings.email}.
            </p>
          )}
        </form>

        <aside>
          <SectionHeading index="II">Elsewhere</SectionHeading>

          <ul className="mt-8 space-y-7">
            <li>
              <p className="font-display text-[0.58rem] uppercase tracking-[0.2em] text-pearl/40">
                Email
              </p>
              <a
                href={`mailto:${settings.email}`}
                className="mt-2 inline-block font-body text-[1.05rem] text-champagne underline-offset-4 hover:underline"
              >
                {settings.email}
              </a>
            </li>

            {settings.linkedin && (
              <li>
                <p className="font-display text-[0.58rem] uppercase tracking-[0.2em] text-pearl/40">
                  LinkedIn
                </p>
                <a
                  href={settings.linkedin}
                  rel="noreferrer"
                  className="mt-2 inline-block font-body text-[1.05rem] text-pearl/80 underline-offset-4 hover:text-champagne hover:underline"
                >
                  {settings.linkedin.replace(/^https?:\/\//, "")}
                </a>
              </li>
            )}

            {settings.github && (
              <li>
                <p className="font-display text-[0.58rem] uppercase tracking-[0.2em] text-pearl/40">
                  GitHub
                </p>
                <a
                  href={settings.github}
                  rel="noreferrer"
                  className="mt-2 inline-block font-body text-[1.05rem] text-pearl/80 underline-offset-4 hover:text-champagne hover:underline"
                >
                  {settings.github.replace(/^https?:\/\//, "")}
                </a>
              </li>
            )}
          </ul>

          <div className="mt-10 border border-champagne/20 p-5">
            <p className="font-display text-[0.58rem] uppercase tracking-[0.2em] text-pearl/40">
              Curriculum vitae
            </p>
            {settings.cvFile ? (
              <a
                href={settings.cvFile}
                className="mt-2 inline-block font-body text-[1.05rem] text-pearl/80 hover:text-champagne"
              >
                Download PDF
              </a>
            ) : (
              <p className="mt-2 font-ui text-xs text-pearl/35">
                [TODO: CV PDF not supplied]
              </p>
            )}
          </div>
        </aside>
      </div>
    </Page>
  );
}
