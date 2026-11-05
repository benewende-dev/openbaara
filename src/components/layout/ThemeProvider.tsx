"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemePref = "light" | "dark" | "system";

const ThemeContext = createContext<{
  pref: ThemePref;
  mounted: boolean;
  setPref: (pref: ThemePref) => void;
}>({ pref: "system", mounted: false, setPref: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

const query = "(prefers-color-scheme: dark)";

function apply(pref: ThemePref) {
  const dark = pref === "dark" || (pref === "system" && window.matchMedia(query).matches);
  document.documentElement.classList.toggle("dark", dark);
}

// Choix enregistré dans localStorage ("ob-theme") ; sans choix, on suit le système.
// Le script en tête de page applique la classe avant le rendu pour éviter un flash.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let stored: ThemePref = "system";
    try {
      const v = localStorage.getItem("ob-theme");
      if (v === "light" || v === "dark") stored = v;
    } catch {}
    // Lecture de localStorage, impossible côté serveur : setState voulu au montage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefState(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    apply(pref);
    if (pref !== "system") return;
    const mq = window.matchMedia(query);
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pref, mounted]);

  const setPref = (next: ThemePref) => {
    setPrefState(next);
    try {
      if (next === "system") localStorage.removeItem("ob-theme");
      else localStorage.setItem("ob-theme", next);
    } catch {}
  };

  return <ThemeContext.Provider value={{ pref, mounted, setPref }}>{children}</ThemeContext.Provider>;
}
