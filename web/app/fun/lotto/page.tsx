import { luckyNumbers } from "../../../lib/fun";
import { julianOf } from "../../../lib/tojeong";
import AutoFill from "../../components/AutoFill";
import ProfileBar from "../../components/ProfileBar";
import ShareButtons from "../../components/ShareButtons";
import AdSlot from "../../components/AdSlot";

export const dynamic = "force-dynamic";

function Ball({ n, bonus }: { n: number; bonus?: boolean }) {
  const bg = bonus ? "var(--peach)" : n <= 10 ? "var(--butter)" : n <= 20 ? "var(--sky)" : n <= 30 ? "var(--accent)" : n <= 40 ? "var(--oh-geum)" : "var(--mint)";
  return <span style={{ display: "inline-flex", width: 44, height: 44, borderRadius: "50%", background: bg, color: "#fff", fontWeight: 800, alignItems: "center", justifyContent: "center", fontSize: 16 }}>{n}</span>;
}

export default async function LottoPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const has = sp.y && sp.m && sp.d;

  let result = null;
  if (has) {
    const y = +sp.y, m = +sp.m, d = +sp.d;
    const cal = (sp.cal === "lunar" ? "lunar" : "solar") as "solar" | "lunar";
    const now = new Date();
    const todayJd = julianOf(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const seed = julianOf(y, m, d, cal) * 31 + todayJd;
    const { main, bonus } = luckyNumbers(seed);
    result = (
      <div className="panel">
        <div className="chips"><span className="chip"><b>{now.getFullYear()}.{now.getMonth() + 1}.{now.getDate()}</b> 행운 번호</span></div>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center", justifyContent: "center", margin: "18px 0" }}>
          {main.map((n) => <Ball key={n} n={n} />)}
          <span className="muted">＋</span>
          <Ball n={bonus} bonus />
        </div>
        <div className="note" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>※ 생년월일과 오늘 날짜로 계산한 행운 번호입니다. 매일 바뀌며 재미로 즐겨주세요.</div>
        <ShareButtons title="행운의 번호" text="오늘 내 행운번호 뽑았어!" />
      </div>
    );
  }

  return (
    <>
      <AutoFill map={{ y: "y", m: "m", d: "d", cal: "cal" }} />
      <a className="back" href="/fun">← 재미</a>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>🔢 행운의 번호</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 8px" }}>생년월일로 오늘의 로또 번호(6+보너스)를 뽑아요</p>
      </section>
      <ProfileBar />
      <div style={{ height: 14 }} />
      <div className="panel">
        <form method="get">
          <div className="field"><label>달력</label>
            <select name="cal" defaultValue={sp.cal || "solar"}><option value="solar">양력</option><option value="lunar">음력(평달)</option></select>
          </div>
          <div className="row field">
            <div><label>년</label><input name="y" type="number" placeholder="1990" defaultValue={sp.y} required /></div>
            <div><label>월</label><input name="m" type="number" min={1} max={12} defaultValue={sp.m} required /></div>
            <div><label>일</label><input name="d" type="number" min={1} max={31} defaultValue={sp.d} required /></div>
          </div>
          <button className="btn" type="submit">행운 번호 뽑기</button>
        </form>
      </div>
      {result}
      <AdSlot />
    </>
  );
}
