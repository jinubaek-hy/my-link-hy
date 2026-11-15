"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  CheckCircle2,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  AddLinkFormValues,
  DESCRIPTION_MAX_LENGTH,
  EMOJI_PRESETS,
  TITLE_MAX_LENGTH,
  createAddLinkSchema,
  isValidLinkUrl,
} from "@/components/mylink/add-link-dialog";
import { DeleteLinkDialog } from "@/components/mylink/delete-link-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Form,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import {
  LinkCardItem,
  LinkSectionItem,
  UpdateLinkInput,
} from "@/types/mylink";

export interface LinkButtonCardProps
  extends Omit<React.ComponentProps<"a">, "href"> {
  link: LinkCardItem;
  sectionId?: string;
  sections?: LinkSectionItem[];
  showActions?: boolean;
  isDeleting?: boolean;
  onUpdateLink?: (
    id: string,
    input: UpdateLinkInput
  ) => Promise<unknown> | void;
  onDeleteRequest?: (link: LinkCardItem) => void;
}

interface InlineEditLinkFormProps {
  link: LinkCardItem;
  defaultSectionId: string;
  sections: LinkSectionItem[];
  onSave: (input: UpdateLinkInput) => Promise<void>;
  onCancel: () => void;
}

function InlineEditLinkForm({
  link,
  defaultSectionId,
  sections,
  onSave,
  onCancel,
}: InlineEditLinkFormProps) {
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const schema = React.useMemo(
    () => createAddLinkSchema(sections, link.id),
    [sections, link.id]
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
      sectionId: link.sectionId || defaultSectionId,
      emoji: link.emoji || "🔗",
      title: link.title || "",
      description: link.description || "",
      href: link.href || "",
      enabled: link.enabled ?? true,
    },
  });

  const watchedValues = useWatch({ control });
  const title = watchedValues.title ?? "";
  const href = watchedValues.href ?? "";

  const urlCheck = React.useMemo(() => isValidLinkUrl(href), [href]);

  const onValidSubmit = async (values: AddLinkFormValues) => {
    setSubmitError(null);
    const normalizedHref = isValidLinkUrl(values.href).normalized;

    try {
      await onSave({
        sectionId: values.sectionId || defaultSectionId,
        emoji: values.emoji.trim() || "🔗",
        title: values.title.trim(),
        description:
          values.description.trim() || "클릭하여 해당 링크로 이동합니다",
        href: normalizedHref,
        enabled: values.enabled,
      });
    } catch (err) {
      console.error("Failed to update link in Firestore:", err);
      setSubmitError(
        "Firestore 수정 중 오류가 발생했어요. 잠시 후 다시 시도해주세요."
      );
    }
  };

  return (
    <Card
      data-slot="link-button-card-editing"
      className="w-full rounded-2xl border-primary/60 bg-card p-4 sm:p-5 shadow-tds-2"
    >
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <span className="tds-label-s text-primary font-semibold">
            링크 인라인 수정
          </span>
          <span className="tds-caption text-muted-foreground truncate">
            ({link.title})
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="수정 취소"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </Button>
      </div>

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
        className="space-y-4"
      >
        {/* 1. 카테고리 섹션 선택 */}
        {sections.length > 0 && (
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
                className="gap-1.5"
              >
                <FieldLabel nativeLabel={false} render={<div />}>
                  카테고리 섹션
                </FieldLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
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
                          "flex items-center gap-2 rounded-m border px-3 py-2 text-left transition-all duration-150 ease-tds cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-ring/30 active:scale-[0.99]",
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
                        <span className="tds-label-s truncate">
                          {section.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <FieldError match={Boolean(error)}>{error?.message}</FieldError>
              </Field>
            )}
          />
        )}

        {/* 2. 아이콘 이모지 선택 및 직접 입력 */}
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
              className="gap-1.5"
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
                  className="w-12 h-10 shrink-0 px-0 text-center tds-title-2 tds-emoji"
                />
                <div className="flex flex-wrap gap-1 flex-1">
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
                          "size-7 rounded-s flex items-center justify-center tds-body-2 tds-emoji transition-all duration-150 ease-tds cursor-pointer border",
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

        {/* 3. 링크 제목 */}
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
                className="h-10"
              />
              <FieldError match={Boolean(error)}>{error?.message}</FieldError>
            </Field>
          )}
        />

        {/* 4. 한 줄 설명 */}
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
                className="h-10"
              />
              <FieldError match={Boolean(error)}>{error?.message}</FieldError>
            </Field>
          )}
        />

        {/* 5. 이동할 URL */}
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
                className="h-10"
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

        {submitError && (
          <p role="alert" className="tds-caption text-destructive">
            {submitError}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="default"
            size="sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-3.5 animate-spin" strokeWidth={2.2} />
            ) : (
              <Check className="size-3.5" strokeWidth={2.2} />
            )}
            <span>저장</span>
          </Button>
        </div>
      </Form>
    </Card>
  );
}

