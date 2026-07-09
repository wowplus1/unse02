import { useState } from "react";
import { useRewardedAd } from "../hooks/useRewardedAd";
import { addPoints } from "../lib/points";

// 정책 준수: 콘텐츠를 막지 않는 '자발적' 리워드 카드. 하루 1회, 광고 '시청 완료' 시 포인트 적립.
const KEY = "unse_reward_gate";
export const REWARD = 10;
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }

export default function RewardCard({ onEarn }: { onEarn?: (points: number) => void }) {
  const [claimed, setClaimed] = useState(() => {
    try { return localStorage.getItem(KEY) === todayStr(); } catch { return false; }
  });
  const [busy, setBusy] = useState(false);
  const { show } = useRewardedAd();

  const watch = () => {
    if (claimed || busy) return;
    setBusy(true);
    show({
      onRewarded: () => {
        const p = addPoints(REWARD);
        try { localStorage.setItem(KEY, todayStr()); } catch {}
        setClaimed(true); setBusy(false); onEarn?.(p);
      },
      onDismiss: () => setBusy(false),
    });
  };

  if (claimed) {
    return (
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--soft)", border: "1px solid var(--line2)" }}>
        <span style={{ fontSize: 22 }}>✅</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14 }}>오늘 포인트 적립 완료</div>
          <div className="muted" style={{ fontSize: 12 }}>내일 또 받을 수 있어요</div>
        </div>
      </div>
    );
  }

  return (
    <button className="card" onClick={watch} disabled={busy}
      style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer", background: "var(--grad-brand)", color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 26, lineHeight: 1 }}>🎁</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 15 }}>{busy ? "광고 준비 중…" : "광고 보고 포인트 받기"}</div>
        <div style={{ fontSize: 12, opacity: .92 }}>광고 시청 완료 시 <b>+{REWARD}P</b> 적립돼요</div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(255,255,255,.22)", borderRadius: 999, padding: "3px 8px" }}>AD</span>
    </button>
  );
}
