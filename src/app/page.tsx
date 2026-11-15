"use client";

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  Database,
  FolderPlus,
  Loader2,
  LockKeyhole,
  Plus,
  Sparkles,
  UserCheck,
} from "lucide-react";
import {
  AddLinkButton,
  AddLinkDialog,
  DeleteLinkDialog,
  GoogleLogoIcon,
  LinkSection,
  ProfileHeroCard,
  ShareToast,
  TopBar,
} from "@/components/mylink";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_MYLINK_DATA } from "@/lib/defaultData";
import { auth } from "@/lib/firebase";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import {
  AddLinkInput,
  LinkCardItem,
  MyLinkAuthUser,
  UpdateLinkInput,
} from "@/types/mylink";

export default function Home() {
  const store = useMyLinkStore();
  const [copiedToast, setCopiedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(
    undefined
  );
  const [deletingLink, setDeletingLink] = useState<LinkCardItem | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage("");
    }, 2200);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const authUser: MyLinkAuthUser = {
          uid: fbUser.uid,
          displayName: fbUser.displayName,
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
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
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
        showToast("프로필 링크를 복사했어요");
        setTimeout(() => setCopiedToast(false), 2200);
      }
    } catch {
      // 클립보드 권한 실패 시 무시
    }
  };

  const handleGoogleLogin = async () => {
    const loggedInUser = await store.signInWithGoogle();
    if (loggedInUser) {
      const displayName =
        loggedInUser.displayName ||
        (loggedInUser.email ? loggedInUser.email.split("@")[0] : "사용자");
      showToast(`${displayName}님, 환영해요!`);
    }
  };

  const handleLogout = async () => {
    await store.signOutUser();
    setIsAddDialogOpen(false);
    setDeletingLink(null);
    showToast("로그아웃되었어요");
  };

  const handleOpenAddDialog = (sectionId?: string) => {
    setSelectedSectionId(sectionId);
    setIsAddDialogOpen(true);
  };

  const handleAddLink = async (input: AddLinkInput) => {
    await store.addLink(input);
    showToast("새로운 링크를 추가했어요");
  };

  const handleUpdateLink = async (id: string, input: UpdateLinkInput) => {
    await store.updateLink(id, input);
    showToast("링크 정보를 수정했어요");
  };

  const handleConfirmDeleteLink = async (link: LinkCardItem) => {
    await store.deleteLink(link.id);
    showToast(`"${link.title}" 링크를 삭제했어요`);
  };

  const isBusy =
    store.isSyncingLinks ||
    store.isAddingLink ||
    store.isUpdatingLink ||
    store.isDeletingLink;

  const headerTitle = currentUser
    ? profile.headerTitle || "마이페이지"
    : "마이링크 (MyLink)";

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* TOP-01: 상단 앱 바 (구글 소셜 로그인 / 유저 정보 & 로그아웃 / 공유 버튼) */}
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
          /* 1. 초기 인증 상태 확인 중 로딩 뷰 */
          <Card className="rounded-3xl">
            <CardContent className="px-6 py-14 flex flex-col items-center justify-center text-center gap-3">
              <Loader2
                className="size-8 animate-spin text-primary"
                strokeWidth={2.2}
              />
              <p className="tds-title-2 text-foreground">
                로그인 상태를 확인하고 있어요...
              </p>
              <p className="tds-body-3 text-muted-foreground">
                잠시만 기다려주세요.
              </p>
            </CardContent>
          </Card>
        ) : !currentUser ? (
          /* 2. 비로그인 상태 — 로그인 안내 화면 */
          <Card
            data-slot="auth-required-card"
            className="rounded-3xl shadow-tds-2"
          >
            <CardContent className="px-5 py-8 sm:px-7 sm:py-10 flex flex-col items-center text-center">
              <div className="size-16 rounded-3xl bg-accent text-primary flex items-center justify-center mb-5 shadow-tds-1">
                <LockKeyhole className="size-8" strokeWidth={2.2} />
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 tds-caption text-accent-foreground font-semibold mb-3">
                <Sparkles className="size-3.5" />
                <span>Google 소셜 로그인 전용</span>
              </span>

              <h1 className="tds-h3 text-foreground break-keep">
                구글 로그인 후 마이페이지를 이용할 수 있어요
              </h1>

              <p className="tds-body-2 text-muted-foreground mt-2.5 break-keep max-w-[440px]">
                마이링크(MyLink)의 마이페이지는 로그인 이후에 사용할 수 있어요. 상단 헤더 또는 아래 버튼을 눌러 구글 계정으로 로그인해주세요.
              </p>

              {/* 로그인 후 제공 기능 안내 박스 */}
              <div className="w-full rounded-2xl border border-border bg-secondary/50 p-4 sm:p-5 mt-6 text-left space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-xl bg-accent text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <UserCheck className="size-4" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <p className="tds-label-m text-foreground">
                      내 구글 유저 정보 마이페이지 표시
                    </p>
                    <p className="tds-caption text-muted-foreground mt-0.5 break-keep">
                      로그인한 유저의 이름, 이메일, 프로필 사진이 마이페이지 화면에 즉시 표시됩니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-xl bg-accent text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Database className="size-4" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <p className="tds-label-m text-foreground">
                      개인화된 Firestore 경로 (users/&#123;user.uid&#125;/links)
                    </p>
                    <p className="tds-caption text-muted-foreground mt-0.5 break-keep">
                      계정별 고유 UID 경로에 나만의 링크 목록을 안전하게 저장하고 언제든 불러옵니다.
                    </p>
                  </div>
                </div>
              </div>

              {store.authError && (
                <p
                  role="alert"
                  className="w-full rounded-xl bg-destructive/10 px-4 py-2.5 tds-caption text-destructive font-semibold mt-4"
                >
                  {store.authError}
                </p>
              )}

              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={handleGoogleLogin}
                disabled={store.isSigningIn}
                className="w-full mt-6 shadow-tds-2"
              >
                {store.isSigningIn ? (
                  <Loader2 className="size-5 animate-spin" strokeWidth={2.4} />
                ) : (
                  <span className="size-6 rounded-full bg-white flex items-center justify-center shrink-0">
                    <GoogleLogoIcon className="size-4" />
                  </span>
                )}
                <span>
                  {store.isSigningIn
                    ? "구글 계정으로 로그인 중..."
                    : "구글 계정으로 시작하기"}
                </span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* 3. 로그인 완료 상태 — 개인화 프로필 정보 및 users/{user.uid}/links 목록 */
          <>
            {/* 최상단 새 링크 추가 액션 버튼 카드 */}
            <AddLinkButton onClick={() => handleOpenAddDialog()} />

            {/* PROF-01 ~ PROF-03: 로그인 유저 정보 & 개인화 경로 표시 프로필 카드 */}
            <ProfileHeroCard
              profile={profile}
              user={currentUser}
              socialBadges={socialBadges}
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
                        : `Firestore (users/${currentUser.uid}/links)에서 링크 목록을 불러오는 중이에요...`}
                </span>
              </div>
            )}

            {/* LINK-01 ~ LINK-02: 섹션별 링크 버튼 카드 리스트 또는 빈 상태 안내 */}
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
                  <Card
                    data-slot="empty-links-card"
                    className="rounded-3xl border-dashed"
                  >
                    <CardContent className="px-6 py-10 flex flex-col items-center text-center">
                      <div className="size-12 rounded-2xl bg-accent text-primary flex items-center justify-center mb-3.5">
                        <FolderPlus className="size-6" strokeWidth={2.2} />
                      </div>
                      <h2 className="tds-title-1 text-foreground">
                        아직 등록된 링크가 없어요
                      </h2>
                      <p className="tds-body-3 text-muted-foreground mt-1.5 max-w-[380px] break-keep">
                        개인화 경로(<code className="text-primary font-mono">users/{currentUser.uid}/links</code>)에 저장된 링크가 없습니다. 첫 번째 링크를 추가해 나만의 프로필을 완성해보세요!
                      </p>
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => handleOpenAddDialog()}
                        className="mt-5 rounded-full px-4"
                      >
                        <Plus className="size-4" strokeWidth={2.4} />
                        <span>첫 링크 추가하기</span>
                      </Button>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </>
        )}
      </main>

      {/* 링크 추가 다이얼로그 (users/{user.uid}/links 연동) */}
      <AddLinkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        sections={sortedSections}
        defaultSectionId={selectedSectionId}
        onAddLink={handleAddLink}
      />

      {/* 링크 삭제 확인 모달 (users/{user.uid}/links 연동) */}
      <DeleteLinkDialog
        open={Boolean(deletingLink)}
        onOpenChange={(open) => {
          if (!open) setDeletingLink(null);
        }}
        link={deletingLink}
        onConfirmDelete={handleConfirmDeleteLink}
      />

      {/* 공유 및 로그인/링크 추가/수정/삭제 완료 토스트 컴포넌트 */}
      <ShareToast open={Boolean(toastMessage)} message={toastMessage} />
    </div>
  );
}
