"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Loader2,
  RotateCcw,
  SearchCheck,
} from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { isValidLinkUrl } from "@/components/mylink/add-link-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Form,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import {
  MyLinkAuthUser,
  MyLinkProfileData,
  UpdateProfileInput,
} from "@/types/mylink";

export const DISPLAY_NAME_MIN_LENGTH = 2;
export const DISPLAY_NAME_MAX_LENGTH = 20;
export const BIO_MAX_LENGTH = 80;
export const HEADER_TITLE_MAX_LENGTH = 20;

export const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Display Name을 입력해주세요.")
    .min(
      DISPLAY_NAME_MIN_LENGTH,
      `Display Name은 최소 ${DISPLAY_NAME_MIN_LENGTH}자 이상 입력해주세요.`
    )
    .max(
      DISPLAY_NAME_MAX_LENGTH,
      `Display Name은 ${DISPLAY_NAME_MAX_LENGTH}자 이내로 입력해주세요.`
    )
    .refine(
      (val) => !/^\s|\s$/.test(val),
      "Display Name 앞뒤에는 공백을 사용할 수 없어요."
    ),
  bio: z
    .string()
    .trim()
    .min(1, "한 줄 소개를 입력해주세요.")
    .max(
      BIO_MAX_LENGTH,
      `한 줄 소개는 ${BIO_MAX_LENGTH}자 이내로 입력해주세요.`
    ),
  avatarUrl: z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      if (!val) return;
      const check = isValidLinkUrl(val);
      if (
        !check.valid ||
        (!check.normalized.startsWith("http://") &&
          !check.normalized.startsWith("https://"))
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "올바른 이미지 URL 주소를 입력해주세요. (https:// 또는 http://)",
        });
      }
    }),
  headerTitle: z
    .string()
    .trim()
    .max(
      HEADER_TITLE_MAX_LENGTH,
      `상단 헤더 제목은 ${HEADER_TITLE_MAX_LENGTH}자 이내로 입력해주세요.`
    ),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

type DuplicateCheckState =
  | { status: "idle"; checkedName: ""; message: "" }
  | { status: "checking"; checkedName: string; message: string }
  | {
      status: "available";
      checkedName: string;
      isCurrent?: boolean;
      message: string;
    }
  | { status: "duplicate"; checkedName: string; message: string };

export interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: MyLinkProfileData;
  user?: MyLinkAuthUser | null;
  onSaveProfile: (input: UpdateProfileInput) => Promise<unknown> | void;
}

interface EditProfileFormProps {
  profile: MyLinkProfileData;
  user?: MyLinkAuthUser | null;
  onSaveProfile: (input: UpdateProfileInput) => Promise<unknown> | void;
  onClose: () => void;
}

