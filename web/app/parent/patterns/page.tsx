'use client'

import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import ParentWordsPanel from '../../../components/ParentWordsPanel'
import ResponsiveLayout from '../../../components/ResponsiveLayout'
import { Icon } from '@/components/ui'
import {
  HeartHandshakeIcon,
  ShieldIcon,
  LocateIcon,
  FlagIcon,
} from '@/components/ui/icons'

export default function PatternsPage() {
  const children = [
    { id: 'kid_01', name: 'Jamie' },
    { id: 'kid_02', name: 'Emma' },
  ]

  // Icon mapping for stats
  const statIcons: Record<string, LucideIcon> = {
    'Kind Interactions': HeartHandshakeIcon,
    'Digital Wellbeing': ShieldIcon,
    'Privacy Warnings': LocateIcon,
    'Risk Moments': FlagIcon,
  }

  // Jellybeat variants for each stat
  const jellybeatVariants: Record<string, string> = {
    'Kind Interactions': 'jellybeat-green-full.png',
    'Privacy Warnings': 'jellybeat-amber-full.png',
    'Digital Wellbeing': 'jellybeat-rainbow-full.png',
    'Risk Moments': 'jellybeat-red-full.png',
  }

  // Stats cards moved from main dashboard
  const stats = [
    {
      label: 'Kind Interactions',
      value: '18',
      change: '+4',
      trend: 'up',
      color: 'text-safe',
    },
    {
      label: 'Privacy Warnings',
      value: '1',
      change: '-2',
      trend: 'down',
      color: 'text-caution',
    },
    {
      label: 'Digital Wellbeing',
      value: '85%',
      change: '+5%',
      trend: 'up',
      color: 'text-blurple',
    },
    {
      label: 'Risk Moments',
      value: '3',
      change: '-1',
      trend: 'down',
      color: 'text-alert',
    },
  ]

  return (
    <ResponsiveLayout
      mobileHeader={{
        title: 'Patterns & Data',
      }}
      showMobileNav={true}
    >
      <div className="space-y-5">
        {/* Header - hidden on mobile (shown in MobileHeader instead) */}
        <div className="hidden md:block">
          <h1 className="text-title-2 font-semibold tracking-tight text-gray-900">
            Behavioral Patterns
          </h1>
          <p className="mt-2 text-subhead text-gray-600 max-w-2xl">
            Pattern-based insights show themes in your child&apos;s digital behavior—not individual messages.
            Use these to start conversations and build understanding together.
          </p>
        </div>

        {/* Mobile description - only shown on mobile */}
        <p className="md:hidden text-sm text-gray-600 leading-relaxed">
          Pattern-based insights to start conversations with your child.
        </p>

        {/* Stats Grid - mobile-first: 2 columns, desktop: 2 columns */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {stats.map((stat) => {
            const StatIcon = statIcons[stat.label]
            const jellybeatIcon = jellybeatVariants[stat.label]
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`text-footnote font-medium ${
                          stat.trend === 'up' ? 'text-safe' : 'text-caution'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <div
                      className={`text-2xl md:text-title-1 font-bold ${stat.color}`}
                    >
                      {stat.value}
                    </div>
                    <div className="mt-2 text-footnote font-medium text-gray-700 leading-tight flex items-center gap-1.5">
                      {StatIcon && (
                        <Icon icon={StatIcon} size="sm" className="text-gray-400" />
                      )}
                      <span>{stat.label}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Image
                      src={`/images/${jellybeatIcon}`}
                      alt={`${stat.label} mascot`}
                      width={48}
                      height={48}
                      className="w-12 h-12 md:w-14 md:h-14"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <ParentWordsPanel children={children} />
      </div>
    </ResponsiveLayout>
  )
}
