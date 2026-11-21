/** A hairline rule broken by a small Nordic knot. */
export function RuneDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center gap-3 text-champagne ${className}`}>
      <span className="gold-rule flex-1" />
      <svg width="46" height="14" viewBox="0 0 46 14" fill="none">
        <path d="M1 7h12M33 7h12" stroke="currentColor" strokeOpacity="0.55" />
        <path d="M23 1l6 6-6 6-6-6z" stroke="currentColor" strokeOpacity="0.8" />
        <path
          d="M23 4.5L25.5 7 23 9.5 20.5 7z"
          fill="currentColor"
          fillOpacity="0.85"
        />
      </svg>
      <span className="gold-rule flex-1" />
    </div>
  );
}
