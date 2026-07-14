import type { View } from "../lib/appTypes";
import BannerAd from "../components/BannerAd";

const FUN: { v: View; ico: string; name: string; d: string }[] = [
  { v: "lotto", ico: "🔢", name: "행운의 번호", d: "오늘의 로또 6+보너스" },
  { v: "name", ico: "💑", name: "이름 궁합", d: "두 사람 이름 궁합 점수" },
  { v: "gunghap", ico: "💞", name: "궁합 보기", d: "두 사람 오행·띠 궁합" },
  { v: "bio", ico: "📈", name: "바이오리듬", d: "신체·감정·지성 컨디션" },
  { v: "juyeok", ico: "☯️", name: "주역 뽑기", d: "오늘의 괘 한 장" },
];

export default function Fun({ onNavigate, onBack }: { onNavigate: (v: View) => void; onBack: () => void }) {
  return (
    <>
      <button className="back" onClick={onBack}>← 오늘</button>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>🎲 재미 운세</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>가볍게 즐기는 오늘의 재미</p>
      </section>
      <div className="grid" style={{ marginTop: 14 }}>
        {FUN.map((f) => (
          <button className="card" key={f.v} onClick={() => onNavigate(f.v)} style={{ textAlign: "left", border: "1px solid var(--line2)", cursor: "pointer" }}>
            <div className="ico">{f.ico}</div>
            <div className="t">{f.name}</div>
            <div className="d">{f.d}</div>
          </button>
        ))}
      </div>
      <BannerAd />
    </>
  );
}
