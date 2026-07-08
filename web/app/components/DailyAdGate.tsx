"use client";
import { useEffect, useState } from "react";
import { AFFILIATE } from "../../lib/ads";
import { BRAND } from "../../lib/brand";

// 하루 한 번, 오늘운세를 "광고 보고 확인" 게이트로 잠금.
// 광고 버튼(또는 닫기)을 누르면 그날은 해제되어, 다시 접속하면 바로 운세가 보임.
const KEY = "unse_ad_gate";
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function DailyAdGate() {
  const [status, setStatus] = useState<"checking" | "locked" | "open">("checking");

  useEffect(() => {
    try {
      setStatus(localStorage.getItem(KEY) === todayStr() ? "open" : "locked");
    } catch { setStatus("open"); }
  }, []);

  const unlock = () => {
    try { localStorage.setItem(KEY, todayStr()); } catch {}
    setStatus("open");
  };
  const onAd = () => {
    window.open(AFFILIATE.coupangUrl, "_blank", "noopener,noreferrer");
    unlock();
  };

  if (status === "open") return null;

  const now = new Date();
  return (
    <div className="adgate">
      {/* checking 동안은 빈 커버로 운세 미리보기 깜빡임 방지 */}
      {status === "locked" && (
        <div className="adgate-card">
          <span className="badge">AD · 제휴</span>
          <div style={{ fontSize: 42, lineHeight: 1 }}>🍀</div>
          <h3 style={{ margin: "10px 0 2px", fontSize: 19 }}>오늘의 운세가 도착했어요!</h3>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            {now.getMonth() + 1}월 {now.getDate()}일 · 광고를 보면 오늘 운세가 열려요
          </p>
          <div className="adgate-teaser">오늘의 총운 <b>?? 점</b> · 행운색 <b>???</b></div>
          <button className="btn" onClick={onAd}>🎁 광고 보고 오늘 운세 확인</button>
          <button className="adgate-skip" onClick={unlock}>오늘은 그냥 볼게요</button>
          <p className="adgate-disc">{AFFILIATE.disclosure}</p>
          <p className="adgate-brand">{BRAND.logo} {BRAND.name}</p>
        </div>
      )}
    </div>
  );
}
