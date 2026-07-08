// 광고 자리 placeholder — 실제 광고(AdSense 등) 연동 전, 확실히 구분되는 배너 자리.
export default function AdSlot({ label = "광고 배너 자리", size = "banner" }: { label?: string; size?: "banner" | "large" }) {
  return (
    <div className={"adslot" + (size === "large" ? " large" : "")} role="complementary" aria-label="광고 영역">
      <span className="badge">AD · 광고</span>
      <span className="ico" aria-hidden>📢</span>
      <span className="ph">{label}</span>
      <span className="sub">광고 연동 예정 공간</span>
    </div>
  );
}
