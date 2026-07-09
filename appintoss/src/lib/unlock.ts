// 오늘의 운세 '전체 열람' 언락 플래그.
// 생일(프로필)은 계속 저장되지만, 이 플래그는 날짜가 바뀌면 자동으로 만료돼
// 매일 다시 리워드를 통해 상세 풀이를 열도록 한다. (정책: 자발적 리워드)
const KEY = "unse_unlock";
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }

export function isUnlockedToday(): boolean {
  try { return localStorage.getItem(KEY) === todayStr(); } catch { return false; }
}
export function setUnlockedToday() {
  try { localStorage.setItem(KEY, todayStr()); } catch {}
}
