import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-lg border-2 px-2.5 py-0.5 text-footnote font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blurple focus:ring-offset-2 whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'border-blurple bg-transparent text-blurple',
        secondary: 'border-gray-700 bg-transparent text-gray-700',
        success: 'border-safe bg-transparent text-safe',
        warning: 'border-caution bg-transparent text-caution',
        destructive: 'border-alert bg-transparent text-alert',
        outline: 'border-gray-700 bg-transparent text-gray-700',
      },
      size: {
        default: 'px-2.5 py-0.5 text-footnote',
      },
    },
    defaultVariants: {
      variant: 'default',
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
