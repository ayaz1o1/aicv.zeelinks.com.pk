import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useCv } from "@/lib/cv-store";
import { emptyCv, type CvData } from "@/lib/cv-types";
import { generateCv } from "@/lib/cv.functions";

type Mode = "form" | "upload";

export const Route = createFileRoute("/builder")({
  validateSearch: (search: Record<string, unknown>): { mode: Mode } => ({
    mode: search["mode"] === "upload" ? "upload" : "form",
  }),
  head: () => ({
    meta: [
      { title: "CV Builder — Zee CV Maker" },
      {
        name: "description",
        content:
          "Fill in your work history, education and skills, or paste an existing CV, and let AI write a polished resume for you.",
      },
      { property: "og:title", content: "CV Builder — Zee CV Maker" },
      {
        property: "og:description",
        content: "Add your details or paste an old CV and let AI write a polished resume.",
      },
    ],
  }),
  component: Builder,
});

const STEPS = ["Personal", "Experience", "Education", "Skills"] as const;

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const cls =
    "mt-1.5 w-full rounded-xl bg-foreground/5 px-3 py-3 text-[14px] text-foreground ring-1 ring-foreground/10 outline-none placeholder:text-muted-foreground/60 focus:ring-primary/50";
  return (
    <label className="block">
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {textarea ? (
        <textarea
          rows={4}
          className={cls}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={cls}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function Builder() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const { cv, setCv } = useCv();
  const run = useServerFn(generateCv);

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<CvData>(cv.name ? cv : emptyCv);
  const [pasted, setPasted] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (patch: Partial<CvData>) => setDraft((d) => ({ ...d, ...patch }));

  const [expText, setExpText] = useState(
    cv.experience.map((e) => `${e.role} at ${e.company} (${e.period}): ${e.detail}`).join("\n"),
  );
  const [eduText, setEduText] = useState(
    cv.education.map((e) => `${e.degree}, ${e.school} (${e.period})`).join("\n"),
  );
  const [skillText, setSkillText] = useState(cv.skills.join(", "));

  async function submit() {
    const raw =
      mode === "upload"
        ? pasted
        : [
            `Name: ${draft.name}`,
            `Job title: ${draft.title}`,
            `Location: ${draft.location}`,
            `Email: ${draft.email}`,
            `Phone: ${draft.phone}`,
            `About me: ${draft.summary}`,
            `Experience:\n${expText}`,
            `Education:\n${eduText}`,
            `Skills: ${skillText}`,
          ].join("\n");

    if (raw.trim().length < 10) {
      toast.error("Please add a little more detail first.");
      return;
    }

    setBusy(true);
    try {
      const result = (await run({ data: { mode: mode === "upload" ? "paste" : "form", raw } })) as CvData;
      setCv({ ...emptyCv, ...result });
      toast.success("Your CV is ready.");
      navigate({ to: "/export" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File) {
    if (file.size > 1_000_000) {
      toast.error("That file is too large. Please keep it under 1 MB.");
      return;
    }
    const text = await file.text();
    const clean = text.replace(/[^\S\n]+/g, " ").trim();
    if (clean.length < 40) {
      toast.error("We couldn't read text from that file. Please paste your CV text instead.");
      return;
    }
    setPasted(clean.slice(0, 18000));
    toast.success("Text pulled from your file.");
  }

  return (
    <AppShell badge={mode === "upload" ? "Upload" : `Step 0${step + 1} / 04`}>
      <div className="mb-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
          {mode === "upload" ? "Import" : STEPS[step]}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight">
          {mode === "upload" ? "Upload my CV" : "Build my CV"}
        </h1>
      </div>

      {mode === "form" && (
        <div className="mb-5 flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`h-1.5 rounded-full ${i === step ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
      )}

      {mode === "upload" ? (
        <div className="space-y-3">
          <label className="kglass flex cursor-pointer flex-col items-center gap-2 rounded-2xl p-6 text-center ring-1 ring-foreground/10">
            <span className="grid size-10 place-items-center rounded-xl bg-foreground/10 ring-1 ring-foreground/15">
              <span className="block h-3 w-3 rotate-180 border-2 border-b-0 border-foreground" />
            </span>
            <span className="font-display text-base font-bold">Choose a file</span>
            <span className="text-xs text-muted-foreground">
              Plain text, Markdown or .doc text export
            </span>
            <input
              type="file"
              accept=".txt,.md,.rtf,.doc,.docx,text/plain"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onFile(f);
              }}
            />
          </label>
          <Field
            label="Or paste your CV text"
            value={pasted}
            onChange={setPasted}
            placeholder="Paste everything you have — we'll tidy it up."
            textarea
          />
        </div>
      ) : (
        <div key={step} className="step-in space-y-3">
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Full name" value={draft.name} onChange={(v) => set({ name: v })} placeholder="Adeel Malik" />
                <Field label="Role" value={draft.title} onChange={(v) => set({ title: v })} placeholder="Product Designer" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Email" value={draft.email} onChange={(v) => set({ email: v })} placeholder="you@email.com" />
                <Field label="Phone" value={draft.phone} onChange={(v) => set({ phone: v })} placeholder="+92 300 0000000" />
              </div>
              <Field label="Location" value={draft.location} onChange={(v) => set({ location: v })} placeholder="Lahore" />
              <Field
                label="About you"
                value={draft.summary}
                onChange={(v) => set({ summary: v })}
                placeholder="A line or two about what you do."
                textarea
              />
            </>
          )}
          {step === 1 && (
            <Field
              label="Work history — one job per line"
              value={expText}
              onChange={setExpText}
              placeholder={"Lead Designer at Vanta Labs (2021–now): built the design system\nDesigner at Halcyon (2018–2021): onboarding, mobile"}
              textarea
            />
          )}
          {step === 2 && (
            <Field
              label="Education — one per line"
              value={eduText}
              onChange={setEduText}
              placeholder={"BSc Computer Science, FAST NUCES (2014–2018)"}
              textarea
            />
          )}
          {step === 3 && (
            <Field
              label="Skills — separated by commas"
              value={skillText}
              onChange={setSkillText}
              placeholder="Figma, React, Design systems"
              textarea
            />
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          className="text-[13px] font-medium text-muted-foreground disabled:opacity-40"
          disabled={mode === "upload" || step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </button>

        {mode === "form" && step < STEPS.length - 1 ? (
          <button
            className="rounded-xl bg-primary px-5 py-3 font-display text-[14px] font-bold text-primary-foreground"
            onClick={() => setStep((s) => s + 1)}
          >
            Continue →
          </button>
        ) : (
          <button
            disabled={busy}
            onClick={() => void submit()}
            className="rounded-xl bg-primary px-5 py-3 font-display text-[14px] font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Writing your CV…" : "Generate my CV"}
          </button>
        )}
      </div>
    </AppShell>
  );
}
