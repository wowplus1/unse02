"use client";
import { useState } from "react";
import { toBlob } from "html-to-image";

// 공유 카드(#targetId)를 PNG로 캡처해 ①시스템 공유 시트(카톡·인스타 등) ②저장 제공.
// 잘림 방지를 위해 폰트 로드 대기 + 노드의 실제 scroll 크기를 명시적으로 전달.
export default function CaptureShare({ targetId = "share-card", fileName = "오늘의운세.png", shareText = "내 오늘의 운세 카드 🔮" }: { targetId?: string; fileName?: string; shareText?: string }) {
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

  const download = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // 시스템 공유 시트 → 카톡·인스타·저장 등 선택. 미지원 시 저장으로 폴백.
  const onShare = async () => {
    setBusy(true); setMsg("");
    try {
      const blob = await makeBlob();
      if (!blob) throw new Error("no node");
      const file = new File([blob], fileName, { type: "image/png" });
      const nav = navigator as any;
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], text: shareText });
      } else {
        download(blob);
        setMsg("이 환경은 바로 공유가 안 돼 저장했어요. 카톡·인스타에서 불러와 공유해 주세요.");
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") setMsg("공유에 실패했어요. 저장으로 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  const onSave = async () => {
    setBusy(true); setMsg("");
    try {
      const blob = await makeBlob();
      if (!blob) throw new Error("no node");
      download(blob);
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
        <button onClick={onShare} disabled={busy} style={{ background: "var(--grad-brand)", color: "#201f1e", border: "none", fontWeight: 800 }}>
          {busy ? "준비 중…" : "📤 공유"}
        </button>
        <button onClick={onSave} disabled={busy}>💾 저장</button>
      </div>
      {msg && <p className="center muted" style={{ fontSize: 12, marginTop: 8 }}>{msg}</p>}
    </div>
  );
}
