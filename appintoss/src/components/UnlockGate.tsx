// 잠긴 풀이 언락 트리거 버튼. 실제 광고 재생은 UnlockModal 팝업에서 처리.
export default function UnlockGate({ onOpen }: { onOpen: () => void }) {
  return (
    <button className="card" onClick={onOpen}
      style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer", background: "var(--grad-brand)", color: "#201f1e", display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 26, lineHeight: 1 }}>🔓</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 15 }}>광고 보고 잠긴 운세 풀이 무료로 보기</div>
        <div style={{ fontSize: 12, opacity: .78 }}>광고 시청 완료 시 오늘 상세 풀이·더보기가 모두 열려요</div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(32,31,30,.14)", borderRadius: 999, padding: "3px 8px" }}>AD</span>
    </button>
  );
}
