export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/experience", label: "Experience" },
  { to: "/credentials", label: "Credentials" },
  { to: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = NAV_LINKS.filter((link) => link.to !== "/");
