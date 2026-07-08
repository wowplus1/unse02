// 사주 시각화 — 4기둥 카드 + 오행 분포 막대. 서버 컴포넌트.
import type { SajuProfile, Pillar } from "../../lib/saju";

const OH_COLOR: Record<string, string> = {
  목: "var(--oh-mok)", 화: "var(--oh-hwa)", 토: "var(--oh-to)", 금: "var(--oh-geum)", 수: "var(--oh-su)",
};
const OH_SOFT: Record<string, string> = {
  목: "var(--mint-soft)", 화: "var(--accent-soft)", 토: "var(--butter-soft)", 금: "var(--line)", 수: "var(--sky-soft)",
};

function PillarCol({ lab, p }: { lab: string; p: Pillar | null }) {
  if (!p) return (
    <div className="pillar"><div className="lab">{lab}</div><div className="gz" style={{ opacity: .3 }}>—</div><div className="ko muted">모름</div></div>
  );
  return (
    <div className="pillar">
      <div className="lab">{lab}</div>
      <div className="gz">{p.ganzhiHan}</div>
      <div className="ko">{p.ganKo}{p.zhiKo}</div>
      <div className="oh" style={{ background: OH_SOFT[p.ganOheng], color: OH_COLOR[p.ganOheng] }}>{p.ganOheng}·{p.zhiOheng}</div>
    </div>
  );
}

export function PillarChart({ p }: { p: SajuProfile }) {
  return (
    <div className="pillars">
      <PillarCol lab="시주" p={p.time} />
      <PillarCol lab="일주" p={p.day} />
      <PillarCol lab="월주" p={p.month} />
      <PillarCol lab="년주" p={p.year} />
    </div>
  );
}

const OH_ORDER = ["목", "화", "토", "금", "수"];
export function OhengChart({ count }: { count: Record<string, number> }) {
  const max = Math.max(1, ...OH_ORDER.map((o) => count[o] || 0));
  return (
    <div className="oheng-chart">
      {OH_ORDER.map((o) => {
        const c = count[o] || 0;
        return (
          <div className="col" key={o}>
            <div className="barwrap">
              <div className="b" style={{ height: `${(c / max) * 100}%`, background: OH_COLOR[o], opacity: c ? 1 : .25 }} />
            </div>
            <div className="lab" style={{ color: OH_COLOR[o] }}>{o}</div>
            <div className="cnt">{c}</div>
          </div>
        );
      })}
    </div>
  );
}
