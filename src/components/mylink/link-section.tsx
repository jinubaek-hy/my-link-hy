import * as React from "react";
import { LinkButtonCard } from "@/components/mylink/link-button-card";
import { cn } from "@/lib/utils";
import { LinkSectionItem } from "@/types/mylink";

export interface LinkSectionProps extends React.ComponentProps<"section"> {
  section: LinkSectionItem;
}

export function LinkSection({
  section,
  className,
  ...props
}: LinkSectionProps) {
  const activeLinks = [...section.links]
    .filter((link) => link.enabled)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (!section.enabled || activeLinks.length === 0) {
    return null;
  }

  return (
    <section
      data-slot="link-section"
      className={cn("space-y-3", className)}
      {...props}
    >
      <div className="flex items-center gap-2 px-1">
        <span className="tds-title-2 tds-emoji" aria-hidden="true">
          {section.emoji}
        </span>
        <h2 className="tds-title-2 text-foreground">
          {section.title}
        </h2>
      </div>

      <div className="space-y-3">
        {activeLinks.map((link) => (
          <LinkButtonCard key={link.id} link={link} />
        ))}
      </div>
    </section>
  );
}
