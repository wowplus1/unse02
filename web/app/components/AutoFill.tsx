"use client";
import { useEffect } from "react";

// 생년월일(y,m,d) 파라미터가 없으면 저장된 프로필로 채워 이동.
// 이미 있으면 그대로. 프로필도 없으면 아무것도 안 함(입력 폼 노출).
export default function AutoFill({ map }: { map: Record<string, string> }) {
  useEffect(() => {
    const cur = new URLSearchParams(window.location.search);
    if (cur.get("y") && cur.get("m") && cur.get("d")) return;
    try {
      const s = localStorage.getItem("unse_profile");
      if (!s) return;
      const p = JSON.parse(s) as Record<string, any>;
      let added = false;
      for (const [field, param] of Object.entries(map)) {
        const v = p[field];
        if (v === null || v === undefined || v === "") continue;
        if (!cur.has(param)) { cur.set(param, String(v)); added = true; }
      }
      if (added) window.location.replace(window.location.pathname + "?" + cur.toString());
    } catch { /* noop */ }
  }, [map]);
  return null;
}
