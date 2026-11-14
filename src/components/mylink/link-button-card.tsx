import * as React from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LinkCardItem } from "@/types/mylink";

export interface LinkButtonCardProps
  extends Omit<React.ComponentProps<"a">, "href"> {
  link: LinkCardItem;
}

export function LinkButtonCard({
  link,
  className,
  ...props
}: LinkButtonCardProps) {
  const isExternal = link.href.startsWith("http");

  return (
    <a
      data-slot="link-button-card"
      href={link.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "group block w-full rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        className
      )}
      {...props}
    >
      <Card className="w-full rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-150 ease-tds group-hover:border-primary/40 group-active:scale-[0.99]">
        <div className="min-w-0 flex-1">
          <div className="flex items-start sm:items-center gap-2">
            <span
              className="tds-title-2 tds-emoji shrink-0 leading-[1.45]"
              aria-hidden="true"
            >
              {link.emoji}
            </span>
            <CardTitle className="line-clamp-2 sm:truncate break-keep group-hover:text-primary transition-colors">
              {link.title}
            </CardTitle>
          </div>
          <CardDescription className="tds-body-3 mt-1 sm:pl-[25px] break-keep">
            {link.description}
          </CardDescription>
        </div>

        <span
          className="tds-title-1 text-tds-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all duration-150 ease-tds shrink-0"
          aria-hidden="true"
        >
          →
        </span>
      </Card>
    </a>
  );
}
