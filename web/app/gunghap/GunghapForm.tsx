"use client";
import { useState } from "react";

interface Person { y: string; m: string; d: string; g: "M" | "W"; cal: "solar" | "lunar"; }
const empty: Person = { y: "", m: "", d: "", g: "M", cal: "solar" };

function PersonFields({ label, val, set }: { label: string; val: Person; set: (p: Person) => void }) {
  return (
    <div className="panel" style={{ marginBottom: 12 }}>
      <h3 style={{ fontSize: 15 }}>{label}</h3>
      <div className="row field" style={{ marginTop: 8 }}>
        <div><label>년</label><input type="number" placeholder="1992" value={val.y} onChange={(e) => set({ ...val, y: e.target.value })} /></div>
        <div><label>월</label><input type="number" min={1} max={12} value={val.m} onChange={(e) => set({ ...val, m: e.target.value })} /></div>
        <div><label>일</label><input type="number" min={1} max={31} value={val.d} onChange={(e) => set({ ...val, d: e.target.value })} /></div>
      </div>
      <div className="row2">
        <div><label>성별</label>
          <select value={val.g} onChange={(e) => set({ ...val, g: e.target.value as "M" | "W" })}>
            <option value="M">남성</option><option value="W">여성</option>
          </select>
        </div>
        <div><label>달력</label>
          <select value={val.cal} onChange={(e) => set({ ...val, cal: e.target.value as "solar" | "lunar" })}>
            <option value="solar">양력</option><option value="lunar">음력</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function GunghapForm({ initA, initB }: { initA?: Person; initB?: Person }) {
  const [a, setA] = useState<Person>(initA ?? empty);
  const [b, setB] = useState<Person>(initB ?? empty);

  const go = () => {
    if (!a.y || !a.m || !a.d || !b.y || !b.m || !b.d) return;
    const q = `ay=${a.y}&am=${a.m}&ad=${a.d}&ag=${a.g}&acal=${a.cal}&by=${b.y}&bm=${b.m}&bd=${b.d}&bg=${b.g}&bcal=${b.cal}`;
    window.location.href = `/gunghap?${q}`;
  };

  return (
    <>
      <PersonFields label="👤 첫 번째 사람" val={a} set={setA} />
      <PersonFields label="👥 두 번째 사람" val={b} set={setB} />
      <button className="btn" onClick={go}>💞 궁합 보기</button>
    </>
  );
}
