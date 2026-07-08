"use client";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", ico: "🏠", label: "오늘" },
  { href: "/ranking", ico: "🏆", label: "랭킹" },
  { href: "/fun", ico: "🎲", label: "재미" },
];

export default function BottomNav() {
  const path = usePathname() || "/";
  const isOn = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <a key={t.href} href={t.href} className={isOn(t.href) ? "on" : ""}>
          <span className="ti">{t.ico}</span>
          {t.label}
        </a>
      ))}
    </nav>
  );
}
