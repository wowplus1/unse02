// 행운색(오행 2색 조합) → 그라데이션 + 가독 텍스트/오버레이 색 산출.
// 예: "빨강·분홍" → 빨강→분홍 그라데이션, 밝은 조합이면 글씨를 차콜로 자동 전환.
const HEX: Record<string, string> = {
  초록: "#4e9a7a", 청색: "#4a76b8", 파랑: "#4a76b8",
  빨강: "#cf4a4a", 분홍: "#e07a9a",
  노랑: "#e8c14a", 황토: "#c39a55",
  흰색: "#f2efe8", 은색: "#c2c5c9",
  검정: "#2e2b28", 남색: "#34406e",
};

function lum(hex: string): number {
  const n = hex.replace("#", "");
  const ch = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(ch[0]) + 0.7152 * f(ch[1]) + 0.0722 * f(ch[2]);
}

export interface LuckyTheme { grad: string; c1: string; c2: string; ink: string; dark: boolean; tint: (a: number) => string; }

export function luckyTheme(colorStr: string): LuckyTheme {
  const toks = (colorStr || "").split(/[·,/]/).map((s) => s.trim()).filter(Boolean);
  const c1 = HEX[toks[0]] || "#d9a544";
  const c2 = HEX[toks[1]] || c1;
  const avg = (lum(c1) + lum(c2)) / 2;
  const isLight = avg > 0.42;           // 밝은 배경(흰색·은색, 노랑·황토) → 어두운 글씨
  const ink = isLight ? "#201f1e" : "#ffffff";
  const tint = (a: number) => (isLight ? `rgba(32,31,30,${a})` : `rgba(255,255,255,${a})`);
  return { grad: `linear-gradient(150deg, ${c1} 0%, ${c2} 100%)`, c1, c2, ink, dark: isLight, tint };
}
