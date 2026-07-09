import Link from "next/link";
import AutoFill from "./components/AutoFill";
import ProfileForm from "./components/ProfileForm";
import ProfileBar from "./components/ProfileBar";
import ShareCard from "./components/ShareCard";
import CaptureShare from "./components/CaptureShare";
import ExpandableText from "./components/ExpandableText";
import { parseProfile, qs, AUTOFILL_MAP } from "../lib/profile";
import { funToday } from "../lib/funtoday";
import { BRAND } from "../lib/brand";

export const dynamic = "force-dynamic"; // 매일 달라지므로 캐시 안 함

const PREVIEW = [
  { ico: "💯", name: "오늘의 총운 점수", d: "0~100점 + 키워드" },
  { ico: "💗", name: "애정·금전·직장운", d: "오늘 핵심만 콕" },
  { ico: "🎁", name: "행운의 색·숫자·아이템", d: "오늘의 럭키템" },
  { ico: "🏆", name: "띠·별자리 랭킹", d: "오늘 순위 확인" },
];

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const parsed = parseProfile(sp);

  // ── 미등록: 온보딩 ──
  if (!parsed) {
    return (
      <>
        <AutoFill map={AUTOFILL_MAP} />
        <section className="hero">
          <div className="ki">{BRAND.logo}</div>
          <h2>오늘 나의 운세는?</h2>
          <p>생년월일 한 번이면 매일 점수로 확인하고 카드로 공유해요</p>
        </section>
        <ProfileForm redirect="/" />
        <div className="sec">✨ 이런 걸 매일 볼 수 있어요</div>
        <div className="grid">
          {PREVIEW.map((m) => (
            <div className="card" key={m.name}>
              <div className="ico">{m.ico}</div>
              <div className="t">{m.name}</div>
              <div className="d">{m.d}</div>
            </div>
          ))}
        </div>
      </>
    );
  }

  // ── 등록됨: 가벼운 오늘의 운세 ──
  const ft = funToday(parsed);
  const q = qs(parsed);

  return (
    <>
      <section style={{ padding: "10px 2px 6px" }}>
        <div className="muted" style={{ fontSize: 13 }}>
          {ft.dateText} ({ft.weekday}) · 오늘의 운세
        </div>
        <h2 style={{ fontSize: 22, margin: "4px 0 0", letterSpacing: "-0.03em", fontWeight: 800 }}>
          {ft.emoji} 오늘은 <span style={{ color: "var(--accent-ink)" }}>{ft.keyword}</span>
        </h2>
      </section>

      <ProfileBar />

      {/* 공유 카드(히어로 겸 캡처 대상) */}
      <div style={{ marginTop: 14 }}>
        <ShareCard data={ft} />
      </div>
      <div style={{ marginTop: 12 }}>
        <CaptureShare />
      </div>

      {/* 애정·금전·직장 상세 (전체 풀이 펼치기) */}
      <div className="sec">🍀 오늘의 핵심운</div>
      <div className="reading">
        {ft.cats.map((c) => (
          <div className="item" key={c.key}>
            <div className="h">
              <span className="name">{c.emoji} {c.label}</span>
              <span className="score">{c.score}점</span>
            </div>
            <div className="bar" style={{ margin: "2px 0 8px" }}><div className="fill" style={{ width: `${c.score}%` }} /></div>
            {c.full && <ExpandableText text={c.full} />}
          </div>
        ))}
      </div>

      {/* 오늘의 운세 전체 (총운·소망·이동) */}
      {ft.more.length > 0 && (
        <>
          <div className="sec">📖 오늘의 운세 더보기</div>
          <div className="reading">
            {ft.more.map((m) => (
              <div className="item" key={m.key}>
                <div className="h"><span className="name">{m.emoji} {m.label}</span></div>
                <ExpandableText text={m.full} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* 행운템 */}
      <div className="sec">🎁 오늘의 행운템</div>
      <div className="grid3">
        <div className="card center" style={{ background: "var(--sky-soft)", border: "none", padding: 14 }}>
          <div className="muted" style={{ fontSize: 11 }}>행운색</div>
          <div style={{ fontWeight: 800, fontSize: 14, marginTop: 3 }}>{ft.luck.color}</div>
        </div>
        <div className="card center" style={{ background: "var(--butter-soft)", border: "none", padding: 14 }}>
          <div className="muted" style={{ fontSize: 11 }}>행운수</div>
          <div style={{ fontWeight: 800, fontSize: 14, marginTop: 3 }}>{ft.luck.num}</div>
        </div>
        <div className="card center" style={{ background: "var(--mint-soft)", border: "none", padding: 14 }}>
          <div className="muted" style={{ fontSize: 11 }}>아이템</div>
          <div style={{ fontWeight: 800, fontSize: 13, marginTop: 3 }}>{ft.luck.item}</div>
        </div>
      </div>


      {/* 더 보기 (가벼운 것만) */}
      <div className="sec">🎉 더 즐기기</div>
      <div className="grid">
        <Link className="card" href={`/ranking?${q}`} prefetch>
          <div className="ico">🏆</div><div className="t">오늘의 랭킹</div><div className="d">띠·별자리 순위</div>
        </Link>
        <Link className="card" href={`/fun?${q}`} prefetch>
          <div className="ico">🎲</div><div className="t">재미 운세</div><div className="d">로또·궁합·바이오리듬</div>
        </Link>
      </div>

    </>
  );
}
