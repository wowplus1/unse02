import type { Profile } from "../lib/appTypes";

// 내 정보 요약 바 — 요약 + 수정/삭제 (콜백 방식)
export default function ProfileBar({ profile, onEdit, onDelete }: {
  profile: Profile; onEdit: () => void; onDelete: () => void;
}) {
  const p = profile;
  return (
    <div className="profbar">
      <div className="who">
        <span className="av">👤</span>
        <span>
          <b>{p.name ? `${p.name}님` : "내 정보"}</b>
          <small>
            {p.y}.{String(p.m).padStart(2, "0")}.{String(p.d).padStart(2, "0")}
            {p.hour != null ? ` ${String(p.hour).padStart(2, "0")}시` : " (시 모름)"} · {p.gender === "M" ? "남" : "여"} · {p.cal === "lunar" ? "음력" : "양력"}
          </small>
        </span>
      </div>
      <div className="acts">
        <button onClick={onEdit}>✏️ 수정</button>
        <button onClick={onDelete}>🗑️ 삭제</button>
      </div>
    </div>
  );
}
