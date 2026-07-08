import AutoFill from "../components/AutoFill";
import ProfileBar from "../components/ProfileBar";
import AdSlot from "../components/AdSlot";
import { parseProfile, sajuFrom, AUTOFILL_MAP } from "../../lib/profile";
import { ddiRanking, starRanking, RankRow } from "../../lib/funtoday";

function medal(rank: number): string {
  return rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : `${rank + 1}`;
}

function RankTable({ rows, mine }: { rows: RankRow[]; mine?: string }) {
  return (
    <div>
      {rows.map((r, i) => {
        const isMine = mine && r.label === mine;
        return (
          <div key={r.idx} className="rankrow" style={isMine ? { background: "var(--accent-soft)", borderColor: "transparent" } : {}}>
            <span className="rk">{medal(i)}</span>
            <span className="em">{r.emoji}</span>
            <span className="nm">{r.label}{isMine && <b style={{ color: "var(--accent-ink)", fontSize: 11, marginLeft: 6 }}>내 순위</b>}</span>
            <span className="kw muted">{r.keyword}</span>
            <span className="sc">{r.score}점</span>
          </div>
        );
      })}
    </div>
  );
}

export default async function RankingPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const parsed = parseProfile(sp);
  const tab = sp.t === "star" ? "star" : "ddi";

  let myDdi = "", myStar = "";
  if (parsed) {
    const p = sajuFrom(parsed);
    myDdi = p.zodiac + "띠";
    myStar = p.starSign;
  }

  const rows = tab === "star" ? starRanking() : ddiRanking();
  const now = new Date();
  const base = parsed ? `?y=${parsed.y}&m=${parsed.m}&d=${parsed.d}&h=${parsed.hour ?? ""}&g=${parsed.gender}&cal=${parsed.cal}` : "?";

  return (
    <>
      <AutoFill map={AUTOFILL_MAP} />
      <section style={{ padding: "10px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>🏆 오늘의 랭킹</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>{now.getMonth() + 1}월 {now.getDate()}일 · 오늘 운세가 좋은 순서</p>
      </section>

      <ProfileBar />

      <div className="chips" style={{ marginTop: 12 }}>
        <a className="chip" href={`/ranking${base}&t=ddi`}
           style={tab === "ddi" ? { background: "var(--accent-soft)", color: "var(--accent-ink)", borderColor: "transparent", fontWeight: 700 } : {}}>🐭 띠별</a>
        <a className="chip" href={`/ranking${base}&t=star`}
           style={tab === "star" ? { background: "var(--accent-soft)", color: "var(--accent-ink)", borderColor: "transparent", fontWeight: 700 } : {}}>⭐ 별자리</a>
      </div>

      <div className="panel" style={{ padding: 12 }}>
        <RankTable rows={rows} mine={tab === "star" ? myStar : myDdi} />
      </div>

      {!parsed && <p className="center muted" style={{ fontSize: 12.5, marginTop: 12 }}>생년월일을 등록하면 내 띠·별자리를 하이라이트해 드려요</p>}

      <AdSlot />
    </>
  );
}
