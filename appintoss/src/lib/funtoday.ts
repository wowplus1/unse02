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
    "생각한 일이 척척 맞아떨어지는 날. 오늘의 결정이 좋은 열매로 돌아와요.",
    "주변에서 도움과 인정이 함께 오는 날. 크게 웃을 일이 생기겠어요.",
    "행운의 별이 당신 편이에요. 새로운 시도가 반가운 성과로 이어집니다.",
    "무엇을 하든 손대는 일마다 반응이 좋은 날이에요.",
    "자신감이 곧 매력으로 이어지는 하루. 당당하게 나서보세요.",
  ] },
  { min: 70, arr: [
    "전반적으로 순조로운 하루예요. 작은 기회도 놓치지 말고 챙겨보세요.",
    "웃을 일이 많은 날. 주변과의 관계에서 즐거움을 얻겠어요.",
    "노력한 만큼 결과가 보이는 날. 꾸준함이 빛을 발합니다.",
    "기분 좋은 소식이 들려올 수 있어요. 긍정적인 마음이 운을 부릅니다.",
    "흐름을 타면 일이 쉽게 풀려요. 자신의 감을 믿어도 좋은 날.",
    "작은 성취가 쌓여 뿌듯한 하루. 주변에 감사 인사를 건네보세요.",
    "인연과 기회가 함께 찾아오는 날. 문을 열어두세요.",
    "부지런히 움직인 만큼 보람이 큰 하루가 됩니다.",
  ] },
  { min: 55, arr: [
    "무난하게 흘러가는 하루. 욕심내기보다 페이스를 유지하는 게 좋아요.",
    "평온한 흐름 속에 소소한 즐거움이 있어요. 여유를 가져보세요.",
    "큰 변화보다 익숙한 일에 집중하면 안정적인 하루가 됩니다.",
    "특별한 기복 없이 잔잔한 날. 계획을 점검하기 좋은 타이밍이에요.",
    "천천히 가도 괜찮은 날. 나만의 리듬을 지키면 마음이 편해져요.",
    "무리 없는 하루. 익숙한 사람들과의 시간이 힘이 되어줘요.",
    "욕심을 조금 덜면 오히려 편안한 하루가 돼요.",
    "루틴을 지키면 하루가 단단해집니다.",
  ] },
  { min: 40, arr: [
    "조금은 신중해야 하는 날. 서두르지 말고 한 박자 쉬어가세요.",
    "예상치 못한 변수에 주의가 필요해요. 확인 또 확인이 안전합니다.",
    "컨디션 관리가 중요한 하루. 무리한 결정은 다음으로 미뤄두세요.",
    "작은 오해가 생기기 쉬운 날. 말은 한 번 더 곱씹고 꺼내세요.",
    "속도를 늦추면 실수가 줄어요. 중요한 일은 오후로 미뤄도 좋아요.",
    "마음이 조급해질 수 있어요. 심호흡 한 번, 여유가 답입니다.",
    "감정보다 사실로 판단하면 무난하게 넘어가요.",
    "작은 배려가 오해를 막아주는 날이에요.",
  ] },
  { min: 0, arr: [
    "오늘은 충전이 필요한 날. 무리하지 말고 나를 돌보는 시간을 가지세요.",
    "흐림 뒤 맑음. 잠시 웅크리며 내일을 준비하기 좋은 날이에요.",
    "큰일은 잠시 접어두세요. 휴식이 곧 최고의 전략인 하루입니다.",
    "에너지가 낮은 날. 욕심을 내려놓고 가볍게 보내는 게 좋아요.",
    "지친 마음을 다독일 시간. 좋아하는 것으로 나를 위로해 주세요.",
    "조용히 재정비하는 날. 오늘의 휴식이 내일의 도약이 됩니다.",
    "무리한 약속은 내일로 미뤄도 괜찮아요.",
    "몸과 마음이 보내는 신호에 귀 기울여 보세요.",
  ] },
];
const R_LOVE = [
  "가까운 사람에게 먼저 다가가면 좋은 신호가 와요.", "솔직한 표현이 관계를 부드럽게 만들어요.",
  "작은 배려가 큰 호감으로 돌아오는 날.", "혼자만의 시간이 마음을 정리해 줘요.",
  "오래된 인연에게서 반가운 소식이 있을 수 있어요.", "따뜻한 말 한마디가 분위기를 살려요.",
  "함께 있는 시간의 소중함을 느끼는 날.", "설레는 만남이나 연락이 있을 수 있어요.",
  "상대의 입장을 헤아리면 관계가 깊어져요.", "짝사랑이라면 용기를 내볼 만한 날.",
  "가족·친구와의 시간이 마음을 채워줘요.", "칭찬 한마디가 상대의 마음을 열어요.",
  "연락이 뜸했던 사람에게 안부를 전해보세요.", "혼자라면 새로운 인연의 기운이 스며드는 날.",
];
const R_MONEY = [
  "충동구매만 조심하면 무난한 금전운.", "예상 밖의 작은 이득이 생길 수 있어요.",
  "지출 계획을 세우면 마음이 편해져요.", "투자·큰 결정은 하루 미루는 게 좋아요.",
  "아껴둔 것이 도움이 되는 날.", "정보를 잘 챙기면 손해를 막을 수 있어요.",
  "커피 한 잔의 여유가 오히려 돈을 아껴줘요.", "작은 절약이 큰 만족으로 돌아와요.",
  "금전 관련 약속은 문서로 확실히 해두세요.", "영수증을 살펴보면 새는 돈이 보여요.",
  "필요한 것과 원하는 것을 구분하면 이득이에요.", "지인의 추천이 알뜰한 선택으로 이어져요.",
  "포인트·쿠폰 챙기기 좋은 날.", "큰 지출은 비교 또 비교가 정답이에요.",
];
const R_WORK = [
  "집중력이 좋아 능률이 오르는 날.", "동료의 도움으로 일이 수월해져요.",
  "꼼꼼함이 실수를 막아줘요.", "새 아이디어가 좋은 평가를 받겠어요.",
  "서두르기보다 마무리에 신경 쓰세요.", "미뤄둔 일을 처리하면 마음이 가벼워져요.",
  "협업에서 좋은 시너지가 나는 날.", "작은 준비가 큰 기회를 잡게 해줘요.",
  "한 가지에 집중하면 성과가 확실해요.", "메모하는 습관이 오늘 빛을 봐요.",
  "먼저 나서면 좋은 인상을 남기는 날.", "복잡한 일은 잘게 쪼개면 술술 풀려요.",
  "질문 하나가 큰 실수를 막아줘요.", "마감 전 점검이 좋은 평가로 이어져요.",
];
const R_TIP = [
  "오늘의 한마디: 미소가 최고의 행운템!", "팁: 물을 자주 마시면 컨디션이 올라가요.",
  "오늘은 평소 안 가던 길로 가보세요.", "감사 인사 한마디가 좋은 기운을 불러와요.",
  "작은 정리정돈이 운을 부릅니다.", "아침의 스트레칭이 하루를 가볍게 해줘요.",
  "좋아하는 음악 한 곡이 기분을 바꿔줘요.", "밝은색 소품이 행운을 끌어당겨요.",
  "누군가를 칭찬하면 그 복이 나에게 와요.", "창문을 열어 환기하면 기분이 맑아져요.",
  "오늘은 계단을 한 번 더 이용해 보세요.", "따뜻한 차 한 잔이 마음을 데워줘요.",
  "작은 목표 하나를 오늘 안에 끝내보세요.", "지갑 속을 정리하면 재물운이 들어와요.",
];

