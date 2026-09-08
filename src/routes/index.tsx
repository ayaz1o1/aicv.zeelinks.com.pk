import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CvSheet } from "@/components/CvSheet";
import { useCv } from "@/lib/cv-store";
import { sampleCv } from "@/lib/cv-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zee CV Maker — AI resume builder by Zeelinks" },
      {
        name: "description",
        content:
          "Build a professional CV in under a minute. Enter your details or paste an existing CV, pick an auto-generated theme, and download a print-ready resume.",
      },
      { property: "og:title", content: "Zee CV Maker — AI resume builder" },
      {
        property: "og:description",
        content:
          "Enter your details or paste your old CV, pick an auto-generated theme, and download a polished resume.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { cv, themes, activeTheme, hydrated } = useCv();
  const navigate = useNavigate();
  const hasCv = Boolean(cv.name);

  return (
    <AppShell badge={hasCv ? "Draft saved" : "New"}>
      <div className="mb-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
          AI CV Maker
        </p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight text-balance">
          Build your CV
        </h1>
        <p className="mt-1.5 text-sm text-pretty text-muted-foreground">
          Two ways to start. We shape the words, you pick the look.
        </p>
      </div>

      <div className="mb-5 flex items-center gap-1.5">
        <span className="h-1.5 w-6 rounded-full bg-primary" />
        <span className="h-1.5 w-1.5 rounded-full bg-border" />
        <span className="h-1.5 w-1.5 rounded-full bg-border" />
        <span className="h-1.5 w-1.5 rounded-full bg-border" />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <Link
          to="/builder"
          search={{ mode: "form" }}
          className="kglass flex flex-col gap-3 rounded-2xl p-4 text-left ring-1 ring-foreground/10"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-primary font-display text-lg font-extrabold text-primary-foreground">
            +
          </span>
          <span className="font-display text-lg font-bold leading-tight">Build my CV</span>
          <span className="text-xs leading-snug text-muted-foreground">
            Answer a few prompts, watch it assemble.
          </span>
        </Link>
        <Link
          to="/builder"
          search={{ mode: "upload" }}
          className="kglass flex flex-col gap-3 rounded-2xl p-4 text-left ring-1 ring-foreground/10"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-foreground/10 ring-1 ring-foreground/15">
            <span className="block h-3 w-3 rotate-180 border-2 border-b-0 border-foreground" />
          </span>
          <span className="font-display text-lg font-bold leading-tight">Upload my CV</span>
          <span className="text-xs leading-snug text-muted-foreground">
            Paste or drop a file, we lift the content out.
          </span>
        </Link>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <p className="font-display text-sm font-semibold">Pick a theme</p>
        <Link to="/themes" className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Swipe
        </Link>
      </div>

      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
        {(hydrated ? themes.slice(0, 4) : []).map((theme) => (
          <button
            key={theme.id}
            onClick={() => navigate({ to: "/themes" })}
            className={`w-48 shrink-0 snap-center rounded-2xl bg-foreground/5 p-3 text-left ring-1 ${
              theme.id === activeTheme?.id ? "ring-primary/60" : "ring-border"
            }`}
          >
            <div className="h-52 overflow-hidden rounded-lg">
              <CvSheet cv={hasCv ? cv : sampleCv} theme={theme} scale="thumb" />
            </div>
            <p className="mt-2 text-xs font-medium text-muted-foreground">{theme.name}</p>
          </button>
        ))}
        {!hydrated && (
          <div className="h-[236px] w-48 shrink-0 animate-pulse rounded-2xl bg-foreground/5" />
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Live preview
        </p>
        <Link
          to="/export"
          className="kglass block -rotate-1 rounded-2xl p-4 ring-1 ring-foreground/10"
        >
          <div className="overflow-hidden rounded-xl">
            {hydrated && activeTheme && (
              <CvSheet cv={hasCv ? cv : sampleCv} theme={activeTheme} />
            )}
          </div>
        </Link>
        {!hasCv && (
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Showing a sample. Your own CV appears here once you add your details.
          </p>
        )}
      </div>
    </AppShell>
  );
}
