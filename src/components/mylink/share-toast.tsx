import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ShareToastProps extends React.ComponentProps<"div"> {
  open: boolean;
  message?: string;
  description?: string;
}

export function ShareToast({
  open,
  message = "마이페이지 링크를 복사했어요",
  description,
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
        "fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-[440px] rounded-2xl border-2 border-primary/25 bg-card px-4 py-3.5 text-foreground shadow-tds-toast flex items-start gap-3">
        <CheckCircle2
          className="size-5 text-primary shrink-0 mt-0.5"
          strokeWidth={2.4}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold leading-snug tracking-[-0.01em] text-foreground break-keep">
            {message}
          </p>
          {description && (
            <p className="text-[13.5px] font-medium leading-relaxed text-foreground/85 mt-1 break-keep">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
