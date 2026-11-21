/**
 * Drifting fog, dust and a ghost word. Purely decorative: every layer is out of
 * the pointer path and hidden from assistive technology.
 */
export function Atmosphere({
  ghost,
  fixed = false,
}: {
  ghost?: string;
  fixed?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`atmosphere ${fixed ? "atmosphere--fixed" : ""}`}
    >
      <span className="atmosphere__fog atmosphere__fog--a" />
      <span className="atmosphere__fog atmosphere__fog--b" />
      <span className="atmosphere__dust" />
      <span className="atmosphere__grain" />
      {ghost ? <span className="page-ghost">{ghost}</span> : null}
      <span className="atmosphere__vignette" />
    </div>
  );
}