export function LinkButtonCard({
  link,
  sectionId,
  sections,
  showActions = true,
  isDeleting = false,
  onUpdateLink,
  onDeleteRequest,
  className,
  ...props
}: LinkButtonCardProps) {
  const storeSections = useMyLinkStore((state) => state.linkSections);
  const storeUpdateLink = useMyLinkStore((state) => state.updateLink);
  const storeDeleteLink = useMyLinkStore((state) => state.deleteLink);
  const isDeletingInStore = useMyLinkStore((state) => state.isDeletingLink);

  const [isEditing, setIsEditing] = React.useState(false);
  const [isFallbackDeleteOpen, setIsFallbackDeleteOpen] = React.useState(false);

  const isCardDeleting =
    isDeleting || (isFallbackDeleteOpen && isDeletingInStore);

  const effectiveSections = sections ?? storeSections;
  const fallbackSectionId =
    sectionId ||
    link.sectionId ||
    effectiveSections[0]?.id ||
    "section-projects";

  const isExternal = link.href.startsWith("http");

  const handleSaveInlineEdit = async (input: UpdateLinkInput) => {
    if (onUpdateLink) {
      await onUpdateLink(link.id, input);
    } else {
      await storeUpdateLink(link.id, input);
    }
    setIsEditing(false);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteRequest) {
      onDeleteRequest(link);
    } else {
      setIsFallbackDeleteOpen(true);
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  if (isEditing && showActions) {
    return (
      <InlineEditLinkForm
        link={link}
        defaultSectionId={fallbackSectionId}
        sections={effectiveSections}
        onSave={handleSaveInlineEdit}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <Card
        data-slot="link-button-card"
        className={cn(
          "group w-full rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 flex-row items-center justify-between gap-2 sm:gap-3 transition-all duration-150 ease-tds hover:border-primary/40",
          className
        )}
      >
        <a
          href={link.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="min-w-0 flex-1 flex items-center justify-between gap-2 outline-none rounded-xl focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.99]"
          {...props}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-start sm:items-center gap-2">
              <span
                className="tds-title-2 tds-emoji shrink-0 leading-[1.45]"
                aria-hidden="true"
              >
                {link.emoji}
              </span>
              <CardTitle className="line-clamp-2 sm:truncate break-keep group-hover:text-primary transition-colors">
                {link.title}
              </CardTitle>
            </div>
            <CardDescription className="tds-body-3 mt-1 sm:pl-[25px] break-keep">
              {link.description}
            </CardDescription>
          </div>

          <span
            className="tds-title-1 text-tds-tertiary group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150 ease-tds shrink-0"
            aria-hidden="true"
          >
            →
          </span>
        </a>

        {showActions && (
          <div className="flex items-center gap-1.5 shrink-0 pl-1 border-l border-border/70">
            <Button
              type="button"
              variant="secondary"
              size="xs"
              onClick={handleEditClick}
              disabled={isCardDeleting}
              aria-label={`${link.title} 수정`}
              className="px-2.5 text-foreground hover:text-primary"
            >
              <Pencil className="size-3.5" strokeWidth={2.2} />
              <span>수정</span>
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="xs"
              onClick={handleDeleteClick}
              disabled={isCardDeleting}
              aria-label={`${link.title} 삭제`}
              className="px-2.5"
            >
              {isCardDeleting ? (
                <Loader2 className="size-3.5 animate-spin" strokeWidth={2.2} />
              ) : (
                <Trash2 className="size-3.5" strokeWidth={2.2} />
              )}
              <span>삭제</span>
            </Button>
          </div>
        )}
      </Card>

      {!onDeleteRequest && showActions && (
        <DeleteLinkDialog
          open={isFallbackDeleteOpen}
          onOpenChange={setIsFallbackDeleteOpen}
          link={link}
          onConfirmDelete={async (target) => {
            await storeDeleteLink(target.id);
          }}
        />
      )}
    </>
  );
}
