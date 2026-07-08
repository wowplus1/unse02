"use client";
import { usePathname } from "next/navigation";

// 경로가 바뀔 때마다 main을 remount(key=경로) → .page 진입 애니메이션 재생.
// 전체 새로고침이든 클라이언트 이동이든 부드럽게 페이드+슬라이드 인.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/";
  return (
    <main key={path} className="page">
      {children}
    </main>
  );
}
