import { useMemo, useState } from "react";
import { castHexagram, drawGangtaegong } from "../lib/juyeok";
import { juyeokReadings, gangReading } from "../lib/content";
import { ReadingItem } from "../components/Reading";

function LineRow({ yang }: { yang: boolean }) {
  const bar = { height: 12, background: "var(--accent)", borderRadius: 4 } as const;
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "5px 0" }}>
      {yang ? <div style={{ ...bar, width: 124 }} /> : (<><div style={{ ...bar, width: 56 }} /><div style={{ ...bar, width: 56 }} /></>)}
    </div>
  );
}

export default function Juyeok({ onBack }: { onBack: () => void }) {
  const [seed, setSeed] = useState(0);
  const { hex, readings, gn, gang } = useMemo(() => {
    const hex = castHexagram();
    const gn = drawGangtaegong();
    return { hex, readings: juyeokReadings(hex.key), gn, gang: gangReading(gn) };
  }, [seed]);

  return (
    <>
      <button className="back" onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>← 재미</button>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>☯️ 주역 점보기</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>6효를 뽑아 세운 오늘의 괘</p>
      </section>
      <div className="panel">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 34 }}>{hex.upper.sym}{hex.lower.sym}</div>
          <div style={{ color: "var(--accent-ink)", fontWeight: 800, marginTop: 4 }}>상괘 {hex.upper.name} · 하괘 {hex.lower.name}</div>
          <div style={{ margin: "14px 0" }}>{[...hex.lines].reverse().map((y, i) => <LineRow key={i} yang={y} />)}</div>
        </div>
        <div className="reading">{readings.map((it, i) => <ReadingItem key={i} r={it} />)}</div>
        <button className="btn mt" onClick={() => setSeed((s) => s + 1)}>🎲 다시 뽑기</button>
      </div>
      {gang && (
        <>
          <div className="sec">🎏 강태공 100괘 — 제 {gn}괘</div>
          <div className="reading"><ReadingItem r={gang} hi /></div>
        </>
      )}
      <div className="note">※ 주역점은 문점(問占) 방식으로, 다시 뽑기마다 새 괘가 나옵니다.</div>
    </>
  );
}
