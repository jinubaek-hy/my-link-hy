import * as React from "react";
import { cn } from "@/lib/utils";

export interface ShareToastProps extends React.ComponentProps<"div"> {
  open: boolean;
  message?: string;
}

export function ShareToast({
  open,
  message = "프로필 링크를 복사했어요",
  className,
  ...props
}: ShareToastProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      data-slot="share-toast"
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200",
        className
      )}
      {...props}
    >
      <div className="px-4 py-2.5 rounded-full bg-foreground text-background tds-label-s shadow-tds-toast">
        {message}
      </div>
    </div>
  );
}
