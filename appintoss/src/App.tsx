import { useEffect, useState } from "react";
import { Profile, PROFILE_KEY, View } from "./lib/appTypes";
import { BRAND } from "./lib/brand";
import ProfileForm from "./components/ProfileForm";
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
  const toFun = () => nav("fun");

  let content: React.ReactNode = null;
  if (!ready) {
    content = null;
  } else if (editing) {
    content = <ProfileForm initial={profile} onSave={saveProfile} onCancel={profile ? () => setEditing(false) : undefined} compact />;
  } else if (!profile && view === "home") {
    content = (
      <>
        <section className="hero">
          <div className="ki">{BRAND.logo}</div>
          <h2>오늘 나의 운세는?</h2>
          <p>생년월일 한 번이면 매일 점수로 확인하고 카드로 공유해요</p>
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
      case "home": content = <Home profile={profile!} onEdit={onEdit} onDelete={deleteProfile} onNavigate={nav} />; break;
      case "ranking": content = <Ranking profile={profile} onEdit={onEdit} onDelete={deleteProfile} onBack={() => nav("home")} />; break;
      case "fun": content = <Fun onNavigate={nav} onBack={() => nav("home")} />; break;
      case "lotto": content = <Lotto profile={profile} onBack={toFun} />; break;
      case "bio": content = <Bio profile={profile} onBack={toFun} />; break;
      case "name": content = <NameScreen onBack={toFun} />; break;
      case "gunghap": content = <Gunghap onBack={toFun} />; break;
      case "juyeok": content = <Juyeok onBack={toFun} />; break;
    }
  }

  return (
    <div className="wrap">
      {/* 상단 헤더는 토스가 서비스 타이틀을 제공하므로 제거 */}
      <main key={editing ? "edit" : view} className="page">{content}</main>
    </div>
  );
}
