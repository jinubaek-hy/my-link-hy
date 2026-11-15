"use client";

import * as React from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { LinkCardItem } from "@/types/mylink";

export interface DeleteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: LinkCardItem | null;
  onConfirmDelete: (link: LinkCardItem) => Promise<unknown> | void;
}

export function DeleteLinkDialog({
  open,
  onOpenChange,
  link,
  onConfirmDelete,
}: DeleteLinkDialogProps) {
  const isDeletingInStore = useMyLinkStore((state) => state.isDeletingLink);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const isBusy = isDeleting || isDeletingInStore;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isBusy && !nextOpen) return;
    if (!nextOpen) {
      setIsDeleting(false);
      setDeleteError(null);
    }
    onOpenChange(nextOpen);
  };

  const handleConfirm = async () => {
    if (!link || isBusy) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onConfirmDelete(link);
      setIsDeleting(false);
      setDeleteError(null);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to delete link from Firestore:", err);
      setDeleteError(
        "Firestore에서 링크 삭제 중 오류가 발생했어요. 잠시 후 다시 시도해주세요."
      );
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[420px]" showCloseButton={!isBusy}>
        <DialogHeader>
          <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
          <DialogDescription>
            선택한 링크 카드를 프로필 목록과 Firestore에서 영구적으로 삭제합니다.
          </DialogDescription>
        </DialogHeader>

        {link && (
          <div className="space-y-3">
            {/* 삭제 대상 링크 이름 표시 */}
            <div className="rounded-xl border border-border bg-secondary/50 px-4 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="tds-title-2 tds-emoji shrink-0"
                  aria-hidden="true"
                >
                  {link.emoji}
                </span>
                <span className="tds-title-2 text-foreground truncate">
                  {link.title}
                </span>
              </div>
              {link.href && (
                <p className="tds-caption text-muted-foreground truncate mt-1 sm:pl-[25px]">
                  {link.href}
                </p>
              )}
            </div>

            {/* 경고 문구 (빨간색) */}
            <p
              role="alert"
              className="flex items-center gap-1.5 tds-label-s text-destructive font-semibold"
            >
              <AlertTriangle className="size-4 shrink-0 text-destructive" />
              <span>이 작업은 되돌릴 수 없습니다</span>
            </p>
          </div>
        )}

        {deleteError && (
          <p role="alert" className="tds-caption text-destructive">
            {deleteError}
          </p>
        )}

        <DialogFooter className="pt-1">
          <DialogClose
            render={
              <Button type="button" variant="secondary" disabled={isBusy}>
                취소
              </Button>
            }
          />
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isBusy || !link}
          >
            {isBusy ? (
              <Loader2 className="size-4 animate-spin" strokeWidth={2.2} />
            ) : (
              <Trash2 className="size-4" strokeWidth={2.2} />
            )}
            <span>삭제하기</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
