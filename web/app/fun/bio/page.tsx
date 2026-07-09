import { biorhythm } from "../../../lib/fun";
import AutoFill from "../../components/AutoFill";
import ProfileBar from "../../components/ProfileBar";
import ShareButtons from "../../components/ShareButtons";

export const dynamic = "force-dynamic";

function Bar({ label, v, color }: { label: string; v: number; color: string }) {
  const pct = (v + 100) / 2;
  const state = v > 40 ? "좋음" : v < -40 ? "저조" : "보통";
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
        <span style={{ fontWeight: 700 }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{v > 0 ? "+" : ""}{v}% · {state}</span>
      </div>
      <div className="bar"><div className="fill" style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  );
}

export default async function BioPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const has = sp.y && sp.m && sp.d;

  let result = null;
  if (has) {
    const now = new Date();
    const b = biorhythm(+sp.y, +sp.m, +sp.d, now);
    const avg = Math.round((b.physical + b.emotional + b.intellectual) / 3);
    result = (
      <div className="panel">
        <div className="chips">
          <span className="chip"><b>{now.getFullYear()}.{now.getMonth() + 1}.{now.getDate()}</b> 기준</span>
          <span className="chip">태어난 지 <b>{b.days.toLocaleString()}일</b></span>
          <span className="chip">종합 <b>{avg > 0 ? "+" : ""}{avg}%</b></span>
        </div>
        <Bar label="🏃 신체 리듬 (23일)" v={b.physical} color="var(--accent)" />
        <Bar label="💗 감정 리듬 (28일)" v={b.emotional} color="var(--lavender)" />
        <Bar label="🧠 지성 리듬 (33일)" v={b.intellectual} color="var(--sky)" />
        <div className="note">※ 생년월일로부터의 경과일을 주기(23·28·33일)로 계산한 값입니다. +는 활력이 높은 날, −는 조심할 날.</div>
        <ShareButtons title="바이오리듬" text="오늘 내 컨디션 리듬 확인!" />
      </div>
    );
  }

  return (
    <>
      <AutoFill map={{ y: "y", m: "m", d: "d" }} />
      <a className="back" href="/fun">← 재미</a>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>📈 바이오리듬</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 8px" }}>오늘의 신체·감정·지성 컨디션을 확인해요</p>
      </section>
      <ProfileBar />
      <div style={{ height: 14 }} />
      <div className="panel">
        <form method="get">
          <div className="row field">
            <div><label>년</label><input name="y" type="number" placeholder="1990" defaultValue={sp.y} required /></div>
            <div><label>월</label><input name="m" type="number" min={1} max={12} defaultValue={sp.m} required /></div>
            <div><label>일</label><input name="d" type="number" min={1} max={31} defaultValue={sp.d} required /></div>
          </div>
          <button className="btn" type="submit">바이오리듬 보기</button>
        </form>
      </div>
      {result}
    </>
  );
}
