import type { Profile } from "../lib/appTypes";
import BannerAd from "../components/BannerAd";
import { luckyNumbers } from "../lib/fun";
import { julianOf } from "../lib/tojeong";

function Ball({ n, bonus }: { n: number; bonus?: boolean }) {
  const bg = bonus ? "var(--peach)" : n <= 10 ? "var(--butter)" : n <= 20 ? "var(--sky)" : n <= 30 ? "var(--accent)" : n <= 40 ? "var(--oh-geum)" : "var(--mint)";
  return <span style={{ display: "inline-flex", width: 44, height: 44, borderRadius: "50%", background: bg, color: "#fff", fontWeight: 800, alignItems: "center", justifyContent: "center", fontSize: 16 }}>{n}</span>;
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
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center", justifyContent: "center", margin: "18px 0" }}>
          {main.map((n) => <Ball key={n} n={n} />)}<span className="muted">＋</span><Ball n={bonus} bonus />
        </div>
        <div className="note" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>※ 생년월일과 오늘 날짜로 계산한 행운 번호입니다. 매일 바뀌며 재미로 즐겨주세요.</div>
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
