"use client";
import { useState } from "react";
import { toBlob } from "html-to-image";

// 공유 카드(#share-card)를 PNG로 캡처.
// 잘림 방지를 위해 폰트 로드 대기 + 노드의 실제 scroll 크기를 명시적으로 전달.
// 생성된 이미지는 미리보기로 띄워 저장/공유(모바일은 길게 눌러 저장이 가장 확실).
export default function CaptureShare({ targetId = "share-card", fileName = "오늘의운세.png" }: { targetId?: string; fileName?: string }) {
  const [busy, setBusy] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
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

  const onShare = async () => {
    setBusy(true); setMsg("");
    try {
      const blob = await makeBlob();
      if (!blob) throw new Error("no node");
      const file = new File([blob], fileName, { type: "image/png" });
      const nav = navigator as any;
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], title: "오늘의 운세", text: "내 오늘의 운세 카드 🔮" });
      } else {
        setImgUrl(URL.createObjectURL(blob));
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") setMsg("공유에 실패했어요. 저장으로 시도해 주세요.");
    } finally { setBusy(false); }
  };

  const onSave = async () => {
    setBusy(true); setMsg("");
    try {
      const blob = await makeBlob();
      if (!blob) throw new Error("no node");
      setImgUrl(URL.createObjectURL(blob));
    } catch { setMsg("이미지를 만들지 못했어요."); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <div className="share">
        <button onClick={onShare} disabled={busy} style={{ background: "var(--grad-brand)", color: "#201f1e", border: "none", fontWeight: 800 }}>
          {busy ? "만드는 중…" : "📤 이미지로 공유"}
        </button>
        <button onClick={onSave} disabled={busy}>💾 이미지 만들기</button>
      </div>
      {msg && <p className="center muted" style={{ fontSize: 12, marginTop: 8 }}>{msg}</p>}

      {imgUrl && (
        <div className="cap-modal" onClick={() => setImgUrl(null)}>
          <div className="cap-inner" onClick={(e) => e.stopPropagation()}>
            <img src={imgUrl} alt="오늘의 운세 카드" />
            <p className="cap-tip">이미지를 <b>길게 눌러 저장</b>하거나 SNS에 공유하세요 📲</p>
            <div className="share" style={{ marginTop: 4 }}>
              <a className="btn mini" href={imgUrl} download={fileName} style={{ flex: 1, textDecoration: "none", textAlign: "center" }}>💾 저장</a>
              <button className="btn mini ghost" style={{ flex: 1 }} onClick={() => setImgUrl(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
