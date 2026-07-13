// 콘텐츠 조회 + 프로필 -> 키 매핑(매퍼)
import raw from "../data/content.json";
import catalogRaw from "../data/catalog.json";
import { SajuProfile } from "./saju";

export interface ContentRow {
  content_code: string;
  express_key: string;
  express_key2: string;
  gender: string; // '', 'M', 'W'
  sub_index: number;
  sub_title: string;
  row_title: string;
  score: number | null;
  body_text: string;
  active: number;
}
const DATA = raw as ContentRow[];
export const CATALOG = catalogRaw as any[];

interface Query {
  code: string;
  key?: string | number;
  keyStartsWith?: string;
  gender?: "M" | "W";
  sub?: number;
}
function find(q: Query): ContentRow[] {
  const keyStr = q.key === undefined ? undefined : String(q.key);
  return DATA.filter((r) => {
    if (r.content_code !== q.code) return false;
    if (keyStr !== undefined && r.express_key !== keyStr) return false;
    if (q.keyStartsWith !== undefined && !r.express_key.startsWith(q.keyStartsWith)) return false;
    if (q.sub !== undefined && r.sub_index !== q.sub) return false;
    if (q.gender !== undefined) {
      // 성별 지정 시: 해당 성별 우선, 없으면 중립('') 허용
      if (r.gender !== q.gender && r.gender !== "") return false;
    }
    return true;
  });
}
// 성별 우선 1건 선택(성별행 > 중립행)
function pick(rows: ContentRow[], gender?: "M" | "W"): ContentRow | null {
  if (rows.length === 0) return null;
  if (gender) {
    const g = rows.find((r) => r.gender === gender);
    if (g) return g;
  }
  const neutral = rows.find((r) => r.gender === "");
  return neutral ?? rows[0];
}

export interface Reading {
  code: string;
  title: string;   // 메뉴 항목명
  subTitle?: string;
  score?: number | null;
  body: string;
}

// ---- 개별 매퍼 ----
function one(code: string, title: string, key: string | number, p: SajuProfile): Reading | null {
  const row = pick(find({ code, key, gender: p.input.gender }), p.input.gender);
  if (!row) return null;
  return { code, title, subTitle: row.row_title || row.sub_title || undefined, score: row.score, body: row.body_text };
}

// 일주(60갑자) 코드 기반 1건 (sub_index 0 우선)
function ilju(code: string, title: string, p: SajuProfile): Reading | null {
  const rows = find({ code, key: p.iljuCode }).sort((a, b) => a.sub_index - b.sub_index);
  if (!rows.length) return null;
  const body = rows.map((r) => r.body_text).join("\n\n");
  return { code, title, body };
}

