import * as React from "react";
import { Plus } from "lucide-react";
import { LinkButtonCard } from "@/components/mylink/link-button-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LinkSectionItem } from "@/types/mylink";

export interface LinkSectionProps extends React.ComponentProps<"section"> {
  section: LinkSectionItem;
  onAddLink?: (sectionId: string) => void;
}

export function LinkSection({
  section,
  onAddLink,
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
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="tds-title-2 tds-emoji shrink-0" aria-hidden="true">
            {section.emoji}
          </span>
          <h2 className="tds-title-2 text-foreground truncate">
            {section.title}
          </h2>
        </div>

        {onAddLink && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onAddLink(section.id)}
            aria-label={`${section.title} 섹션에 링크 추가`}
            className="text-muted-foreground hover:text-primary shrink-0 -mr-1"
          >
            <Plus className="size-3.5" strokeWidth={2.2} />
            <span>추가</span>
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {activeLinks.map((link) => (
          <LinkButtonCard key={link.id} link={link} />
        ))}
      </div>
    </section>
  );
}
