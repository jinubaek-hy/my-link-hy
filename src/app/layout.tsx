import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "마이링크 (MyLink) | 토스 프로필",
  description:
    "토스 디자인 시스템(TDS) × shadcn/ui 기반의 바이오 프로필 및 링크 목록 서비스입니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
