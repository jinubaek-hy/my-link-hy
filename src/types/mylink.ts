export interface SocialBadgeItem {
  id: string;
  platform?: string;
  label: string;
  href: string;
  order?: number;
  enabled: boolean;
}

export interface LinkCardItem {
  id: string;
  sectionId?: string;
  emoji: string;
  title: string;
  description: string;
  href: string;
  order?: number;
  enabled: boolean;
  clickCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddLinkInput {
  sectionId: string;
  emoji: string;
  title: string;
  description: string;
  href: string;
  enabled?: boolean;
}

export interface UpdateLinkInput {
  sectionId?: string;
  emoji: string;
  title: string;
  description: string;
  href: string;
  enabled?: boolean;
}

export interface LinkSectionItem {
  id: string;
  emoji: string;
  title: string;
  order?: number;
  enabled: boolean;
  links: LinkCardItem[];
}

export interface MyLinkProfileData {
  id?: string;
  handle?: string;
  headerTitle: string;
  avatarUrl: string;
  name: string;
  bio: string;
  updatedAt?: string;
}

export interface MyLinkData {
  version: 3;
  profile: MyLinkProfileData;
  socialBadges: SocialBadgeItem[];
  linkSections: LinkSectionItem[];
}

export interface MyLinkMockApiResponse {
  status: number;
  message: string;
  meta: {
    apiVersion: string;
    generatedAt: string;
    totalSections: number;
    totalLinks: number;
  };
  data: MyLinkData;
}
