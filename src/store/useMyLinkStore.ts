"use client";

import {
  GoogleAuthProvider,
   signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  DEFAULT_MYLINK_DATA,
  DUMMY_LINK_SECTIONS,
  LOCAL_STORAGE_KEY,
} from "@/lib/defaultData";
import { auth, db } from "@/lib/firebase";
import {
  AddLinkInput,
  LinkCardItem,
  LinkSectionItem,
  MyLinkAuthUser,
  MyLinkData,
  MyLinkProfileData,
  SocialBadgeItem,
  UpdateLinkInput,
} from "@/types/mylink";

/** 기본(비로그인 폴백) Firestore 경로 상수 */
export const FIRESTORE_LINKS_COLLECTION_PATH = [
  "users",
  "anonymous",
  "links",
] as const;

/** 로그인한 사용자 개인화 Firestore 링크 컬렉션 경로: users/{user.uid}/links */
export function getUserLinksCollectionPath(uid: string) {
  return ["users", uid, "links"] as const;
}

function createEmptySectionsTemplate(): LinkSectionItem[] {
  return DUMMY_LINK_SECTIONS.map((section) => ({
    ...section,
    enabled: true,
    links: [],
  }));
}

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
  currentUser: MyLinkAuthUser | null;
  isAuthLoading: boolean;
  isSigningIn: boolean;
  authError: string | null;
  isSyncingLinks: boolean;
  isAddingLink: boolean;
  isUpdatingLink: boolean;
  isDeletingLink: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  setCurrentUser: (user: MyLinkAuthUser | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  signInWithGoogle: () => Promise<MyLinkAuthUser | null>;
  signOutUser: () => Promise<void>;
  syncUserProfileAndLinks: (user: MyLinkAuthUser) => Promise<void>;
  updateProfile: (partial: Partial<MyLinkProfileData>) => void;
  setSocialBadges: (badges: SocialBadgeItem[]) => void;
  setLinkSections: (sections: LinkSectionItem[]) => void;
  addLink: (input: AddLinkInput) => Promise<LinkCardItem>;
  updateLink: (id: string, input: UpdateLinkInput) => Promise<LinkCardItem>;
  deleteLink: (id: string) => Promise<void>;
  syncLinksFromFirestore: (uidOverride?: string) => Promise<void>;
  resetToDefault: () => void;
}

