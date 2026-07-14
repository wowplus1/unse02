// 오늘의 콘텐츠 '열람' 언락 플래그. 날짜가 바뀌면 자동 만료(매일 리셋).
// 키를 나눠 홈 상세/랭킹/재미를 각각 따로 하루 1회 언락한다. (정책: 자발적 리워드)
const BASE = "unse_unlock";
export const UNLOCK_HOME = BASE;
export const UNLOCK_RANKING = "unse_unlock_ranking";
export const UNLOCK_FUN = "unse_unlock_fun";

function todayStr() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }

export function isUnlockedToday(key: string = BASE): boolean {
  try { return localStorage.getItem(key) === todayStr(); } catch { return false; }
}
export function setUnlockedToday(key: string = BASE) {
  try { localStorage.setItem(key, todayStr()); } catch {}
}
