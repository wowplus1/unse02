import { useCallback, useEffect, useRef, useState } from "react";
import { loadFullScreenAd, showFullScreenAd } from "@apps-in-toss/web-framework";
import { AD_REWARDED_ID } from "../lib/ads";

// 토스 리워드 광고 훅 (인앱광고 2.0 · loadFullScreenAd/showFullScreenAd).
// 리워드/전면은 같은 API이며 adGroupId로 구분. 보상은 'userEarnedReward'에서만 지급.
// 토스 밖(브라우저)·미지원 환경에서는 폴백으로 바로 언락해 개발/미리보기에서도 동작.
export function useRewardedAd() {
  const [loaded, setLoaded] = useState(false);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  const loadSupported = () => {
    try { return (loadFullScreenAd as any)?.isSupported?.() === true; } catch { return false; }
  };
  const showSupported = () => {
    try { return (showFullScreenAd as any)?.isSupported?.() === true; } catch { return false; }
  };

  const load = useCallback(() => {
    if (!loadSupported()) return;
    cleanupRef.current?.();
    try {
      cleanupRef.current = (loadFullScreenAd as any)({
        options: { adGroupId: AD_REWARDED_ID },
        onEvent: (e: any) => { if (e?.type === "loaded") setLoaded(true); },
        onError: (err: any) => console.warn("리워드 광고 로드 실패", err),
      });
    } catch (e) { /* 미지원 환경 */ }
  }, []);

  useEffect(() => { load(); return () => cleanupRef.current?.(); }, [load]);

  const show = ({ onRewarded, onDismiss }: { onRewarded: () => void; onDismiss?: () => void }) => {
    // 폴백: 토스 밖/미지원 → 바로 언락 (개발·미리보기용)
    if (!showSupported()) { onRewarded(); return; }
    let earned = false;
    try {
      (showFullScreenAd as any)({
        options: { adGroupId: AD_REWARDED_ID },
        onEvent: (e: any) => {
          if (e?.type === "userEarnedReward") { earned = true; onRewarded(); }
          else if (e?.type === "dismissed") { if (!earned) onDismiss?.(); load(); /* 다음 광고 미리 로드 */ }
        },
        onError: (err: any) => { console.warn("리워드 광고 표시 실패", err); onRewarded(); },
      });
    } catch (e) { onRewarded(); }
  };

  return { loaded, load, show };
}
