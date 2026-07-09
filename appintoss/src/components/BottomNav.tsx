import type { View } from "../lib/appTypes";

const TABS: { v: View; ico: string; label: string }[] = [
  { v: "home", ico: "🏠", label: "오늘" },
  { v: "ranking", ico: "🏆", label: "랭킹" },
  { v: "fun", ico: "🎲", label: "재미" },
];
const FUN_SUB: View[] = ["fun", "lotto", "bio", "name", "gunghap", "juyeok"];

export default function BottomNav({ view, onNavigate }: { view: View; onNavigate: (v: View) => void }) {
  const isOn = (v: View) => (v === "fun" ? FUN_SUB.includes(view) : view === v);
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button key={t.v} onClick={() => onNavigate(t.v)} className={isOn(t.v) ? "on" : ""}
          style={{ background: isOn(t.v) ? "var(--accent-soft)" : "none", border: "none", cursor: "pointer" }}>
          <span className="ti">{t.ico}</span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
