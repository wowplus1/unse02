"use client";
import { useState } from "react";
import { toBlob } from "html-to-image";

// 지정한 카드 DOM(id)을 PNG로 캡처 → Web Share(파일)로 SNS 공유, 안 되면 다운로드.
export default function CaptureShare({ targetId = "share-card", fileName = "오늘의운세.png" }: { targetId?: string; fileName?: string }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const capture = async (): Promise<Blob | null> => {
    const node = document.getElementById(targetId);
    if (!node) return null;
    return await toBlob(node, { pixelRatio: 3, cacheBust: true, backgroundColor: undefined });
  };

  const onShare = async () => {
    setBusy(true); setMsg("");
    try {
      const blob = await capture();
      if (!blob) throw new Error("no node");
      const file = new File([blob], fileName, { type: "image/png" });
      const nav = navigator as any;
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], title: "오늘의 운세", text: "내 오늘의 운세 카드 🔮" });
      } else {
        download(blob);
        setMsg("이미지를 저장했어요. SNS에 올려보세요!");
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") setMsg("공유 대신 이미지를 저장할게요");
    } finally { setBusy(false); }
  };

  const onSave = async () => {
    setBusy(true); setMsg("");
    const blob = await capture();
    if (blob) { download(blob); setMsg("이미지를 저장했어요!"); }
    setBusy(false);
  };

  const download = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = fileName; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <div>
      <div className="share">
        <button onClick={onShare} disabled={busy} style={{ background: "var(--grad-brand)", color: "#fff", border: "none", fontWeight: 800 }}>
          {busy ? "만드는 중…" : "📤 이미지로 공유"}
        </button>
        <button onClick={onSave} disabled={busy}>💾 저장</button>
      </div>
      {msg && <p className="center muted" style={{ fontSize: 12, marginTop: 8 }}>{msg}</p>}
    </div>
  );
}