export const useMyLinkStore = create<MyLinkStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_MYLINK_DATA,
      linkSections: createEmptySectionsTemplate(),
      hasHydrated: false,
      currentUser: null,
      isAuthLoading: true,
      isSigningIn: false,
      authError: null,
      isSyncingLinks: false,
      isAddingLink: false,
      isUpdatingLink: false,
      isDeletingLink: false,

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      setCurrentUser: (user) => set({ currentUser: user }),

      setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),

      setAuthError: (authError) => set({ authError }),

      signInWithGoogle: async () => {
        set({ isSigningIn: true, authError: null });
        try {
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: "select_account" });
          const credential = await signInWithPopup(auth, provider);
          const fbUser = credential.user;

          const authUser: MyLinkAuthUser = {
            uid: fbUser.uid,
            displayName: fbUser.displayName,
            email: fbUser.email,
            photoURL: fbUser.photoURL,
          };

          await get().syncUserProfileAndLinks(authUser);
          return authUser;
        } catch (error: unknown) {
          const code =
            error && typeof error === "object" && "code" in error
              ? String((error as { code?: unknown }).code)
              : "";
          if (
            code === "auth/popup-closed-by-user" ||
            code === "auth/cancelled-popup-request"
          ) {
            set({ authError: "구글 로그인 창이 닫혔어요. 다시 시도해주세요." });
          } else {
            console.error("Google sign-in failed:", error);
            set({
              authError:
                "구글 로그인 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
            });
          }
          return null;
        } finally {
          set({ isSigningIn: false });
        }
      },

      signOutUser: async () => {
        set({ authError: null });
        await signOut(auth);
        set({
          currentUser: null,
          profile: DEFAULT_MYLINK_DATA.profile,
          linkSections: createEmptySectionsTemplate(),
        });
      },

      syncUserProfileAndLinks: async (authUser) => {
        const defaultName =
          authUser.displayName?.trim() ||
          (authUser.email ? authUser.email.split("@")[0] : "마이링크 사용자");
        const defaultAvatar = authUser.photoURL || "";
        const defaultBio = authUser.email
          ? `${authUser.email} · 나만의 마이페이지 프로필 🚀`
          : "구글 계정으로 연동된 나만의 마이페이지 프로필 🚀";

        let mergedProfile: MyLinkProfileData = {
          id: authUser.uid,
          uid: authUser.uid,
          email: authUser.email ?? undefined,
          handle: authUser.email ? `@${authUser.email.split("@")[0]}` : undefined,
          headerTitle: "마이페이지",
          avatarUrl: defaultAvatar,
          name: defaultName,
          bio: defaultBio,
          updatedAt: new Date().toISOString(),
        };

        // users/{user.uid} 문서가 존재하는 경우 유저 프로필 정보를 읽어와 병합하고 최신 정보 저장
        try {
          const userDocRef = doc(db, "users", authUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const docName =
              typeof data.name === "string" && data.name.trim()
                ? data.name.trim()
                : typeof data.displayName === "string" && data.displayName.trim()
                  ? data.displayName.trim()
                  : defaultName;
            const docAvatar =
              typeof data.avatarUrl === "string" && data.avatarUrl.trim()
                ? data.avatarUrl.trim()
                : typeof data.photoURL === "string" && data.photoURL.trim()
                  ? data.photoURL.trim()
                  : defaultAvatar;
            const docEmail =
              typeof data.email === "string" && data.email.trim()
                ? data.email.trim()
                : authUser.email ?? undefined;
            const docBio =
              typeof data.bio === "string" && data.bio.trim()
                ? data.bio.trim()
                : defaultBio;

            mergedProfile = {
              ...mergedProfile,
              name: docName,
              avatarUrl: docAvatar,
              email: docEmail,
              bio: docBio,
              headerTitle:
                typeof data.headerTitle === "string" && data.headerTitle.trim()
                  ? data.headerTitle.trim()
                  : "마이페이지",
            };
          } else {
            await setDoc(
              userDocRef,
              {
                uid: authUser.uid,
                name: mergedProfile.name,
                displayName: authUser.displayName ?? mergedProfile.name,
                email: authUser.email ?? null,
                photoURL: authUser.photoURL ?? null,
                avatarUrl: mergedProfile.avatarUrl,
                bio: mergedProfile.bio,
                headerTitle: mergedProfile.headerTitle,
                updatedAt: mergedProfile.updatedAt,
              },
              { merge: true }
            );
          }
        } catch {
          // Firestore 보안 규칙에서 상위 users/{uid} 문서 접근이 제한된 경우에도 Auth 유저 프로필로 안전하게 표시
        }

        // 이메일 배지 개인화 반영
        const nextBadges = get().socialBadges.map((badge) => {
          if (badge.platform === "email" && authUser.email) {
            return {
              ...badge,
              href: `mailto:${authUser.email}`,
            };
          }
          return badge;
        });

        set({
          currentUser: authUser,
          profile: mergedProfile,
          socialBadges: nextBadges,
          isAuthLoading: false,
        });

        await get().syncLinksFromFirestore(authUser.uid);
      },

      updateProfile: (partial) =>
        set((state) => ({
          profile: { ...state.profile, ...partial },
        })),

      setSocialBadges: (socialBadges) => set({ socialBadges }),

      setLinkSections: (linkSections) => set({ linkSections }),

      addLink: async (input) => {
        const uid = get().currentUser?.uid;
        if (!uid) {
          throw new Error("로그인 후 링크를 추가할 수 있습니다.");
        }

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
            uid,
            userName: state.currentUser?.displayName ?? state.profile.name,
            userEmail: state.currentUser?.email ?? state.profile.email ?? null,
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

          const [colRoot, colUid, colLinks] = getUserLinksCollectionPath(uid);
          const linksColRef = collection(db, colRoot, colUid, colLinks);
          const docRef = await addDoc(linksColRef, linkPayload);

          const createdLink: LinkCardItem = {
            id: docRef.id,
            ...linkPayload,
          };

          // 실시간 구독(onSnapshot) 대신, 링크 추가 완료 후 users/{user.uid}/links에서 목록을 다시 조회(getDocs)하여 갱신
          await get().syncLinksFromFirestore(uid);

          return createdLink;
        } finally {
          set({ isAddingLink: false });
        }
      },

      updateLink: async (id, input) => {
        const uid = get().currentUser?.uid;
        if (!uid) {
          throw new Error("로그인 후 링크를 수정할 수 있습니다.");
        }

        set({ isUpdatingLink: true });
        try {
          const state = get();
          const fallbackSectionId =
            state.linkSections[0]?.id ?? "section-projects";

          let existingLink: LinkCardItem | undefined;
          let existingSectionId: string | undefined;

          for (const section of state.linkSections) {
            const found = section.links.find((l) => l.id === id);
            if (found) {
              existingLink = found;
              existingSectionId = found.sectionId ?? section.id;
              break;
            }
          }

          const requestedSectionId =
            input.sectionId ?? existingSectionId ?? fallbackSectionId;
          const targetSectionId = state.linkSections.some(
            (section) => section.id === requestedSectionId
          )
            ? requestedSectionId
            : fallbackSectionId;

          const now = input.updatedAt ?? new Date().toISOString();
          const updateFields = {
            uid,
            sectionId: targetSectionId,
            emoji: input.emoji.trim() || "🔗",
            title: input.title.trim(),
            description:
              input.description.trim() || "클릭하여 해당 링크로 이동합니다",
            href: input.href.trim(),
            enabled: input.enabled ?? existingLink?.enabled ?? true,
            updatedAt: now,
          };

          const [colRoot, colUid, colLinks] = getUserLinksCollectionPath(uid);
          const linkDocRef = doc(db, colRoot, colUid, colLinks, id);

          try {
            await updateDoc(linkDocRef, updateFields);
          } catch {
            await setDoc(
              linkDocRef,
              {
                ...updateFields,
                order: existingLink?.order ?? 1,
                clickCount: existingLink?.clickCount ?? 0,
                createdAt: existingLink?.createdAt ?? now,
              },
              { merge: true }
            );
          }

          const updatedLink: LinkCardItem = {
            id,
            order: existingLink?.order ?? 1,
            clickCount: existingLink?.clickCount ?? 0,
            createdAt: existingLink?.createdAt ?? now,
            ...updateFields,
          };

          // 실시간 구독(onSnapshot) 대신, 링크 수정 완료 후 users/{user.uid}/links에서 목록을 다시 조회(getDocs)하여 갱신
          await get().syncLinksFromFirestore(uid);

          return updatedLink;
        } finally {
          set({ isUpdatingLink: false });
        }
      },

      deleteLink: async (id) => {
        const uid = get().currentUser?.uid;
        if (!uid) {
          throw new Error("로그인 후 링크를 삭제할 수 있습니다.");
        }

        set({ isDeletingLink: true });
        try {
          const [colRoot, colUid, colLinks] = getUserLinksCollectionPath(uid);
          const linkDocRef = doc(db, colRoot, colUid, colLinks, id);

          await deleteDoc(linkDocRef);

          // 실시간 구독(onSnapshot) 대신, 링크 삭제 완료 후 users/{user.uid}/links에서 목록을 다시 조회(getDocs)하여 갱신
          await get().syncLinksFromFirestore(uid);
        } finally {
          set({ isDeletingLink: false });
        }
      },

      syncLinksFromFirestore: async (uidOverride) => {
        const uid = uidOverride ?? get().currentUser?.uid;
        if (!uid) {
          set({
            linkSections: createEmptySectionsTemplate(),
            isSyncingLinks: false,
          });
          return;
        }

        set({ isSyncingLinks: true });
        try {
          const [colRoot, colUid, colLinks] = getUserLinksCollectionPath(uid);
          const linksColRef = collection(db, colRoot, colUid, colLinks);
          const snapshot = await getDocs(linksColRef);

          const firestoreLinks: LinkCardItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              sectionId:
                typeof data.sectionId === "string" && data.sectionId.trim()
                  ? data.sectionId.trim()
                  : "section-projects",
              emoji:
                typeof data.emoji === "string" && data.emoji.trim()
                  ? data.emoji.trim()
                  : "🔗",
              title:
                typeof data.title === "string" && data.title.trim()
                  ? data.title.trim()
                  : typeof data.name === "string"
                    ? data.name
                    : "제목 없는 링크",
              description:
                typeof data.description === "string" ? data.description : "",
              href:
                typeof data.href === "string" && data.href.trim()
                  ? data.href.trim()
                  : typeof data.url === "string"
                    ? data.url
                    : "#",
              order: typeof data.order === "number" ? data.order : undefined,
              enabled: typeof data.enabled === "boolean" ? data.enabled : true,
              clickCount:
                typeof data.clickCount === "number" ? data.clickCount : 0,
              createdAt: parseTimestamp(data.createdAt),
              updatedAt: parseTimestamp(data.updatedAt),
            };
          });

          set((state) => {
            const baseSections =
              state.linkSections.length > 0
                ? state.linkSections
                : createEmptySectionsTemplate();
            const fallbackSectionId =
              baseSections[0]?.id ?? "section-projects";
            const validSectionIds = new Set(baseSections.map((s) => s.id));

            const nextSections = baseSections.map((section) => {
              const matchingFirestoreLinks = firestoreLinks.filter((item) => {
                const targetId =
                  item.sectionId && validSectionIds.has(item.sectionId)
                    ? item.sectionId
                    : fallbackSectionId;
                return targetId === section.id;
              });

              const sortedLinks = sortLinksByCreatedAtDesc(
                matchingFirestoreLinks
              );

              return {
                ...section,
                enabled: true,
                links: sortedLinks,
              };
            });

            return { linkSections: nextSections };
          });
        } catch (error) {
          console.error(
            `Failed to sync links from Firestore (users/${uid}/links):`,
            error
          );
        } finally {
          set({ isSyncingLinks: false });
        }
      },

      resetToDefault: () =>
        set({
          ...DEFAULT_MYLINK_DATA,
          linkSections: createEmptySectionsTemplate(),
          hasHydrated: true,
        }),
    }),
    {
      name: LOCAL_STORAGE_KEY,
      version: 4,
      storage: createJSONStorage(() => localStorage),
      migrate: () => ({
        ...DEFAULT_MYLINK_DATA,
        linkSections: createEmptySectionsTemplate(),
      }),
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
