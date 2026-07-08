"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ProfileForm from "./ProfileForm";

const KEY = "unse_profile";
interface Prof { name?: string; y: number; m: number; d: number; h: number | null; gender: "M" | "W"; cal: "solar" | "lunar"; }

// 모든 페이지 상단에 쓰는 "내 정보" 요약 바 — 요약 표시 + 수정/삭제.
// 저장된 프로필이 없으면 아무것도 렌더하지 않음(온보딩/입력 폼이 대신 뜸).
export default function ProfileBar() {
  const [p, setP] = useState<Prof | null>(null);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);
  const path = usePathname() || "/";

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setP(JSON.parse(s)); } catch {}
    setReady(true);
  }, []);

  if (!ready || !p) return null; // 프로필 없으면 표시 안 함

  const onDelete = () => {
    if (!confirm("저장된 내 정보를 삭제할까요?")) return;
    try { localStorage.removeItem(KEY); } catch {}
    window.location.href = "/"; // 온보딩으로
  };

  if (editing) {
    return (
      <div className="mt">
        <ProfileForm redirect={path} compact />
        <button className="btn ghost mt" onClick={() => setEditing(false)}>취소</button>
      </div>
    );
  }

  return (
    <div className="profbar">
      <div className="who">
        <span className="av">👤</span>
        <span>
          <b>{p.name ? `${p.name}님` : "내 정보"}</b>
          <small>
            {p.y}.{String(p.m).padStart(2, "0")}.{String(p.d).padStart(2, "0")}
            {p.h != null ? ` ${String(p.h).padStart(2, "0")}시` : " (시 모름)"} · {p.gender === "M" ? "남" : "여"} · {p.cal === "lunar" ? "음력" : "양력"}
          </small>
        </span>
      </div>
      <div className="acts">
        <button onClick={() => setEditing(true)}>✏️ 수정</button>
        <button onClick={onDelete}>🗑️ 삭제</button>
      </div>
    </div>
  );
}
