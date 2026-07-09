import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRewardedAd } from "../hooks/useRewardedAd";
import { addPoints } from "../lib/points";

const KEY = "unse_reward_gate";
export const REWARD = 10; // 하루 1회 적립 포인트
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }

// 하루 한 번, 홈에서 '광고 보고 운세 확인' 리워드 팝업. 시청 완료(보상) 시 포인트 적립 + 오늘 운세 잠금 해제.
export default function RewardGate({ onUnlock }: { onUnlock?: (points: number) => void }) {
  const [status, setStatus] = useState<"checking" | "locked" | "open">("checking");
  const [busy, setBusy] = useState(false);
  const { show } = useRewardedAd();

  useEffect(() => {
    try { setStatus(localStorage.getItem(KEY) === todayStr() ? "open" : "locked"); }
    catch { setStatus("open"); }
  }, []);

  const grant = () => {
    const pts = addPoints(REWARD);
    try { localStorage.setItem(KEY, todayStr()); } catch {}
    setStatus("open");
    setBusy(false);
    onUnlock?.(pts);
  };

  const watch = () => {
    setBusy(true);
    show({ onRewarded: grant, onDismiss: () => setBusy(false) });
  };

  if (status === "open" || typeof document === "undefined") return null;
  return createPortal(
    <div className="adgate">
      {status === "locked" && (
        <div className="adgate-card">
          <span className="badge">리워드 · AD</span>
          <div style={{ fontSize: 44, lineHeight: 1 }}>🎁</div>
          <h3 style={{ margin: "10px 0 2px", fontSize: 19 }}>오늘의 운세가 도착했어요!</h3>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            광고 보고 확인하면 <b style={{ color: "var(--accent-ink)" }}>{REWARD}P</b> 적립돼요
          </p>
          <div className="adgate-teaser">오늘의 총운 <b>?? 점</b> · 행운색 <b>???</b></div>
          <button className="btn" onClick={watch} disabled={busy}>
            {busy ? "광고 준비 중…" : `🎬 광고 보고 운세 확인 (+${REWARD}P)`}
          </button>
          <p className="adgate-disc">시청을 완료하면 포인트가 적립되고 오늘 운세가 열려요.</p>
        </div>
      )}
    </div>,
    document.body
  );
}
