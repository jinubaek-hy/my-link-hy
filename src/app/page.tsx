"use client";

import { useEffect, useRef, useState } from "react";
import {
  AddLinkButton,
  AddLinkDialog,
  LinkSection,
  ProfileHeroCard,
  ShareToast,
  TopBar,
} from "@/components/mylink";
import {
  DEFAULT_MYLINK_DATA,
  LOCAL_STORAGE_KEY,
  fetchMockMyLinkData,
} from "@/lib/defaultData";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { AddLinkInput } from "@/types/mylink";

export default function Home() {
  const store = useMyLinkStore();
  const [copiedToast, setCopiedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(
    undefined
  );
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
    // 최초 접속 시(또는 구버전 스키마일 때) 백엔드 Mock API(/api/links) 및 JSON 데이터를 받아와 LocalStorage에 시드 저장
    const syncInitialMockData = async () => {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      let needsSeed = !raw;

      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (!parsed?.state?.linkSections || (parsed?.version ?? 0) < 3) {
            needsSeed = true;
          }
        } catch {
          needsSeed = true;
        }
      }

      if (needsSeed) {
        const mockRes = await fetchMockMyLinkData();
        useMyLinkStore.setState({
          ...mockRes.data,
          hasHydrated: true,
        });
      }
    };

    void syncInitialMockData();

    // 다른 탭이나 개발자 도구에서 LocalStorage 변경 시 즉시 동기화
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_KEY) {
        useMyLinkStore.persist.rehydrate();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
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

  const handleOpenAddDialog = (sectionId?: string) => {
    setSelectedSectionId(sectionId);
    setIsAddDialogOpen(true);
  };

  const handleAddLink = (input: AddLinkInput) => {
    store.addLink(input);
    showToast("새로운 링크를 추가했어요");
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* TOP-01: 상단 앱 바 컴포넌트 */}
      <TopBar
        title={profile.headerTitle}
        copied={copiedToast}
        onShare={handleShare}
      />

      {/* 모바일 퍼스트 단일 컬럼 컨테이너 (max-w-[560px]) */}
      <main className="max-w-[560px] mx-auto px-5 pt-5 space-y-6">
        {/* 최상단 새 링크 추가 액션 버튼 카드 */}
        <AddLinkButton onClick={() => handleOpenAddDialog()} />

        {/* PROF-01 ~ PROF-03: 중앙 프로필 카드 & 소셜 배지 컴포넌트 */}
        <ProfileHeroCard profile={profile} socialBadges={socialBadges} />

        {/* LINK-01 ~ LINK-02: 섹션별 링크 버튼 카드 리스트 컴포넌트 */}
        <div className="space-y-7">
          {visibleSections.map((section) => (
            <LinkSection
              key={section.id}
              section={section}
            />
          ))}
        </div>
      </main>

      {/* 링크 추가 다이얼로그 (로컬 상태 연동) */}
      <AddLinkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        sections={sortedSections}
        defaultSectionId={selectedSectionId}
        onAddLink={handleAddLink}
      />

      {/* 공유 및 링크 추가 완료 토스트 컴포넌트 */}
      <ShareToast open={Boolean(toastMessage)} message={toastMessage} />
    </div>
  );
}
