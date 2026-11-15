"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Link2, Loader2, Plus } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { LinkButtonCard } from "@/components/mylink/link-button-card";
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AddLinkInput, LinkSectionItem } from "@/types/mylink";

export interface AddLinkButtonProps
  extends React.ComponentProps<"button"> {
  label?: string;
  description?: string;
}

export function AddLinkButton({
  label = "새 링크 추가하기",
  description = "포트폴리오, 블로그, 소셜 채널 링크를 등록해보세요",
  className,
  ...props
}: AddLinkButtonProps) {
  return (
    <button
      type="button"
      data-slot="add-link-button"
      className={cn(
        "group relative w-full rounded-2xl border border-primary bg-primary px-4 py-3.5 sm:px-5 sm:py-4 text-left text-primary-foreground shadow-tds-2 transition-all duration-150 ease-tds cursor-pointer outline-none hover:bg-tds-blue-600 active:bg-tds-blue-700 active:scale-[0.99] focus-visible:ring-3 focus-visible:ring-ring/40",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="size-11 rounded-xl bg-primary-foreground/18 text-primary-foreground flex items-center justify-center shrink-0 transition-transform duration-150 ease-tds group-hover:scale-105 group-hover:bg-primary-foreground/25">
            <Link2 className="size-5" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="tds-title-2 text-primary-foreground truncate">
              {label}
            </div>
            <p className="tds-body-3 text-primary-foreground/85 truncate mt-0.5">
              {description}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground px-3.5 py-2 tds-label-s text-primary shadow-tds-1 shrink-0 transition-transform duration-150 ease-tds group-hover:translate-x-0.5">
          <Plus className="size-3.5" strokeWidth={2.5} />
          <span>링크 추가</span>
        </span>
      </div>
    </button>
  );
}

const EMOJI_PRESETS = [
  "🔗",
  "🎨",
  "💻",
  "🚀",
  "📺",
  "💬",
  "📘",
  "📄",
  "⚡",
  "📊",
  "🎧",
  "🎁",
] as const;

const TITLE_MIN_LENGTH = 2;
const TITLE_MAX_LENGTH = 40;
const DESCRIPTION_MAX_LENGTH = 80;

export interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: LinkSectionItem[];
  defaultSectionId?: string;
  onAddLink: (input: AddLinkInput) => Promise<unknown> | void;
}

export function normalizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function isValidLinkUrl(rawUrl: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return {
      valid: false,
      normalized: "",
      error: "이동할 URL 주소를 입력해주세요.",
    };
  }

  if (/\s/.test(trimmed)) {
    return {
      valid: false,
      normalized: trimmed,
      error: "URL 주소에는 공백을 포함할 수 없어요.",
    };
  }

  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) {
    return {
      valid: false,
      normalized: trimmed,
      error: "허용되지 않는 URL 프로토콜입니다. (https:// 또는 http:// 사용)",
    };
  }

  const normalized = normalizeUrl(trimmed);

  if (normalized.startsWith("mailto:")) {
    const emailPart = normalized.slice("mailto:".length);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailPart)) {
      return {
        valid: false,
        normalized,
        error: "올바른 이메일 주소 형식이 아니에요. (예: mailto:hello@example.com)",
      };
    }
    return { valid: true, normalized };
  }

  if (normalized.startsWith("tel:")) {
    const telPart = normalized.slice("tel:".length);
    if (!/^[0-9+\-()]{5,20}$/.test(telPart)) {
      return {
        valid: false,
        normalized,
        error: "올바른 전화번호 형식이 아니에요. (예: tel:010-1234-5678)",
      };
    }
    return { valid: true, normalized };
  }

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        valid: false,
        normalized,
        error: "http:// 또는 https://로 시작하는 올바른 주소를 입력해주세요.",
      };
    }

    const hostname = parsed.hostname;
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
    const hasValidDomain =
      hostname.includes(".") &&
      !hostname.startsWith(".") &&
      !hostname.endsWith(".") &&
      hostname.split(".").every((part) => part.length > 0) &&
      (hostname.split(".").pop()?.length ?? 0) >= 2;

    if (!isLocalhost && !hasValidDomain) {
      return {
        valid: false,
        normalized,
        error: "올바른 도메인 주소를 입력해주세요. (예: https://example.com)",
      };
    }

    return { valid: true, normalized };
  } catch {
    return {
      valid: false,
      normalized,
      error: "올바른 URL 형식이 아니에요. (예: https://example.com)",
    };
  }
}

