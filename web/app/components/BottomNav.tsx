"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TABS = [
  { href: "/", ico: "🏠", label: "오늘" },
  { href: "/ranking", ico: "🏆", label: "랭킹" },
  { href: "/fun", ico: "🎲", label: "재미" },
];

export default function BottomNav() {
  const path = usePathname() || "/";
  const [qs, setQs] = useState("");

  // 현재 URL의 프로필 파라미터를 탭 링크에 이어붙여 새로고침/재입력 없이 이동
  useEffect(() => {
    const cur = new URLSearchParams(window.location.search);
    const keep = new URLSearchParams();
    for (const k of ["y", "m", "d", "h", "g", "cal"]) {
      const v = cur.get(k);
      if (v !== null) keep.set(k, v);
    }
    const s = keep.toString();
    setQs(s ? `?${s}` : "");
  }, [path]);

  const isOn = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <Link key={t.href} href={`${t.href}${qs}`} prefetch className={isOn(t.href) ? "on" : ""}>
          <span className="ti">{t.ico}</span>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
