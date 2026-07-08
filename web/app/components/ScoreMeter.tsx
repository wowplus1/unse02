// 길흉 점수(0~10) 게이지 — 서버 컴포넌트.
export default function ScoreMeter({ score, label }: { score: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, (score / 10) * 100));
  return (
    <div className="meter">
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
          <span className="muted">{label}</span>
          <b style={{ color: "var(--accent-ink)" }}>{score}/10</b>
        </div>
      )}
      <div className="bar"><div className="fill" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
