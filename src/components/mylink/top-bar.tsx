"use client";

import * as React from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TopBarProps extends React.ComponentProps<"header"> {
  title: string;
  copied?: boolean;
  onShare?: () => void;
}

export function TopBar({
  title,
  copied = false,
  onShare,
  className,
  ...props
}: TopBarProps) {
  return (
    <header
      data-slot="top-bar"
      className={cn(
        "sticky top-0 z-20 h-[56px] bg-background/90 backdrop-blur-md border-b border-border",
        className
      )}
      {...props}
    >
      <div className="max-w-[560px] mx-auto h-full px-5 flex items-center justify-between">
        <span className="tds-title-2 text-foreground">
          {title}
        </span>

        {onShare && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onShare}
            aria-label="프로필 공유하기"
            title="프로필 링크 복사"
            className="-mr-1.5"
          >
            {copied ? (
              <Check className="size-4 text-primary" strokeWidth={2.2} />
            ) : (
              <ArrowUpRight className="size-4" strokeWidth={2} />
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
