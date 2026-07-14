import type { Profile } from "../lib/appTypes";
import BannerAd from "../components/BannerAd";
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
    const { main, bonus } = luckyNumbers(seed);
    result = (
      <div className="panel">
        <div className="chips"><span className="chip"><b>{now.getFullYear()}.{now.getMonth() + 1}.{now.getDate()}</b> 행운 번호</span></div>
        <div style={{ background: "radial-gradient(120% 90% at 50% 0%, var(--card-soft), var(--soft))", borderRadius: 18, border: "1px solid var(--line2)", padding: "22px 12px 20px", marginTop: 8 }}>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
            {main.map((n) => <Ball key={n} n={n} />)}
            <span style={{ fontSize: 24, color: "var(--muted)", fontWeight: 800, margin: "0 1px" }}>＋</span>
            <span style={{ position: "relative", display: "inline-flex" }}>
              <Ball n={bonus} bonus />
              <span style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", fontSize: 9, fontWeight: 800, color: "#fff", background: "#c77dff", borderRadius: 999, padding: "1px 6px", whiteSpace: "nowrap", boxShadow: "0 2px 5px rgba(0,0,0,.2)" }}>보너스</span>
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 16, fontSize: 10.5, color: "var(--muted)", flexWrap: "wrap" }}>
            {[["1–10", "#f4b63e"], ["11–20", "#5aa9e6"], ["21–30", "#ec6b6b"], ["31–40", "#9aa0a6"], ["41–45", "#79c079"]].map(([lab, c]) => (
              <span key={lab} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 9, height: 9, borderRadius: 999, background: c as string }} />{lab}
              </span>
            ))}
          </div>
        </div>
        <div className="note">※ 생년월일과 오늘 날짜로 계산한 행운 번호입니다. 매일 바뀌며 재미로 즐겨주세요.</div>
      </div>
    );
  }
  return (
    <>
      <button className="back" onClick={onBack}>← 재미</button>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>🔢 행운의 번호</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 8px" }}>생년월일로 오늘의 로또 번호(6+보너스)를 뽑아요</p>
      </section>
      {result || <div className="panel center muted">먼저 <b>오늘</b> 탭에서 생년월일을 등록해 주세요.</div>}
      <BannerAd />
    </>
  );
}
