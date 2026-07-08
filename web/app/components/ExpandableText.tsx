"use client";
import { useState } from "react";

// 긴 본문을 미리보기(clamp자)로 접어두고 "더보기"로 전체를 펼침.
export default function ExpandableText({ text, clamp = 48 }: { text: string; clamp?: number }) {
  const [open, setOpen] = useState(false);
  const compact = text.replace(/\n+/g, " ").trim();
  const needToggle = compact.length > clamp + 6;

  if (!needToggle) return <div className="b">{text}</div>;

  return (
    <div>
      <div className="b" style={{ whiteSpace: "pre-wrap" }}>
        {open ? text : compact.slice(0, clamp) + "…"}
      </div>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ background: "none", border: "none", color: "var(--accent-ink)", fontWeight: 700, fontSize: 12.5, cursor: "pointer", padding: "6px 0 0" }}
      >
        {open ? "접기 ▲" : "더보기 ▼"}
      </button>
    </div>
  );
}
