// 포인트 저장 (localStorage). ⚠️ 기기 로컬 저장이라 실제 리워드 정산은 추후 서버/토스 연동 필요.
const KEY = "unse_points";

export function getPoints(): number {
  try { return Number(localStorage.getItem(KEY) || 0) || 0; } catch { return 0; }
}
export function addPoints(n: number): number {
  const p = getPoints() + n;
  try { localStorage.setItem(KEY, String(p)); } catch {}
  return p;
}