// 프로필 기반 "확실히 도출 가능한" 리딩 묶음
export function sajuReadings(p: SajuProfile): { group: string; items: Reading[] }[] {
  const gi = p.dayGanIndex; // 1~10
  const groups: { group: string; items: Reading[] }[] = [];

  // 일주로 보는 나 (60갑자)
  const iljuItems: Reading[] = [];
  const s070 = ilju("S070", `일주 ${p.day.ganzhiHan}(${p.day.ganKo}${p.day.zhiKo})로 보는 나`, p);
  if (s070) iljuItems.push(s070);
  if (iljuItems.length) groups.push({ group: `일주 · ${p.day.ganzhiHan}`, items: iljuItems });

  const seongkyeok: Reading[] = [];
  const c085 = one("S085", "일간으로 보는 성격", gi, p);
  if (c085) seongkyeok.push(c085);
  const c080 = one("S080", "일간(천간) 기질", gi, p);
  if (c080) seongkyeok.push(c080);
  const s065 = ilju("S065", "일주로 보는 성격", p);
  if (s065) seongkyeok.push(s065);
  if (seongkyeok.length) groups.push({ group: "성격·기질", items: seongkyeok });

  // 오행·기운
  const oheng: Reading[] = [];
  const s063 = ilju("S063", "오행 성향", p);
  if (s063) oheng.push(s063);
  const s064 = ilju("S064", "타고난 오행 기운", p);
  if (s064) oheng.push(s064);
  if (oheng.length) groups.push({ group: "오행·기운", items: oheng });

  const jaemulItems: Reading[] = [];
  const jaemul = one("S082", "일간으로 보는 재물운", gi, p);
  if (jaemul) jaemulItems.push(jaemul);
  const s066 = ilju("S066", "일주로 보는 사업·재물운", p);
  if (s066) jaemulItems.push(s066);
  if (jaemulItems.length) groups.push({ group: "재물운", items: jaemulItems });

  // 직업·적성
  const s071 = ilju("S071", "일주로 보는 직업·적성", p);
  if (s071) groups.push({ group: "직업·적성", items: [s071] });

  const geongang: Reading[] = [];
  const c083 = one("S083", "일간으로 보는 건강·신체", gi, p);
  if (c083) geongang.push(c083);
  const s074 = ilju("S074", "일주로 보는 건강운", p);
  if (s074) geongang.push(s074);
  if (geongang.length) groups.push({ group: "건강운", items: geongang });

  // 애정·이성·대인
  const aejeong: Reading[] = [];
  const s072 = ilju("S072", "일주로 보는 애정운", p);
  if (s072) aejeong.push(s072);
  const s073 = ilju("S073", "일주로 보는 이성운", p);
  if (s073) aejeong.push(s073);
  const s068 = ilju("S068", "대인·관계 성향", p);
  if (s068) aejeong.push(s068);
  if (aejeong.length) groups.push({ group: "애정·이성·대인", items: aejeong });

  // 십이운성 (일지 기준)
  const uns = one("S015", `일지 십이운성 — ${p.dayUnseong}`, p.dayUnseongIndex, p);
  if (uns) groups.push({ group: "십이운성", items: [uns] });

  // 별자리
  const star: Reading[] = [];
  const s060 = one("S060", "별자리 개요", p.starSign, p);
  if (s060) star.push(s060);
  const f013 = one("F013", "별자리 성격(상세)", p.starSign, p);
  if (f013) star.push(f013);
  const t017 = one("T017", "별자리 매력 포인트", p.starSign, p);
  if (t017) star.push(t017);
  const si = signIndex(p.starSign);
  const t029b = one("T029", "별자리 애정", p.starSign, p);
  if (t029b) star.push(t029b);
  const t023 = one("T023", "별자리 행운(색·수·날)", si, p);
  if (t023) star.push(t023);
  const t039 = one("T039", "별자리 행운수", si, p);
  if (t039) star.push(t039);
  const y001 = one("Y001", "이상적인 데이트 스타일", si, p);
  if (y001) star.push(y001);
  if (star.length) groups.push({ group: `별자리 · ${p.starSign}`, items: star });

  // 시주·자녀 (태어난 시 기준 · 추정) — 시 모름이면 생략
  if (p.timeZhiHan) {
    const zi = zhiIndex(p.timeZhiHan);
    const siju: Reading[] = [];
    const s022 = one("S022", "시주로 보는 운", zi, p);
    if (s022) siju.push(s022);
    const s034 = one("S034", "자녀 기질", zi, p);
    if (s034) siju.push(s034);
    const s035 = one("S035", "자녀 성품", zi, p);
    if (s035) siju.push(s035);
    const s036 = one("S036", "자녀 진로·적성", zi, p);
    if (s036) siju.push(s036);
    if (siju.length) groups.push({ group: "시주·자녀운 (태어난 시 기준·추정)", items: siju });
  }

  // 평생운 (음력 생월 기준 · 추정)
  const lm = p.lunarMonth;
  const pyeong: Reading[] = [];
  const s045 = one("S045", "초년운", lm, p);
  if (s045) pyeong.push(s045);
  const s046 = one("S046", "중년운", lm, p);
  if (s046) pyeong.push(s046);
  const s047 = one("S047", "말년운", lm, p);
  if (s047) pyeong.push(s047);
  const s051 = one("S051", "타고난 건강·체질", lm, p);
  if (s051) pyeong.push(s051);
  if (pyeong.length) groups.push({ group: `평생운 (음력 ${lm}월생 기준·추정)`, items: pyeong });

  // 행운의 수리 (일간)
  const t061rows = find({ code: "T061", key: p.dayGan });
  if (t061rows.length) {
    const items: Reading[] = t061rows
      .sort((a, b) => a.sub_index - b.sub_index)
      .map((r) => ({
        code: "T061",
        title: r.sub_index === 0 ? `행운의 수리 ${r.row_title || r.sub_title}` : `피해야 할 수리 ${r.sub_title}`,
        body: r.body_text,
      }));
    groups.push({ group: "행운의 숫자", items });
  }

  return groups;
}

