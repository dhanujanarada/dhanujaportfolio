import { Fragment, type CSSProperties } from "react";

/**
 * Character-by-character reveal. Words stay unbreakable so long project
 * titles still wrap normally. CSS owns the animation, so prerendered text is
 * visible without JavaScript; GSAP stays with scroll and scene motion.
 */
export function SplitText({
  text,
  active,
  className = "",
}: {
  text: string;
  active: boolean;
  className?: string;
}) {
  const words = text.split(" ");
  let index = 0;

  return (
    <span
      className={`split ${active ? "is-active" : ""} ${className}`}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          <span aria-hidden className="inline-block whitespace-nowrap">
            {Array.from(word).map((character) => {
              const charIndex = index;
              index += 1;
              return (
                <span
                  key={`${character}-${charIndex}`}
                  aria-hidden
                  className="split-char"
                  style={
                    {
                      "--i": charIndex,
                      "--r": `${((charIndex * 7) % 5) - 2}deg`,
                    } as CSSProperties
                  }
                >
                  {character}
                </span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
