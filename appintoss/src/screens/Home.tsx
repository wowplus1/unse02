import { useState } from "react";
import type { Profile, View } from "../lib/appTypes";
import { funToday } from "../lib/funtoday";
import ProfileBar from "../components/ProfileBar";
import ShareCard from "../components/ShareCard";
import CaptureShare from "../components/CaptureShare";
import ExpandableText from "../components/ExpandableText";
import UnlockModal from "../components/UnlockModal";
import BannerAd from "../components/BannerAd";
import { isUnlockedToday, setUnlockedToday } from "../lib/unlock";

export default function Home({ profile, onEdit, onDelete, onNavigate }: {
  profile: Profile; onEdit: () => void; onDelete: () => void; onNavigate: (v: View) => void;
}) {
  const ft = funToday(profile);
  const [unlocked, setUnlocked] = useState(() => isUnlockedToday());
  const [detailGate, setDetailGate] = useState(false);
  return (
    <>
      <section style={{ padding: "10px 2px 6px" }}>
        <div className="muted" style={{ fontSize: 13 }}>{ft.dateText} ({ft.weekday}) · 오늘의 운세</div>
        <h2 style={{ fontSize: 22, margin: "4px 0 0", letterSpacing: "-0.03em", fontWeight: 800 }}>
          {ft.emoji} 오늘은 <span style={{ color: "var(--accent-ink)" }}>{ft.keyword}</span>
        </h2>
      </section>

      <ProfileBar profile={profile} onEdit={onEdit} onDelete={onDelete} />

      <div className="grid" style={{ marginTop: 12 }}>
        <button className="card" onClick={() => onNavigate("ranking")}
          style={{ textAlign: "left", border: "none", cursor: "pointer", color: "#3a2c0c", position: "relative", background: "linear-gradient(145deg,#ffe09a,#f4bd4e)", boxShadow: "0 7px 18px rgba(240,181,63,.32)" }}>
          <div style={{ fontSize: 26, width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>🏆</div>
          <div style={{ fontWeight: 800, fontSize: 16, marginTop: 12, letterSpacing: "-0.02em" }}>오늘의 랭킹</div>
          <div style={{ fontSize: 12.5, marginTop: 3, opacity: .72 }}>띠·별자리 순위</div>
          <span style={{ position: "absolute", top: 16, right: 16, fontSize: 17, fontWeight: 800, opacity: .55 }}>→</span>
        </button>
        <button className="card" onClick={() => onNavigate("fun")}
          style={{ textAlign: "left", border: "none", cursor: "pointer", color: "#3a1f12", position: "relative", background: "linear-gradient(145deg,#f7bda2,#ec8f6f)", boxShadow: "0 7px 18px rgba(236,143,111,.32)" }}>
          <div style={{ fontSize: 26, width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>🎲</div>
          <div style={{ fontWeight: 800, fontSize: 16, marginTop: 12, letterSpacing: "-0.02em" }}>재미 운세</div>
          <div style={{ fontSize: 12.5, marginTop: 3, opacity: .72 }}>로또·궁합·바이오리듬</div>
          <span style={{ position: "absolute", top: 16, right: 16, fontSize: 17, fontWeight: 800, opacity: .55 }}>→</span>
        </button>
      </div>

      <div style={{ marginTop: 14 }}><ShareCard data={ft} name={profile.name} /></div>
      <div style={{ marginTop: 12 }}><CaptureShare /></div>

      <div className="sec">🍀 오늘의 핵심운</div>
      <div className="panel" style={{ padding: "12px 12px 1px" }}>
      <div className="reading">
        {ft.cats.map((c) => (
          <div className="item" key={c.key}>
            <div className="h">
              <span className="name">{c.emoji} {c.label}</span>
              <span className="score">{c.score}점</span>
            </div>
            <div className="bar" style={{ margin: "2px 0 8px" }}><div className="fill" style={{ width: `${c.score}%` }} /></div>
            {c.full && (unlocked
              ? <ExpandableText text={c.full} />
              : <>
                  <div className="muted" style={{ fontSize: 13 }}>{c.line}</div>
                  <button onClick={() => setDetailGate(true)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, background: "var(--accent-soft)", color: "var(--accent-ink)", border: "none", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    🔒 상세 풀이는 광고 보고
                  </button>
                </>
            )}
          </div>
        ))}
      </div>
      </div>

      {ft.more.length > 0 && (unlocked ? (
        <>
          <div className="sec">📖 오늘의 운세 더보기</div>
          <div className="panel" style={{ padding: "12px 12px 1px" }}>
          <div className="reading">
            {ft.more.map((m) => (
              <div className="item" key={m.key}>
                <div className="h"><span className="name">{m.emoji} {m.label}</span></div>
                <ExpandableText text={m.full} />
              </div>
            ))}
          </div>
          </div>
        </>
      ) : (
        <>
          <div className="sec">📖 오늘의 운세 더보기</div>
          <div className="card center" onClick={() => setDetailGate(true)}
            style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)", padding: "20px 16px", cursor: "pointer" }}>
            <div style={{ fontSize: 30, lineHeight: 1 }}>🔒</div>
            <div style={{ fontWeight: 800, fontSize: 15, marginTop: 8 }}>
              <b style={{ color: "var(--accent-ink)" }}>{ft.more.map((m) => m.label).join(" · ")}</b> 잠금
            </div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>광고 보면 오늘 더보기 풀이가 모두 열려요</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 13, background: "var(--grad-brand)", color: "#201f1e", fontWeight: 800, fontSize: 14, padding: "11px 20px", borderRadius: 13, boxShadow: "0 6px 16px rgba(240,181,63,.35)" }}>
              🎬 광고 보고 열기
            </div>
          </div>
        </>
      ))}

      <div className="sec">🎁 오늘의 행운템</div>
      <div className="panel" style={{ padding: 12 }}>
        <div className="grid3" style={{ gap: 9 }}>
          <div className="card center" style={{ background: "var(--sky-soft)", border: "1px solid var(--line2)", padding: "14px 8px" }}>
            <div style={{ fontSize: 22, lineHeight: 1 }}>🎨</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 5, fontWeight: 700 }}>행운색</div>
            <div style={{ fontWeight: 800, fontSize: 14, marginTop: 2 }}>{ft.luck.color}</div>
          </div>
          <div className="card center" style={{ background: "var(--butter-soft)", border: "1px solid var(--line2)", padding: "14px 8px" }}>
            <div style={{ fontSize: 22, lineHeight: 1 }}>🔢</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 5, fontWeight: 700 }}>행운수</div>
            <div style={{ fontWeight: 800, fontSize: 14, marginTop: 2 }}>{ft.luck.num}</div>
          </div>
          <div className="card center" style={{ background: "var(--mint-soft)", border: "1px solid var(--line2)", padding: "14px 8px" }}>
            <div style={{ fontSize: 22, lineHeight: 1 }}>🎁</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 5, fontWeight: 700 }}>아이템</div>
            <div style={{ fontWeight: 800, fontSize: 12.5, marginTop: 2 }}>{ft.luck.item}</div>
          </div>
        </div>
      </div>

      {/* 정책: 스크롤 화면 하단 배너 */}
      <BannerAd />

      <UnlockModal
        open={detailGate}
        onClose={() => setDetailGate(false)}
        onUnlocked={() => { setUnlockedToday(); setUnlocked(true); setDetailGate(false); }}
      />
    </>
  );
}