// 혈액형(선택 입력)
export function bloodReading(blood: string, gender: "M" | "W"): Reading | null {
  const row = pick(find({ code: "F033", key: blood, gender }), gender);
  if (!row) return null;
  return { code: "F033", title: `${blood}형 성격`, body: row.body_text };
}

// 띠 궁합(G024): 한 사람의 띠 운명 특징
export function ttiFate(p: SajuProfile): Reading | null {
  const rows = find({ code: "G024", keyStartsWith: p.yearZhi, gender: p.input.gender });
  const row = pick(rows, p.input.gender);
  if (!row) return null;
  return { code: "G024", title: `${p.zodiac}띠 ${p.input.gender === "M" ? "남성" : "여성"}의 운명`, body: row.body_text };
}

// 별자리 순번 (양자리=1 ... 물고기=12)
const SIGN_ORDER = ["양자리", "황소자리", "쌍둥이자리", "게자리", "사자자리", "처녀자리",
  "천칭자리", "전갈자리", "사수자리", "염소자리", "물병자리", "물고기자리"];
export function signIndex(sign: string): number {
  const i = SIGN_ORDER.indexOf(sign);
  return i < 0 ? 1 : i + 1;
}
// 시지 순번 (子=1 ... 亥=12)
const ZHI_ORDER = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
export function zhiIndex(zhiHan: string): number {
  const i = ZHI_ORDER.indexOf(zhiHan);
  return i < 0 ? 1 : i + 1;
}

// 토정비결 종합운 (144키)
export function tojeongReadings(key: string): Reading[] {
  const out: Reading[] = [];
  // S103: 상세 5분류(건강·희망·재물·직장·연애) sub_title 라벨 포함
  const s103 = find({ code: "S103", key }).sort((a, b) => a.sub_index - b.sub_index);
  const base = s103.find((r) => r.sub_index === 0);
  if (base) out.push({ code: "S103", title: "올해의 괘사", body: base.body_text });
  for (const r of s103.filter((r) => r.sub_index > 0)) {
    out.push({ code: "S103", title: r.sub_title || "운세", body: r.body_text });
  }
  const extra: [string, string][] = [
    ["S106", "신년 애정운"], ["S107", "신년 건강운"], ["S108", "신년 직장운"], ["S109", "신년 소원운"],
  ];
  for (const [code, title] of extra) {
    const r = find({ code, key })[0];
    if (r) out.push({ code, title, body: r.body_text });
  }
  return out;
}
// 신년 월별운 (S110, sub 1~12)
export function tojeongMonthly(key: string): Reading[] {
  const rows = find({ code: "S110", key }).filter((r) => r.sub_index >= 1).sort((a, b) => a.sub_index - b.sub_index);
  return rows.map((r) => ({ code: "S110", title: `${r.sub_index}월`, body: r.body_text }));
}
// 오늘의 운세 6항목 (같은 일진 키)
const DAILY = [
  ["S087", "오늘의 총운"], ["S088", "애정운"], ["S089", "소망운"],
  ["S090", "사업·직장운"], ["S091", "이동·이사운"], ["S092", "금전운"],
];
export function dailyPool(): string[] {
  return Array.from(new Set(DATA.filter((r) => r.content_code === "S087").map((r) => r.express_key))).sort();
}
export function dailyReadings(key: string): Reading[] {
  const out: Reading[] = [];
  for (const [code, title] of DAILY) {
    const r = find({ code, key })[0];
    if (r) out.push({ code, title, score: r.score, body: r.body_text });
  }
  return out;
}

