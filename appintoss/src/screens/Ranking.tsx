import { useState } from "react";
import type { Profile } from "../lib/appTypes";
import { sajuFrom } from "../lib/profile";
import { ddiRanking, starRanking, RankRow } from "../lib/funtoday";
import BannerAd from "../components/BannerAd";

function medal(rank: number) { return rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : `${rank + 1}`; }

export default function Ranking({ profile, onBack }: {
  profile: Profile | null; onEdit?: () => void; onDelete?: () => void; onBack: () => void;
}) {
  const [tab, setTab] = useState<"ddi" | "star">("ddi");
  const [open, setOpen] = useState<number | null>(null);
  const rows = tab === "star" ? starRanking() : ddiRanking();
  const now = new Date();
  let mine = "";
  if (profile) { const p = sajuFrom(profile); mine = tab === "star" ? p.starSign : p.zodiac + "띠"; }

  return (
    <>
      <button className="back" onClick={onBack}>← 오늘</button>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>🏆 오늘의 랭킹</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>{now.getMonth() + 1}월 {now.getDate()}일 · 오늘 운세가 좋은 순서</p>
      </section>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {(["ddi", "star"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setOpen(null); }}
            style={{
              flex: 1, padding: "14px 0", borderRadius: 15, fontSize: 15.5, fontWeight: 800, cursor: "pointer",
              border: tab === t ? "none" : "1px solid var(--line2)",
              background: tab === t ? "var(--grad-brand)" : "var(--card)",
              color: tab === t ? "#201f1e" : "var(--muted)",
              boxShadow: tab === t ? "0 6px 16px rgba(240,181,63,.28)" : "none",
            }}>
            {t === "ddi" ? "🐭 띠별" : "⭐ 별자리"}
          </button>
        ))}
      </div>

      <div className="panel" style={{ padding: 12 }}>
        {rows.map((r: RankRow, i) => {
          const isMine = !!mine && r.label === mine;
          const isOpen = open === r.idx;
          return (
            <div key={r.idx}>
              <div className="rankrow" onClick={() => setOpen(isOpen ? null : r.idx)}
                style={{ cursor: "pointer", ...(isMine ? { background: "var(--accent-soft)", borderColor: "transparent" } : {}), ...(isOpen ? { borderColor: "var(--accent)" } : {}) }}>
                <span className="rk">{medal(i)}</span>
                <span className="em">{r.emoji}</span>
                <span className="nm">{r.label}{isMine && <b style={{ color: "var(--accent-ink)", fontSize: 11, marginLeft: 6 }}>내 순위</b>}</span>
                <span className="kw muted">{r.keyword}</span>
                <span className="sc">{r.score}점</span>
                <span style={{ marginLeft: 6, color: "var(--muted)", fontSize: 12, flex: "none" }}>{isOpen ? "▴" : "▾"}</span>
              </div>
              {isOpen && (
                <div style={{ background: "var(--soft)", border: "1px solid var(--line2)", borderRadius: 14, padding: "13px 15px", margin: "2px 2px 9px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{r.emoji}</span>
                    <b style={{ fontSize: 15 }}>{r.label} 오늘의 운세</b>
                    <span className="sc" style={{ marginLeft: "auto" }}>{r.score}점</span>
                  </div>
                  <p style={{ margin: "0 0 10px", fontSize: 13.5, lineHeight: 1.65 }}>
                    <b style={{ color: "var(--accent-ink)" }}>{r.reading.trait}</b> {r.reading.summary}
                  </p>
                  <div style={{ display: "grid", gap: 6, fontSize: 13, lineHeight: 1.55 }}>
                    <div>💗 <b>애정</b> · {r.reading.love}</div>
                    <div>💰 <b>금전</b> · {r.reading.money}</div>
                    <div>💼 <b>직장</b> · {r.reading.work}</div>
                  </div>
                  <div style={{ marginTop: 10, padding: "8px 11px", borderRadius: 10, background: "var(--accent-soft)", color: "var(--accent-ink)", fontSize: 12.5, fontWeight: 600 }}>
                    ✨ {r.reading.tip}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!profile && <p className="center muted" style={{ fontSize: 12.5, marginTop: 12 }}>생년월일을 등록하면 내 띠·별자리를 하이라이트해 드려요</p>}
      <BannerAd />
    </>
  );
}
