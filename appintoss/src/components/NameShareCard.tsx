// 이름 궁합 공유용 결과 카드 (프레젠테이션 · 캡처 대상).
// 캡처 안정성을 위해 전부 인라인 스타일 + 자체 배경(그라데이션)으로 구성.
import { BRAND } from "../lib/brand";

export default function NameShareCard({ a, b, score, verdict, id = "name-share-card" }: {
  a: string; b: string; score: number; verdict: string; id?: string;
}) {
  return (
    <div
      id={id}
      style={{
        position: "relative", width: "100%", maxWidth: 360, margin: "0 auto",
        background: "linear-gradient(150deg,#eab98a,#e0a06a 48%,#d1897a)", color: "#fff",
        borderRadius: 26, padding: 24, boxShadow: "0 14px 40px rgba(226,120,150,.28)", overflow: "hidden",
        fontFamily: '"Pretendard", -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
      }}
    >
      {/* 상단 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, opacity: .95 }}>
        <span style={{ fontWeight: 800 }}>{BRAND.logo} {BRAND.name}</span>
        <span>💑 이름 궁합</span>
      </div>

      {/* 중앙: 두 이름 + 점수 */}
      <div style={{ textAlign: "center", padding: "16px 0 6px" }}>
        <div style={{ fontSize: 44, lineHeight: 1 }}>💞</div>
        <div style={{ fontSize: 17, fontWeight: 800, marginTop: 12, letterSpacing: "-0.02em" }}>
          {a} <span style={{ opacity: .85, fontWeight: 700 }}>♥</span> {b}
        </div>
        <div style={{ fontSize: 66, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, marginTop: 6 }}>
          {score}<span style={{ fontSize: 26, fontWeight: 800, opacity: .85 }}>%</span>
        </div>
      </div>

      {/* 게이지 */}
      <div style={{ background: "rgba(255,255,255,.22)", borderRadius: 999, height: 12, margin: "6px 6px 14px", overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: "rgba(255,255,255,.92)", borderRadius: 999 }} />
      </div>

      {/* 한 줄 평 */}
      <div style={{
        display: "block", textAlign: "center", background: "rgba(255,255,255,.2)", borderRadius: 16,
        padding: "12px 14px", fontSize: 14.5, fontWeight: 800, lineHeight: 1.5,
      }}>
        {verdict}
      </div>

      <div style={{ textAlign: "center", fontSize: 11, opacity: .8, marginTop: 16 }}>
        전통 한글 획수 궁합 · {BRAND.name}에서 확인
      </div>
    </div>
  );
}
