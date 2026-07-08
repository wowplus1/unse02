import { castHexagram, drawGangtaegong } from "../../lib/juyeok";
import { juyeokReadings, gangReading } from "../../lib/content";
import { ReadingItem } from "../components/Reading";
import ProfileBar from "../components/ProfileBar";
import ShareButtons from "../components/ShareButtons";
import AdSlot from "../components/AdSlot";

export const dynamic = "force-dynamic"; // 매번 새로 뽑기

function LineRow({ yang }: { yang: boolean }) {
  const bar = { height: 12, background: "var(--accent)", borderRadius: 4 } as const;
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "5px 0" }}>
      {yang ? <div style={{ ...bar, width: 124 }} /> : (<><div style={{ ...bar, width: 56 }} /><div style={{ ...bar, width: 56 }} /></>)}
    </div>
  );
}

export default function JuyeokPage() {
  const hex = castHexagram();
  const readings = juyeokReadings(hex.key);
  const gn = drawGangtaegong();
  const gang = gangReading(gn);

  return (
    <>
      <a className="back" href="/explore">← 더보기</a>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>☯️ 주역 점보기</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>6효를 뽑아 세운 오늘의 괘</p>
      </section>

      <ProfileBar />
      <div style={{ height: 14 }} />

      <div className="panel">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 34 }}>{hex.upper.sym}{hex.lower.sym}</div>
          <div style={{ color: "var(--accent-ink)", fontWeight: 800, marginTop: 4 }}>
            상괘 {hex.upper.name} · 하괘 {hex.lower.name}
          </div>
          <div style={{ margin: "14px 0" }}>
            {[...hex.lines].reverse().map((y, i) => <LineRow key={i} yang={y} />)}
          </div>
        </div>
        <div className="reading">
          {readings.map((it, i) => <ReadingItem key={i} r={it} />)}
        </div>
        <a className="btn mt" href="/juyeok">🎲 다시 뽑기</a>
      </div>

      <AdSlot />

      {gang && (
        <>
          <div className="sec">🎏 강태공 100괘 — 제 {gn}괘</div>
          <div className="reading"><ReadingItem r={gang} hi /></div>
        </>
      )}

      <div className="note">※ 주역점은 생년월일이 아니라 문점(問占)—6효를 뽑아 괘를 세우는 원본 방식입니다. 다시 뽑기마다 새 괘가 나옵니다.</div>
      <ShareButtons title="주역 점보기" text="오늘 내 괘를 뽑아봤어" />
    </>
  );
}
