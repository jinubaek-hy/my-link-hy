"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_MYLINK_DATA, LOCAL_STORAGE_KEY } from "@/lib/defaultData";
import {
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
