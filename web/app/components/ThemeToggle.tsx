"use client";
import { useEffect, useState } from "react";

// 라이트/다크 토글 — data-theme 을 <html>에 스탬프, localStorage 저장.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const saved = (localStorage.getItem("unse_theme") as "light" | "dark" | null);
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(saved ?? sys);
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("unse_theme", theme); } catch {}
  }, [theme]);

  return (
    <button className="theme-btn" aria-label="테마 전환" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