export function createAddLinkSchema(sections: LinkSectionItem[]) {
  return z
    .object({
      sectionId: z.string().min(1, "카테고리 섹션을 선택해주세요."),
      emoji: z
        .string()
        .trim()
        .min(1, "아이콘 이모지를 선택하거나 입력해주세요.")
        .refine(
          (val) => [...val].length <= 4,
          "이모지는 최대 4자까지 입력할 수 있어요."
        ),
      title: z
        .string()
        .trim()
        .min(1, "링크 제목을 입력해주세요.")
        .min(
          TITLE_MIN_LENGTH,
          `링크 제목은 최소 ${TITLE_MIN_LENGTH}자 이상 입력해주세요.`
        )
        .max(
          TITLE_MAX_LENGTH,
          `링크 제목은 ${TITLE_MAX_LENGTH}자 이내로 입력해주세요.`
        ),
      description: z
        .string()
        .trim()
        .max(
          DESCRIPTION_MAX_LENGTH,
          `한 줄 설명은 ${DESCRIPTION_MAX_LENGTH}자 이내로 입력해주세요.`
        ),
      href: z
        .string()
        .trim()
        .min(1, "이동할 URL 주소를 입력해주세요.")
        .superRefine((val, ctx) => {
          const check = isValidLinkUrl(val);
          if (!check.valid) {
            ctx.addIssue({
              code: "custom",
              message: check.error ?? "올바른 URL 형식이 아니에요.",
            });
          }
        }),
      enabled: z.boolean(),
    })
    .superRefine((values, ctx) => {
      const targetSection = sections.find((s) => s.id === values.sectionId);
      if (!targetSection) return;

      const trimmedTitle = values.title.trim().toLowerCase();
      if (
        trimmedTitle &&
        targetSection.links.some(
          (link) => link.title.trim().toLowerCase() === trimmedTitle
        )
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["title"],
          message: "선택한 섹션에 동일한 제목의 링크가 이미 등록되어 있어요.",
        });
      }

      const urlCheck = isValidLinkUrl(values.href);
      if (
        urlCheck.valid &&
        targetSection.links.some(
          (link) =>
            normalizeUrl(link.href).toLowerCase() ===
            urlCheck.normalized.toLowerCase()
        )
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["href"],
          message: "선택한 섹션에 동일한 URL 주소가 이미 등록되어 있어요.",
        });
      }
    });
}

export type AddLinkFormValues = z.infer<ReturnType<typeof createAddLinkSchema>>;

interface AddLinkFormProps {
  sections: LinkSectionItem[];
  defaultSectionId?: string;
  onAddLink: (input: AddLinkInput) => Promise<unknown> | void;
  onClose: () => void;
}

