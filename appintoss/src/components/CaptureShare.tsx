"use client";
import { useState } from "react";
import { toBlob } from "html-to-image";

// 공유 카드(#share-card)를 PNG로 캡처해 '바로 저장'(다운로드) 한다.
// 잘림 방지를 위해 폰트 로드 대기 + 노드의 실제 scroll 크기를 명시적으로 전달.
export default function CaptureShare({ targetId = "share-card", fileName = "오늘의운세.png" }: { targetId?: string; fileName?: string }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const makeBlob = async (): Promise<Blob | null> => {
    const node = document.getElementById(targetId);
    if (!node) return null;
    try { await (document as any).fonts?.ready; } catch {}
    const w = Math.ceil(node.scrollWidth);
    const h = Math.ceil(node.scrollHeight);
    return await toBlob(node, {
      pixelRatio: 2,
      cacheBust: true,
      width: w,
      height: h,
      // 캡처 시 레이아웃 왜곡 방지 (여백/변형 제거, 실제 크기 고정)
      style: { margin: "0", transform: "none", width: `${w}px`, height: `${h}px` },
    });
  };

  const onSave = async () => {
    setBusy(true); setMsg("");
    try {
      const blob = await makeBlob();
      if (!blob) throw new Error("no node");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMsg("이미지를 저장했어요 📥");
    } catch {
      setMsg("이미지를 저장하지 못했어요. 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="share">
        <button onClick={onSave} disabled={busy} style={{ background: "var(--grad-brand)", color: "#201f1e", border: "none", fontWeight: 800 }}>
          {busy ? "저장 중…" : "💾 이미지 저장"}
        </button>
      </div>
      {msg && <p className="center muted" style={{ fontSize: 12, marginTop: 8 }}>{msg}</p>}
    </div>
  );
}
