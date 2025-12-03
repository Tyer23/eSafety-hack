import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-2.5 py-0.5 text-footnote font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blurple focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blurple text-white",
        secondary: "border-transparent bg-gray-100 text-gray-800",
        success: "border-transparent bg-safe text-white",
        warning: "border-transparent bg-caution text-white",
        destructive: "border-transparent bg-alert text-white",
        outline: "border-gray-200 text-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
