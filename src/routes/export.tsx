import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CvSheet } from "@/components/CvSheet";
import { useCv } from "@/lib/cv-store";
import { sampleCv } from "@/lib/cv-types";

export const Route = createFileRoute("/export")({
  head: () => ({
    meta: [
      { title: "Download your CV — Zee CV Maker" },
      {
        name: "description",
        content:
          "Preview your finished CV in the theme you chose and save it as a print-ready PDF in one tap.",
      },
      { property: "og:title", content: "Download your CV — Zee CV Maker" },
      {
        property: "og:description",
        content: "Preview your finished resume and save it as a PDF.",
      },
    ],
  }),
  component: ExportPage,
});

function ExportPage() {
  const { cv, activeTheme, hydrated } = useCv();
  const hasCv = Boolean(cv.name);

  return (
    <AppShell badge={hasCv ? "Ready" : "Sample"}>
      <div className="print-hide mb-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">Export</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight">Your CV</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {hasCv
            ? "Looks right? Save it as a PDF and send it out."
            : "This is a sample CV. Add your own details to make it yours."}
        </p>
      </div>

      <div className="print-sheet kglass rounded-2xl p-3 ring-1 ring-foreground/10">
        <div className="overflow-hidden rounded-xl">
          {hydrated && activeTheme && <CvSheet cv={hasCv ? cv : sampleCv} theme={activeTheme} />}
        </div>
      </div>

      <div className="print-hide mt-5 space-y-3">
        <button
          onClick={() => window.print()}
          className="w-full rounded-xl bg-primary py-4 font-display text-[15px] font-bold text-primary-foreground"
        >
          Download PDF
        </button>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/builder"
            search={{ mode: "form" }}
            className="rounded-xl bg-foreground/5 py-3 text-center font-display text-[13px] font-bold ring-1 ring-border"
          >
            Edit details
          </Link>
          <Link
            to="/themes"
            className="rounded-xl bg-foreground/5 py-3 text-center font-display text-[13px] font-bold ring-1 ring-border"
          >
            Change theme
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
