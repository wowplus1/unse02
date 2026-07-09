import { useState } from "react";
import { nameCompat } from "../lib/fun";

function verdict(s: number) {
  if (s >= 85) return "천생연분! 최고의 궁합이에요 💞";
  if (s >= 70) return "잘 어울리는 좋은 궁합이에요 😊";
  if (s >= 50) return "노력하면 좋아지는 사이예요 🙂";
  if (s >= 30) return "밀당이 필요한 관계예요 😅";
  return "서로 다른 매력, 조심스러운 사이예요 😬";
}

export default function NameScreen({ onBack }: { onBack: () => void }) {
  const [a, setA] = useState(""); const [b, setB] = useState("");
  const [res, setRes] = useState<number | null>(null);
  const go = () => { if (a.trim() && b.trim()) setRes(nameCompat(a.trim(), b.trim())); };
  return (
    <>
      <button className="back" onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>← 재미</button>
      <section style={{ padding: "2px 2px 4px" }}>
        <h2 style={{ fontSize: 23, margin: 0, letterSpacing: "-0.03em", fontWeight: 800 }}>💑 이름 궁합</h2>
        <p className="muted" style={{ fontSize: 13, margin: "4px 0 8px" }}>두 사람의 이름으로 궁합 점수를 봐요</p>
      </section>
      <div className="panel">
        <div className="row2 field">
          <div><label>내 이름</label><input value={a} onChange={(e) => setA(e.target.value)} placeholder="홍길동" /></div>
          <div><label>상대 이름</label><input value={b} onChange={(e) => setB(e.target.value)} placeholder="성춘향" /></div>
        </div>
        <button className="btn" onClick={go}>이름 궁합 보기</button>
      </div>
      {res !== null && (
        <div className="panel center" style={{ marginTop: 12 }}>
          <div className="muted" style={{ fontSize: 15 }}>{a} ♥ {b}</div>
          <div style={{ fontSize: 54, fontWeight: 900, color: "var(--accent)", margin: "6px 0" }}>{res}%</div>
          <div className="bar" style={{ margin: "8px 0" }}><div className="fill" style={{ width: `${res}%` }} /></div>
          <div style={{ fontWeight: 700, marginTop: 8 }}>{verdict(res)}</div>
          <div className="note">※ 전통 한글 획수 방식의 재미 궁합입니다.</div>
        </div>
      )}
    </>
  );
}
