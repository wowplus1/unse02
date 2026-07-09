// 정통 명리 일진 분석 — 일간(日干)과 오늘 일진의 십신(十神)·오행 생극·십이운성 관계로 길흉/주제 판정.
import { Solar } from "lunar-typescript";
import { UNSEONG, unseongIndex } from "./saju";

const GAN_YANG: Record<string, boolean> = { 甲: true, 丙: true, 戊: true, 庚: true, 壬: true, 乙: false, 丁: false, 己: false, 辛: false, 癸: false };
const GAN_OH: Record<string, string> = { 甲: "목", 乙: "목", 丙: "화", 丁: "화", 戊: "토", 己: "토", 庚: "금", 辛: "금", 壬: "수", 癸: "수" };
const GAN_KO: Record<string, string> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계" };
const ZHI_KO: Record<string, string> = { 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해" };
const SHENG: Record<string, string> = { 목: "화", 화: "토", 토: "금", 금: "수", 수: "목" };
const KE: Record<string, string> = { 목: "토", 토: "수", 수: "화", 화: "금", 금: "목" };

export interface Sipsin { name: string; cat: string; tone: "길" | "주의" | "중립"; }
export function sipsinOf(dayGan: string, other: string): Sipsin {
  const od = GAN_OH[dayGan], oo = GAN_OH[other];
  const same = GAN_YANG[dayGan] === GAN_YANG[other];
  if (od === oo) return { name: same ? "비견" : "겁재", cat: "비겁", tone: same ? "중립" : "주의" };
  if (SHENG[od] === oo) return { name: same ? "식신" : "상관", cat: "식상", tone: same ? "길" : "주의" };
  if (KE[od] === oo) return { name: same ? "편재" : "정재", cat: "재성", tone: "길" };
  if (KE[oo] === od) return { name: same ? "편관" : "정관", cat: "관성", tone: same ? "주의" : "길" };
  return { name: same ? "편인" : "정인", cat: "인성", tone: same ? "중립" : "길" };
}

const CAT_THEME: Record<string, { title: string; desc: string }> = {
  재성: { title: "재물·성취운", desc: "재물의 기회와 씀씀이가 함께 커지는 흐름입니다. 실리를 챙기되 과한 지출은 삼가세요." },
  관성: { title: "직장·명예운", desc: "책임과 질서, 윗사람·규범과 관련된 일이 부각됩니다. 신중하면 인정받고, 무리하면 압박이 됩니다." },
  식상: { title: "표현·활동운", desc: "재능과 표현, 의식주의 여유가 살아나는 날입니다. 다만 말과 감정 표현은 절제가 필요합니다." },
  인성: { title: "문서·귀인운", desc: "공부·계약·문서, 귀인의 도움과 안정이 따르는 흐름입니다. 배우고 받아들이기에 좋습니다." },
  비겁: { title: "인간관계·경쟁운", desc: "동료·경쟁·협력이 부각됩니다. 협력엔 좋지만 금전 거래나 보증은 조심하세요." },
};

export interface DailyMyeongri {
  todayGanzhi: string;
  todayGanKo: string;
  sipsin: string;
  cat: string;
  tone: "길" | "주의" | "중립";
  ohengRel: string;     // 오행 관계 한줄
  unseong: string;      // 오늘 지지의 십이운성(일간 기준)
  themeTitle: string;
  summary: string;
  score: number;        // 1~10 대략 길흉
}

// 특정 날짜의 일진 간지
export function ganzhiOfDate(date: Date): string {
  return Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate()).getLunar().getEightChar().getDay();
}

export function dailyMyeongri(dayGan: string, todayGanzhi: string): DailyMyeongri {
  const tGan = todayGanzhi.charAt(0), tZhi = todayGanzhi.charAt(1);
  const ss = sipsinOf(dayGan, tGan);
  const od = GAN_OH[dayGan], to = GAN_OH[tGan];
  let ohengRel: string;
  if (od === to) ohengRel = `오늘 기운(${to})이 내 일간(${od})과 같아 비화(比和) — 경쟁과 협력이 공존`;
  else if (SHENG[to] === od) ohengRel = `오늘 기운(${to})이 내 일간(${od})을 생(生)해 도움을 받는 흐름`;
  else if (SHENG[od] === to) ohengRel = `내 일간(${od})이 오늘 기운(${to})을 생(生)해 기운을 내보내는 흐름`;
  else if (KE[od] === to) ohengRel = `내 일간(${od})이 오늘 기운(${to})을 극(剋)해 성취·재물의 흐름`;
  else ohengRel = `오늘 기운(${to})이 내 일간(${od})을 극(剋)해 압박·관리가 필요한 흐름`;

  const uns = UNSEONG[unseongIndex(dayGan, tZhi)];
  const theme = CAT_THEME[ss.cat];
  // 십이운성 강약 → 점수 보정
  const strong = ["장생", "건록", "제왕", "관대"].includes(uns);
  const weak = ["병", "사", "묘", "절"].includes(uns);
  let score = ss.tone === "길" ? 8 : ss.tone === "주의" ? 5 : 6;
  if (strong) score += 1; if (weak) score -= 1;
  score = Math.max(2, Math.min(10, score));

  const toneMsg = ss.tone === "길" ? "전반적으로 순조로운" : ss.tone === "주의" ? "변수에 유의할" : "무난한";
  const summary =
    `오늘은 내 일간 ${GAN_KO[dayGan]}(${dayGan})에 대해 오늘 일진의 천간이 '${ss.name}(${ss.cat})'에 해당합니다. ` +
    `${theme.desc} ${ohengRel}이며, 오늘 지지는 십이운성 '${uns}'라 기운은 ${strong ? "왕성한" : weak ? "약해지는" : "보통인"} 상태입니다. ` +
    `종합하면 ${toneMsg} 하루입니다.`;

  return {
    todayGanzhi, todayGanKo: (GAN_KO[tGan] ?? tGan) + (ZHI_KO[tZhi] ?? tZhi),
    sipsin: ss.name, cat: ss.cat, tone: ss.tone, ohengRel, unseong: uns,
    themeTitle: theme.title, summary, score,
  };
}
