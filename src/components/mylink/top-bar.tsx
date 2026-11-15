"use client";

import * as React from "react";
import { ArrowUpRight, Check, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MyLinkAuthUser } from "@/types/mylink";

export function GoogleLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z"
      />
    </svg>
  );
}

export interface TopBarProps extends React.ComponentProps<"header"> {
  title: string;
  user?: MyLinkAuthUser | null;
  isAuthLoading?: boolean;
  isSigningIn?: boolean;
  copied?: boolean;
  onGoogleLogin?: () => void;
  onLogout?: () => void;
  onShare?: () => void;
  onAddLinkClick?: () => void;
}

export function TopBar({
  title,
  user,
  isAuthLoading = false,
  isSigningIn = false,
  copied = false,
  onGoogleLogin,
  onLogout,
  onShare,
  onAddLinkClick,
  className,
  ...props
}: TopBarProps) {
  const userDisplayName =
    user?.displayName?.trim() ||
    (user?.email && user.email.includes("@")
      ? user.email.split("@")[0]?.trim()
      : "") ||
    "사용자";

  return (
    <header
      data-slot="top-bar"
      className={cn(
        "sticky top-0 z-20 h-[56px] bg-background/90 backdrop-blur-md border-b border-border",
        className
      )}
      {...props}
    >
      <div className="max-w-[560px] mx-auto h-full px-5 flex items-center justify-between gap-2">
        <span className="tds-title-2 text-foreground truncate min-w-0">
          {title}
        </span>

        <div className="flex items-center gap-2 shrink-0 -mr-1.5">
          {onAddLinkClick && user && (
            <Button
              type="button"
              variant="brand-weak"
              size="pill"
              onClick={onAddLinkClick}
              aria-label="새 링크 추가하기"
            >
              <Plus className="size-3.5" strokeWidth={2.4} />
              <span>링크 추가</span>
            </Button>
          )}

          {isAuthLoading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground mx-2" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <span className="tds-caption text-muted-foreground max-w-[100px] truncate hidden sm:inline">
                {userDisplayName}
              </span>
              {onLogout && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onLogout}
                  aria-label="로그아웃"
                >
                  로그아웃
                </Button>
              )}
            </div>
          ) : (
            onGoogleLogin && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onGoogleLogin}
                disabled={isSigningIn}
                aria-label="구글 로그인"
              >
                {isSigningIn ? (
                  <Loader2 className="size-3.5 animate-spin" strokeWidth={2.2} />
                ) : (
                  <GoogleLogoIcon className="size-3.5" />
                )}
                <span>구글 로그인</span>
              </Button>
            )
          )}

          {onShare && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onShare}
              aria-label="프로필 공유하기"
              title="프로필 링크 복사"
            >
              {copied ? (
                <Check className="size-4 text-primary" strokeWidth={2.2} />
              ) : (
                <ArrowUpRight className="size-4" strokeWidth={2} />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
