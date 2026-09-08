import type { CSSProperties } from "react";
import type { CvData } from "@/lib/cv-types";
import type { CvTheme } from "@/lib/themes";

type Props = { cv: CvData; theme: CvTheme; scale?: "full" | "thumb" };

export function CvSheet({ cv, theme, scale = "full" }: Props) {
  const t = scale === "thumb";
  const style = {
    background: theme.paper,
    color: theme.ink,
    fontFamily: theme.bodyFont,
    "--ac": theme.accent,
    "--soft": theme.soft,
    "--rule": theme.rule,
  } as CSSProperties;

  const head = { fontFamily: theme.headingFont };
  const label = t ? "text-[6px]" : "text-[9px]";
  const body = t ? "text-[6px]" : "text-[11px]";

  const Header = (
    <div>
      <h2
        style={{ ...head, color: theme.layout === "banner" ? theme.paper : theme.ink }}
        className={`font-extrabold tracking-tight leading-none ${t ? "text-[10px]" : "text-xl"}`}
      >
        {cv.name || "Your name"}
      </h2>
      <p
        style={{ color: theme.layout === "banner" ? theme.paper : theme.soft }}
        className={`${t ? "text-[6px] mt-0.5" : "text-[12px] mt-1"}`}
      >
        {[cv.title, cv.location].filter(Boolean).join(" · ") || "Your role · Your city"}
      </p>
      {!t && (cv.email || cv.phone) && (
        <p
          style={{ color: theme.layout === "banner" ? theme.paper : theme.soft }}
          className="text-[11px] mt-0.5"
        >
          {[cv.email, cv.phone].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className={t ? "mt-1.5" : "mt-4"}>
      <p
        className={`${label} font-semibold uppercase tracking-[0.16em]`}
        style={{ color: "var(--ac)" }}
      >
        {title}
      </p>
      <div className={t ? "mt-1 space-y-1" : "mt-1.5 space-y-2.5"}>{children}</div>
    </div>
  );

  const Experience = cv.experience.length > 0 && (
    <Section title="Experience">
      {cv.experience.slice(0, t ? 2 : undefined).map((e, i) => (
        <div key={i}>
          <div className="flex items-baseline justify-between gap-2">
            <p className={`${body} font-semibold leading-tight`} style={head}>
              {e.role}
              {e.company ? ` — ${e.company}` : ""}
            </p>
            <p className={`${t ? "text-[5px]" : "text-[10px]"} shrink-0`} style={{ color: "var(--soft)" }}>
              {e.period}
            </p>
          </div>
          {e.detail && (
            <p
              className={`${t ? "text-[5px]" : "text-[11px]"} leading-snug mt-0.5`}
              style={{ color: "var(--soft)" }}
            >
              {e.detail}
            </p>
          )}
        </div>
      ))}
    </Section>
  );

  const Education = cv.education.length > 0 && (
    <Section title="Education">
      {cv.education.slice(0, t ? 1 : undefined).map((e, i) => (
        <div key={i} className="flex items-baseline justify-between gap-2">
          <p className={`${body} font-semibold leading-tight`} style={head}>
            {e.degree}
            {e.school ? ` — ${e.school}` : ""}
          </p>
          <p className={`${t ? "text-[5px]" : "text-[10px]"} shrink-0`} style={{ color: "var(--soft)" }}>
            {e.period}
          </p>
        </div>
      ))}
    </Section>
  );

  const Skills = cv.skills.length > 0 && (
    <Section title="Skills">
      <div className="flex flex-wrap gap-1">
        {cv.skills.slice(0, t ? 4 : undefined).map((s) => (
          <span
            key={s}
            className={`rounded-full ${t ? "px-1 py-px text-[5px]" : "px-2 py-0.5 text-[10px]"} font-medium`}
            style={{ background: "color-mix(in oklab, var(--ac) 14%, transparent)", color: "var(--ac)" }}
          >
            {s}
          </span>
        ))}
      </div>
    </Section>
  );

  const Summary = cv.summary && (
    <p
      className={`${t ? "text-[5px] mt-1" : "text-[11px] mt-3"} leading-snug`}
      style={{ color: "var(--soft)" }}
    >
      {cv.summary}
    </p>
  );

  if (theme.layout === "sidebar") {
    return (
      <div style={style} className={`flex ${t ? "p-2 gap-2" : "p-5 gap-5"} h-full`}>
        <div
          className={`${t ? "w-[34%] pr-1.5" : "w-[34%] pr-4"} border-r`}
          style={{ borderColor: "var(--rule)" }}
        >
          {Header}
          {Skills}
          {Education}
        </div>
        <div className="flex-1">
          {Summary}
          {Experience}
        </div>
      </div>
    );
  }

  if (theme.layout === "banner") {
    return (
      <div style={style} className="h-full">
        <div style={{ background: theme.accent }} className={t ? "p-2" : "p-5"}>
          {Header}
        </div>
        <div className={t ? "p-2" : "p-5 pt-3"}>
          {Summary}
          {Experience}
          {Education}
          {Skills}
        </div>
      </div>
    );
  }

  if (theme.layout === "minimal") {
    return (
      <div style={style} className={`h-full ${t ? "p-2" : "p-6"}`}>
        {Header}
        <div className={t ? "mt-1 h-px" : "mt-3 h-px"} style={{ background: "var(--rule)" }} />
        {Summary}
        {Experience}
        {Education}
        {Skills}
      </div>
    );
  }

  return (
    <div style={style} className={`h-full ${t ? "p-2" : "p-5"}`}>
      <div
        className={t ? "pb-1 border-b-2" : "pb-2.5 border-b-2"}
        style={{ borderColor: "var(--ac)" }}
      >
        {Header}
      </div>
      {Summary}
      {Experience}
      {Education}
      {Skills}
    </div>
  );
}
