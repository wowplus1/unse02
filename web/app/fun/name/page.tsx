import { nameCompat } from "../../../lib/fun";
import ProfileBar from "../../components/ProfileBar";
import ShareButtons from "../../components/ShareButtons";
import AdSlot from "../../components/AdSlot";

export const dynamic = "force-dynamic";

function verdict(score: number): string {
  if (score >= 85) return "천생연분! 최고의 궁합이에요 💞";
  if (score >= 70) return "잘 어울리는 좋은 궁합이에요 😊";
  if (score >= 50) return "노력하면 좋아지는 사이예요 🙂";
  if (score >= 30) return "밀당이 필요한 관계예요 😅";
  return "서로 다른 매력, 조심스러운 사이예요 😬";
}

export default async function NamePage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const a = (sp.a || "").trim(), b = (sp.b || "").trim();
  const has = a && b;
  const score = has ? nameCompat(a, b) : 0;

  return (
    <>
      <a className="back" href="/fun">← 재미</a>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>💑 이름 궁합</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 8px" }}>두 사람의 이름으로 궁합 점수를 봐요</p>
      </section>
      <ProfileBar />
      <div style={{ height: 14 }} />
      <div className="panel">
        <form method="get">
          <div className="row2 field">
            <div><label>내 이름</label><input name="a" defaultValue={a} placeholder="홍길동" required /></div>
            <div><label>상대 이름</label><input name="b" defaultValue={b} placeholder="성춘향" required /></div>
          </div>
          <button className="btn" type="submit">이름 궁합 보기</button>
        </form>
      </div>
      {has && (
        <div className="panel center" style={{ marginTop: 12 }}>
          <div className="muted" style={{ fontSize: 15 }}>{a} ♥ {b}</div>
          <div style={{ fontSize: 54, fontWeight: 900, color: "var(--accent)", margin: "6px 0" }}>{score}%</div>
          <div className="bar" style={{ margin: "8px 0" }}><div className="fill" style={{ width: `${score}%` }} /></div>
          <div style={{ fontWeight: 700, marginTop: 8 }}>{verdict(score)}</div>
          <ShareButtons title="이름 궁합" text={`${a} ♥ ${b} = ${score}%!`} />
          <div className="note">※ 전통 한글 획수 방식의 재미 궁합입니다.</div>
        </div>
      )}
      <AdSlot />
    </>
  );
}
