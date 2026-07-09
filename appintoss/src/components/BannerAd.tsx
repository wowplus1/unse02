import { useEffect, useRef, useState } from "react";
import { TossAds } from "@apps-in-toss/web-framework";

// TODO: 콘솔에서 발급한 실제 배너(리스트형) 광고 그룹 ID로 교체하세요.
const BANNER_AD_GROUP_ID = "ait-ad-test-banner-list-id";

// 앱인토스 배너 광고. 정책상 '스크롤 되는 화면의 상단/하단'에만 사용 (콘텐츠 하단 권장).
// 토스 밖(브라우저)·미지원·미설정에서는 자리표시(placeholder)만 노출.
export default function BannerAd({ label = "광고 배너 자리" }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [attached, setAttached] = useState(false);

  useEffect(() => {
    const ok = (() => { try { return (TossAds as any)?.attachBanner?.isSupported?.() === true; } catch { return false; } })();
    if (!ok || !ref.current) return;
    let cleanup: any;
    try {
      // ⚠️ 실제 파라미터는 콘솔 광고 ID 발급 + 공식 문서로 최종 확인 필요
      cleanup = (TossAds as any).attachBanner({
        element: ref.current,
        options: { adGroupId: BANNER_AD_GROUP_ID, listType: "card" },
      });
      setAttached(true);
    } catch (e) { /* 파라미터/미지원 → 자리표시 유지 */ }
    return () => { try { cleanup?.(); } catch {} };
  }, []);

  return (
    <div className="adslot" ref={ref} role="complementary" aria-label="광고 영역">
      {!attached && (
        <>
          <span className="badge">AD · 광고</span>
          <span className="ico" aria-hidden>📢</span>
          <span className="ph">{label}</span>
          <span className="sub">배너 광고 연동 예정</span>
        </>
      )}
    </div>
  );
}
