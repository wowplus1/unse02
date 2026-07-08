// 주역 64괘 문점(問占) + 강태공 100괘 추첨.
// 64괘 키 = 상괘digit + 하괘digit, 선천팔괘 순서 1乾 2兌 3離 4震 5巽 6坎 7艮 8坤.

// 팔괘 패턴(아래→위, 양=true) → digit(1~8), 이름
const TRIGRAMS: { pat: boolean[]; digit: number; name: string; sym: string }[] = [
  { pat: [true, true, true], digit: 1, name: "건(乾)", sym: "☰" },
  { pat: [true, true, false], digit: 2, name: "태(兌)", sym: "☱" },
  { pat: [true, false, true], digit: 3, name: "이(離)", sym: "☲" },
  { pat: [true, false, false], digit: 4, name: "진(震)", sym: "☳" },
  { pat: [false, true, true], digit: 5, name: "손(巽)", sym: "☴" },
  { pat: [false, true, false], digit: 6, name: "감(坎)", sym: "☵" },
  { pat: [false, false, true], digit: 7, name: "간(艮)", sym: "☶" },
  { pat: [false, false, false], digit: 8, name: "곤(坤)", sym: "☷" },
];
function trigram(lines: boolean[]) {
  return TRIGRAMS.find((t) => t.pat[0] === lines[0] && t.pat[1] === lines[1] && t.pat[2] === lines[2])!;
}

export interface Hexagram {
  key: string;         // "11" ~ "88"
  upper: { name: string; sym: string };
  lower: { name: string; sym: string };
  lines: boolean[];    // 아래(0)→위(5)
}

// 동전 6개를 던져 6효를 만든다 (문점)
export function castHexagram(rand: () => number = Math.random): Hexagram {
  const lines = Array.from({ length: 6 }, () => rand() < 0.5);
  const lower = trigram(lines.slice(0, 3));
  const upper = trigram(lines.slice(3, 6));
  return {
    key: `${upper.digit}${lower.digit}`,
    upper: { name: upper.name, sym: upper.sym },
    lower: { name: lower.name, sym: lower.sym },
    lines,
  };
}

// 강태공 100괘 추첨 (1~100)
export function drawGangtaegong(rand: () => number = Math.random): number {
  return 1 + Math.floor(rand() * 100);
}
