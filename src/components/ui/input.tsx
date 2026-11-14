import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({
  className,
  type = "text",
  ...props
}: InputPrimitive.Props) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-m border border-input bg-secondary/60 px-3.5 py-2.5 tds-body-2 text-foreground transition-all duration-150 ease-tds outline-none placeholder:text-tds-tertiary focus-visible:border-ring focus-visible:bg-card focus-visible:ring-3 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-30 data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
