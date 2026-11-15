import * as React from "react";
import { Database, Mail, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
}

export function ProfileHeroCard({
  profile,
  user,
  socialBadges = [],
  className,
  ...props
}: ProfileHeroCardProps) {
  const displayName =
    user?.displayName?.trim() ||
    profile.name?.trim() ||
    (user?.email ? user.email.split("@")[0] : "마이링크 사용자");
  const displayEmail = user?.email || profile.email;
  const displayAvatar = user?.photoURL || profile.avatarUrl || "";
  const fallbackInitial = displayName.charAt(0).toUpperCase() || "M";
  const firestorePath = user?.uid
    ? `users/${user.uid}/links`
    : undefined;

  return (
    <Card
      data-slot="profile-hero-card"
      className={cn("rounded-3xl", className)}
      {...props}
    >
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

        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 tds-caption text-accent-foreground font-semibold mb-2">
          <UserCheck className="size-3.5 shrink-0" />
          <span>마이페이지 · Google 계정 연동됨</span>
        </div>

        <h1 className="tds-h3 text-foreground break-keep">
          {displayName}
        </h1>

        {displayEmail && (
          <p className="inline-flex items-center gap-1.5 tds-caption text-muted-foreground mt-1 break-all">
            <Mail className="size-3.5 shrink-0 text-primary" />
            <span>{displayEmail}</span>
          </p>
        )}

        <p className="tds-body-2 text-muted-foreground mt-2 break-keep">
          &ldquo;{profile.bio}&rdquo;
        </p>

        {firestorePath && (
          <div
            data-slot="user-firestore-info"
            className="mt-4 w-full rounded-2xl border border-border bg-secondary/50 px-3.5 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 text-center"
          >
            <span className="inline-flex items-center gap-1.5 tds-caption text-foreground font-semibold shrink-0">
              <Database className="size-3.5 text-primary shrink-0" />
              <span>개인화 Firestore 경로</span>
            </span>
            <code className="tds-caption text-primary bg-accent px-2.5 py-0.5 rounded-full break-all font-mono">
              {firestorePath}
            </code>
          </div>
        )}

        <SocialBadgeList badges={socialBadges} className="mt-5" />
      </CardContent>
    </Card>
  );
}
