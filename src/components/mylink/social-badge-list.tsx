import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SocialBadgeItem } from "@/types/mylink";

export interface SocialBadgeLinkProps
  extends React.ComponentProps<"a">,
    VariantProps<typeof badgeVariants> {
  badge: SocialBadgeItem;
}

export function SocialBadgeLink({
  badge,
  variant = "secondary",
  className,
  ...props
}: SocialBadgeLinkProps) {
  const isExternal = badge.href.startsWith("http");

  return (
    <a
      data-slot="social-badge-link"
      href={badge.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        badgeVariants({ variant }),
        "w-full sm:w-auto cursor-pointer",
        className
      )}
      {...props}
    >
      {badge.label}
    </a>
  );
}

export interface SocialBadgeListProps extends React.ComponentProps<"div"> {
  badges: SocialBadgeItem[];
}

export function SocialBadgeList({
  badges,
  className,
  ...props
}: SocialBadgeListProps) {
  const visibleBadges = [...badges]
    .filter((badge) => badge.enabled)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (visibleBadges.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="social-badge-list"
      className={cn(
        "grid grid-cols-2 w-full sm:w-auto sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-2",
        className
      )}
      {...props}
    >
      {visibleBadges.map((badge) => (
        <SocialBadgeLink key={badge.id} badge={badge} />
      ))}
    </div>
  );
}
