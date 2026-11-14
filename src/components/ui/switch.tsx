"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-tds-grey-300 transition-colors duration-150 ease-tds outline-none focus-visible:ring-3 focus-visible:ring-ring/40 data-checked:bg-primary disabled:cursor-not-allowed disabled:opacity-30",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-5 rounded-full bg-white shadow-tds-1 ring-0 transition-transform duration-150 ease-tds translate-x-0 data-checked:translate-x-5"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
