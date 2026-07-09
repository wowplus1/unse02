import Link from "next/link";
import AutoFill from "../components/AutoFill";
import ProfileBar from "../components/ProfileBar";
import { parseProfile, qs, AUTOFILL_MAP } from "../../lib/profile";

const FUN = [
  { ico: "🔢", name: "행운의 번호", d: "오늘의 로또 6+보너스", href: "/fun/lotto", needP: true },
  { ico: "💑", name: "이름 궁합", d: "두 사람 이름 궁합 점수", href: "/fun/name", needP: false },
  { ico: "💞", name: "궁합 보기", d: "두 사람 오행·띠 궁합", href: "/gunghap", needP: false },
  { ico: "📈", name: "바이오리듬", d: "신체·감정·지성 컨디션", href: "/fun/bio", needP: true },
  { ico: "☯️", name: "주역 뽑기", d: "오늘의 괘 한 장", href: "/juyeok", needP: false },
];

export default async function FunHub({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const parsed = parseProfile(sp);
  const q = parsed ? qs(parsed) : "";
  return (
    <>
      <AutoFill map={AUTOFILL_MAP} />
      <section style={{ padding: "10px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>🎲 재미 운세</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>가볍게 즐기는 오늘의 재미</p>
      </section>
      <ProfileBar />
      <div className="grid" style={{ marginTop: 14 }}>
        {FUN.map((f) => (
          <Link className="card" key={f.href} href={f.needP && q ? `${f.href}?${q}` : f.href} prefetch>
            <div className="ico">{f.ico}</div>
            <div className="t">{f.name}</div>
            <div className="d">{f.d}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
