// 가벼운 매일 운세 엔진 — 생년월일 + 오늘 날짜로 결정적(seed) 산출.
// 명리 계산(dailyMyeongri)을 기반 점수로 쓰되, 재미있게 0~100 + 키워드/이모지로 포장.
import { computeSaju, SajuProfile } from "./saju";
import { dailyPool, dailyReadings, luckyByOheng, OHENG_KO_LIST } from "./content";
import { personalSeed, todayPick, julianOf } from "./tojeong";
import { dailyMyeongri, ganzhiOfDate } from "./myeongri";
import { DDI, SIGNS } from "./fun";
import type { ParsedProfile } from "./profile";

// 결정적 해시 (문자/숫자 seed → 0..1)
function hash01(seed: number): number {
  let t = (seed ^ 0x9e3779b9) >>> 0;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function pickFrom<T>(arr: T[], seed: number): T {
  return arr[Math.floor(hash01(seed) * arr.length) % arr.length];
}
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const firstSentence = (body: string, max = 60) => {
  const s = (body || "").replace(/\n+/g, " ").trim().split(/(?<=[.!?다요])\s/)[0] || "";
  return s.length > max ? s.slice(0, max) + "…" : s;
};

// 점수대별 무드(키워드+이모지)
const MOODS: { min: number; keys: string[]; emojis: string[]; tone: string }[] = [
  { min: 85, tone: "최고", keys: ["날아오르는 날", "빛나는 하루", "운이 트이는 날", "행운 가득"], emojis: ["🌟", "🔥", "✨", "🍀"] },
  { min: 70, tone: "좋음", keys: ["기분 좋은 하루", "순풍에 돛단 날", "설레는 하루", "웃음 나는 날"], emojis: ["😊", "🍀", "💛", "🌈"] },
  { min: 55, tone: "무난", keys: ["잔잔한 하루", "차분한 하루", "무난한 흐름", "커피 한 잔 같은 날"], emojis: ["🙂", "☕", "🌤️", "🧸"] },
  { min: 40, tone: "주의", keys: ["한 박자 쉬어가기", "조심조심", "살짝 흐림", "천천히 가는 날"], emojis: ["😌", "🌿", "🍵", "🌥️"] },
  { min: 0, tone: "휴식", keys: ["웅크리는 날", "내일을 위한 날", "충전이 필요해", "무리는 금물"], emojis: ["🫠", "🌧️", "🛋️", "🌙"] },
];
function moodOf(score: number, seed: number) {
  const m = MOODS.find((x) => score >= x.min)!;
  return { keyword: pickFrom(m.keys, seed), emoji: pickFrom(m.emojis, seed + 7), tone: m.tone };
}

// 날짜마다 바뀌는 카드 테마(배경 그라데이션 + 아이콘) — 흰 글씨가 잘 보이는 중간 채도로 구성.
const THEMES: { grad: string; icon: string }[] = [
  { grad: "linear-gradient(150deg,#e9a84c,#dd8f3a 55%,#c9762e)", icon: "🌅" },
  { grad: "linear-gradient(150deg,#b59a7d,#a5876a 55%,#8f7256)", icon: "🔮" },
  { grad: "linear-gradient(150deg,#7fa398,#6b9184 55%,#587d70)", icon: "🌊" },
  { grad: "linear-gradient(150deg,#8fa87e,#7d9668 55%,#6b8455)", icon: "🍃" },
  { grad: "linear-gradient(150deg,#e6b95c,#d9a544 55%,#c69133)", icon: "🌞" },
  { grad: "linear-gradient(150deg,#d29488,#c17d76 55%,#ad6763)", icon: "🌹" },
  { grad: "linear-gradient(150deg,#8fa87e,#7d9668 55%,#6b8455)", icon: "🍀" },
  { grad: "linear-gradient(150deg,#4a4642,#3a3632 55%,#2a2724)", icon: "✨" },
  { grad: "linear-gradient(150deg,#eabf6a,#e0a94c 55%,#cf9436)", icon: "🍑" },
  { grad: "linear-gradient(150deg,#a89bb0,#96889f 55%,#82758c)", icon: "🌙" },
];

// 오행 → 행운 아이템
const OHENG_ITEM: Record<string, string> = {
  목: "화분·우드 소품", 화: "레드 포인트·향초", 토: "골드 액세서리·도자기", 금: "화이트 셔츠·은 장신구", 수: "블루 아이템·텀블러",
};

export interface CatFortune { key: string; label: string; emoji: string; score: number; line: string; full: string; }
export interface MoreItem { key: string; label: string; emoji: string; full: string; }
export interface FunToday {
  dateText: string;
  weekday: string;
  score: number;        // 0~100 총운
  keyword: string;
  emoji: string;        // 날짜별 테마 아이콘
  grad: string;         // 날짜별 테마 배경 그라데이션
  tone: string;
  headline: string;     // 총운 한 줄
  cats: CatFortune[];   // 애정·금전·직장 (전체 본문 포함)
  more: MoreItem[];     // 총운 전체·소망·이동 (점수 없이 본문)
  luck: { color: string; num: string; item: string };
  zodiac: string;
  starSign: string;
  dayGanKo: string;
}

const WD = ["일", "월", "화", "수", "목", "금", "토"];

export function funToday(parsed: ParsedProfile, now: Date = new Date()): FunToday {
  const p = computeSaju(parsed.y, parsed.m, parsed.d, parsed.hour, parsed.gender, parsed.cal);
  const mr = dailyMyeongri(p.dayGan, ganzhiOfDate(now));

  const todayJd = julianOf(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const seed = personalSeed(parsed.y, parsed.m, parsed.d, parsed.hour, parsed.cal) + todayJd;

  // 총운 0~100: 명리 길흉(2~10)을 중심으로, 살짝 상향 바이어스 + 결정적 지터
  const base = 55 + (mr.score - 6) * 6;
  const score = clamp(Math.round(base + hash01(seed) * 14 - 3), 41, 99);
  const { keyword, tone } = moodOf(score, seed);
  // 날짜별 테마(배경+아이콘) — 사람+날짜 시드라 매일 바뀜
  const theme = pickFrom(THEMES, seed + 999);

  // 텍스트 풀
  const pool = dailyPool();
  const pick = todayPick(pool, now, personalSeed(parsed.y, parsed.m, parsed.d, parsed.hour, parsed.cal));
  const items = dailyReadings(pool[pick.index]);
  const byTitle = (t: string) => items.find((it) => it.title.includes(t));
  const chong = items[0];
  const headline = firstSentence(chong?.body || mr.summary, 70);

  const catScore = (salt: number) => clamp(Math.round(base + hash01(seed + salt) * 34 - 12), 33, 99);
  const loveBody = byTitle("애정")?.body || "";
  const moneyBody = byTitle("금전")?.body || "";
  const workBody = byTitle("사업")?.body || byTitle("직장")?.body || "";
  const cats: CatFortune[] = [
    { key: "love", label: "애정운", emoji: "💗", score: catScore(101), line: firstSentence(loveBody, 46), full: loveBody },
    { key: "money", label: "금전운", emoji: "💰", score: catScore(202), line: firstSentence(moneyBody, 46), full: moneyBody },
    { key: "work", label: "직장운", emoji: "💼", score: catScore(303), line: firstSentence(workBody, 46), full: workBody },
  ];
  const more: MoreItem[] = [
    { key: "total", label: "총운 전체", emoji: "📜", full: chong?.body || mr.summary },
    { key: "wish", label: "소망운", emoji: "🙏", full: byTitle("소망")?.body || "" },
    { key: "move", label: "이동·이사운", emoji: "🚗", full: byTitle("이동")?.body || "" },
  ].filter((m) => m.full);

  // 오늘의 행운 오행 — 사람+날짜 시드로 매일 바뀌며, 색·행운수·아이템이 함께 결정됨
  const dailyOh = OHENG_KO_LIST[Math.floor(hash01(seed + 555) * OHENG_KO_LIST.length) % OHENG_KO_LIST.length];
  const lk = luckyByOheng(dailyOh);
  return {
    dateText: `${now.getMonth() + 1}월 ${now.getDate()}일`,
    weekday: WD[now.getDay()],
    score, keyword, emoji: theme.icon, grad: theme.grad, tone, headline, cats, more,
    luck: { color: lk.color, num: lk.num, item: OHENG_ITEM[dailyOh] || "행운의 소품" },
    zodiac: p.zodiac, starSign: p.starSign, dayGanKo: p.dayGanKo,
  };
}

// ── 띠/별자리 오늘 운세 풀이 (가벼운 재미, 점수대+시드로 결정) ──
const R_SUMMARY: { min: number; arr: string[] }[] = [
  { min: 85, arr: [
    "막힘없이 술술 풀리는 최고의 하루예요. 미뤄둔 일을 시작하기 딱 좋아요.",
    "기분 좋은 일이 겹치는 날. 자신감 있게 밀어붙이면 좋은 결과가 따라와요.",
    "운의 흐름이 활짝 열렸어요. 적극적으로 움직일수록 행운이 커집니다.",
  ] },
  { min: 70, arr: [
    "전반적으로 순조로운 하루예요. 작은 기회도 놓치지 말고 챙겨보세요.",
    "웃을 일이 많은 날. 주변과의 관계에서 즐거움을 얻겠어요.",
    "노력한 만큼 결과가 보이는 날. 꾸준함이 빛을 발합니다.",
  ] },
  { min: 55, arr: [
    "무난하게 흘러가는 하루. 욕심내기보다 페이스를 유지하는 게 좋아요.",
    "평온한 흐름 속에 소소한 즐거움이 있어요. 여유를 가져보세요.",
    "큰 변화보다 익숙한 일에 집중하면 안정적인 하루가 됩니다.",
  ] },
  { min: 40, arr: [
    "조금은 신중해야 하는 날. 서두르지 말고 한 박자 쉬어가세요.",
    "예상치 못한 변수에 주의가 필요해요. 확인 또 확인이 안전합니다.",
    "컨디션 관리가 중요한 하루. 무리한 결정은 다음으로 미뤄두세요.",
  ] },
  { min: 0, arr: [
    "오늘은 충전이 필요한 날. 무리하지 말고 나를 돌보는 시간을 가지세요.",
    "흐림 뒤 맑음. 잠시 웅크리며 내일을 준비하기 좋은 날이에요.",
    "큰일은 잠시 접어두세요. 휴식이 곧 최고의 전략인 하루입니다.",
  ] },
];
const R_LOVE = ["가까운 사람에게 먼저 다가가면 좋은 신호가 와요.", "솔직한 표현이 관계를 부드럽게 만들어요.", "작은 배려가 큰 호감으로 돌아오는 날.", "혼자만의 시간이 마음을 정리해 줘요.", "오래된 인연에게서 반가운 소식이 있을 수 있어요."];
const R_MONEY = ["충동구매만 조심하면 무난한 금전운.", "예상 밖의 작은 이득이 생길 수 있어요.", "지출 계획을 세우면 마음이 편해져요.", "투자·큰 결정은 하루 미루는 게 좋아요.", "아껴둔 것이 도움이 되는 날."];
const R_WORK = ["집중력이 좋아 능률이 오르는 날.", "동료의 도움으로 일이 수월해져요.", "꼼꼼함이 실수를 막아줘요.", "새 아이디어가 좋은 평가를 받겠어요.", "서두르기보다 마무리에 신경 쓰세요."];
const R_TIP = ["오늘의 한마디: 미소가 최고의 행운템!", "팁: 물을 자주 마시면 컨디션이 올라가요.", "오늘은 평소 안 가던 길로 가보세요.", "감사 인사 한마디가 좋은 기운을 불러와요.", "작은 정리정돈이 운을 부릅니다."];

export interface RankReading { summary: string; love: string; money: string; work: string; tip: string; }
function rankReading(seed: number, score: number): RankReading {
  const grp = R_SUMMARY.find((x) => score >= x.min)!;
  return {
    summary: pickFrom(grp.arr, seed + 11),
    love: pickFrom(R_LOVE, seed + 22),
    money: pickFrom(R_MONEY, seed + 33),
    work: pickFrom(R_WORK, seed + 44),
    tip: pickFrom(R_TIP, seed + 55),
  };
}

// ── 띠/별자리 오늘 랭킹 ──
export interface RankRow { idx: number; label: string; emoji: string; score: number; keyword: string; reading: RankReading; }
function rankList(labels: { ko: string; emoji: string }[], salt: number, now: Date): RankRow[] {
  const todayJd = julianOf(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const rows = labels.map((l, idx) => {
    const seed = todayJd * 131 + idx * salt + salt;
    const score = clamp(Math.round(45 + hash01(seed) * 54), 41, 99);
    return { idx, label: l.ko, emoji: l.emoji, score, keyword: moodOf(score, seed).keyword, reading: rankReading(seed, score) };
  });
  return rows.sort((a, b) => b.score - a.score);
}
export function ddiRanking(now: Date = new Date()): RankRow[] {
  return rankList(DDI.map((d) => ({ ko: d.ko + "띠", emoji: d.emoji })), 137, now);
}
export function starRanking(now: Date = new Date()): RankRow[] {
  return rankList(SIGNS, 211, now);
}
