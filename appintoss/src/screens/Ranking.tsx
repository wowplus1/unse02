import { useState } from "react";
import type { Profile } from "../lib/appTypes";
import { sajuFrom } from "../lib/profile";
import { ddiRanking, starRanking, RankRow } from "../lib/funtoday";
import ProfileBar from "../components/ProfileBar";

function medal(rank: number) { return rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : `${rank + 1}`; }

export default function Ranking({ profile, onEdit, onDelete, onBack }: {
  profile: Profile | null; onEdit: () => void; onDelete: () => void; onBack: () => void;
}) {
  const [tab, setTab] = useState<"ddi" | "star">("ddi");
  const rows = tab === "star" ? starRanking() : ddiRanking();
  const now = new Date();
  let mine = "";
  if (profile) { const p = sajuFrom(profile); mine = tab === "star" ? p.starSign : p.zodiac + "띠"; }

  return (
    <>
      <button className="back" onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>← 오늘</button>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>🏆 오늘의 랭킹</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>{now.getMonth() + 1}월 {now.getDate()}일 · 오늘 운세가 좋은 순서</p>
      </section>

      {profile && <ProfileBar profile={profile} onEdit={onEdit} onDelete={onDelete} />}

      <div className="chips" style={{ marginTop: 12 }}>
        {(["ddi", "star"] as const).map((t) => (
          <button key={t} className="chip" onClick={() => setTab(t)}
            style={{ cursor: "pointer", ...(tab === t ? { background: "var(--accent-soft)", color: "var(--accent-ink)", borderColor: "transparent", fontWeight: 700 } : {}) }}>
            {t === "ddi" ? "🐭 띠별" : "⭐ 별자리"}
          </button>
        ))}
      </div>

      <div className="panel" style={{ padding: 12 }}>
        {rows.map((r: RankRow, i) => {
          const isMine = !!mine && r.label === mine;
          return (
            <div key={r.idx} className="rankrow" style={isMine ? { background: "var(--accent-soft)", borderColor: "transparent" } : {}}>
              <span className="rk">{medal(i)}</span>
              <span className="em">{r.emoji}</span>
              <span className="nm">{r.label}{isMine && <b style={{ color: "var(--accent-ink)", fontSize: 11, marginLeft: 6 }}>내 순위</b>}</span>
              <span className="kw muted">{r.keyword}</span>
              <span className="sc">{r.score}점</span>
            </div>
          );
        })}
      </div>
      {!profile && <p className="center muted" style={{ fontSize: 12.5, marginTop: 12 }}>생년월일을 등록하면 내 띠·별자리를 하이라이트해 드려요</p>}
    </>
  );
}
