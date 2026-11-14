"use client"

import { Field as FieldPrimitive } from "@base-ui/react/field"
import { cn } from "@/lib/utils"

function Label({ className, ...props }: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      data-slot="label"
      className={cn(
        "tds-label-s text-foreground select-none flex items-center gap-1.5 data-disabled:cursor-not-allowed data-disabled:opacity-30",
        className
      )}
      {...props}
    />
  )
}

export { Label }
