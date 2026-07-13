// 공유용 결과 카드 (프레젠테이션). 화면 히어로 겸 캡처 대상.
// 배경은 '오늘의 행운색'(오행 2색)을 그라데이션으로 사용. 밝은 조합이면 글씨/타일을 자동으로 어둡게.
import type { FunToday } from "../lib/funtoday";
import { BRAND } from "../lib/brand";
import { luckyTheme } from "../lib/luckyColor";

function MiniStat({ emoji, label, score, tintBg }: { emoji: string; label: string; score: number; tintBg: string }) {
  return (
    <div style={{ flex: 1, background: tintBg, borderRadius: 16, padding: "11px 8px", textAlign: "center" }}>
      <div style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</div>
      <div style={{ fontSize: 11.5, opacity: .95, marginTop: 5 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 800, marginTop: 1 }}>{score}</div>
    </div>
  );
}

export default function ShareCard({ data, name, id = "share-card" }: { data: FunToday; name?: string; id?: string }) {
  const { grad, ink, tint } = luckyTheme(data.luck.color);
  return (
    <div
      id={id}
      style={{
        position: "relative", width: "100%", maxWidth: 360, margin: "0 auto",
        background: grad, color: ink, borderRadius: 26, padding: 24,
        boxShadow: "0 14px 40px rgba(32,31,30,.22)", overflow: "hidden",
        fontFamily: '"Pretendard", -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
      }}
    >
      {/* 상단 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, opacity: .95 }}>
        <span style={{ fontWeight: 800 }}>{BRAND.logo} {BRAND.name}</span>
        <span>{data.dateText} ({data.weekday})</span>
      </div>

      {/* 중앙: 점수 */}
      <div style={{ textAlign: "center", padding: "14px 0 6px" }}>
        <div style={{ fontSize: 52, lineHeight: 1 }}>{data.emoji}</div>
        <div style={{ fontSize: 14, marginTop: 12, opacity: .95 }}>{name ? `${name}님의 오늘 총운` : "오늘의 총운"}</div>
        <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, marginTop: 2 }}>
          {data.score}<span style={{ fontSize: 24, fontWeight: 800, opacity: .85 }}>점</span>
        </div>
        <div style={{
          display: "inline-block", marginTop: 10, background: tint(.22),
          borderRadius: 999, padding: "6px 16px", fontSize: 15, fontWeight: 800,
        }}>
          {data.keyword}
        </div>
      </div>

      {/* 한 줄 */}
      <div style={{ fontSize: 13, lineHeight: 1.6, textAlign: "center", opacity: .96, margin: "10px 4px 16px" }}>
        “{data.headline}”
      </div>

      {/* 애정·금전·직장 */}
      <div style={{ display: "flex", gap: 8 }}>
        {data.cats.map((c) => <MiniStat key={c.key} emoji={c.emoji} label={c.label} score={c.score} tintBg={tint(.18)} />)}
      </div>

      {/* 행운 */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <div style={{ flex: 1, background: tint(.14), borderRadius: 14, padding: "10px 12px", fontSize: 12.5 }}>
          <div style={{ opacity: .85 }}>🎨 행운색</div><div style={{ fontWeight: 800, marginTop: 2 }}>{data.luck.color}</div>
        </div>
        <div style={{ flex: 1, background: tint(.14), borderRadius: 14, padding: "10px 12px", fontSize: 12.5 }}>
          <div style={{ opacity: .85 }}>🔢 행운수</div><div style={{ fontWeight: 800, marginTop: 2 }}>{data.luck.num}</div>
        </div>
      </div>
      <div style={{ background: tint(.14), borderRadius: 14, padding: "10px 12px", fontSize: 12.5, marginTop: 8 }}>
        <div style={{ opacity: .85 }}>🎁 행운 아이템</div><div style={{ fontWeight: 800, marginTop: 2 }}>{data.luck.item}</div>
      </div>

      <div style={{ textAlign: "center", fontSize: 11, opacity: .8, marginTop: 16 }}>
        {data.zodiac}띠 · {data.starSign} · {BRAND.name}에서 내 운세 확인
      </div>
    </div>
  );
}