// 주역 64괘 문점 (key 11~88)
const JUYEOK = [
  ["J009", "소망·승부운"], ["J004", "건강운"], ["J005", "대인관계운"], ["J006", "궁합·인연운"],
];
export function juyeokReadings(key: string): Reading[] {
  const out: Reading[] = [];
  for (const [code, title] of JUYEOK) {
    const r = find({ code, key })[0];
    if (r) out.push({ code, title, body: r.body_text });
  }
  return out;
}
// 강태공 100괘 (key 1~100)
export function gangReading(n: number): Reading | null {
  const r = find({ code: "J037", key: n })[0];
  if (!r) return null;
  return { code: "J037", title: r.row_title || `제 ${n}괘`, body: r.body_text };
}
// 대운 풀이 (S042: 순번*100 + 지지 子=1). ※키 인코딩 추정
export function daeunReading(order: number, zhiIndex: number): Reading | null {
  const key = order * 100 + zhiIndex;
  const r = find({ code: "S042", key })[0];
  if (!r) return null;
  return { code: "S042", title: `${order}번째 대운`, body: r.body_text };
}

// 일일 총운 1건 (주간 요약용)
export function dailyTotal(key: string): { score: number | null; body: string } | null {
  const r = find({ code: "S087", key })[0];
  if (!r) return null;
  return { score: r.score, body: r.body_text };
}

// 삼재 텍스트(S061, 생년 띠 기반 참고)
export function samjaeReading(birthZhiHan: string): Reading | null {
  const r = find({ code: "S061", key: zhiIndex(birthZhiHan) })[0];
  if (!r) return null;
  return { code: "S061", title: "삼재 풀이", body: r.body_text };
}

// 오늘의 행운 포인트 (일진 일간 오행 → 색/숫자)
const GAN_OHENG_KO: Record<string, string> = {
  甲: "목", 乙: "목", 丙: "화", 丁: "화", 戊: "토", 己: "토", 庚: "금", 辛: "금", 壬: "수", 癸: "수",
};
const OHENG_COLOR2: Record<string, string> = { 목: "초록·청색", 화: "빨강·분홍", 토: "노랑·황토", 금: "흰색·은색", 수: "검정·남색" };
const OHENG_NUM2: Record<string, string> = { 목: "3, 8", 화: "2, 7", 토: "5, 10", 금: "4, 9", 수: "1, 6" };
export function todayLucky(iljuGanHan: string): { oheng: string; color: string; num: string } {
  const oh = GAN_OHENG_KO[iljuGanHan] || "-";
  return { oheng: oh, color: OHENG_COLOR2[oh] || "-", num: OHENG_NUM2[oh] || "-" };
}
// 오행(목화토금수) 키로 직접 행운색/수를 조회 — '오늘의 행운 오행'을 매일 뽑는 용도.
export const OHENG_KO_LIST = ["목", "화", "토", "금", "수"] as const;
export function luckyByOheng(oh: string): { oheng: string; color: string; num: string } {
  return { oheng: oh, color: OHENG_COLOR2[oh] || "-", num: OHENG_NUM2[oh] || "-" };
}

