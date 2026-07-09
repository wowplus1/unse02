import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeToggle from "./components/ThemeToggle";
import PageTransition from "./components/PageTransition";
import { BRAND } from "../lib/brand";

export const metadata: Metadata = {
  title: `${BRAND.name} · ${BRAND.tagline}`,
  description: "생년월일 한 번으로 오늘의 운세부터 정통 사주까지. 사주·토정비결·궁합·주역·별자리·행운 아이템.",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7b5cff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="wrap">
          <header className="topbar">
            <a href="/" className="brand">
              <span className="logo">{BRAND.logo}</span>
              <span>
                <h1>{BRAND.name}</h1>
                <small>{BRAND.tagline}</small>
              </span>
            </a>
            <ThemeToggle />
          </header>
          <PageTransition>{children}</PageTransition>
        </div>
      </body>
    </html>
  );
}
