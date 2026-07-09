// 앱인토스 SPA 공용 타입/상수
export interface Profile {
  name?: string;
  y: number; m: number; d: number;
  hour: number | null;
  gender: "M" | "W";
  cal: "solar" | "lunar";
}
export const PROFILE_KEY = "unse_profile";

export type View = "home" | "ranking" | "fun" | "lotto" | "bio" | "name" | "gunghap" | "juyeok";
