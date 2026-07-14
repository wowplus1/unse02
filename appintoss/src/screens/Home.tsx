import { useState } from "react";
import type { Profile, View } from "../lib/appTypes";
import { funToday } from "../lib/funtoday";
import ProfileBar from "../components/ProfileBar";
import ShareCard from "../components/ShareCard";
import CaptureShare from "../components/CaptureShare";
import ExpandableText from "../components/ExpandableText";
import UnlockGate from "../components/UnlockGate";
import UnlockModal from "../components/UnlockModal";
import BannerAd from "../components/BannerAd";
import { isUnlockedToday, setUnlockedToday, UNLOCK_RANKING, UNLOCK_FUN } from "../lib/unlock";

type Gate = null | "detail" | "ranking" | "fun";

export default function Home({ profile, onEdit, onDelete, onNavigate }: {
  profile: Profile; onEdit: () => void; onDelete: () => void; onNavigate: (v: View) => void;
}) {
  const ft = funToday(profile);
  const [unlocked, setUnlocked] = useState(() => isUnlockedToday());
  const [gate, setGate] = useState<Gate>(null);

  // 오늘 이미 언락했으면 바로 이동, 아니면 광고 팝업
  const goRanking = () => (isUnlockedToday(UNLOCK_RANKING) ? onNavigate("ranking") : setGate("ranking"));
  const goFun = () => (isUnlockedToday(UNLOCK_FUN) ? onNavigate("fun") : setGate("fun"));
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
        <button className="card" onClick={goRanking} style={{ textAlign: "left", border: "1px solid var(--line2)", cursor: "pointer" }}>
          <div className="ico">🏆</div><div className="t">오늘의 랭킹</div><div className="d">띠·별자리 순위</div>
        </button>
        <button className="card" onClick={goFun} style={{ textAlign: "left", border: "1px solid var(--line2)", cursor: "pointer" }}>
          <div className="ico">🎲</div><div className="t">재미 운세</div><div className="d">로또·궁합·바이오리듬</div>
        </button>
      </div>

      {!unlocked ? (
        <div style={{ marginTop: 12 }}>
          <UnlockGate onOpen={() => setGate("detail")} />
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
              : <>
                  <div className="muted" style={{ fontSize: 13 }}>{c.line}</div>
                  <button onClick={() => setGate("detail")}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, background: "var(--accent-soft)", color: "var(--accent-ink)", border: "none", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    🔒 상세 풀이는 광고 보고
                  </button>
                </>
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
          <div className="card center" onClick={() => setGate("detail")}
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

      <UnlockModal
        open={gate !== null}
        onClose={() => setGate(null)}
        title={gate === "ranking" ? "오늘의 랭킹 열기" : gate === "fun" ? "재미 운세 열기" : "잠긴 운세 풀이"}
        desc={gate === "ranking"
          ? <>광고를 보면 오늘의 <b style={{ color: "var(--accent-ink)" }}>띠·별자리 랭킹</b>을<br />확인할 수 있어요.</>
          : gate === "fun"
            ? <>광고를 보면 <b style={{ color: "var(--accent-ink)" }}>재미 운세</b>(로또·궁합 등)를<br />즐길 수 있어요.</>
            : undefined}
        onUnlocked={() => {
          if (gate === "ranking") { setUnlockedToday(UNLOCK_RANKING); setGate(null); onNavigate("ranking"); }
          else if (gate === "fun") { setUnlockedToday(UNLOCK_FUN); setGate(null); onNavigate("fun"); }
          else { setUnlockedToday(); setUnlocked(true); setGate(null); }
        }}
      />
    </>
  );
}
