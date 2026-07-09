// 만세력/사주 엔진 — lunar-typescript 기반.
// 입력(생년월일시·성별·양음력) -> SajuProfile(간지·오행·십이운성·띠·별자리·키값)
import { Solar, Lunar, EightChar } from "lunar-typescript";

// 진태양시/야자시 옵션
export interface SajuOpts {
  minute?: number;         // 출생 분(0~59)
  longitude?: number;      // 출생지 경도(동경). 기본 서울 126.98
  trueSolar?: boolean;     // 진태양시(경도+균시차) 보정
  sect?: 1 | 2;            // 자시 기준: 1=야자시(23시부터 다음날 일주), 2=자정 기준(기본)
}
// 주요 도시 경도(동경)
export const REGIONS: { name: string; lon: number }[] = [
  { name: "서울", lon: 126.98 }, { name: "인천", lon: 126.71 }, { name: "수원", lon: 127.03 },
  { name: "춘천", lon: 127.73 }, { name: "강릉", lon: 128.90 }, { name: "대전", lon: 127.38 },
  { name: "대구", lon: 128.60 }, { name: "부산", lon: 129.08 }, { name: "울산", lon: 129.31 },
  { name: "광주", lon: 126.85 }, { name: "전주", lon: 127.15 }, { name: "제주", lon: 126.53 },
];
// 균시차(분) 근사식
function eqOfTime(dt: Date): number {
  const start = new Date(dt.getFullYear(), 0, 0);
  const N = Math.floor((dt.getTime() - start.getTime()) / 86400000);
  const B = (2 * Math.PI * (N - 81)) / 364;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}
