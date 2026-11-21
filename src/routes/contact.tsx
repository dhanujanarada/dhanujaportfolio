import { useState, type FormEvent } from "react";

import { getContent } from "../cms/content";
import { Page } from "../components/Page";

export function meta() {
  return [
    { title: "Contact — Dhanuja Narada Udurawana" },
    {
      name: "description",
      content: "Email, LinkedIn and GitHub. No phone number is published.",
    },
  ];
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
      intro="The form composes an email in your mail client. Nothing is stored or posted."
    >
      <div className="grid gap-12 md:grid-cols-[3fr_2fr]">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="contact-name"
              className="font-ui text-xs tracking-[0.06em] text-pearl/60"
            >
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              required
              autoComplete="name"
              className="mt-2 w-full border border-pearl/20 bg-transparent px-3 py-2 font-body text-base text-pearl outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="font-ui text-xs tracking-[0.06em] text-pearl/60"
            >
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full border border-pearl/20 bg-transparent px-3 py-2 font-body text-base text-pearl outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="font-ui text-xs tracking-[0.06em] text-pearl/60"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              className="mt-2 w-full resize-y border border-pearl/20 bg-transparent px-3 py-2 font-body text-base text-pearl outline-none focus:border-champagne"
            />
          </div>

          <button
            type="submit"
            className="bg-champagne px-5 py-2 font-ui text-xs tracking-[0.08em] text-ink"
          >
            Compose email
          </button>

          {ready && (
            <p role="status" className="font-ui text-xs text-champagne">
              Your mail app should open. If it does not, email {settings.email}.
            </p>
          )}
        </form>

        <aside className="space-y-4 font-ui text-xs leading-relaxed">
          <div>
            <p className="text-pearl/40">Email</p>
            <a
              href={`mailto:${settings.email}`}
              className="text-champagne underline-offset-4 hover:underline"
            >
              {settings.email}
            </a>
          </div>
          {settings.linkedin && (
            <div>
              <p className="text-pearl/40">LinkedIn</p>
              <a
                href={settings.linkedin}
                className="text-pearl/80 underline-offset-4 hover:text-champagne hover:underline"
                rel="noreferrer"
              >
                {settings.linkedin.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          {settings.github && (
            <div>
              <p className="text-pearl/40">GitHub</p>
              <a
                href={settings.github}
                className="text-pearl/80 underline-offset-4 hover:text-champagne hover:underline"
                rel="noreferrer"
              >
                {settings.github.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          {settings.cvFile ? (
            <div>
              <p className="text-pearl/40">CV</p>
              <a href={settings.cvFile} className="text-pearl/80 hover:text-champagne">
                Download PDF
              </a>
            </div>
          ) : (
            <p className="font-ui text-xs text-pearl/35">
              [TODO: CV PDF not supplied]
            </p>
          )}
        </aside>
      </div>
    </Page>
  );
}
