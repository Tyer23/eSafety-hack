import * as React from "react"
import { type LucideIcon, type LucideProps } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Icon size variants following design-system.md specifications
const iconVariants = cva("", {
  variants: {
    size: {
      sm: "w-4 h-4",   // 16px - Inline text
      md: "w-5 h-5",   // 20px - Standard UI
      lg: "w-6 h-6",   // 24px - Navigation
      xl: "w-8 h-8",   // 32px - Feature highlights
      "2xl": "w-12 h-12", // 48px - Large displays
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export interface IconProps
  extends Omit<LucideProps, "size">,
    VariantProps<typeof iconVariants> {
  icon: LucideIcon
  /**
   * If true, adds aria-hidden="true" for decorative icons.
   * Set to false when icon is standalone and needs aria-label.
   * @default true
   */
  decorative?: boolean
}

/**
 * Icon component wrapper for Lucide icons with design system sizes.
 *
 * @example
 * // Standard usage with decorative icon
 * <Icon icon={Send} size="md" />
 *
 * @example
 * // Icon-only button (not decorative, needs label)
 * <button aria-label="Close">
 *   <Icon icon={X} size="lg" decorative={false} />
 * </button>
 *
 * @example
 * // Custom styling and stroke weight
 * <Icon
 *   icon={TrendingUp}
 *   size="xl"
 *   className="text-safe"
 *   strokeWidth={2.5}
 * />
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, size, className, decorative = true, ...props }, ref) => {
    return (
      <IconComponent
        ref={ref}
        className={cn(iconVariants({ size }), className)}
        aria-hidden={decorative ? "true" : undefined}
        {...props}
      />
    )
  }
)

Icon.displayName = "Icon"

// Export the size variant type for use in other components
export type IconSize = NonNullable<VariantProps<typeof iconVariants>["size"]>
