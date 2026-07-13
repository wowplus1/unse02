import { useState } from "react";
import type { Profile, View } from "../lib/appTypes";
import { funToday } from "../lib/funtoday";
import ProfileBar from "../components/ProfileBar";
import ShareCard from "../components/ShareCard";
import CaptureShare from "../components/CaptureShare";
import ExpandableText from "../components/ExpandableText";
import UnlockGate from "../components/UnlockGate";
import BannerAd from "../components/BannerAd";
import { getPoints } from "../lib/points";
import { isUnlockedToday } from "../lib/unlock";

export default function Home({ profile, onEdit, onDelete, onNavigate }: {
  profile: Profile; onEdit: () => void; onDelete: () => void; onNavigate: (v: View) => void;
}) {
  const ft = funToday(profile);
  const [points, setPoints] = useState(() => getPoints());
  const [unlocked, setUnlocked] = useState(() => isUnlockedToday());
  return (
    <>
      <section style={{ padding: "10px 2px 6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="muted" style={{ fontSize: 13 }}>{ft.dateText} ({ft.weekday}) · 오늘의 운세</div>
          <span className="chip" style={{ fontWeight: 700 }}>🪙 {points.toLocaleString()}P</span>
        </div>
        <h2 style={{ fontSize: 22, margin: "4px 0 0", letterSpacing: "-0.03em", fontWeight: 800 }}>
          {ft.emoji} 오늘은 <span style={{ color: "var(--accent-ink)" }}>{ft.keyword}</span>
        </h2>
      </section>

      <ProfileBar profile={profile} onEdit={onEdit} onDelete={onDelete} />

      <div className="sec">🎉 더 즐기기</div>
      <div className="grid">
        <button className="card" onClick={() => onNavigate("ranking")} style={{ textAlign: "left", border: "1px solid var(--line2)", cursor: "pointer" }}>
          <div className="ico">🏆</div><div className="t">오늘의 랭킹</div><div className="d">띠·별자리 순위</div>
        </button>
        <button className="card" onClick={() => onNavigate("fun")} style={{ textAlign: "left", border: "1px solid var(--line2)", cursor: "pointer" }}>
          <div className="ico">🎲</div><div className="t">재미 운세</div><div className="d">로또·궁합·바이오리듬</div>
        </button>
      </div>

      {!unlocked ? (
        <div style={{ marginTop: 12 }}>
          <UnlockGate onUnlock={(p) => { setPoints(p); setUnlocked(true); }} />
        </div>
      ) : (
        <div className="card" style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, background: "var(--soft)", border: "1px solid var(--line2)" }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14 }}>오늘 운세 전체 열림</div>
            <div className="muted" style={{ fontSize: 12 }}>상세 풀이·더보기까지 모두 확인할 수 있어요</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 14 }}><ShareCard data={ft} name={profile.name} /></div>
      <div style={{ marginTop: 12 }}><CaptureShare /></div>

      <div className="sec">🍀 오늘의 핵심운</div>
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
              : <div className="muted" style={{ fontSize: 13 }}>{c.line} <span style={{ color: "var(--accent-ink)", fontWeight: 700 }}>🔒 상세 풀이는 리워드로</span></div>
            )}
          </div>
        ))}
      </div>

      {ft.more.length > 0 && (unlocked ? (
        <>
          <div className="sec">📖 오늘의 운세 더보기</div>
          <div className="reading">
            {ft.more.map((m) => (
              <div className="item" key={m.key}>
                <div className="h"><span className="name">{m.emoji} {m.label}</span></div>
                <ExpandableText text={m.full} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="sec">📖 오늘의 운세 더보기</div>
          <div className="card center muted" style={{ background: "var(--soft)", border: "1px dashed var(--line2)", fontSize: 13, padding: 16 }}>
            🔒 리워드 보고 <b style={{ color: "var(--accent-ink)" }}>{ft.more.map((m) => m.label).join(" · ")}</b>까지 열어보세요
          </div>
        </>
      ))}

      <div className="sec">🎁 오늘의 행운템</div>
      <div className="grid3">
        <div className="card center" style={{ background: "var(--sky-soft)", border: "none", padding: 14 }}>
          <div className="muted" style={{ fontSize: 11 }}>행운색</div>
          <div style={{ fontWeight: 800, fontSize: 14, marginTop: 3 }}>{ft.luck.color}</div>
        </div>
        <div className="card center" style={{ background: "var(--butter-soft)", border: "none", padding: 14 }}>
          <div className="muted" style={{ fontSize: 11 }}>행운수</div>
          <div style={{ fontWeight: 800, fontSize: 14, marginTop: 3 }}>{ft.luck.num}</div>
        </div>
        <div className="card center" style={{ background: "var(--mint-soft)", border: "none", padding: 14 }}>
          <div className="muted" style={{ fontSize: 11 }}>아이템</div>
          <div style={{ fontWeight: 800, fontSize: 13, marginTop: 3 }}>{ft.luck.item}</div>
        </div>
      </div>

      {/* 정책: 스크롤 화면 하단 배너 */}
      <BannerAd />
    </>
  );
}
