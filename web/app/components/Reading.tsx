// 풀이(Reading) 렌더 — 서버 컴포넌트. content.ts 의 Reading 형태를 표시.
import type { Reading } from "../../lib/content";

export function ReadingItem({ r, hi = false }: { r: Reading; hi?: boolean }) {
  return (
    <div className={"item" + (hi ? " hi" : "")}>
      <div className="h">
        <span className="name">{r.title}</span>
        {typeof r.score === "number" && <span className="score">길흉 {r.score}/10</span>}
      </div>
      {r.subTitle && <div className="muted" style={{ fontSize: 12, marginTop: -4, marginBottom: 6 }}>{r.subTitle}</div>}
      <div className="b">{r.body}</div>
    </div>
  );
}

// 그룹 묶음 렌더 (sajuReadings 결과 형태)
export function ReadingGroups({ groups }: { groups: { group: string; items: Reading[] }[] }) {
  return (
    <div className="reading">
      {groups.map((g, gi) => (
        <div key={gi}>
          <div className="g">{g.group}</div>
          {g.items.map((it, i) => <ReadingItem key={i} r={it} />)}
        </div>
      ))}
    </div>
  );
}
