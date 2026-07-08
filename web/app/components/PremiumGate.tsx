"use client";
import { useState } from "react";

// 긴 프리미엄 콘텐츠를 블러로 가리고, CTA 클릭 시 펼침(모의 결제 동선).
// 실제 결제 연동은 이번 범위 밖 — 클릭하면 그냥 열립니다.
export default function PremiumGate({ children, price = "2,900원" }: { children: React.ReactNode; price?: string }) {
  const [open, setOpen] = useState(false);
  if (open) return <>{children}</>;
  return (
    <div className="gate">
      <div className="blurred">{children}</div>
      <div className="cover">
        <div className="cta">
          <span style={{ fontSize: 26 }}>🔒</span>
          <b style={{ fontSize: 15 }}>전체 리포트는 프리미엄에서</b>
          <span className="tag">사주 전 항목 · 대운 상세 · 평생운 풀이 포함</span>
          <button className="btn mini" onClick={() => setOpen(true)}>✨ 전체 보기 · {price}</button>
          <span className="tag" style={{ fontSize: 11 }}>* 데모: 결제 없이 열립니다</span>
        </div>
      </div>
    </div>
  );
}
