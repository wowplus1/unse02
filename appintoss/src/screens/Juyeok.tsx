import { useMemo } from "react";
import type { Profile } from "../lib/appTypes";
import BannerAd from "../components/BannerAd";
import { castHexagram, drawGangtaegong } from "../lib/juyeok";
import { juyeokReadings, gangReading } from "../lib/content";
import { personalSeed, julianOf } from "../lib/tojeong";
import { ReadingItem } from "../components/Reading";

// 결정적 시드 난수 (mulberry32) — 같은 시드면 항상 같은 수열
function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function LineRow({ yang }: { yang: boolean }) {
  const bar = { height: 12, background: "var(--accent)", borderRadius: 4 } as const;
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "5px 0" }}>
      {yang ? <div style={{ ...bar, width: 124 }} /> : (<><div style={{ ...bar, width: 56 }} /><div style={{ ...bar, width: 56 }} /></>)}
    </div>
  );
}

export default function Juyeok({ profile, onBack }: { profile: Profile | null; onBack: () => void }) {
  // 하루 한 번 고정: 사람+날짜로 시드해 오늘의 괘를 결정. (다시 뽑기 없음 — 운세의 근본 유지)
  const { hex, readings, gn, gang } = useMemo(() => {
    const now = new Date();
    const todayJd = julianOf(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const base = profile ? personalSeed(profile.y, profile.m, profile.d, profile.hour, profile.cal) : 0;
    const rand = mulberry32(base + todayJd);
    const hex = castHexagram(rand);
    const gn = drawGangtaegong(rand);
    return { hex, readings: juyeokReadings(hex.key), gn, gang: gangReading(gn) };
  }, [profile]);

  return (
    <>
      <button className="back" onClick={onBack}>← 재미</button>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>☯️ 주역 점보기</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>생년월일과 날짜로 세운 오늘의 괘 (하루 1회)</p>
      </section>
      <div className="panel">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 34 }}>{hex.upper.sym}{hex.lower.sym}</div>
          <div style={{ color: "var(--accent-ink)", fontWeight: 800, marginTop: 4 }}>상괘 {hex.upper.name} · 하괘 {hex.lower.name}</div>
          <div style={{ margin: "14px 0" }}>{[...hex.lines].reverse().map((y, i) => <LineRow key={i} yang={y} />)}</div>
        </div>
        <div className="reading">{readings.map((it, i) => <ReadingItem key={i} r={it} />)}</div>
      </div>
      {gang && (
        <>
          <div className="sec">🎏 강태공 100괘 — 제 {gn}괘</div>
          <div className="reading"><ReadingItem r={gang} hi /></div>
        </>
      )}
      <div className="note">※ 주역점은 하루 한 번, 오늘의 괘로 고정됩니다. 내일이면 새로운 괘가 나와요.</div>
      <BannerAd />
    </>
  );
}
