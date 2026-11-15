"use client";

import {
  CheckCircle2,
  Info,
  Loader2,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      position="top-center"
      offset={16}
      visibleToasts={2}
      icons={{
        success: (
          <CheckCircle2
            className="size-4 text-primary shrink-0"
            strokeWidth={2.4}
          />
        ),
        info: (
          <Info className="size-4 text-primary shrink-0" strokeWidth={2.4} />
        ),
        warning: (
          <TriangleAlert
            className="size-4 text-tds-yellow-500 shrink-0"
            strokeWidth={2.4}
          />
        ),
        error: (
          <OctagonX
            className="size-4 text-destructive shrink-0"
            strokeWidth={2.4}
          />
        ),
        loading: (
          <Loader2
            className="size-4 text-primary animate-spin shrink-0"
            strokeWidth={2.4}
          />
        ),
      }}
      toastOptions={{
        duration: 2400,
        classNames: {
          toast:
            "group toast !w-fit !max-w-[90vw] !rounded-full !border !border-border/15 !bg-foreground !text-background !px-4 !py-2.5 !shadow-tds-toast !flex !items-center !gap-2",
          title:
            "!font-sans !tds-label-m !text-background !font-semibold !leading-snug !break-keep",
          description:
            "!font-sans !tds-caption !text-background/85 !font-medium !leading-snug !mt-0.5 !break-keep",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
