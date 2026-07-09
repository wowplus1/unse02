import type { Profile } from "../lib/appTypes";
import BannerAd from "../components/BannerAd";
import { biorhythm } from "../lib/fun";

function Bar({ label, v, color }: { label: string; v: number; color: string }) {
  const pct = (v + 100) / 2;
  const state = v > 40 ? "좋음" : v < -40 ? "저조" : "보통";
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
        <span style={{ fontWeight: 700 }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{v > 0 ? "+" : ""}{v}% · {state}</span>
      </div>
      <div className="bar"><div className="fill" style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  );
}

export default function Bio({ profile, onBack }: { profile: Profile | null; onBack: () => void }) {
  const now = new Date();
  let result = null;
  if (profile) {
    const b = biorhythm(profile.y, profile.m, profile.d, now);
    const avg = Math.round((b.physical + b.emotional + b.intellectual) / 3);
    result = (
      <div className="panel">
        <div className="chips">
          <span className="chip"><b>{now.getFullYear()}.{now.getMonth() + 1}.{now.getDate()}</b> 기준</span>
          <span className="chip">태어난 지 <b>{b.days.toLocaleString()}일</b></span>
          <span className="chip">종합 <b>{avg > 0 ? "+" : ""}{avg}%</b></span>
        </div>
        <Bar label="🏃 신체 리듬 (23일)" v={b.physical} color="var(--accent)" />
        <Bar label="💗 감정 리듬 (28일)" v={b.emotional} color="var(--lavender)" />
        <Bar label="🧠 지성 리듬 (33일)" v={b.intellectual} color="var(--sky)" />
        <div className="note">※ 생년월일로부터의 경과일을 주기(23·28·33일)로 계산한 값입니다.</div>
      </div>
    );
  }
  return (
    <>
      <button className="back" onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>← 재미</button>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>📈 바이오리듬</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 8px" }}>오늘의 신체·감정·지성 컨디션을 확인해요</p>
      </section>
      {result || <div className="panel center muted">먼저 <b>오늘</b> 탭에서 생년월일을 등록해 주세요.</div>}
      <BannerAd />
    </>
  );
}
