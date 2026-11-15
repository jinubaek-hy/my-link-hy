"use client";

import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  DEFAULT_MYLINK_DATA,
  DUMMY_FLAT_LINKS,
  LOCAL_STORAGE_KEY,
} from "@/lib/defaultData";
import { db } from "@/lib/firebase";
import {
  AddLinkInput,
  LinkCardItem,
  LinkSectionItem,
  MyLinkData,
  MyLinkProfileData,
  SocialBadgeItem,
} from "@/types/mylink";

/** Firestore 링크 저장 컬렉션 경로: users/anonymous/links */
export const FIRESTORE_LINKS_COLLECTION_PATH = [
  "users",
  "anonymous",
  "links",
] as const;

const DEFAULT_SEED_LINK_IDS = new Set(DUMMY_FLAT_LINKS.map((link) => link.id));

function parseTimestamp(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }
  return undefined;
}

export function sortLinksByCreatedAtDesc(links: LinkCardItem[]): LinkCardItem[] {
  return [...links].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    const validTimeA = Number.isNaN(timeA) ? 0 : timeA;
    const validTimeB = Number.isNaN(timeB) ? 0 : timeB;
    if (validTimeA !== validTimeB) {
      return validTimeB - validTimeA;
    }
    return (a.order ?? 0) - (b.order ?? 0);
  });
}

export interface MyLinkStore extends MyLinkData {
  hasHydrated: boolean;
  isSyncingLinks: boolean;
  isAddingLink: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  updateProfile: (partial: Partial<MyLinkProfileData>) => void;
  setSocialBadges: (badges: SocialBadgeItem[]) => void;
  setLinkSections: (sections: LinkSectionItem[]) => void;
  addLink: (input: AddLinkInput) => Promise<LinkCardItem>;
  syncLinksFromFirestore: () => Promise<void>;
  resetToDefault: () => void;
}

export const useMyLinkStore = create<MyLinkStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_MYLINK_DATA,
      hasHydrated: false,
      isSyncingLinks: false,
      isAddingLink: false,

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      updateProfile: (partial) =>
        set((state) => ({
          profile: { ...state.profile, ...partial },
        })),

      setSocialBadges: (socialBadges) => set({ socialBadges }),

      setLinkSections: (linkSections) => set({ linkSections }),

      addLink: async (input) => {
        set({ isAddingLink: true });
        try {
          const state = get();
          const fallbackSectionId =
            state.linkSections[0]?.id ?? "section-projects";
          const targetSectionId = state.linkSections.some(
            (section) => section.id === input.sectionId
          )
            ? input.sectionId
            : fallbackSectionId;

          const targetSection = state.linkSections.find(
            (section) => section.id === targetSectionId
          );
          const maxOrder = (targetSection?.links ?? []).reduce(
            (max, item) => Math.max(max, item.order ?? 0),
            0
          );

          const now = new Date().toISOString();
          const linkPayload = {
            sectionId: targetSectionId,
            emoji: input.emoji.trim() || "🔗",
            title: input.title.trim(),
            description: input.description.trim(),
            href: input.href.trim(),
            order: maxOrder + 1,
            enabled: input.enabled ?? true,
            clickCount: 0,
            createdAt: now,
            updatedAt: now,
          };

          const linksColRef = collection(
            db,
            FIRESTORE_LINKS_COLLECTION_PATH[0],
            FIRESTORE_LINKS_COLLECTION_PATH[1],
            FIRESTORE_LINKS_COLLECTION_PATH[2]
          );
          const docRef = await addDoc(linksColRef, linkPayload);

          const createdLink: LinkCardItem = {
            id: docRef.id,
            ...linkPayload,
          };

          // 실시간 구독(onSnapshot) 대신, 링크 추가 완료 후 Firestore에서 목록을 다시 조회(getDocs)하여 갱신
          await get().syncLinksFromFirestore();

          return createdLink;
        } finally {
          set({ isAddingLink: false });
        }
      },

      syncLinksFromFirestore: async () => {
        set({ isSyncingLinks: true });
        try {
          const linksColRef = collection(
            db,
            FIRESTORE_LINKS_COLLECTION_PATH[0],
            FIRESTORE_LINKS_COLLECTION_PATH[1],
            FIRESTORE_LINKS_COLLECTION_PATH[2]
          );
          const q = query(linksColRef, orderBy("createdAt", "desc"));
          const snapshot = await getDocs(q);

          const firestoreLinks: LinkCardItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              sectionId:
                typeof data.sectionId === "string"
                  ? data.sectionId
                  : "section-projects",
              emoji: typeof data.emoji === "string" ? data.emoji : "🔗",
              title: typeof data.title === "string" ? data.title : "",
              description:
                typeof data.description === "string" ? data.description : "",
              href: typeof data.href === "string" ? data.href : "#",
              order: typeof data.order === "number" ? data.order : undefined,
              enabled: typeof data.enabled === "boolean" ? data.enabled : true,
              clickCount:
                typeof data.clickCount === "number" ? data.clickCount : 0,
              createdAt: parseTimestamp(data.createdAt),
              updatedAt: parseTimestamp(data.updatedAt),
            };
          });

          set((state) => {
            const fallbackSectionId =
              state.linkSections[0]?.id ?? "section-projects";
            const validSectionIds = new Set(
              state.linkSections.map((s) => s.id)
            );
            const firestoreLinkIds = new Set(firestoreLinks.map((l) => l.id));

            const nextSections = state.linkSections.map((section) => {
              const matchingFirestoreLinks = firestoreLinks.filter((item) => {
                const targetId =
                  item.sectionId && validSectionIds.has(item.sectionId)
                    ? item.sectionId
                    : fallbackSectionId;
                return targetId === section.id;
              });

              const preservedSeedLinks = section.links.filter(
                (link) =>
                  DEFAULT_SEED_LINK_IDS.has(link.id) &&
                  !firestoreLinkIds.has(link.id)
              );

              const mergedLinks = sortLinksByCreatedAtDesc([
                ...matchingFirestoreLinks,
                ...preservedSeedLinks,
              ]);

              const hasEnabledFirestoreLink = matchingFirestoreLinks.some(
                (l) => l.enabled
              );

              return {
                ...section,
                enabled: hasEnabledFirestoreLink ? true : section.enabled,
                links: mergedLinks,
              };
            });

            return { linkSections: nextSections };
          });
        } catch (error) {
          console.error(
            "Failed to sync links from Firestore (users/anonymous/links):",
            error
          );
        } finally {
          set({ isSyncingLinks: false });
        }
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
