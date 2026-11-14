import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-l border border-transparent bg-clip-padding tds-label-m whitespace-nowrap transition-all duration-150 ease-tds outline-none select-none cursor-pointer focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-tds-blue-600 active:bg-tds-blue-700",
        "brand-weak":
          "bg-accent text-accent-foreground hover:bg-accent/80",
        secondary:
          "bg-secondary text-secondary-foreground border-border hover:bg-accent hover:text-accent-foreground",
        outline:
          "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground",
        ghost:
          "hover:bg-secondary hover:text-foreground",
        destructive:
          "bg-destructive/12 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 gap-2 px-4 rounded-l tds-label-m",
        xs: "h-7 gap-1 rounded-s px-2.5 tds-caption",
        sm: "h-9 gap-1.5 rounded-m px-3 tds-label-s",
        lg: "h-14 gap-2 px-5 rounded-xl tds-label-l",
        pill: "h-[34px] gap-1.5 px-4 rounded-full tds-label-s",
        icon: "size-9 rounded-m",
        "icon-xs": "size-7 rounded-s [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 rounded-m",
        "icon-lg": "size-12 rounded-l",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
