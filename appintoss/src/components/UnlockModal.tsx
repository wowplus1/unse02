import { useState } from "react";
import { createPortal } from "react-dom";
import { useRewardedAd } from "../hooks/useRewardedAd";
import { setUnlockedToday } from "../lib/unlock";

// 잠긴 풀이를 눌렀을 때 뜨는 안내 팝업. '광고 보기'로 시청 완료 시 오늘 상세 풀이를 언락.
// (transform 조상 영향 회피를 위해 body로 portal)
export default function UnlockModal({ open, onClose, onUnlocked }: {
  open: boolean; onClose: () => void; onUnlocked: () => void;
}) {
  const { show } = useRewardedAd();
  const [busy, setBusy] = useState(false);
  if (!open) return null;

  const watch = () => {
    if (busy) return;
    setBusy(true);
    show({
      onRewarded: () => { setUnlockedToday(); setBusy(false); onUnlocked(); },
      onDismiss: () => setBusy(false),
    });
  };

  return createPortal(
    <div className="cap-modal" onClick={onClose}>
      <div className="adgate-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 340 }}>
        <span className="badge">AD</span>
        <div style={{ fontSize: 42, marginTop: 6 }}>🔒</div>
        <h3 style={{ margin: "10px 0 6px", fontSize: 19, letterSpacing: "-0.02em" }}>잠긴 운세 풀이</h3>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65 }}>
          광고를 보면 오늘의 <b style={{ color: "var(--accent-ink)" }}>상세 풀이 · 더보기</b>가<br />모두 무료로 열려요.
        </p>
        <button className="btn" style={{ marginTop: 18 }} onClick={watch} disabled={busy}>
          {busy ? "광고 준비 중…" : "🎬 광고 보고 열기"}
        </button>
        <button className="adgate-skip" onClick={onClose}>다음에 볼게요</button>
      </div>
    </div>,
    document.body
  );
}
