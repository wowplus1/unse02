"use client";
import { useState } from "react";
import { toBlob } from "html-to-image";
import { share, getTossShareLink } from "@apps-in-toss/web-framework";

// 공유 카드(#targetId)를 PNG로 캡처. '📤 공유'는 앱인토스 네이티브 공유 시트(카톡·인스타 등),
// '💾 저장'은 이미지 다운로드. (네이티브 공유는 텍스트/링크 기반이라 링크 공유로 동작)
export default function CaptureShare({ targetId = "share-card", fileName = "오늘의운세.png", shareText = "내 오늘의 운세 확인해봐! 🔮 인생역점" }: { targetId?: string; fileName?: string; shareText?: string }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const makeBlob = async (): Promise<Blob | null> => {
    const node = document.getElementById(targetId);
    if (!node) return null;
    try { await (document as any).fonts?.ready; } catch {}
    const w = Math.ceil(node.scrollWidth);
    const h = Math.ceil(node.scrollHeight);
    return await toBlob(node, {
      pixelRatio: 2, cacheBust: true, width: w, height: h,
      style: { margin: "0", transform: "none", width: `${w}px`, height: `${h}px` },
    });
  };

  const download = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = fileName;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // 앱인토스 네이티브 공유 시트 → 카톡·인스타 등. 미지원(브라우저)이면 웹 공유/저장으로 폴백.
  const onShare = async () => {
    setBusy(true); setMsg("");
    try {
      let link = "";
      try { link = await getTossShareLink("intoss://unse4u"); } catch {}
      const message = link ? `${shareText}\n👉 ${link}` : shareText;
      await share({ message });
    } catch {
      try {
        const blob = await makeBlob();
        const file = blob ? new File([blob], fileName, { type: "image/png" }) : null;
        const nav = navigator as any;
        if (file && nav.canShare && nav.canShare({ files: [file] })) {
          await nav.share({ files: [file], text: shareText });
        } else if (blob) {
          download(blob);
          setMsg("이 환경은 공유가 안 돼 저장했어요.");
        }
      } catch (e2: any) {
        if (e2?.name !== "AbortError") setMsg("공유에 실패했어요. 저장으로 시도해 주세요.");
      }
    } finally { setBusy(false); }
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
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div className="share">
        <button onClick={onShare} disabled={busy} style={{ background: "var(--grad-brand)", color: "#201f1e", border: "none", fontWeight: 800 }}>
          {busy ? "준비 중…" : "📤 공유하기"}
        </button>
        <button onClick={onSave} disabled={busy}>💾 저장</button>
      </div>
      {msg && <p className="center muted" style={{ fontSize: 12, marginTop: 8 }}>{msg}</p>}
    </div>
  );
}
