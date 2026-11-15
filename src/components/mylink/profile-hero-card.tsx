import * as React from "react";
import { Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SocialBadgeList } from "@/components/mylink/social-badge-list";
import { cn } from "@/lib/utils";
import {
  MyLinkAuthUser,
  MyLinkProfileData,
  SocialBadgeItem,
} from "@/types/mylink";

export interface ProfileHeroCardProps extends React.ComponentProps<typeof Card> {
  profile: MyLinkProfileData;
  user?: MyLinkAuthUser | null;
  socialBadges?: SocialBadgeItem[];
  onEditProfile?: () => void;
}

export function ProfileHeroCard({
  profile,
  user,
  socialBadges = [],
  onEditProfile,
  className,
  ...props
}: ProfileHeroCardProps) {
  const displayEmail = user?.email || profile.email;
  const emailPrefix =
    displayEmail && displayEmail.includes("@")
      ? displayEmail.split("@")[0]?.trim()
      : "";
  const displayName =
    profile.name?.trim() ||
    user?.displayName?.trim() ||
    emailPrefix ||
    "사용자";
  const displayAvatar = profile.avatarUrl?.trim() || user?.photoURL || "";
  const fallbackInitial = displayName.charAt(0).toUpperCase() || "U";

  return (
    <Card
      data-slot="profile-hero-card"
      className={cn("relative rounded-3xl", className)}
      {...props}
    >
      {onEditProfile && (
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
          <Button
            type="button"
            variant="secondary"
            size="xs"
            onClick={onEditProfile}
            aria-label="프로필 수정"
            className="gap-1.5 px-3 text-foreground hover:text-primary"
          >
            <Pencil className="size-3.5" strokeWidth={2.2} />
            <span>프로필 수정</span>
          </Button>
        </div>
      )}

      <CardContent className="px-5 py-6 sm:px-6 sm:py-8 flex flex-col items-center text-center">
        <Avatar className="mb-4">
          {displayAvatar && (
            <AvatarImage
              src={displayAvatar}
              alt={`${displayName} 프로필 사진`}
              referrerPolicy="no-referrer"
            />
          )}
          <AvatarFallback>{fallbackInitial}</AvatarFallback>
        </Avatar>

        <h1 className="tds-h3 text-foreground break-keep">
          {displayName}
        </h1>

        {displayEmail && (
          <p className="tds-caption text-muted-foreground mt-0.5">
            {displayEmail}
          </p>
        )}

        <p className="tds-body-2 text-muted-foreground mt-1.5 break-keep">
          &ldquo;{profile.bio}&rdquo;
        </p>

        <SocialBadgeList badges={socialBadges} className="mt-5" />
      </CardContent>
    </Card>
  );
}
