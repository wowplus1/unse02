// 계산형 재미 운세: 행운번호(로또), 바이오리듬, 이름궁합.
import { Solar } from "lunar-typescript";

// ---- 행운 번호(로또) : 생년월일+날짜 시드로 결정적 6+1 ----
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function luckyNumbers(seed: number): { main: number[]; bonus: number } {
  const rnd = mulberry32(seed);
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const main = pool.slice(0, 6).sort((a, b) => a - b);
  const bonus = pool[6];
  return { main, bonus };
}

// ---- 바이오리듬 : 생년월일 ~ 대상일 경과일 기준 사인파 ----
export interface Bio { physical: number; emotional: number; intellectual: number; days: number; }
export function biorhythm(by: number, bm: number, bd: number, target: Date): Bio {
  const birthJd = Math.floor(Solar.fromYmd(by, bm, bd).getJulianDay());
  const targetJd = Math.floor(Solar.fromYmd(target.getFullYear(), target.getMonth() + 1, target.getDate()).getJulianDay());
  const days = targetJd - birthJd;
  const wave = (cycle: number) => Math.round(Math.sin((2 * Math.PI * days) / cycle) * 100);
  return { physical: wave(23), emotional: wave(28), intellectual: wave(33), days };
}

// ---- 이름 궁합 (한글 획수 방식) ----
const CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const JUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const STROKE: Record<string, number> = {
  "ㄱ": 2, "ㄲ": 4, "ㄴ": 2, "ㄷ": 3, "ㄸ": 6, "ㄹ": 5, "ㅁ": 4, "ㅂ": 4, "ㅃ": 8, "ㅅ": 2, "ㅆ": 4, "ㅇ": 1, "ㅈ": 3, "ㅉ": 6, "ㅊ": 4, "ㅋ": 3, "ㅌ": 4, "ㅍ": 4, "ㅎ": 3,
  "ㅏ": 2, "ㅐ": 3, "ㅑ": 3, "ㅒ": 4, "ㅓ": 2, "ㅔ": 3, "ㅕ": 3, "ㅖ": 4, "ㅗ": 2, "ㅘ": 4, "ㅙ": 5, "ㅚ": 3, "ㅛ": 3, "ㅜ": 2, "ㅝ": 4, "ㅞ": 5, "ㅟ": 3, "ㅠ": 3, "ㅡ": 1, "ㅢ": 2, "ㅣ": 1,
  "ㄳ": 4, "ㄵ": 5, "ㄶ": 5, "ㄺ": 7, "ㄻ": 9, "ㄼ": 9, "ㄽ": 7, "ㄾ": 9, "ㄿ": 9, "ㅀ": 8, "ㅄ": 6,
};
function syllableStroke(ch: string): number {
  const code = ch.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return 0; // 한글 음절 아님
  const idx = code - 0xac00;
  const cho = CHO[Math.floor(idx / 588)];
  const jung = JUNG[Math.floor((idx % 588) / 28)];
  const jong = JONG[idx % 28];
  return (STROKE[cho] || 0) + (STROKE[jung] || 0) + (STROKE[jong] || 0);
}
// 이름 두 개를 번갈아 배치 → 인접합 반복 → 2자리 백분율
export function nameCompat(a: string, b: string): number {
  const ca = [...a.replace(/\s/g, "")], cb = [...b.replace(/\s/g, "")];
  let row: number[] = [];
  const n = Math.max(ca.length, cb.length);
  for (let i = 0; i < n; i++) {
    if (ca[i]) row.push(syllableStroke(ca[i]));
    if (cb[i]) row.push(syllableStroke(cb[i]));
  }
  if (row.length < 2) return 50;
  while (row.length > 2) {
    const next: number[] = [];
    for (let i = 0; i < row.length - 1; i++) next.push((row[i] + row[i + 1]) % 10);
    row = next;
  }
  return row[0] * 10 + row[1];
}

// 지지 시드(띠) / 별자리 시드용 상수
export const DDI = [
  { han: "子", ko: "쥐", emoji: "🐭" }, { han: "丑", ko: "소", emoji: "🐮" }, { han: "寅", ko: "범", emoji: "🐯" },
  { han: "卯", ko: "토끼", emoji: "🐰" }, { han: "辰", ko: "용", emoji: "🐲" }, { han: "巳", ko: "뱀", emoji: "🐍" },
  { han: "午", ko: "말", emoji: "🐴" }, { han: "未", ko: "양", emoji: "🐑" }, { han: "申", ko: "원숭이", emoji: "🐵" },
  { han: "酉", ko: "닭", emoji: "🐔" }, { han: "戌", ko: "개", emoji: "🐶" }, { han: "亥", ko: "돼지", emoji: "🐷" },
];
export const SIGNS = [
  { ko: "양자리", emoji: "♈" }, { ko: "황소자리", emoji: "♉" }, { ko: "쌍둥이자리", emoji: "♊" }, { ko: "게자리", emoji: "♋" },
  { ko: "사자자리", emoji: "♌" }, { ko: "처녀자리", emoji: "♍" }, { ko: "천칭자리", emoji: "♎" }, { ko: "전갈자리", emoji: "♏" },
  { ko: "사수자리", emoji: "♐" }, { ko: "염소자리", emoji: "♑" }, { ko: "물병자리", emoji: "♒" }, { ko: "물고기자리", emoji: "♓" },
];