function AddLinkForm({
  sections,
  defaultSectionId,
  onAddLink,
  onClose,
}: AddLinkFormProps) {
  const fallbackSectionId = sections[0]?.id ?? "section-projects";
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const schema = React.useMemo(
    () => createAddLinkSchema(sections),
    [sections]
  );

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<AddLinkFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      sectionId: defaultSectionId || fallbackSectionId,
      emoji: "🔗",
      title: "",
      description: "",
      href: "",
      enabled: true,
    },
  });

  const watchedValues = useWatch({ control });
  const sectionId =
    watchedValues.sectionId ?? (defaultSectionId || fallbackSectionId);
  const emoji = watchedValues.emoji ?? "🔗";
  const title = watchedValues.title ?? "";
  const description = watchedValues.description ?? "";
  const href = watchedValues.href ?? "";
  const enabled = watchedValues.enabled ?? true;

  const urlCheck = React.useMemo(() => isValidLinkUrl(href), [href]);

  const onValidSubmit = async (values: AddLinkFormValues) => {
    setSubmitError(null);
    const normalizedHref = isValidLinkUrl(values.href).normalized;

    try {
      await onAddLink({
        sectionId: values.sectionId || fallbackSectionId,
        emoji: values.emoji.trim() || "🔗",
        title: values.title.trim(),
        description:
          values.description.trim() || "클릭하여 해당 링크로 이동합니다",
        href: normalizedHref,
        enabled: values.enabled,
      });

      onClose();
    } catch (err) {
      console.error("Failed to save link to Firestore:", err);
      setSubmitError(
        "Firestore 저장 중 오류가 발생했어요. 잠시 후 다시 시도해주세요."
      );
    }
  };

  const previewLink = {
    id: "preview-link",
    sectionId,
    emoji: emoji.trim() || "🔗",
    title: title.trim() || "링크 제목이 여기에 표시돼요",
    description:
      description.trim() || "한 줄 설명을 입력하면 카드 하단에 함께 표시됩니다",
    href: urlCheck.valid ? urlCheck.normalized : "#",
    enabled: true,
  };

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
      {/* 1. 섹션(카테고리) 선택 — Base UI Field + RHF Controller */}
      <Controller
        control={control}
        name="sectionId"
        render={({
          field: { name, value, onChange },
          fieldState: { invalid, isTouched, isDirty, error },
        }) => (
          <Field
            name={name}
            invalid={invalid}
            touched={isTouched}
            dirty={isDirty}
            className="gap-2"
          >
            <FieldLabel nativeLabel={false} render={<div />}>
              카테고리 섹션
            </FieldLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((section) => {
                const isSelected = section.id === value;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      onChange(section.id);
                      if (title.trim()) void trigger("title");
                      if (href.trim()) void trigger("href");
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-m border px-3 py-2.5 text-left transition-all duration-150 ease-tds cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-ring/30 active:scale-[0.99]",
                      isSelected
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-secondary/50 text-foreground hover:bg-secondary"
                    )}
                  >
                    <span
                      className="tds-body-2 tds-emoji shrink-0"
                      aria-hidden="true"
                    >
                      {section.emoji}
                    </span>
                    <span className="tds-label-s truncate">{section.title}</span>
                  </button>
                );
              })}
            </div>
            <FieldError match={Boolean(error)}>{error?.message}</FieldError>
          </Field>
        )}
      />

      {/* 2. 아이콘 이모지 선택 및 직접 입력 — Base UI Field + Input + RHF Controller */}
      <Controller
        control={control}
        name="emoji"
        render={({
          field: { ref, name, value, onBlur, onChange },
          fieldState: { invalid, isTouched, isDirty, error },
        }) => (
          <Field
            name={name}
            invalid={invalid}
            touched={isTouched}
            dirty={isDirty}
            className="gap-2"
          >
            <div className="flex items-center justify-between">
              <FieldLabel>
                아이콘 이모지 <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldDescription>클릭하거나 직접 입력</FieldDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                ref={ref}
                value={value}
                onBlur={onBlur}
                onValueChange={onChange}
                maxLength={4}
                aria-label="이모지 직접 입력"
                className="w-14 shrink-0 px-0 text-center tds-title-1 tds-emoji"
              />
              <div className="flex flex-wrap gap-1.5 flex-1">
                {EMOJI_PRESETS.map((preset) => {
                  const active = value.trim() === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() =>
                        setValue("emoji", preset, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        })
                      }
                      aria-label={`이모지 ${preset} 선택`}
                      className={cn(
                        "size-8 rounded-s flex items-center justify-center tds-body-1 tds-emoji transition-all duration-150 ease-tds cursor-pointer border",
                        active
                          ? "border-primary bg-accent scale-105"
                          : "border-transparent bg-secondary hover:bg-secondary/80"
                      )}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
            <FieldError match={Boolean(error)}>{error?.message}</FieldError>
          </Field>
        )}
      />

      {/* 3. 링크 제목 — Base UI Field + Input + RHF Controller */}
      <Controller
        control={control}
        name="title"
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
                링크 제목 <span className="text-destructive">*</span>
              </FieldLabel>
              <span
                className={cn(
                  "tds-caption tds-tabular",
                  value.trim().length > TITLE_MAX_LENGTH
                    ? "text-destructive font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {value.trim().length}/{TITLE_MAX_LENGTH}
              </span>
            </div>
            <Input
              ref={ref}
              value={value}
              onBlur={onBlur}
              onValueChange={onChange}
              placeholder="예: 개인 기술 블로그 & 포트폴리오 (2~40자)"
            />
            <FieldError match={Boolean(error)}>{error?.message}</FieldError>
          </Field>
        )}
      />

      {/* 4. 한 줄 설명 — Base UI Field + Input + RHF Controller */}
      <Controller
        control={control}
        name="description"
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
              <FieldLabel>한 줄 설명 (선택)</FieldLabel>
              <span
                className={cn(
                  "tds-caption tds-tabular",
                  value.trim().length > DESCRIPTION_MAX_LENGTH
                    ? "text-destructive font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {value.trim().length}/{DESCRIPTION_MAX_LENGTH}
              </span>
            </div>
            <Input
              ref={ref}
              value={value}
              onBlur={onBlur}
              onValueChange={onChange}
              placeholder="예: 웹 개발 아티클과 사이드 프로젝트 기록을 모았습니다"
            />
            <FieldError match={Boolean(error)}>{error?.message}</FieldError>
          </Field>
        )}
      />

      {/* 5. 이동할 URL — Base UI Field + Input + RHF Controller */}
      <Controller
        control={control}
        name="href"
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
            <FieldLabel>
              이동할 URL <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              ref={ref}
              type="url"
              value={value}
              onBlur={onBlur}
              onValueChange={onChange}
              placeholder="https://github.com/gildong-dev"
            />
            <FieldError match={Boolean(error)}>{error?.message}</FieldError>
            {!error && value.trim().length > 0 && urlCheck.valid && (
              <FieldDescription className="flex items-center gap-1 text-primary truncate">
                <CheckCircle2 className="size-3.5 shrink-0" />
                <span className="truncate">
                  연결 주소: {urlCheck.normalized}
                </span>
              </FieldDescription>
            )}
          </Field>
        )}
      />

      {/* 6. 노출 여부 스위치 — Base UI Field + Switch + RHF Controller */}
      <Controller
        control={control}
        name="enabled"
        render={({
          field: { name, value, onChange, onBlur },
          fieldState: { invalid, isTouched, isDirty },
        }) => (
          <Field
            name={name}
            invalid={invalid}
            touched={isTouched}
            dirty={isDirty}
            className="flex-row items-center justify-between rounded-m border border-border bg-secondary/40 px-4 py-3"
          >
            <div className="space-y-0.5">
              <FieldLabel className="cursor-pointer">
                프로필에 바로 노출하기
              </FieldLabel>
              <FieldDescription>
                비활성화하면 목록에는 저장되지만 방문자 화면에는 숨겨집니다.
              </FieldDescription>
            </div>
            <Switch
              checked={value}
              onCheckedChange={onChange}
              onBlur={onBlur}
            />
          </Field>
        )}
      />

      {/* 7. 실시간 링크 카드 미리보기 (LinkButtonCard 재사용) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="tds-caption text-muted-foreground">
            실시간 카드 미리보기
          </span>
          {!enabled && (
            <span className="tds-caption text-destructive">
              숨김 상태로 저장됨
            </span>
          )}
        </div>
        <div className="pointer-events-none select-none">
          <LinkButtonCard link={previewLink} tabIndex={-1} />
        </div>
      </div>

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
        <Button type="submit" variant="default" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" strokeWidth={2.2} />
          ) : (
            <Plus className="size-4" strokeWidth={2.2} />
          )}
          {isSubmitting ? "저장 및 목록 갱신 중..." : "링크 추가하기"}
        </Button>
      </DialogFooter>
    </Form>
  );
}

export function AddLinkDialog({
  open,
  onOpenChange,
  sections,
  defaultSectionId,
  onAddLink,
}: AddLinkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 링크 추가</DialogTitle>
          <DialogDescription>
            프로필 페이지에 노출할 새로운 링크 카드를 추가합니다. (Firestore users/anonymous/links에 저장됩니다)
          </DialogDescription>
        </DialogHeader>

        {open && (
          <AddLinkForm
            key={defaultSectionId ?? "default"}
            sections={sections}
            defaultSectionId={defaultSectionId}
            onAddLink={onAddLink}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
