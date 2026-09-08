export type CvTheme = {
  id: string;
  name: string;
  layout: "classic" | "sidebar" | "banner" | "minimal";
  surface: "light" | "dark";
  hue: number;
  headingFont: string;
  bodyFont: string;
  accent: string;
  paper: string;
  ink: string;
  soft: string;
  rule: string;
};

const FIRST = [
  "Nocturne",
  "Column",
  "Split",
  "Meridian",
  "Atlas",
  "Ember",
  "Harbour",
  "Slate",
  "Verve",
  "Quill",
  "Orbit",
  "Cadence",
];
const SECOND = ["One", "Feed", "Press", "Grid", "Line", "Edge", "Frame", "Mark"];

const FONTS = [
  { heading: '"Archivo", sans-serif', body: '"IBM Plex Sans", sans-serif' },
  { heading: '"IBM Plex Sans", sans-serif', body: '"IBM Plex Sans", sans-serif' },
  { heading: '"Archivo", sans-serif', body: '"Archivo", sans-serif' },
];

const LAYOUTS: CvTheme["layout"][] = ["classic", "sidebar", "banner", "minimal"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

export function randomTheme(): CvTheme {
  const hue = Math.floor(Math.random() * 360);
  const surface: CvTheme["surface"] = Math.random() < 0.28 ? "dark" : "light";
  const fonts = pick(FONTS);
  const chroma = (0.1 + Math.random() * 0.08).toFixed(3);

  return {
    id: Math.random().toString(36).slice(2, 10),
    name: `${pick(FIRST)} ${pick(SECOND)}`,
    layout: pick(LAYOUTS),
    surface,
    hue,
    headingFont: fonts.heading,
    bodyFont: fonts.body,
    accent: `oklch(${surface === "dark" ? 0.78 : 0.55} ${chroma} ${hue})`,
    paper: surface === "dark" ? `oklch(0.24 0.02 ${hue})` : `oklch(0.985 0.004 ${hue})`,
    ink: surface === "dark" ? `oklch(0.95 0.008 ${hue})` : `oklch(0.24 0.02 ${hue})`,
    soft: surface === "dark" ? `oklch(0.72 0.02 ${hue})` : `oklch(0.55 0.02 ${hue})`,
    rule: surface === "dark" ? `oklch(0.38 0.02 ${hue})` : `oklch(0.88 0.01 ${hue})`,
  };
}

export function randomThemes(count = 6): CvTheme[] {
  return Array.from({ length: count }, () => randomTheme());
}
