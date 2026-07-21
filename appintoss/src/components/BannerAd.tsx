import { useEffect, useRef, useState } from "react";
import { TossAds } from "@apps-in-toss/web-framework";
import { AD_BANNER_ID } from "../lib/ads";

const BANNER_AD_GROUP_ID = AD_BANNER_ID;

// 앱인토스 배너. 정책상 '스크롤 화면의 상/하단'에만 사용.
// 실제 광고가 붙을 때만 노출 — 미지원/미설정/인벤토리 없음이면 아무것도 안 보임(빈 자리표시 제거).
export default function BannerAd() {
  const ref = useRef<HTMLDivElement>(null);
  const [attached, setAttached] = useState(false);

  useEffect(() => {
    const ok = (() => { try { return (TossAds as any)?.attachBanner?.isSupported?.() === true; } catch { return false; } })();
    if (!ok || !ref.current) return;
    let cleanup: any;
    try {
      cleanup = (TossAds as any).attachBanner({
        element: ref.current,
        options: { adGroupId: BANNER_AD_GROUP_ID, listType: "card" },
      });
      setAttached(true);
    } catch (e) { /* 미지원/미설정 → 숨김 유지 */ }
    return () => { try { cleanup?.(); } catch {} };
  }, []);

  // 광고가 실제로 붙었을 때만 영역 차지. 아니면 빈(0높이) 마운트 지점만 유지.
  return <div ref={ref} role="complementary" aria-label="광고 영역" style={attached ? { margin: "18px 0" } : { height: 0, overflow: "hidden" }} />;
}
