import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const TABS = [
  { to: "/", label: "Home" },
  { to: "/builder", label: "Builder" },
  { to: "/themes", label: "Themes" },
  { to: "/export", label: "Export" },
] as const;

function TabIcon({ index, active }: { index: number; active: boolean }) {
  const shape =
    index === 0 ? (
      <span className="block size-3 rounded-sm bg-current" />
    ) : index === 1 ? (
      <span className="block h-3 w-3 border-t-2 border-l-2 border-current" />
    ) : index === 2 ? (
      <span className="block size-3 rounded-full bg-current" />
    ) : (
      <span className="block h-2.5 w-2.5 rounded-b-full bg-current" />
    );

  return (
    <span
      className={`grid size-9 place-items-center rounded-xl ring-1 ${
        active
          ? "bg-primary/15 ring-primary/30 text-primary"
          : "bg-foreground/5 ring-border text-muted-foreground"
      }`}
    >
      {shape}
    </span>
  );
}

export function AppShell({ badge, children }: { badge?: string; children: ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[520px] flex-col overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 mx-auto max-w-[520px]" aria-hidden="true">
        <div className="drift-a absolute -top-24 -left-24 h-72 w-72 rotate-12 bg-primary/20 blur-3xl" />
        <div className="drift-b absolute -bottom-28 -right-24 h-72 w-72 -rotate-12 bg-azure/20 blur-3xl" />
        <div className="drift-c absolute top-1/3 -right-[10%] h-56 w-56 rotate-12 bg-foreground/5 blur-2xl" />
      </div>

      <header className="print-hide relative z-10 flex items-center justify-between px-5 pt-5 pb-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
            <span className="font-display text-sm font-extrabold tracking-tight text-primary">Z</span>
          </span>
          <span className="leading-none">
            <span className="block font-display text-[15px] font-bold tracking-tight text-foreground">
              Zee&nbsp;CV
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Maker
            </span>
          </span>
        </Link>
        {badge && (
          <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground ring-1 ring-border">
            {badge}
          </span>
        )}
      </header>

      <main className="relative z-10 flex-1 px-4 pb-6">{children}</main>

      <nav className="print-hide sticky bottom-0 z-20 shrink-0 border-t border-border bg-background/85 px-3 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="grid grid-cols-4 gap-1">
          {TABS.map((tab, i) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: tab.to === "/" }}
              className="flex flex-col items-center gap-1 py-1 text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {({ isActive }) => (
                <>
                  <TabIcon index={i} active={isActive} />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