// 오행 궁합(G023): 남성오행 + 여성오행 (예: '목화')
export function ohengGunghap(maleOheng: string, femaleOheng: string): Reading | null {
  const key = maleOheng + femaleOheng;
  const rows = find({ code: "G023", key });
  if (!rows.length) return null;
  return { code: "G023", title: `오행 궁합 — 남(${maleOheng}) · 여(${femaleOheng})`, body: rows[0].body_text };
}

// ---- 별자리·서양운세 ----
export function starReadings(p: SajuProfile): Reading[] {
  const out: Reading[] = [];
  const si = signIndex(p.starSign);
  const byName: [string, string][] = [["S060", "별자리 개요"], ["F013", "별자리 성격(상세)"], ["T017", "매력 포인트"], ["T029", "별자리 애정"]];
  for (const [code, title] of byName) {
    const r = pick(find({ code, key: p.starSign, gender: p.input.gender }), p.input.gender);
    if (r) out.push({ code, title, body: r.body_text });
  }
  const byIdx: [string, string][] = [["T023", "행운(색·수·날)"], ["T039", "행운수"], ["Y001", "데이트 스타일"]];
  for (const [code, title] of byIdx) {
    const r = find({ code, key: si })[0];
    if (r) out.push({ code, title, body: r.body_text });
  }
  return out;
}
// 풍수(F011): 주택 향(向) 선택
export function pungsuList(): { key: string; title: string }[] {
  const seen = new Map<string, string>();
  for (const r of DATA.filter((r) => r.content_code === "F011")) {
    if (!seen.has(r.express_key)) seen.set(r.express_key, r.row_title || `향 ${r.express_key}`);
  }
  return Array.from(seen, ([key, title]) => ({ key, title }));
}
export function pungsuReading(key: string): Reading | null {
  const r = find({ code: "F011", key })[0];
  if (!r) return null;
  return { code: "F011", title: r.row_title || "주택 풍수", body: r.body_text };
}

// ---- 행운 아이템 (일간 오행 기반) ----
const OHENG_LIST = ["목", "화", "토", "금", "수"];
const OHENG_COLOR: Record<string, string> = { 목: "초록·청색 계열", 화: "빨강·분홍 계열", 토: "노랑·황토 계열", 금: "흰색·은색 계열", 수: "검정·남색 계열" };
const OHENG_NUM: Record<string, string> = { 목: "3, 8", 화: "2, 7", 토: "5, 10", 금: "4, 9", 수: "1, 6" };
export interface Lucky { color: string; colorBody?: string; num: string; su: Reading[]; surname?: Reading; }
export function luckyReadings(p: SajuProfile): Lucky {
  const oh = p.day.ganOheng;
  const idx = OHENG_LIST.indexOf(oh) + 1;
  // 행운 수리(T061, 일간)
  const su: Reading[] = find({ code: "T061", key: p.dayGan }).sort((a, b) => a.sub_index - b.sub_index)
    .map((r) => ({ code: "T061", title: r.sub_index === 0 ? "행운의 수리" : "피해야 할 수리", body: r.body_text }));
  // 행운 성씨(S009, 오행 첫 변형)
  const sr = find({ code: "S009", key: `${idx}1` })[0];
  return {
    color: OHENG_COLOR[oh] || "-",
    num: OHENG_NUM[oh] || "-",
    su,
    surname: sr ? { code: "S009", title: "행운의 성씨", body: sr.body_text } : undefined,
  };
}

// ---- 특수운: 계절(S113, 양력 생월) ----
export function seasonReading(solarMonth: number): Reading | null {
  const r = find({ code: "S113", key: solarMonth })[0];
  if (!r) return null;
  return { code: "S113", title: `${solarMonth}월생의 계절 기운`, body: r.body_text };
}

export function catalogByCategory() {
  const map: Record<number, any[]> = {};
  for (const c of CATALOG) {
    (map[c.menu_category] ??= []).push(c);
  }
  return map;
}