function EditProfileForm({
  profile,
  user,
  onSaveProfile,
  onClose,
}: EditProfileFormProps) {
  const checkDisplayNameAvailability = useMyLinkStore(
    (state) => state.checkDisplayNameAvailability
  );
  const isCheckingDisplayName = useMyLinkStore(
    (state) => state.isCheckingDisplayName
  );

  const displayEmail = user?.email || profile.email || "";
  const emailPrefix =
    displayEmail && displayEmail.includes("@")
      ? displayEmail.split("@")[0]?.trim()
      : "";

  const initialName =
    profile.name?.trim() ||
    user?.displayName?.trim() ||
    emailPrefix ||
    "사용자";
  const initialBio =
    profile.bio?.trim() || "안녕하세요! 나만의 링크를 모아둔 공간입니다.";
  const initialAvatarUrl =
    profile.avatarUrl?.trim() || user?.photoURL?.trim() || "";
  const initialHeaderTitle = profile.headerTitle?.trim() || "마이페이지";

  const googleDefaultPhotoUrl = auth.currentUser?.photoURL || "";

  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [dupCheck, setDupCheck] = React.useState<DuplicateCheckState>({
    status: "available",
    checkedName: initialName.toLowerCase(),
    isCurrent: true,
    message: "현재 사용 중인 Display Name이에요.",
  });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    mode: "onTouched",
    defaultValues: {
      name: initialName,
      bio: initialBio,
      avatarUrl: initialAvatarUrl,
      headerTitle: initialHeaderTitle,
    },
  });

  const watchedValues = useWatch({ control });
  const nameValue = watchedValues.name ?? "";
  const bioValue = watchedValues.bio ?? "";
  const avatarUrlValue = watchedValues.avatarUrl ?? "";

  const trimmedName = nameValue.trim();
  const normalizedName = trimmedName.toLowerCase();
  const isSameAsInitial = normalizedName === initialName.toLowerCase();
  const isCheckedForCurrentInput =
    isSameAsInitial ||
    (dupCheck.status === "available" &&
      dupCheck.checkedName === normalizedName);

  const handleNameChange = (
    nextValue: string,
    fieldOnChange: (val: string) => void
  ) => {
    fieldOnChange(nextValue);
    setSubmitError(null);
    const nextTrimmed = nextValue.trim().toLowerCase();
    if (nextTrimmed && nextTrimmed === initialName.toLowerCase()) {
      clearErrors("name");
      setDupCheck({
        status: "available",
        checkedName: nextTrimmed,
        isCurrent: true,
        message: "현재 사용 중인 Display Name이에요.",
      });
    } else {
      setDupCheck({
        status: "idle",
        checkedName: "",
        message: "",
      });
    }
  };

  const handleCheckDuplicate = async () => {
    setSubmitError(null);
    const targetName = nameValue.trim();

    if (targetName.length < DISPLAY_NAME_MIN_LENGTH) {
      setError("name", {
        type: "manual",
        message: `Display Name은 최소 ${DISPLAY_NAME_MIN_LENGTH}자 이상 입력해주세요.`,
      });
      return;
    }

    if (targetName.length > DISPLAY_NAME_MAX_LENGTH) {
      setError("name", {
        type: "manual",
        message: `Display Name은 ${DISPLAY_NAME_MAX_LENGTH}자 이내로 입력해주세요.`,
      });
      return;
    }

    setDupCheck({
      status: "checking",
      checkedName: targetName.toLowerCase(),
      message: "Display Name 중복 여부를 확인하고 있어요...",
    });

    const result = await checkDisplayNameAvailability(targetName);
    if (result.available) {
      clearErrors("name");
      setDupCheck({
        status: "available",
        checkedName: targetName.toLowerCase(),
        isCurrent: result.isCurrentUserName,
        message: result.message,
      });
    } else {
      setError("name", {
        type: "manual",
        message: result.message,
      });
      setDupCheck({
        status: "duplicate",
        checkedName: targetName.toLowerCase(),
        message: result.message,
      });
    }
  };

  const onValidSubmit = async (values: EditProfileFormValues) => {
    setSubmitError(null);
    const finalName = values.name.trim();
    const finalNormalized = finalName.toLowerCase();

    // Display Name이 변경되었는데 아직 중복 확인을 거치지 않은 경우 안내
    if (
      finalNormalized !== initialName.toLowerCase() &&
      !(
        dupCheck.status === "available" &&
        dupCheck.checkedName === finalNormalized
      )
    ) {
      setError("name", {
        type: "manual",
        message: "Display Name 중복 확인 버튼을 눌러 사용 가능 여부를 확인해주세요.",
      });
      return;
    }

    const finalAvatar = values.avatarUrl.trim()
      ? isValidLinkUrl(values.avatarUrl).normalized
      : "";

    try {
      await onSaveProfile({
        name: finalName,
        bio: values.bio.trim(),
        avatarUrl: finalAvatar,
        headerTitle: values.headerTitle.trim() || "마이페이지",
      });
      onClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "프로필 저장 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.";
      setSubmitError(message);
    }
  };

  const previewAvatar = avatarUrlValue.trim();
  const previewName = trimmedName || "Display Name";
  const previewInitial = previewName.charAt(0).toUpperCase() || "U";
  const previewBio =
    bioValue.trim() || "한 줄 소개를 입력하면 프로필 카드에 표시됩니다.";

  return (
    <Form
      errors={
        Object.fromEntries(
          Object.entries(errors)
            .filter(([, err]) => Boolean(err?.message))
            .map(([key, err]) => [key, err?.message ?? ""])
        )
      }
      onSubmit={handleSubmit(onValidSubmit)}
      noValidate
    >
      {/* 1. 실시간 프로필 미리보기 */}
      <div className="rounded-2xl border border-border bg-secondary/40 px-4 py-4 flex items-center gap-3.5">
        <Avatar className="size-14 shrink-0">
          {previewAvatar && (
            <AvatarImage
              src={previewAvatar}
              alt={`${previewName} 미리보기`}
              referrerPolicy="no-referrer"
            />
          )}
          <AvatarFallback className="tds-title-2">
            {previewInitial}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="tds-title-2 text-foreground truncate">
              {previewName}
            </span>
            {isCheckedForCurrentInput && trimmedName.length >= 2 && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-accent px-2 py-0.5 tds-caption text-primary shrink-0">
                <Check className="size-3" strokeWidth={2.5} />
                <span>확인됨</span>
              </span>
            )}
          </div>
          {displayEmail && (
            <p className="tds-caption text-muted-foreground truncate">
              {displayEmail}
            </p>
          )}
          <p className="tds-body-3 text-muted-foreground truncate mt-0.5">
            &ldquo;{previewBio}&rdquo;
          </p>
        </div>
      </div>

      {/* 2. Display Name 입력 + 중복 확인 버튼 */}
      <Controller
        control={control}
        name="name"
        render={({
          field: { ref, name, value, onBlur, onChange },
          fieldState: { invalid, isTouched, isDirty, error },
        }) => (
          <Field
            name={name}
            invalid={invalid || dupCheck.status === "duplicate"}
            touched={isTouched}
            dirty={isDirty}
          >
            <div className="flex items-center justify-between">
              <FieldLabel>
                Display Name <span className="text-destructive">*</span>
              </FieldLabel>
              <span
                className={cn(
                  "tds-caption tds-tabular",
                  value.trim().length > DISPLAY_NAME_MAX_LENGTH
                    ? "text-destructive font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {value.trim().length}/{DISPLAY_NAME_MAX_LENGTH}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                ref={ref}
                value={value}
                onBlur={onBlur}
                onValueChange={(val) => handleNameChange(val, onChange)}
                placeholder="표시할 이름을 입력하세요 (2~20자)"
                className="flex-1"
              />
              <Button
                type="button"
                variant={isCheckedForCurrentInput ? "secondary" : "default"}
                size="default"
                onClick={handleCheckDuplicate}
                disabled={
                  isCheckingDisplayName ||
                  isSubmitting ||
                  value.trim().length < DISPLAY_NAME_MIN_LENGTH
                }
                className="shrink-0 px-3.5"
              >
                {isCheckingDisplayName ? (
                  <Loader2 className="size-4 animate-spin" strokeWidth={2.2} />
                ) : (
                  <SearchCheck className="size-4" strokeWidth={2.2} />
                )}
                <span>중복 확인</span>
              </Button>
            </div>

            <FieldError match={Boolean(error)}>{error?.message}</FieldError>

            {!error && dupCheck.status === "available" && (
              <FieldDescription className="flex items-center gap-1 text-primary">
                <CheckCircle2 className="size-3.5 shrink-0" />
                <span>{dupCheck.message}</span>
              </FieldDescription>
            )}

            {!error &&
              dupCheck.status === "idle" &&
              trimmedName.length >= DISPLAY_NAME_MIN_LENGTH && (
                <FieldDescription className="flex items-center gap-1 text-muted-foreground">
                  <AlertCircle className="size-3.5 shrink-0" />
                  <span>
                    우측 &lsquo;중복 확인&rsquo; 버튼을 눌러 사용 가능 여부를 확인해주세요.
                  </span>
                </FieldDescription>
              )}
          </Field>
        )}
      />

      {/* 3. 한 줄 소개 (Bio) */}
      <Controller
        control={control}
        name="bio"
        render={({
          field: { ref, name, value, onBlur, onChange },
          fieldState: { invalid, isTouched, isDirty, error },
        }) => (
          <Field
            name={name}
            invalid={invalid}
            touched={isTouched}
            dirty={isDirty}
          >
            <div className="flex items-center justify-between">
              <FieldLabel>
                한 줄 소개 <span className="text-destructive">*</span>
              </FieldLabel>
              <span
                className={cn(
                  "tds-caption tds-tabular",
                  value.trim().length > BIO_MAX_LENGTH
                    ? "text-destructive font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {value.trim().length}/{BIO_MAX_LENGTH}
              </span>
            </div>
            <Input
              ref={ref}
              value={value}
              onBlur={onBlur}
              onValueChange={onChange}
              placeholder="예: 프로덕트 디자이너 & 프론트엔드 개발자입니다 🚀"
            />
            <FieldError match={Boolean(error)}>{error?.message}</FieldError>
          </Field>
        )}
      />

      {/* 4. 프로필 이미지 URL (선택) */}
      <Controller
        control={control}
        name="avatarUrl"
        render={({
          field: { ref, name, value, onBlur, onChange },
          fieldState: { invalid, isTouched, isDirty, error },
        }) => (
          <Field
            name={name}
            invalid={invalid}
            touched={isTouched}
            dirty={isDirty}
          >
            <div className="flex items-center justify-between gap-2">
              <FieldLabel>프로필 이미지 URL (선택)</FieldLabel>
              {googleDefaultPhotoUrl && value.trim() !== googleDefaultPhotoUrl && (
                <button
                  type="button"
                  onClick={() =>
                    setValue("avatarUrl", googleDefaultPhotoUrl, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                  className="inline-flex items-center gap-1 tds-caption text-primary hover:underline cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>구글 기본 사진 복원</span>
                </button>
              )}
            </div>
            <Input
              ref={ref}
              type="url"
              value={value}
              onBlur={onBlur}
              onValueChange={onChange}
              placeholder="https://example.com/avatar.png (비워두면 이니셜 표시)"
            />
            <FieldError match={Boolean(error)}>{error?.message}</FieldError>
          </Field>
        )}
      />

      {/* 5. 상단 헤더 제목 (선택) */}
      <Controller
        control={control}
        name="headerTitle"
        render={({
          field: { ref, name, value, onBlur, onChange },
          fieldState: { invalid, isTouched, isDirty, error },
        }) => (
          <Field
            name={name}
            invalid={invalid}
            touched={isTouched}
            dirty={isDirty}
          >
            <div className="flex items-center justify-between">
              <FieldLabel>상단 헤더 타이틀 (선택)</FieldLabel>
              <span
                className={cn(
                  "tds-caption tds-tabular",
                  value.trim().length > HEADER_TITLE_MAX_LENGTH
                    ? "text-destructive font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {value.trim().length}/{HEADER_TITLE_MAX_LENGTH}
              </span>
            </div>
            <Input
              ref={ref}
              value={value}
              onBlur={onBlur}
              onValueChange={onChange}
              placeholder="마이페이지"
            />
            <FieldError match={Boolean(error)}>{error?.message}</FieldError>
          </Field>
        )}
      />

      {submitError && (
        <p role="alert" className="tds-caption text-destructive">
          {submitError}
        </p>
      )}

      <DialogFooter className="pt-1">
        <DialogClose
          render={
            <Button type="button" variant="secondary" disabled={isSubmitting}>
              취소
            </Button>
          }
        />
        <Button
          type="submit"
          variant="default"
          disabled={isSubmitting || isCheckingDisplayName}
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" strokeWidth={2.2} />
          ) : (
            <Check className="size-4" strokeWidth={2.2} />
          )}
          <span>프로필 저장</span>
        </Button>
      </DialogFooter>
    </Form>
  );
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  user,
  onSaveProfile,
}: EditProfileDialogProps) {
  const [isSubmittingForm, setIsSubmittingForm] = React.useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmittingForm && !nextOpen) return;
    onOpenChange(nextOpen);
  };

  const handleSaveWithLock = async (input: UpdateProfileInput) => {
    setIsSubmittingForm(true);
    try {
      await onSaveProfile(input);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const firestorePathText = user?.uid
    ? `users/${user.uid}`
    : "users/{user.uid}";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!isSubmittingForm}>
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
          <DialogDescription>
            마이페이지에 표시되는 Display Name과 한 줄 소개, 프로필 사진을 수정합니다. (Firestore {firestorePathText}에 저장됩니다)
          </DialogDescription>
        </DialogHeader>

        {open && (
          <EditProfileForm
            key={profile.updatedAt ?? profile.name ?? "profile-form"}
            profile={profile}
            user={user}
            onSaveProfile={handleSaveWithLock}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
