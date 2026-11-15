"use client";

import * as React from "react";
import { ArrowUpRight, Check, Loader2, LogOut, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    (user?.email ? user.email.split("@")[0] : "사용자");
  const userInitial = userDisplayName.charAt(0).toUpperCase() || "U";

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
            <div
              role="status"
              aria-label="로그인 상태 확인 중"
              className="inline-flex items-center gap-1.5 h-[34px] px-3 rounded-full bg-secondary text-muted-foreground tds-caption"
            >
              <Loader2 className="size-3.5 animate-spin text-primary" />
              <span>확인 중</span>
            </div>
          ) : user ? (
            <div className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-1.5 h-[34px] pl-1.5 pr-2.5 rounded-full bg-secondary/80 border border-border"
                title={
                  user.email
                    ? `${userDisplayName} (${user.email})`
                    : userDisplayName
                }
              >
                <Avatar className="size-6 rounded-full border-0">
                  {user.photoURL && (
                    <AvatarImage
                      src={user.photoURL}
                      alt={`${userDisplayName} 프로필`}
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <AvatarFallback className="rounded-full tds-caption bg-accent text-accent-foreground">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="tds-caption text-foreground font-semibold max-w-[84px] sm:max-w-[120px] truncate">
                  {userDisplayName}
                </span>
              </div>

              {onLogout && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  aria-label="로그아웃"
                  className="h-[34px] rounded-full px-3 tds-caption"
                >
                  <LogOut className="size-3.5" strokeWidth={2.2} />
                  <span>로그아웃</span>
                </Button>
              )}
            </div>
          ) : (
            onGoogleLogin && (
              <Button
                type="button"
                variant="default"
                size="pill"
                onClick={onGoogleLogin}
                disabled={isSigningIn}
                aria-label="구글 소셜 로그인"
                className="pl-3 pr-3.5 shadow-tds-1"
              >
                {isSigningIn ? (
                  <Loader2 className="size-3.5 animate-spin" strokeWidth={2.4} />
                ) : (
                  <span className="size-5 rounded-full bg-white flex items-center justify-center shrink-0">
                    <GoogleLogoIcon className="size-3.5" />
                  </span>
                )}
                <span>{isSigningIn ? "로그인 중..." : "구글 로그인"}</span>
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
