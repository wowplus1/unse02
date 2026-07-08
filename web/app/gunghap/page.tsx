import GunghapForm from "./GunghapForm";
import ProfileBar from "../components/ProfileBar";
import { ReadingItem } from "../components/Reading";
import ShareButtons from "../components/ShareButtons";
import AdSlot from "../components/AdSlot";
import { computeSaju } from "../../lib/saju";
import { ohengGunghap, ttiFate } from "../../lib/content";

const OH_EMOJI: Record<string, string> = { 목: "🌳", 화: "🔥", 토: "⛰️", 금: "⚙️", 수: "💧" };

export default async function GunghapPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const has = sp.ay && sp.am && sp.ad && sp.by && sp.bm && sp.bd;

  if (!has) {
    return (
      <>
        <section className="hero">
          <div className="ki">💞</div>
          <h2 style={{ fontSize: 22 }}>궁합 보기</h2>
          <p>두 사람의 생년월일로 오행·띠 궁합을 봐요</p>
        </section>
        <ProfileBar />
        <div style={{ height: 14 }} />
        <GunghapForm />
      </>
    );
  }

  const A = { y: +sp.ay, m: +sp.am, d: +sp.ad, g: (sp.ag === "W" ? "W" : "M") as "M" | "W", cal: (sp.acal === "lunar" ? "lunar" : "solar") as "solar" | "lunar" };
  const B = { y: +sp.by, m: +sp.bm, d: +sp.bd, g: (sp.bg === "W" ? "W" : "M") as "M" | "W", cal: (sp.bcal === "lunar" ? "lunar" : "solar") as "solar" | "lunar" };
  const pA = computeSaju(A.y, A.m, A.d, null, A.g, A.cal);
  const pB = computeSaju(B.y, B.m, B.d, null, B.g, B.cal);

  // 오행 궁합: 남/여 슬롯 매핑 (동성이면 A=남 슬롯)
  const male = A.g === "W" && B.g === "M" ? pB : pA;
  const female = A.g === "W" && B.g === "M" ? pA : pB;
  const oheng = ohengGunghap(male.day.ganOheng, female.day.ganOheng);
  const fateA = ttiFate(pA);
  const fateB = ttiFate(pB);

  return (
    <>
      <a className="back" href="/gunghap">← 다시 입력</a>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>💞 궁합 결과</h2>
      </section>

      <ProfileBar />
      <div style={{ height: 14 }} />

      {/* 두 사람 요약 */}
      <div className="grid">
        <div className="card center" style={{ background: "var(--accent-soft)", border: "none" }}>
          <div style={{ fontSize: 30 }}>{OH_EMOJI[pA.day.ganOheng]}</div>
          <div className="t">{pA.zodiac}띠</div>
          <div className="d">일간 {pA.dayGanKo} · {pA.day.ganOheng}</div>
        </div>
        <div className="card center" style={{ background: "var(--sky-soft)", border: "none" }}>
          <div style={{ fontSize: 30 }}>{OH_EMOJI[pB.day.ganOheng]}</div>
          <div className="t">{pB.zodiac}띠</div>
          <div className="d">일간 {pB.dayGanKo} · {pB.day.ganOheng}</div>
        </div>
      </div>

      <div className="sec">☯️ 오행 궁합</div>
      <div className="reading">
        {oheng ? <ReadingItem r={oheng} hi /> : <div className="item"><div className="b muted">해당 오행 조합 풀이를 찾지 못했습니다.</div></div>}
      </div>

      <AdSlot />

      <div className="sec">🐾 각자의 띠 운명</div>
      <div className="reading">
        {fateA && <ReadingItem r={fateA} />}
        {fateB && <ReadingItem r={fateB} />}
      </div>

      <ShareButtons title="궁합 결과" text={`${pA.zodiac}띠 × ${pB.zodiac}띠 궁합 결과!`} />
    </>
  );
}
