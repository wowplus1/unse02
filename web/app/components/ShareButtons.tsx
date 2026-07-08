"use client";
import { useState } from "react";

// 결과 공유 — Web Share API + 링크 복사 (구조만; 카카오 SDK 등은 이번 범위 밖).
export default function ShareButtons({ title = "오늘운세", text = "내 운세 보러 가기" }: { title?: string; text?: string }) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); } catch { /* 취소 */ }
    } else {
      onCopy();
    }
  };
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  };

  return (
    <div className="share">
      <button onClick={onShare}>🔗 공유하기</button>
      <button onClick={onCopy}>{copied ? "✅ 복사됨" : "📋 링크 복사"}</button>
    </div>
  );
}
