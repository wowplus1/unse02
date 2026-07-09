import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleAdMob } from "@apps-in-toss/web-framework";

// TODO: 콘솔에서 발급받은 실제 '리워드 광고 그룹 ID'로 교체하세요.
//       (지금은 테스트 ID — 사업자 등록 + 광고 설정 후 실제 광고가 노출됩니다)
const AD_GROUP_ID = "ait-ad-test-rewarded-id";

// 토스 리워드 광고 훅. 토스 밖(브라우저)·미지원·미설정 환경에서는 폴백으로 바로 보상 처리해
// 개발/미리보기에서도 플로우가 동작하게 함.
export function useRewardedAd() {
  const [loaded, setLoaded] = useState(false);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  // 토스 안에서 명시적으로 지원(true)일 때만 실제 광고 사용. 그 외(브라우저·미지원)는 폴백.
  const loadSupported = () => {
    try { return GoogleAdMob?.loadAppsInTossAdMob?.isSupported?.() === true; } catch { return false; }
  };
  const showSupported = () => {
    try { return GoogleAdMob?.showAppsInTossAdMob?.isSupported?.() === true; } catch { return false; }
  };

  const load = useCallback(() => {
    if (!loadSupported()) return;
    cleanupRef.current?.();
    try {
      cleanupRef.current = GoogleAdMob.loadAppsInTossAdMob({
        options: { adGroupId: AD_GROUP_ID },
        onEvent: (e: any) => { if (e?.type === "loaded") setLoaded(true); },
        onError: (err: any) => console.warn("광고 로드 실패", err),
      });
    } catch (e) { /* 미지원 환경 */ }
  }, []);

  useEffect(() => { load(); return () => cleanupRef.current?.(); }, [load]);

  const show = ({ onRewarded, onDismiss }: { onRewarded: () => void; onDismiss?: () => void }) => {
    // 폴백: 토스 밖/미지원/미설정 → 바로 보상 (개발·미리보기용)
    if (!showSupported()) {
      onRewarded();
      return;
    }
    try {
      GoogleAdMob.showAppsInTossAdMob({
        options: { adGroupId: AD_GROUP_ID },
        onEvent: (e: any) => {
          if (e?.type === "userEarnedReward") onRewarded();
          else if (e?.type === "dismissed") onDismiss?.();
        },
        onError: (err: any) => { console.warn("광고 표시 실패", err); onRewarded(); },
      });
    } catch (e) { onRewarded(); }
  };

  return { loaded, load, show };
}
