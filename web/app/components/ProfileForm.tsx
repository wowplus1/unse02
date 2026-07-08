"use client";
import { useEffect, useState } from "react";

export interface Prof {
  name?: string;
  y: number; m: number; d: number;
  h: number | null;
  gender: "M" | "W";
  cal: "solar" | "lunar";
}
const KEY = "unse_profile";

function urlWith(p: Prof, base: string): string {
  const q = `y=${p.y}&m=${p.m}&d=${p.d}&h=${p.h ?? ""}&g=${p.gender}&cal=${p.cal}`;
  return base + (base.includes("?") ? "&" : "?") + q;
}

// 생년월일 입력 폼. 저장 후 redirect 경로로 이동(프로필 파라미터 부착).
export default function ProfileForm({ redirect = "/", compact = false }: { redirect?: string; compact?: boolean }) {
  const [p, setP] = useState<Prof | null>(null);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setP(JSON.parse(s)); } catch {}
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const np: Prof = {
      name: (f.get("name") as string) || "",
      y: +(f.get("y") as string), m: +(f.get("m") as string), d: +(f.get("d") as string),
      h: f.get("h") ? +(f.get("h") as string) : null,
      gender: f.get("gender") === "W" ? "W" : "M",
      cal: f.get("cal") === "lunar" ? "lunar" : "solar",
    };
    try { localStorage.setItem(KEY, JSON.stringify(np)); } catch {}
    window.location.href = urlWith(np, redirect);
  };

  return (
    <div className="panel">
      {!compact && <h3>🔮 내 정보 등록</h3>}
      <p className="muted" style={{ fontSize: 13, marginTop: compact ? 0 : 4 }}>
        한 번만 등록하면 다음부터 재입력 없이 바로 봐요. <b>이 기기에만</b> 저장됩니다.
      </p>
      <form onSubmit={onSubmit}>
        <div className="row2 field">
          <div><label>이름/별칭 (선택)</label><input name="name" defaultValue={p?.name} placeholder="홍길동" /></div>
          <div><label>달력</label>
            <select name="cal" defaultValue={p?.cal || "solar"}>
              <option value="solar">양력</option><option value="lunar">음력(평달)</option>
            </select>
          </div>
        </div>
        <div className="row field">
          <div><label>년</label><input name="y" type="number" placeholder="1990" defaultValue={p?.y} required /></div>
          <div><label>월</label><input name="m" type="number" min={1} max={12} defaultValue={p?.m} required /></div>
          <div><label>일</label><input name="d" type="number" min={1} max={31} defaultValue={p?.d} required /></div>
        </div>
        <div className="row2 field">
          <div><label>태어난 시각</label>
            <select name="h" defaultValue={p?.h ?? ""}>
              <option value="">모름</option>
              {Array.from({ length: 24 }).map((_, i) => <option key={i} value={i}>{String(i).padStart(2, "0")}시</option>)}
            </select>
          </div>
          <div><label>성별</label>
            <select name="gender" defaultValue={p?.gender || "M"}>
              <option value="M">남성</option><option value="W">여성</option>
            </select>
          </div>
        </div>
        <button className="btn mt" type="submit">✨ 등록하고 운세 보기</button>
      </form>
    </div>
  );
}
