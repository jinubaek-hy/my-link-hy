import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { SocialBadgeList } from "@/components/mylink/social-badge-list";
import { cn } from "@/lib/utils";
import { MyLinkProfileData, SocialBadgeItem } from "@/types/mylink";

export interface ProfileHeroCardProps extends React.ComponentProps<typeof Card> {
  profile: MyLinkProfileData;
  socialBadges?: SocialBadgeItem[];
}

export function ProfileHeroCard({
  profile,
  socialBadges = [],
  className,
  ...props
}: ProfileHeroCardProps) {
  const fallbackInitial = profile.name?.trim().charAt(0) || "홍";

  return (
    <Card
      data-slot="profile-hero-card"
      className={cn("rounded-3xl", className)}
      {...props}
    >
      <CardContent className="px-5 py-6 sm:px-6 sm:py-8 flex flex-col items-center text-center">
        <Avatar className="mb-4">
          <AvatarImage
            src={profile.avatarUrl || "/profile-avatar.jpg"}
            alt={`${profile.name} 프로필 사진`}
          />
          <AvatarFallback>{fallbackInitial}</AvatarFallback>
        </Avatar>

        <h1 className="tds-h3 text-foreground break-keep">
          {profile.name}
        </h1>

        <p className="tds-body-2 text-muted-foreground mt-1.5 break-keep">
          &ldquo;{profile.bio}&rdquo;
        </p>

        <SocialBadgeList badges={socialBadges} className="mt-5" />
      </CardContent>
    </Card>
  );
}
