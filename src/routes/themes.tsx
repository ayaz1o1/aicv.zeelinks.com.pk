import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CvSheet } from "@/components/CvSheet";
import { useCv } from "@/lib/cv-store";
import { sampleCv } from "@/lib/cv-types";

export const Route = createFileRoute("/themes")({
  head: () => ({
    meta: [
      { title: "CV Themes — Zee CV Maker" },
      {
        name: "description",
        content:
          "Fresh CV themes generated automatically every time you shuffle. Pick a layout, colour and type pairing for your resume.",
      },
      { property: "og:title", content: "CV Themes — Zee CV Maker" },
      {
        property: "og:description",
        content: "Auto-generated resume themes — shuffle until one fits, then apply it.",
      },
    ],
  }),
  component: Themes,
});

function Themes() {
  const { cv, themes, themeId, selectTheme, shuffleThemes, hydrated } = useCv();
  const preview = cv.name ? cv : sampleCv;

  return (
    <AppShell badge="Auto-generated">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">Themes</p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight">Pick a look</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Every shuffle draws a new set of layouts and colours.
          </p>
        </div>
        <button
          onClick={shuffleThemes}
          className="shrink-0 rounded-xl bg-primary px-4 py-2.5 font-display text-[13px] font-bold text-primary-foreground"
        >
          Shuffle
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {hydrated &&
          themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => selectTheme(theme.id)}
              className={`rounded-2xl bg-foreground/5 p-3 text-left ring-1 ${
                theme.id === themeId ? "ring-2 ring-primary" : "ring-border"
              }`}
            >
              <div className="h-52 overflow-hidden rounded-lg">
                <CvSheet cv={preview} theme={theme} scale="thumb" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{theme.name}</p>
                {theme.id === themeId && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    On
                  </span>
                )}
              </div>
            </button>
          ))}
      </div>
    </AppShell>
  );
}