// 띠/별자리별 고유 성격 멘트 (정체성 — 매일 고정, DDI/SIGNS 순서와 동일)
const DDI_TRAIT = [
  "빠른 눈치와 기지로 기회를 잘 잡는 당신,", "묵묵한 성실함으로 신뢰를 쌓는 당신,",
  "결단력과 카리스마가 돋보이는 당신,", "부드러운 센스로 사람을 끌어당기는 당신,",
  "타고난 리더십과 추진력의 당신,", "깊은 통찰과 예리한 직관의 당신,",
  "활기와 열정이 넘치는 당신,", "따뜻한 배려심이 빛나는 당신,",
  "재치와 재주가 많은 당신,", "부지런하고 야무진 당신,",
  "의리와 성실함이 돋보이는 당신,", "넉넉한 마음으로 복을 부르는 당신,",
];
const SIGN_TRAIT = [
  "열정과 도전정신이 넘치는 당신,", "끈기와 안정감이 강점인 당신,",
  "호기심과 재치가 많은 당신,", "정 많고 섬세한 당신,",
  "당당한 존재감의 당신,", "꼼꼼하고 분석적인 당신,",
  "균형 감각과 매력을 지닌 당신,", "강한 집중력과 직관의 당신,",
  "자유롭고 낙천적인 당신,", "책임감과 인내심이 강한 당신,",
  "독창적이고 개성 있는 당신,", "감성이 풍부하고 따뜻한 당신,",
];

