"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  AddLinkButton,
  AddLinkDialog,
  DeleteLinkDialog,
  EditProfileDialog,
  GoogleLogoIcon,
  LinkSection,
  ProfileHeroCard,
  TopBar,
} from "@/components/mylink";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_MYLINK_DATA } from "@/lib/defaultData";
import { auth } from "@/lib/firebase";
import {
  getEmailPrefixDisplayName,
  useMyLinkStore,
} from "@/store/useMyLinkStore";
import {
  AddLinkInput,
  LinkCardItem,
  MyLinkAuthUser,
  UpdateLinkInput,
  UpdateProfileInput,
} from "@/types/mylink";

export default function Home() {
  const store = useMyLinkStore();
  const [copiedToast, setCopiedToast] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(
    undefined
  );
  const [deletingLink, setDeletingLink] = useState<LinkCardItem | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const authUser: MyLinkAuthUser = {
          uid: fbUser.uid,
          displayName: getEmailPrefixDisplayName(
            fbUser.email,
            fbUser.displayName
          ),
          email: fbUser.email,
          photoURL: fbUser.photoURL,
        };
        void useMyLinkStore.getState().syncUserProfileAndLinks(authUser);
      } else {
        useMyLinkStore.getState().setCurrentUser(null);
        useMyLinkStore.getState().setAuthLoading(false);
        void useMyLinkStore.getState().syncLinksFromFirestore("");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const data =
    store.hasHydrated && Array.isArray(store.linkSections)
      ? store
      : DEFAULT_MYLINK_DATA;

  const { profile, socialBadges, linkSections } = data;
  const currentUser = store.currentUser;

  const sortedSections = [...linkSections].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const visibleSections = sortedSections.filter(
    (section) =>
      section.enabled && section.links.some((link) => link.enabled)
  );

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedToast(true);
        toast.success("프로필 링크를 복사했어요");
        setTimeout(() => setCopiedToast(false), 2200);
      }
    } catch {
      toast.error("링크 복사에 실패했어요");
    }
  };

  const handleGoogleLogin = async () => {
    const loggedInUser = await store.signInWithGoogle();
    if (loggedInUser) {
      const displayName =
        loggedInUser.displayName?.trim() ||
        getEmailPrefixDisplayName(
          loggedInUser.email,
          loggedInUser.displayName
        );
      toast.success(`${displayName}님, 반가워요`);
    } else {
      const errorMsg = useMyLinkStore.getState().authError;
      if (errorMsg) {
        toast.error(errorMsg);
      }
    }
  };

  const handleLogout = async () => {
    await store.signOutUser();
    setIsAddDialogOpen(false);
    setIsEditProfileDialogOpen(false);
    setDeletingLink(null);
    toast("로그아웃되었어요");
  };

  const handleOpenAddDialog = (sectionId?: string) => {
    setSelectedSectionId(sectionId);
    setIsAddDialogOpen(true);
  };

  const handleSaveProfile = async (input: UpdateProfileInput) => {
    await store.saveUserProfile(input);
    toast.success("프로필 정보를 수정했어요");
  };

  const handleAddLink = async (input: AddLinkInput) => {
    await store.addLink(input);
    toast.success("새로운 링크를 추가했어요");
  };

  const handleUpdateLink = async (id: string, input: UpdateLinkInput) => {
    await store.updateLink(id, input);
    toast.success("링크 정보를 수정했어요");
  };

  const handleConfirmDeleteLink = async (link: LinkCardItem) => {
    await store.deleteLink(link.id);
    toast.success(`"${link.title}" 링크를 삭제했어요`);
  };

  const isBusy =
    store.isSyncingLinks ||
    store.isAddingLink ||
    store.isUpdatingLink ||
    store.isDeletingLink;

  const headerTitle = currentUser
    ? profile.headerTitle || "마이페이지"
    : "마이링크";

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* TOP-01: 상단 앱 바 */}
      <TopBar
        title={headerTitle}
        user={currentUser}
        isAuthLoading={store.isAuthLoading}
        isSigningIn={store.isSigningIn}
        copied={copiedToast}
        onGoogleLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onShare={handleShare}
      />

      {/* 모바일 퍼스트 단일 컬럼 컨테이너 (max-w-[560px]) */}
      <main className="max-w-[560px] mx-auto px-5 pt-5 space-y-6">
        {store.isAuthLoading ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-6 text-muted-foreground"
          >
            <Loader2
              className="size-4 animate-spin text-primary shrink-0"
              strokeWidth={2.4}
            />
            <span className="tds-label-s text-foreground">
              로그인 상태를 확인하는 중이에요...
            </span>
          </div>
        ) : !currentUser ? (
          /* 비로그인 상태 안내 카드 */
          <Card data-slot="auth-required-card" className="rounded-3xl">
            <CardContent className="px-5 py-8 sm:px-6 sm:py-10 flex flex-col items-center text-center">
              <h1 className="tds-h3 text-foreground break-keep">
                로그인이 필요해요
              </h1>

              <p className="tds-body-2 text-muted-foreground mt-2 break-keep max-w-[360px]">
                마이페이지는 구글 로그인 이후에 사용할 수 있어요. 로그인하고 나만의 링크를 등록하고 관리해보세요.
              </p>

              {store.authError && (
                <p
                  role="alert"
                  className="tds-caption text-destructive mt-3 break-keep"
                >
                  {store.authError}
                </p>
              )}

              <Button
                type="button"
                variant="default"
                onClick={handleGoogleLogin}
                disabled={store.isSigningIn}
                className="mt-6 px-6"
              >
                {store.isSigningIn ? (
                  <Loader2 className="size-4 animate-spin" strokeWidth={2.4} />
                ) : (
                  <span className="size-5 rounded-full bg-white flex items-center justify-center shrink-0">
                    <GoogleLogoIcon className="size-3.5" />
                  </span>
                )}
                <span>
                  {store.isSigningIn ? "로그인 중..." : "구글로 시작하기"}
                </span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* 로그인 완료 상태 — 마이페이지 */
          <>
            {/* 최상단 새 링크 추가 액션 버튼 카드 */}
            <AddLinkButton onClick={() => handleOpenAddDialog()} />

            {/* PROF-01 ~ PROF-03: 중앙 프로필 카드 & 소셜 배지 컴포넌트 */}
            <ProfileHeroCard
              profile={profile}
              user={currentUser}
              socialBadges={socialBadges}
              onEditProfile={() => setIsEditProfileDialogOpen(true)}
            />

            {/* Firestore 링크 조회 및 갱신 중 로딩 배너 */}
            {isBusy && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3 text-muted-foreground shadow-tds-1"
              >
                <Loader2
                  className="size-4 animate-spin text-primary shrink-0"
                  strokeWidth={2.4}
                />
                <span className="tds-label-s text-foreground">
                  {store.isAddingLink
                    ? "새 링크를 저장하고 목록을 갱신하는 중이에요..."
                    : store.isUpdatingLink
                      ? "링크 수정을 저장하고 목록을 갱신하는 중이에요..."
                      : store.isDeletingLink
                        ? "링크를 삭제하고 목록을 갱신하는 중이에요..."
                        : "최신 링크 목록을 불러오는 중이에요..."}
                </span>
              </div>
            )}

            {/* LINK-01 ~ LINK-02: 섹션별 링크 버튼 카드 리스트 */}
            <div
              aria-busy={isBusy}
              className={
                isBusy
                  ? "space-y-7 opacity-60 transition-opacity duration-150"
                  : "space-y-7 transition-opacity duration-150"
              }
            >
              {visibleSections.length > 0 ? (
                visibleSections.map((section) => (
                  <LinkSection
                    key={section.id}
                    section={section}
                    sections={sortedSections}
                    deletingLinkId={
                      store.isDeletingLink ? deletingLink?.id : undefined
                    }
                    onAddLink={(sectionId) => handleOpenAddDialog(sectionId)}
                    onUpdateLink={handleUpdateLink}
                    onDeleteRequest={(link) => setDeletingLink(link)}
                  />
                ))
              ) : (
                !isBusy && (
                  <Card data-slot="empty-links-card" className="rounded-3xl">
                    <CardContent className="px-5 py-8 sm:px-6 sm:py-10 flex flex-col items-center text-center">
                      <p className="tds-title-2 text-foreground">
                        아직 등록된 링크가 없어요
                      </p>
                      <p className="tds-body-3 text-muted-foreground mt-1.5 break-keep">
                        새 링크를 추가해 나만의 마이페이지를 채워보세요.
                      </p>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenAddDialog()}
                        className="mt-4"
                      >
                        <Plus className="size-3.5" strokeWidth={2.2} />
                        <span>링크 추가하기</span>
                      </Button>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </>
        )}
      </main>

      {/* 링크 추가 다이얼로그 */}
      <AddLinkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        sections={sortedSections}
        defaultSectionId={selectedSectionId}
        onAddLink={handleAddLink}
      />

      {/* 링크 삭제 확인 모달 */}
      <DeleteLinkDialog
        open={Boolean(deletingLink)}
        onOpenChange={(open) => {
          if (!open) setDeletingLink(null);
        }}
        link={deletingLink}
        onConfirmDelete={handleConfirmDeleteLink}
      />

      {/* 프로필 수정 다이얼로그 */}
      <EditProfileDialog
        open={isEditProfileDialogOpen}
        onOpenChange={setIsEditProfileDialogOpen}
        profile={profile}
        user={currentUser}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
