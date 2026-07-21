import { useEffect, useState } from "react";
import { Profile, PROFILE_KEY, View } from "./lib/appTypes";
import { BRAND } from "./lib/brand";
import { isUnlockedToday, setUnlockedToday, UNLOCK_RANKING, UNLOCK_FUN } from "./lib/unlock";
import ProfileForm from "./components/ProfileForm";
import TopNav from "./components/TopNav";
import UnlockModal from "./components/UnlockModal";
import Home from "./screens/Home";
import Ranking from "./screens/Ranking";
import Fun from "./screens/Fun";
import Lotto from "./screens/Lotto";
import Bio from "./screens/Bio";
import NameScreen from "./screens/NameScreen";
import Gunghap from "./screens/Gunghap";
import Juyeok from "./screens/Juyeok";

const PREVIEW = [
  { ico: "💯", name: "오늘의 총운 점수", d: "0~100점 + 키워드" },
  { ico: "💗", name: "애정·금전·직장운", d: "오늘 핵심만 콕" },
  { ico: "🎁", name: "행운의 색·숫자·아이템", d: "오늘의 럭키템" },
  { ico: "🏆", name: "띠·별자리 랭킹", d: "오늘 순위 확인" },
];

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("home");
  const [editing, setEditing] = useState(false);
  const [navGate, setNavGate] = useState<null | "ranking" | "fun">(null);

  useEffect(() => {
    try { const s = localStorage.getItem(PROFILE_KEY); if (s) setProfile(JSON.parse(s)); } catch {}
    setReady(true);
  }, []);

  const saveProfile = (p: Profile) => {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch {}
    setProfile(p); setEditing(false); setView("home");
  };
  const deleteProfile = () => {
    if (!confirm("저장된 내 정보를 삭제할까요?")) return;
    try { localStorage.removeItem(PROFILE_KEY); } catch {}
    setProfile(null); setEditing(false); setView("home");
  };
  const nav = (v: View) => { setView(v); setEditing(false); window.scrollTo(0, 0); };
  const onEdit = () => setEditing(true);

  // 랭킹·재미 진입은 오늘 미언락이면 광고 게이트, 아니면 바로 이동. (홈·재미 하위 화면은 그대로 통과)
  const openView = (target: View) => {
    if (target === "ranking" && !isUnlockedToday(UNLOCK_RANKING)) { setNavGate("ranking"); return; }
    if (target === "fun" && !isUnlockedToday(UNLOCK_FUN)) { setNavGate("fun"); return; }
    nav(target);
  };

  let content: React.ReactNode = null;
  if (!ready) {
    content = null;
  } else if (editing) {
    content = <ProfileForm initial={profile} onSave={saveProfile} onCancel={profile ? () => setEditing(false) : undefined} compact />;
  } else if (!profile && view === "home") {
    content = (
      <>
        <section className="hero">
          <img src={BRAND.iconUrl} alt={BRAND.name}
            style={{ width: 92, height: 92, borderRadius: 24, objectFit: "cover", boxShadow: "0 8px 22px rgba(0,0,0,.18)" }} />
          <h2>오늘 나의 운세는?</h2>
          <p>생년월일 한 번이면 매일 운세 확인 · 광고 보고 잠긴 풀이까지 무료</p>
        </section>
        <ProfileForm onSave={saveProfile} />
        <div className="sec">✨ 이런 걸 매일 볼 수 있어요</div>
        <div className="grid">
          {PREVIEW.map((m) => (
            <div className="card" key={m.name}>
              <div className="ico">{m.ico}</div><div className="t">{m.name}</div><div className="d">{m.d}</div>
            </div>
          ))}
        </div>
      </>
    );
  } else {
    switch (view) {
      case "home": content = <Home profile={profile!} onEdit={onEdit} onDelete={deleteProfile} onNavigate={openView} />; break;
      case "ranking": content = <Ranking profile={profile} />; break;
      case "fun": content = <Fun onNavigate={openView} />; break;
      case "lotto": content = <Lotto profile={profile} />; break;
      case "bio": content = <Bio profile={profile} />; break;
      case "name": content = <NameScreen />; break;
      case "gunghap": content = <Gunghap />; break;
      case "juyeok": content = <Juyeok profile={profile} />; break;
    }
  }

  // 재미 섹션(허브 + 하위 화면)에서는 '재미 운세' 탭을 활성화
  const FUN_VIEWS: View[] = ["fun", "lotto", "bio", "name", "gunghap", "juyeok"];
  const showTopNav = !editing && !!profile && (view === "ranking" || FUN_VIEWS.includes(view));
  const topNavCurrent: View = FUN_VIEWS.includes(view) ? "fun" : view;

  return (
    <div className="wrap">
      {showTopNav && <TopNav current={topNavCurrent} onNav={openView} />}
      <main key={editing ? "edit" : view} className="page">{content}</main>

      <UnlockModal
        open={navGate !== null}
        onClose={() => setNavGate(null)}
        title={navGate === "ranking" ? "오늘의 랭킹 열기" : "재미 운세 열기"}
        desc={navGate === "ranking"
          ? <>광고를 보면 오늘의 <b style={{ color: "var(--accent-ink)" }}>띠·별자리 랭킹</b>을<br />확인할 수 있어요.</>
          : <>광고를 보면 <b style={{ color: "var(--accent-ink)" }}>재미 운세</b>(로또·궁합 등)를<br />즐길 수 있어요.</>}
        onUnlocked={() => {
          if (navGate === "ranking") { setUnlockedToday(UNLOCK_RANKING); setNavGate(null); nav("ranking"); }
          else if (navGate === "fun") { setUnlockedToday(UNLOCK_FUN); setNavGate(null); nav("fun"); }
        }}
      />
    </div>
  );
}
