import { useState } from "react";
import { useRewardedAd } from "../hooks/useRewardedAd";
import { addPoints } from "../lib/points";
import { setUnlockedToday } from "../lib/unlock";

// 정책 준수 리워드: 콘텐츠를 완전히 막지 않고(기본 운세는 무료), 상세 풀이·더보기를
// '자발적' 리워드 시청으로 여는 소프트 게이트. 광고 '시청 완료' 시에만 언락+포인트.
const BONUS = 10;

export default function UnlockGate({ onUnlock }: { onUnlock: (points: number) => void }) {
  const [busy, setBusy] = useState(false);
  const { show } = useRewardedAd();

  const watch = () => {
    if (busy) return;
    setBusy(true);
    show({
      onRewarded: () => {
        const p = addPoints(BONUS);
        setUnlockedToday();
        setBusy(false);
        onUnlock(p);
      },
      onDismiss: () => setBusy(false),
    });
  };

  return (
    <button className="card" onClick={watch} disabled={busy}
      style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer", background: "var(--grad-brand)", color: "#201f1e", display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 26, lineHeight: 1 }}>🎁</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 15 }}>{busy ? "광고 준비 중…" : "리워드 보고 오늘 운세 모두 무료로 열기"}</div>
        <div style={{ fontSize: 12, opacity: .78 }}>광고 시청 완료 시 상세 풀이·더보기 전체 오픈 <b>+{BONUS}P</b></div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(32,31,30,.14)", borderRadius: 999, padding: "3px 8px" }}>AD</span>
    </button>
  );
}
