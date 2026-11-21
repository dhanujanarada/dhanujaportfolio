const NUMERALS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

/** Roman numeral for chapter markers; falls back to the number itself. */
export function roman(value: number): string {
  return NUMERALS[value - 1] ?? String(value);
}
