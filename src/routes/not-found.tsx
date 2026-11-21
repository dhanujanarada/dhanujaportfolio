import { Link } from "react-router";

import { Page } from "../components/Page";

export function meta() {
  return [{ title: "Not found — Dhanuja Narada Udurawana" }];
}

export default function NotFound() {
  return (
    <Page
      kicker="404"
      title="This page is not here"
      ghost="Lost"
      intro="The address may have changed. The projects and the rest of the CV are still one link away."
    >
      <nav className="flex flex-wrap gap-6 font-ui text-xs text-pearl/70">
        <Link to="/" className="hover:text-champagne">
          Home
        </Link>
        <Link to="/projects" className="hover:text-champagne">
          Projects
        </Link>
        <Link to="/contact" className="hover:text-champagne">
          Contact
        </Link>
      </nav>
    </Page>
  );
}
