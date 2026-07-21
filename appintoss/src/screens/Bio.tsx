import { useEffect, useRef } from "react";
import type { Profile } from "../lib/appTypes";
import BannerAd from "../components/BannerAd";
import CaptureShare from "../components/CaptureShare";
import { BRAND } from "../lib/brand";
import { biorhythm } from "../lib/fun";

const SERIES = [
  { key: "physical", label: "🏃 신체", period: 23, color: "#e0784f" },
  { key: "emotional", label: "💗 감정", period: 28, color: "#d76a9a" },
  { key: "intellectual", label: "🧠 지성", period: 33, color: "#5f8fbf" },
] as const;

function stateOf(v: number) { return v > 40 ? "좋음" : v < -40 ? "저조" : "보통"; }

// ±14일 사인파 그래프. days = 태어난 지 경과일.
function BioChart({ days, today }: { days: number; today: Record<string, number> }) {
  const range = 14, step = 0.5;
  const W = 340, H = 200, padX = 12, padTop = 16, padBot = 26;
  const plotW = W - 2 * padX, plotH = H - padTop - padBot;
  const tx = (t: number) => padX + ((t + range) / (2 * range)) * plotW;
  const vy = (v: number) => padTop + (1 - (v + 100) / 200) * plotH;
  const val = (t: number, per: number) => Math.sin((2 * Math.PI * (days + t)) / per) * 100;
  const pts: number[] = [];
  for (let t = -range; t <= range + 1e-6; t += step) pts.push(t);
  const line = (per: number) => pts.map((t) => `${tx(t).toFixed(1)},${vy(val(t, per)).toFixed(1)}`).join(" ");
  const todayX = tx(0), zeroY = vy(0);

  const lineRefs = useRef<(SVGPolylineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);

  // 진입 시 곡선을 왼쪽부터 그리고(line-draw) 오늘 점이 톡 튀어나오는 연출
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      const len = el.getTotalLength();
      el.style.transition = "none";
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
      el.getBoundingClientRect(); // reflow
      el.style.transition = `stroke-dashoffset 1.05s ease ${i * 0.18}s`;
      el.style.strokeDashoffset = "0";
    });
    dotRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.transformBox = "fill-box";
      el.style.transformOrigin = "center";
      el.style.transition = "none";
      el.style.transform = "scale(0)";
      el.getBoundingClientRect(); // reflow
      el.style.transition = `transform .42s cubic-bezier(.34,1.56,.64,1) ${0.95 + i * 0.12}s`;
      el.style.transform = "scale(1)";
    });
  }, [days]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }} role="img" aria-label="바이오리듬 그래프">
      {/* 기준선 (0%) */}
      <line x1={padX} y1={zeroY} x2={W - padX} y2={zeroY} stroke="var(--line)" strokeWidth={1} />
      <text x={padX} y={vy(100) - 3} fontSize={9} fill="var(--muted)">+100</text>
      <text x={padX} y={vy(-100) + 11} fontSize={9} fill="var(--muted)">-100</text>
      {/* 오늘 세로선 */}
      <line x1={todayX} y1={padTop} x2={todayX} y2={H - padBot} stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3 3" />
      <text x={todayX} y={H - 9} fontSize={10} fill="var(--accent-ink)" fontWeight={800} textAnchor="middle">오늘</text>
      {/* 곡선 */}
      {SERIES.map((s, i) => (
        <polyline key={s.key} ref={(el) => { lineRefs.current[i] = el; }} points={line(s.period)} fill="none" stroke={s.color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
      ))}
      {/* 오늘 지점 점 */}
      {SERIES.map((s, i) => (
        <circle key={s.key} ref={(el) => { dotRefs.current[i] = el; }} cx={todayX} cy={vy(today[s.key])} r={4.5} fill={s.color} stroke="#fff" strokeWidth={1.5} />
      ))}
    </svg>
  );
}

export default function Bio({ profile }: { profile: Profile | null }) {
  const now = new Date();
  let result = null;
  if (profile) {
    const b = biorhythm(profile.y, profile.m, profile.d, now);
    const today: Record<string, number> = { physical: b.physical, emotional: b.emotional, intellectual: b.intellectual };
    const avg = Math.round((b.physical + b.emotional + b.intellectual) / 3);
    result = (
      <>
      <div className="panel" id="bio-share-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: "var(--muted)", fontWeight: 700, marginBottom: 10 }}>
          <span>{BRAND.logo} {BRAND.name}{profile.name ? ` · ${profile.name}님` : ""}</span>
          <span>{now.getFullYear()}.{now.getMonth() + 1}.{now.getDate()}</span>
        </div>
        <div className="chips">
          <span className="chip"><b>{now.getFullYear()}.{now.getMonth() + 1}.{now.getDate()}</b> 기준</span>
          <span className="chip">태어난 지 <b>{b.days.toLocaleString()}일</b></span>
          <span className="chip">종합 <b>{avg > 0 ? "+" : ""}{avg}%</b></span>
        </div>

        <div style={{ marginTop: 8 }}><BioChart days={b.days} today={today} /></div>

        {/* 범례 + 오늘 수치 */}
        <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
          {SERIES.map((s) => {
            const v = today[s.key];
            return (
              <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5 }}>
                <span style={{ width: 12, height: 12, borderRadius: 999, background: s.color, flex: "none" }} />
                <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{s.label} <span className="muted" style={{ fontSize: 11.5, fontWeight: 600 }}>({s.period}일)</span></span>
                <span style={{ marginLeft: "auto", fontWeight: 800, color: s.color, whiteSpace: "nowrap" }}>{v > 0 ? "+" : ""}{v}% · {stateOf(v)}</span>
              </div>
            );
          })}
        </div>

        <div className="note">※ 생년월일로부터의 경과일을 주기(23·28·33일)로 계산한 사인파입니다.</div>
      </div>
      <div style={{ marginTop: 12 }}><CaptureShare targetId="bio-share-card" fileName="바이오리듬.png" /></div>
      </>
    );
  }
  return (
    <>      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>📈 바이오리듬</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 8px" }}>오늘의 신체·감정·지성 컨디션을 확인해요</p>
      </section>
      {result || <div className="panel center muted">먼저 <b>오늘</b> 탭에서 생년월일을 등록해 주세요.</div>}
      <BannerAd />
    </>
  );
}
