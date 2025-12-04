'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { Icon } from '@/components/ui/icon'
import {
  MessageCircleIcon,
  TrendingUpIcon,
  BarChart3Icon,
} from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export default function MobileBottomNav() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      href: '/parent',
      label: 'Chat',
      icon: MessageCircleIcon,
    },
    {
      href: '/parent/insights',
      label: 'Insights',
      icon: TrendingUpIcon,
    },
    {
      href: '/parent/patterns',
      label: 'Patterns',
      icon: BarChart3Icon,
    },
  ]

  return (
    <nav
      className="mx-2 fixed bottom-4 left-2 right-0 z-50 bg-white border-t border-gray-200 rounded-3xl shadow-elevated pb-[env(safe-area-inset-bottom)] md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-start h-16 p-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors rounded-xl active:scale-95',
                isActive
                  ? 'text-blurple bg-gray-50 rounded-3xl'
                  : 'text-gray-500 hover:text-gray-700 active:bg-gray-50'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                icon={item.icon}
                size="lg"
                className={cn(isActive && 'fill-blurple/10')}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  'text-[11px] font-medium leading-none',
                  isActive ? 'text-blurple' : 'text-gray-600'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