export interface RankReading { trait: string; summary: string; love: string; money: string; work: string; tip: string; }

// 결정적 셔플(Fisher-Yates) — 같은 시드면 같은 순서. 하루 안에서 항목마다 다른 문장을 '중복 없이' 배정하는 데 사용.
function shuffledBy<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(hash01(seed + i * 0x9e3779b1) * (i + 1));
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

// ── 띠/별자리 오늘 랭킹 ──
export interface RankRow { idx: number; label: string; emoji: string; score: number; keyword: string; reading: RankReading; }
function rankList(labels: { ko: string; emoji: string; trait: string }[], salt: number, now: Date): RankRow[] {
  const todayJd = julianOf(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const ranked = labels
    .map((l, idx) => {
      const seed = todayJd * 131 + idx * salt + salt;
      const score = clamp(Math.round(45 + hash01(seed) * 54), 41, 99);
      return { idx, label: l.ko, emoji: l.emoji, score, keyword: moodOf(score, seed).keyword, trait: l.trait };
    })
    .sort((a, b) => b.score - a.score);

  // 하루·목록별로 풀을 셔플해두고, 순위 위치대로 배정 → 12개 항목이 서로 다른 문장을 가짐(중복 없음).
  const daySeed = todayJd * 100003 + salt;
  const love = shuffledBy(R_LOVE, daySeed + 1);
  const money = shuffledBy(R_MONEY, daySeed + 2);
  const work = shuffledBy(R_WORK, daySeed + 3);
  const tip = shuffledBy(R_TIP, daySeed + 4);
  const bands = R_SUMMARY.map((g, gi) => shuffledBy(g.arr, daySeed + 10 + gi));
  const bandUsed = R_SUMMARY.map(() => 0);

  return ranked.map((r, pos) => {
    const gi = R_SUMMARY.findIndex((x) => r.score >= x.min);
    const bp = bands[gi];
    const summary = bp[bandUsed[gi]++ % bp.length];
    const reading: RankReading = {
      trait: r.trait,
      summary,
      love: love[pos % love.length],
      money: money[pos % money.length],
      work: work[pos % work.length],
      tip: tip[pos % tip.length],
    };
    return { idx: r.idx, label: r.label, emoji: r.emoji, score: r.score, keyword: r.keyword, reading };
  });
}
export function ddiRanking(now: Date = new Date()): RankRow[] {
  return rankList(DDI.map((d, i) => ({ ko: d.ko + "띠", emoji: d.emoji, trait: DDI_TRAIT[i] })), 137, now);
}
export function starRanking(now: Date = new Date()): RankRow[] {
  return rankList(SIGNS.map((s, i) => ({ ko: s.ko, emoji: s.emoji, trait: SIGN_TRAIT[i] })), 211, now);
}
