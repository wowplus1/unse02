import type { View } from "../lib/appTypes";

// 스크롤해도 상단에 고정되는 홈/랭킹/재미 탭. (게이트 처리는 상위 onNav에서)
const TABS: { key: View; label: string }[] = [
  { key: "home", label: "홈" },
  { key: "ranking", label: "오늘의 랭킹" },
  { key: "fun", label: "재미 운세" },
];

export default function TopNav({ current, onNav }: { current: View; onNav: (v: View) => void }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", gap: 8, padding: "8px 0 10px", marginBottom: 6, background: "var(--bg)", borderBottom: "1px solid var(--line2)" }}>
      {TABS.map((t) => {
        const on = current === t.key;
        return (
          <button key={t.key} onClick={() => onNav(t.key)}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 13, fontSize: 13.5, fontWeight: 800, cursor: "pointer",
              border: on ? "none" : "1px solid var(--line2)",
              background: on ? "var(--grad-brand)" : "var(--card)",
              color: on ? "#201f1e" : "var(--muted)",
              boxShadow: on ? "0 5px 14px rgba(240,181,63,.28)" : "none",
            }}>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
