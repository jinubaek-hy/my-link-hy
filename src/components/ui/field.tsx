"use client"

import * as React from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"
import { Form as FormPrimitive } from "@base-ui/react/form"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

function Form({ className, ...props }: FormPrimitive.Props) {
  return (
    <FormPrimitive
      data-slot="form"
      className={cn("space-y-5", className)}
      {...props}
    />
  )
}

function Field({ className, ...props }: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      className={cn("group/field flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "tds-label-s text-foreground select-none flex items-center gap-1 data-disabled:cursor-not-allowed data-disabled:opacity-30",
        className
      )}
      {...props}
    />
  )
}

function FieldControl({ className, ...props }: FieldPrimitive.Control.Props) {
  return (
    <FieldPrimitive.Control
      data-slot="field-control"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-m border border-input bg-secondary/60 px-3.5 py-2.5 tds-body-2 text-foreground transition-all duration-150 ease-tds outline-none placeholder:text-tds-tertiary focus-visible:border-ring focus-visible:bg-card focus-visible:ring-3 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-30 data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn("tds-caption text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({
  className,
  children,
  showIcon = true,
  ...props
}: FieldPrimitive.Error.Props & {
  showIcon?: boolean
}) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      className={cn(
        "flex items-center gap-1 tds-caption text-destructive",
        className
      )}
      {...props}
    >
      {showIcon && <AlertCircle className="size-3.5 shrink-0" />}
      <span>{children}</span>
    </FieldPrimitive.Error>
  )
}

export {
  Form,
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
}
