import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-4 h-[34px] tds-label-s whitespace-nowrap shrink-0 select-none transition-all duration-150 ease-tds outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-30 [&_svg]:size-3.5 [&_svg]:pointer-events-none gap-1.5",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-tds-blue-600",
        secondary:
          "border-border bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20",
        "brand-weak":
          "border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
        outline:
          "border-border bg-card text-foreground hover:bg-secondary",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
