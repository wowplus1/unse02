// URL search params → 사주 입력 파싱 (서버 컴포넌트 공용).
// 파라미터: y, m, d, h(시·선택), g(M/W), cal(solar/lunar)
import { computeSaju, SajuProfile } from "./saju";

export interface ParsedProfile {
  y: number; m: number; d: number;
  hour: number | null;
  gender: "M" | "W";
  cal: "solar" | "lunar";
}

export function parseProfile(sp: Record<string, string | undefined>): ParsedProfile | null {
  const y = Number(sp.y), m = Number(sp.m), d = Number(sp.d);
  if (!y || !m || !d) return null;
  return {
    y, m, d,
    hour: sp.h ? Number(sp.h) : null,
    gender: sp.g === "W" ? "W" : "M",
    cal: sp.cal === "lunar" ? "lunar" : "solar",
  };
}

export function sajuFrom(p: ParsedProfile): SajuProfile {
  return computeSaju(p.y, p.m, p.d, p.hour, p.gender, p.cal);
}

// 다른 페이지 링크에 프로필 파라미터를 붙일 때
export function qs(p: ParsedProfile): string {
  return `y=${p.y}&m=${p.m}&d=${p.d}&h=${p.hour ?? ""}&g=${p.gender}&cal=${p.cal}`;
}

// AutoFill 이 localStorage 프로필을 URL 파라미터로 매핑할 때 쓰는 맵
export const AUTOFILL_MAP = { y: "y", m: "m", d: "d", h: "h", gender: "g", cal: "cal" };
