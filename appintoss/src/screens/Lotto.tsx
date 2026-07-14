import type { Profile } from "../lib/appTypes";
import BannerAd from "../components/BannerAd";
import CaptureShare from "../components/CaptureShare";
import { BRAND } from "../lib/brand";
import { luckyNumbers } from "../lib/fun";
import { julianOf } from "../lib/tojeong";

// 번호대별 색(로또 관습) — 광택 있는 3D 볼로 표현
function ballColor(n: number, bonus?: boolean) {
  if (bonus) return "#c77dff";
  return n <= 10 ? "#f4b63e" : n <= 20 ? "#5aa9e6" : n <= 30 ? "#ec6b6b" : n <= 40 ? "#9aa0a6" : "#79c079";
}
function Ball({ n, bonus, size = 46 }: { n: number; bonus?: boolean; size?: number }) {
  const base = ballColor(n, bonus);
  return (
    <span style={{
      display: "inline-flex", width: size, height: size, borderRadius: "50%",
      background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,.9), rgba(255,255,255,0) 45%), ${base}`,
      boxShadow: "inset -3px -4px 7px rgba(0,0,0,.22), inset 2px 2px 4px rgba(255,255,255,.35), 0 4px 8px rgba(0,0,0,.16)",
      color: "#fff", fontWeight: 900, fontSize: size * 0.36,
      alignItems: "center", justifyContent: "center",
      textShadow: "0 1px 2px rgba(0,0,0,.3)", flex: "none",
    }}>{n}</span>
  );
}

export default function Lotto({ profile, onBack }: { profile: Profile | null; onBack: () => void }) {
  const now = new Date();
  let result = null;
  if (profile) {
    const todayJd = julianOf(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const seed = julianOf(profile.y, profile.m, profile.d, profile.cal) * 31 + todayJd;
    const { main } = luckyNumbers(seed);
    const BALL = 58, R = 66, S = 2 * (R + BALL / 2) + 6, c = S / 2;
    result = (
      <>
      <div className="panel" id="lotto-share-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: "var(--muted)", fontWeight: 700, marginBottom: 10 }}>
          <span>{BRAND.logo} {BRAND.name}{profile.name ? ` · ${profile.name}님` : ""}</span>
          <span>{now.getFullYear()}.{now.getMonth() + 1}.{now.getDate()}</span>
        </div>
        <div className="chips"><span className="chip"><b>{now.getFullYear()}.{now.getMonth() + 1}.{now.getDate()}</b> 행운 번호</span></div>
        <div style={{ background: "radial-gradient(120% 90% at 50% 0%, var(--card-soft), var(--soft))", borderRadius: 18, border: "1px solid var(--line2)", padding: "16px 12px", marginTop: 8 }}>
          {/* 6개 원형(촘촘) 배치 */}
          <div style={{ position: "relative", width: S, height: S, margin: "2px auto" }}>
            {main.map((n, i) => {
              const ang = (-90 + i * 60) * Math.PI / 180;
              const x = c + R * Math.cos(ang) - BALL / 2;
              const y = c + R * Math.sin(ang) - BALL / 2;
              return <span key={n} style={{ position: "absolute", left: x, top: y }}><Ball n={n} size={BALL} /></span>;
            })}
            {/* 중앙 라벨 */}
            <div style={{ position: "absolute", left: c - 30, top: c - 30, width: 60, height: 60, borderRadius: "50%", background: "var(--card)", border: "1px solid var(--line2)", boxShadow: "var(--shadow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🍀</div>
          </div>
        </div>
        <div className="note">※ 생년월일과 오늘 날짜로 계산한 행운 번호입니다. 매일 바뀌며 재미로 즐겨주세요.</div>
      </div>
      <div style={{ marginTop: 12 }}><CaptureShare targetId="lotto-share-card" fileName="행운번호.png" /></div>
      </>
    );
  }
  return (
    <>
      <button className="back" onClick={onBack}>← 재미</button>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>🔢 행운의 번호</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 8px" }}>생년월일로 오늘의 행운 번호 6개를 뽑아요</p>
      </section>
      {result || <div className="panel center muted">먼저 <b>오늘</b> 탭에서 생년월일을 등록해 주세요.</div>}
      <BannerAd />
    </>
  );
}
