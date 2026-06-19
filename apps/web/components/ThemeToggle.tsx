"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("vm-dashboard-theme") === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem("vm-dashboard-theme", theme);
  }, [theme]);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }

  const isLight = theme === "light";

  return (
    <button
      aria-label={isLight ? "Bytt til dark mode" : "Bytt til light mode"}
      className="theme-toggle"
      onClick={toggleTheme}
      suppressHydrationWarning
      type="button"
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
      <span>{isLight ? "Dark" : "Light"}</span>
    </button>
  );
}
