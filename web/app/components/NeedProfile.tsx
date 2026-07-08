import AutoFill from "./AutoFill";
import ProfileForm from "./ProfileForm";
import { AUTOFILL_MAP } from "../../lib/profile";

// 프로필 파라미터가 없을 때: localStorage 자동 채움 시도 + 입력 폼.
export default function NeedProfile({ redirect, title = "먼저 생년월일을 알려주세요" }: { redirect: string; title?: string }) {
  return (
    <>
      <AutoFill map={AUTOFILL_MAP} />
      <section className="hero">
        <div className="ki">🔮</div>
        <h2 style={{ fontSize: 22 }}>{title}</h2>
        <p>한 번 등록하면 모든 운세에 자동으로 적용돼요</p>
      </section>
      <ProfileForm redirect={redirect} />
    </>
  );
}
