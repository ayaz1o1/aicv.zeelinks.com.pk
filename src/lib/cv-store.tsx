import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { emptyCv, type CvData } from "./cv-types";
import { randomTheme, randomThemes, type CvTheme } from "./themes";

type Store = {
  cv: CvData;
  setCv: (cv: CvData) => void;
  themes: CvTheme[];
  shuffleThemes: () => void;
  themeId: string | null;
  selectTheme: (id: string) => void;
  activeTheme: CvTheme;
  hydrated: boolean;
};

const CvContext = createContext<Store | null>(null);

const KEY = "zeecv:v1";

export function CvProvider({ children }: { children: ReactNode }) {
  const [cv, setCvState] = useState<CvData>(emptyCv);
  const [themes, setThemes] = useState<CvTheme[]>([]);
  const [themeId, setThemeId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let restoredThemes: CvTheme[] | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { cv?: CvData; themes?: CvTheme[]; themeId?: string };
        if (parsed.cv) setCvState({ ...emptyCv, ...parsed.cv });
        if (parsed.themes?.length) restoredThemes = parsed.themes;
        if (parsed.themeId) setThemeId(parsed.themeId);
      }
    } catch {
      /* ignore corrupt storage */
    }
    const list = restoredThemes ?? randomThemes();
    setThemes(list);
    setThemeId((current) => current ?? list[0]?.id ?? null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ cv, themes, themeId }));
    } catch {
      /* storage full or unavailable */
    }
  }, [cv, themes, themeId, hydrated]);

  const value = useMemo<Store>(() => {
    const activeTheme =
      themes.find((t) => t.id === themeId) ?? themes[0] ?? randomTheme();
    return {
      cv,
      setCv: setCvState,
      themes,
      shuffleThemes: () => {
        const next = randomThemes();
        setThemes(next);
        setThemeId(next[0]?.id ?? null);
      },
      themeId,
      selectTheme: setThemeId,
      activeTheme,
      hydrated,
    };
  }, [cv, themes, themeId, hydrated]);

  return <CvContext.Provider value={value}>{children}</CvContext.Provider>;
}

export function useCv() {
  const ctx = useContext(CvContext);
  if (!ctx) throw new Error("useCv must be used inside CvProvider");
  return ctx;
}
