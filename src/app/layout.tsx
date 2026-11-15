import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "마이링크 (MyLink) | 마이페이지",
  description:
    "토스 디자인 시스템(TDS) × shadcn/ui 기반의 개인화 바이오 링크 및 마이페이지 서비스입니다.",
  openGraph: {
    locale: "ko_KR",
  },
  other: {
    google: "notranslate",
    "content-language": "ko",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" translate="no" className="notranslate h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
