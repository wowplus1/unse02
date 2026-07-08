// 토정비결 작괘법 + 오늘의 일진.
// 상괘=(세는나이+태세수)%8, 중괘=(음력생월 대소일수+월건수)%6, 하괘=(음력생일+일진수)%3
// 태세수/월건수/일진수: 간지 선천수(先天數) 합 기반. (정통 산법 · 실제 책력과 대조 권장)
import { Solar, Lunar, LunarMonth } from "lunar-typescript";

// 선천수(先天數)
const GAN_SEON: Record<string, number> = {
  甲: 9, 己: 9, 乙: 8, 庚: 8, 丙: 7, 辛: 7, 丁: 6, 壬: 6, 戊: 5, 癸: 5,
};
const ZHI_SEON: Record<string, number> = {
  子: 9, 午: 9, 丑: 8, 未: 8, 寅: 7, 申: 7, 卯: 6, 酉: 6, 辰: 5, 戌: 5, 巳: 4, 亥: 4,
};
// 태세/일진수는 선천수합 + 6 오프셋(공개 예시 2005 乙酉=20, 丙辰일=18로 검증). 월건은 오프셋 없음.
const seon = (gz: string) => GAN_SEON[gz.charAt(0)] + ZHI_SEON[gz.charAt(1)];

export interface TojeongResult {
  key: string;      // "111" ~ "863"
  sang: number; jung: number; ha: number;
  ageSe: number;    // 세는나이
  targetYear: number;
  yearGz: string;   // 세운 간지(한자)
}

function birthLunar(y: number, m: number, d: number, cal: "solar" | "lunar"): Lunar {
  return cal === "lunar" ? Lunar.fromYmd(y, m, d) : Solar.fromYmd(y, m, d).getLunar();
}

export function tojeong(
  y: number, m: number, d: number, cal: "solar" | "lunar", targetYear: number
): TojeongResult {
  const lunar = birthLunar(y, m, d, cal);
  const ec = lunar.getEightChar();

  // 세운(보는 해) 간지 — 연중(6월)로 잡아 입춘 경계 회피
  const yearGz = Solar.fromYmd(targetYear, 6, 1).getLunar().getYearInGanZhi();
  const ageSe = targetYear - lunar.getYear() + 1;

  // 상괘
  const taese = seon(yearGz) + 6;
  const sang = ((ageSe + taese) % 8) || 8;

  // 중괘: 음력 생월 대소 일수 + 월건수
  const lmonth = Math.abs(lunar.getMonth());
  const dayCount = LunarMonth.fromYm(lunar.getYear(), lmonth)?.getDayCount() ?? 30;
  const wolgeon = seon(ec.getMonth());
  const jung = ((dayCount + wolgeon) % 6) || 6;

  // 하괘: 음력 생일 + 일진수
  const iljin = seon(ec.getDay()) + 6; // +6 은 mod 3 에서 무의미하나 표기상 유지
  const ha = ((lunar.getDay() + iljin) % 3) || 3;

  return { key: `${sang}${jung}${ha}`, sang, jung, ha, ageSe, targetYear, yearGz };
}

// 특정 날짜의 일진 + 180개 풀 중 결정적 선택
const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];
export interface DailyPick {
  dateText: string;
  weekday: string;
  ilju: string;     // 일주 간지(한자)
  iljuGan: string;  // 일간(한자)
  index: number;    // 0~179
  isToday: boolean;
}
// seed: 생년월일 등 개인 시드(오늘 일진 + 개인 시드로 개인화). 0이면 날짜만(비개인).
export function pickForDate(pool: string[], date: Date, today: Date = new Date(), seed = 0): DailyPick {
  const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const ilju = solar.getLunar().getEightChar().getDay();
  const jd = Math.floor(solar.getJulianDay());
  const n = pool.length || 1;
  const index = (((jd + seed) % n) + n) % n;
  const sameDay = date.toDateString() === today.toDateString();
  return {
    dateText: `${date.getMonth() + 1}월 ${date.getDate()}일`,
    weekday: WEEKDAY[date.getDay()],
    ilju, iljuGan: ilju.charAt(0), index, isToday: sameDay,
  };
}
export function todayPick(pool: string[], now: Date = new Date(), seed = 0): DailyPick {
  return pickForDate(pool, now, now, seed);
}

// 생년월일(양/음력) → 개인 시드(양력 율리우스일)
export function julianOf(y: number, m: number, d: number, cal: "solar" | "lunar" = "solar"): number {
  const solar = cal === "lunar" ? Lunar.fromYmd(y, m, d).getSolar() : Solar.fromYmd(y, m, d);
  return Math.floor(solar.getJulianDay());
}

// 개인화 시드: 생년월일 + 생시(있으면). 오늘의 운세를 사람마다(시간대까지) 다르게.
export function personalSeed(y: number, m: number, d: number, hour: number | null, cal: "solar" | "lunar" = "solar"): number {
  return julianOf(y, m, d, cal) + (hour == null ? 0 : (hour + 1) * 7);
}

// 특정 연도의 년지(한자)
export function yearZhiOf(year: number): string {
  return Solar.fromYmd(year, 6, 1).getLunar().getYearInGanZhi().charAt(1);
}

// 삼재 계산: 생년 띠(년지) × 대상 연도
const SAMJAE_GROUP: Record<string, string[]> = {
  申: ["寅", "卯", "辰"], 子: ["寅", "卯", "辰"], 辰: ["寅", "卯", "辰"],
  巳: ["亥", "子", "丑"], 酉: ["亥", "子", "丑"], 丑: ["亥", "子", "丑"],
  寅: ["申", "酉", "戌"], 午: ["申", "酉", "戌"], 戌: ["申", "酉", "戌"],
  亥: ["巳", "午", "未"], 卯: ["巳", "午", "未"], 未: ["巳", "午", "未"],
};
const SAMJAE_PHASE = ["들삼재", "눌삼재", "날삼재"];
export function samjae(birthYearZhi: string, targetYear: number): { isSamjae: boolean; phase: string; years: string[] } {
  const years = SAMJAE_GROUP[birthYearZhi] || [];
  const tz = yearZhiOf(targetYear);
  const i = years.indexOf(tz);
  return { isSamjae: i >= 0, phase: i >= 0 ? SAMJAE_PHASE[i] : "", years };
}
