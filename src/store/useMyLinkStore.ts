"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_MYLINK_DATA, LOCAL_STORAGE_KEY } from "@/lib/defaultData";
import {
  AddLinkInput,
  LinkCardItem,
  LinkSectionItem,
  MyLinkData,
  MyLinkProfileData,
  SocialBadgeItem,
} from "@/types/mylink";

export interface MyLinkStore extends MyLinkData {
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  updateProfile: (partial: Partial<MyLinkProfileData>) => void;
  setSocialBadges: (badges: SocialBadgeItem[]) => void;
  setLinkSections: (sections: LinkSectionItem[]) => void;
  addLink: (input: AddLinkInput) => LinkCardItem;
  resetToDefault: () => void;
}

export const useMyLinkStore = create<MyLinkStore>()(
  persist(
    (set) => ({
      ...DEFAULT_MYLINK_DATA,
      hasHydrated: false,

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      updateProfile: (partial) =>
        set((state) => ({
          profile: { ...state.profile, ...partial },
        })),

      setSocialBadges: (socialBadges) => set({ socialBadges }),

      setLinkSections: (linkSections) => set({ linkSections }),

      addLink: (input) => {
        const now = new Date().toISOString();
        let createdLink: LinkCardItem = {
          id: `link-${Date.now()}`,
          sectionId: input.sectionId,
          emoji: input.emoji.trim() || "🔗",
          title: input.title.trim(),
          description: input.description.trim(),
          href: input.href.trim(),
          enabled: input.enabled ?? true,
          clickCount: 0,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => {
          const fallbackSectionId =
            state.linkSections[0]?.id ?? "section-projects";
          const targetSectionId = state.linkSections.some(
            (section) => section.id === input.sectionId
          )
            ? input.sectionId
            : fallbackSectionId;

          const nextSections = state.linkSections.map((section) => {
            if (section.id !== targetSectionId) {
              return section;
            }

            const maxOrder = section.links.reduce(
              (max, item) => Math.max(max, item.order ?? 0),
              0
            );

            createdLink = {
              ...createdLink,
              sectionId: targetSectionId,
              order: maxOrder + 1,
            };

            return {
              ...section,
              enabled: createdLink.enabled ? true : section.enabled,
              links: [...section.links, createdLink],
            };
          });

          return {
            linkSections: nextSections,
          };
        });

        return createdLink;
      },

      resetToDefault: () =>
        set({
          ...DEFAULT_MYLINK_DATA,
          hasHydrated: true,
        }),
    }),
    {
      name: LOCAL_STORAGE_KEY,
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState, version) => {
        if (version < 3 || !persistedState) {
          return DEFAULT_MYLINK_DATA;
        }
        return persistedState as MyLinkData;
      },
      partialize: (state): MyLinkData => ({
        version: state.version,
        profile: state.profile,
        socialBadges: state.socialBadges,
        linkSections: state.linkSections,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
