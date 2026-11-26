export const FONT_SIZE_KEY = "sdr-font";
export const FONT_MIN = 12;
export const FONT_MAX = 24;
export const FONT_DEFAULT = 16;

export const fontSizeBoot = `try{var n=Number(localStorage.getItem("${FONT_SIZE_KEY}"));if(n>=${FONT_MIN}&&n<=${FONT_MAX})document.documentElement.style.fontSize=n+"px";}catch(e){}`;

export function readFontSize() {
  if (typeof window === "undefined") return FONT_DEFAULT;
  const stored = Number(localStorage.getItem(FONT_SIZE_KEY));
  if (stored >= FONT_MIN && stored <= FONT_MAX) return stored;
  return FONT_DEFAULT;
}

export function applyFontSize(px: number) {
  const next = Math.min(FONT_MAX, Math.max(FONT_MIN, Math.round(px)));
  document.documentElement.style.fontSize = `${next}px`;
  localStorage.setItem(FONT_SIZE_KEY, String(next));
  return next;
}
