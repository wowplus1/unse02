// 광고 자리 placeholder — 실제 광고(AdSense 등) 연동 전 자리만 확보.
export default function AdSlot({ label = "광고 영역" }: { label?: string }) {
  return (
    <div className="adslot" aria-hidden>
      <span className="lb">SPONSORED</span>
      <span>{label}</span>
    </div>
  );
}
