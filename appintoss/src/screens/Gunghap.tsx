import { useState } from "react";
import BannerAd from "../components/BannerAd";
import { computeSaju } from "../lib/saju";
import { ohengGunghap, ttiFate } from "../lib/content";
import { ReadingItem } from "../components/Reading";

interface Person { y: string; m: string; d: string; g: "M" | "W"; cal: "solar" | "lunar"; }
const empty: Person = { y: "", m: "", d: "", g: "M", cal: "solar" };
const OH_EMOJI: Record<string, string> = { 목: "🌳", 화: "🔥", 토: "⛰️", 금: "⚙️", 수: "💧" };

function Fields({ label, val, set }: { label: string; val: Person; set: (p: Person) => void }) {
  return (
    <div className="panel" style={{ marginBottom: 12 }}>
      <h3 style={{ fontSize: 15 }}>{label}</h3>
      <div className="row field" style={{ marginTop: 8 }}>
        <div><label>년</label><input type="number" value={val.y} onChange={(e) => set({ ...val, y: e.target.value })} placeholder="1992" /></div>
        <div><label>월</label><input type="number" value={val.m} onChange={(e) => set({ ...val, m: e.target.value })} /></div>
        <div><label>일</label><input type="number" value={val.d} onChange={(e) => set({ ...val, d: e.target.value })} /></div>
      </div>
      <div className="row2">
        <div><label>성별</label><select value={val.g} onChange={(e) => set({ ...val, g: e.target.value as "M" | "W" })}><option value="M">남성</option><option value="W">여성</option></select></div>
        <div><label>달력</label><select value={val.cal} onChange={(e) => set({ ...val, cal: e.target.value as "solar" | "lunar" })}><option value="solar">양력</option><option value="lunar">음력</option></select></div>
      </div>
    </div>
  );
}

export default function Gunghap({ onBack }: { onBack: () => void }) {
  const [a, setA] = useState<Person>(empty);
  const [b, setB] = useState<Person>(empty);
  const [show, setShow] = useState(false);

  const ready = a.y && a.m && a.d && b.y && b.m && b.d;
  let content = null;
  if (show && ready) {
    const pA = computeSaju(+a.y, +a.m, +a.d, null, a.g, a.cal);
    const pB = computeSaju(+b.y, +b.m, +b.d, null, b.g, b.cal);
    const male = a.g === "W" && b.g === "M" ? pB : pA;
    const female = a.g === "W" && b.g === "M" ? pA : pB;
    const oheng = ohengGunghap(male.day.ganOheng, female.day.ganOheng);
    const fateA = ttiFate(pA); const fateB = ttiFate(pB);
    content = (
      <>
        <div className="grid">
          <div className="card center" style={{ background: "var(--accent-soft)", border: "none" }}>
            <div style={{ fontSize: 30 }}>{OH_EMOJI[pA.day.ganOheng]}</div><div className="t">{pA.zodiac}띠</div><div className="d">일간 {pA.dayGanKo} · {pA.day.ganOheng}</div>
          </div>
          <div className="card center" style={{ background: "var(--sky-soft)", border: "none" }}>
            <div style={{ fontSize: 30 }}>{OH_EMOJI[pB.day.ganOheng]}</div><div className="t">{pB.zodiac}띠</div><div className="d">일간 {pB.dayGanKo} · {pB.day.ganOheng}</div>
          </div>
        </div>
        <div className="sec">☯️ 오행 궁합</div>
        <div className="reading">{oheng ? <ReadingItem r={oheng} hi /> : <div className="item"><div className="b muted">해당 조합 풀이를 찾지 못했습니다.</div></div>}</div>
        <div className="sec">🐾 각자의 띠 운명</div>
        <div className="reading">{fateA && <ReadingItem r={fateA} />}{fateB && <ReadingItem r={fateB} />}</div>
        <button className="btn ghost mt" onClick={() => setShow(false)}>← 다시 입력</button>
      </>
    );
  }

  return (
    <>
      <button className="back" onClick={onBack}>← 재미</button>
      <section style={{ padding: "2px 2px 8px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>💞 궁합 보기</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>두 사람의 생년월일로 오행·띠 궁합</p>
      </section>
      {content || (
        <>
          <Fields label="👤 첫 번째 사람" val={a} set={setA} />
          <Fields label="👥 두 번째 사람" val={b} set={setB} />
          <button className="btn" onClick={() => setShow(true)} disabled={!ready}>💞 궁합 보기</button>
        </>
      )}
      <BannerAd />
    </>
  );
}