interface Resolved { solar: Solar; lunar: Lunar; ec: EightChar; origHM: string; corrHM: string; corrected: boolean; }
function resolveBirth(
  y: number, m: number, d: number, hour: number | null, minute: number,
  calendar: "solar" | "lunar", opts: SajuOpts
): Resolved {
  const h = hour ?? 12;
  const base = calendar === "lunar"
    ? Lunar.fromYmdHms(y, m, d, h, minute, 0).getSolar()
    : Solar.fromYmdHms(y, m, d, h, minute, 0);
  const origHM = `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  let solar = base;
  let corrected = false;
  let corrHM = origHM;
  if (opts.trueSolar && hour !== null) {
    const lon = opts.longitude ?? 126.98;
    const jsd = new Date(base.getYear(), base.getMonth() - 1, base.getDay(), base.getHour(), base.getMinute(), 0);
    const corr = (lon - 135) * 4 + eqOfTime(jsd); // 분
    jsd.setMinutes(jsd.getMinutes() + Math.round(corr));
    solar = Solar.fromYmdHms(jsd.getFullYear(), jsd.getMonth() + 1, jsd.getDate(), jsd.getHours(), jsd.getMinutes(), 0);
    corrected = true;
    corrHM = `${String(jsd.getHours()).padStart(2, "0")}:${String(jsd.getMinutes()).padStart(2, "0")}`;
  }
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  ec.setSect(opts.sect ?? 2);
  return { solar, lunar, ec, origHM, corrHM, corrected };
}

// 한자 -> 한글 매핑
const GAN_KO: Record<string, string> = {
  甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무",
  己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계",
};
const ZHI_KO: Record<string, string> = {
  子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사",
  午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해",
};
const ZODIAC_KO: Record<string, string> = {
  子: "쥐", 丑: "소", 寅: "범", 卯: "토끼", 辰: "용", 巳: "뱀",
  午: "말", 未: "양", 申: "원숭이", 酉: "닭", 戌: "개", 亥: "돼지",
};
const GAN_LIST = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const ZHI_LIST = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 오행
const GAN_OHENG: Record<string, string> = {
  甲: "목", 乙: "목", 丙: "화", 丁: "화", 戊: "토",
  己: "토", 庚: "금", 辛: "금", 壬: "수", 癸: "수",
};
const ZHI_OHENG: Record<string, string> = {
  寅: "목", 卯: "목", 巳: "화", 午: "화", 辰: "토", 戌: "토",
  丑: "토", 未: "토", 申: "금", 酉: "금", 子: "수", 亥: "수",
};

// 십이운성(십이장생) — 1=장생 ... 12=양
export const UNSEONG = [
  "장생", "목욕", "관대", "건록", "제왕", "쇠",
  "병", "사", "묘", "절", "태", "양",
];
// 일간별 장생 시작 지지 index 와 방향(양간 순행 +1, 음간 역행 -1)
const UNSEONG_START: Record<string, [number, number]> = {
  甲: [11, +1], 乙: [6, -1], 丙: [2, +1], 丁: [9, -1], 戊: [2, +1],
  己: [9, -1], 庚: [5, +1], 辛: [0, -1], 壬: [8, +1], 癸: [3, -1],
};

export function unseongIndex(dayGan: string, zhi: string): number {
  const [start, dir] = UNSEONG_START[dayGan];
  const z = ZHI_LIST.indexOf(zhi);
  const idx = dir === 1 ? (z - start + 12) % 12 : (start - z + 12) % 12;
  return idx; // 0=장생
}

// 별자리 (양력 월/일 기준)
const ZODIAC_SIGNS: [number, number, string][] = [
  [1, 20, "물병자리"], [2, 19, "물고기자리"], [3, 21, "양자리"], [4, 20, "황소자리"],
  [5, 21, "쌍둥이자리"], [6, 22, "게자리"], [7, 23, "사자자리"], [8, 23, "처녀자리"],
  [9, 23, "천칭자리"], [10, 23, "전갈자리"], [11, 23, "사수자리"], [12, 22, "염소자리"],
];
function starSign(month: number, day: number): string {
  // 각 구간의 시작일 이후면 해당 별자리. 염소자리(12/22~1/19) 처리 포함.
  for (let i = ZODIAC_SIGNS.length - 1; i >= 0; i--) {
    const [m, d, name] = ZODIAC_SIGNS[i];
    if (month > m || (month === m && day >= d)) return name;
  }
  return "염소자리"; // 1/1~1/19
}

export interface Pillar {
  ganzhiHan: string; // 甲子
  ganKo: string;
  zhiKo: string;
  ganOheng: string;
  zhiOheng: string;
  unseong: string;
}

export interface SajuProfile {
  input: { y: number; m: number; d: number; hour: number | null; gender: "M" | "W"; calendar: "solar" | "lunar" };
  solarText: string;
  lunarText: string;
  year: Pillar;
  month: Pillar;
  day: Pillar;
  time: Pillar | null;
  dayGan: string;      // 한자 일간
  dayGanKo: string;
  dayGanIndex: number; // 1~10 (甲=1)
  iljuCode: string;    // 60갑자 코드 (甲=A..癸=J) + 월지순번(寅=1) 2자리, 예: 甲子->A11
  dayZhi: string;
  zodiac: string;      // 띠 (한글)
  yearZhi: string;     // 년지 한자
  starSign: string;    // 별자리
  lunarMonth: number;  // 음력 생월(1~12)
  timeZhiHan: string | null; // 시지 한자(시 모름이면 null)
  dayUnseongIndex: number; // 1~12
  dayUnseong: string;
  ohengCount: Record<string, number>;
  timeInfo: { origin: string; corrected: string; trueSolar: boolean; sect: number } | null; // 진태양시/야자시 정보
}

function pillar(ganzhi: string, dayGan: string): Pillar {
  const gan = ganzhi.charAt(0);
  const zhi = ganzhi.charAt(1);
  return {
    ganzhiHan: ganzhi,
    ganKo: GAN_KO[gan] ?? gan,
    zhiKo: ZHI_KO[zhi] ?? zhi,
    ganOheng: GAN_OHENG[gan] ?? "",
    zhiOheng: ZHI_OHENG[zhi] ?? "",
    unseong: UNSEONG[unseongIndex(dayGan, zhi)],
  };
}

export function computeSaju(
  y: number, m: number, d: number, hour: number | null,
  gender: "M" | "W", calendar: "solar" | "lunar", opts: SajuOpts = {}
): SajuProfile {
  const minute = opts.minute ?? 0;
  const { solar, lunar, ec, origHM, corrHM, corrected } = resolveBirth(y, m, d, hour, minute, calendar, opts);
  const yearGz = ec.getYear();
  const monthGz = ec.getMonth();
  const dayGz = ec.getDay();
  const timeGz = ec.getTime();
  const dayGan = dayGz.charAt(0);
  const dayZhi = dayGz.charAt(1);
  const yearZhi = yearGz.charAt(1);

  const oheng: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const addOheng = (gz: string) => {
    oheng[GAN_OHENG[gz.charAt(0)]]++;
    oheng[ZHI_OHENG[gz.charAt(1)]]++;
  };
  [yearGz, monthGz, dayGz].forEach(addOheng);
  if (hour !== null) addOheng(timeGz);

  const dUnseong = unseongIndex(dayGan, dayZhi);

  // 60갑자 코드: 천간자모 + 월지순번(寅=1)
  const ganIdx = GAN_LIST.indexOf(dayGan);
  const zhiIdx = ZHI_LIST.indexOf(dayZhi);
  const iljuNum = ((zhiIdx - 2 + 12) % 12) + 1;
  const iljuCode = "ABCDEFGHIJ".charAt(ganIdx) + String(iljuNum).padStart(2, "0");

  return {
    input: { y, m, d, hour, gender, calendar },
    solarText: `${solar.getYear()}년 ${solar.getMonth()}월 ${solar.getDay()}일`,
    lunarText: `${lunar.getYear()}년 ${lunar.getMonth()}월 ${lunar.getDay()}일`,
    year: pillar(yearGz, dayGan),
    month: pillar(monthGz, dayGan),
    day: pillar(dayGz, dayGan),
    time: hour !== null ? pillar(timeGz, dayGan) : null,
    dayGan,
    dayGanKo: GAN_KO[dayGan],
    dayGanIndex: GAN_LIST.indexOf(dayGan) + 1,
    iljuCode,
    dayZhi,
    zodiac: ZODIAC_KO[yearZhi],
    yearZhi,
    starSign: starSign(solar.getMonth(), solar.getDay()),
    lunarMonth: Math.abs(lunar.getMonth()),
    timeZhiHan: hour !== null ? timeGz.charAt(1) : null,
    dayUnseongIndex: dUnseong + 1,
    dayUnseong: UNSEONG[dUnseong],
    ohengCount: oheng,
    timeInfo: hour !== null ? { origin: origHM, corrected: corrHM, trueSolar: corrected, sect: opts.sect ?? 2 } : null,
  };
}

// 대운 흐름 (lunar-typescript getYun 사용)
export interface Daeun {
  order: number;      // 대운 순번 1~
  ganzhiHan: string;
  ganKo: string; zhiKo: string;
  zhiIndex: number;   // 子=1 .. 亥=12
  startAge: number;
  startYear: number;
}
export function daeunList(
  y: number, m: number, d: number, hour: number | null,
  gender: "M" | "W", calendar: "solar" | "lunar", opts: SajuOpts = {}
): Daeun[] {
  const { ec } = resolveBirth(y, m, d, hour, opts.minute ?? 0, calendar, opts);
  const yun = ec.getYun(gender === "M" ? 1 : 0);
  const arr = yun.getDaYun();
  const out: Daeun[] = [];
  let order = 0;
  for (const dy of arr) {
    const gz = dy.getGanZhi();
    if (!gz || gz.length < 2) continue; // 초기 비운(대운 이전) 구간 스킵
    order++;
    const zhi = gz.charAt(1);
    out.push({
      order,
      ganzhiHan: gz,
      ganKo: GAN_KO[gz.charAt(0)] ?? gz.charAt(0),
      zhiKo: ZHI_KO[zhi] ?? zhi,
      zhiIndex: ZHI_LIST.indexOf(zhi) + 1,
      startAge: dy.getStartAge(),
      startYear: dy.getStartYear(),
    });
    if (order >= 8) break;
  }
  return out;
}

export { ZHI_KO, GAN_KO, ZODIAC_KO, ZHI_LIST };
