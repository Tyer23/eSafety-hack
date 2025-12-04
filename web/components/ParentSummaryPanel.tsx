'use client'

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Badge, Button, Icon } from '@/components/ui'
import {
  ShieldIcon,
  HeartHandshakeIcon,
  LocateIcon,
  FlagIcon,
} from '@/components/ui/icons'

interface ChildInfo {
  id: string
  name: string
}

interface ParentSummaryPanelProps {
  children: ChildInfo[]
}

export default function ParentSummaryPanel({
  children,
}: ParentSummaryPanelProps) {
  const [selectedChild, setSelectedChild] = useState<string>(
    children[0]?.id || ''
  )

  // Static demo data – will be wired to an API / ML summaries later.
  const weeklySummary =
    'This week, Jamie and Emma showed mostly kind and curious behaviour online. ' +
    'There were a few moments of unkind language and one near‑miss with sharing personal information, ' +
    'but they responded well after a gentle nudge from the guardian.'

  // Icon mapping for stats
  const statIcons: Record<string, LucideIcon> = {
    'Kind interactions': HeartHandshakeIcon,
    'Digital wellbeing': ShieldIcon,
    'Privacy warnings': LocateIcon,
    'Potential risk moments': FlagIcon,
  }

  // Stats data for each child
  const childStats: Record<
    string,
    Array<{
      label: string
      value: string
      trend: string
      tone: 'positive' | 'neutral'
    }>
  > = {
    kid_01: [
      {
        label: 'Kind interactions',
        value: '18',
        trend: '+4',
        tone: 'positive',
      },
      {
        label: 'Potential risk moments',
        value: '5',
        trend: '-2',
        tone: 'neutral',
      },
      {
        label: 'Privacy warnings',
        value: '1',
        trend: '0',
        tone: 'neutral',
      },
      {
        label: 'Digital wellbeing',
        value: 'Balanced',
        trend: '',
        tone: 'positive',
      },
    ],
    kid_02: [
      {
        label: 'Kind interactions',
        value: '22',
        trend: '+6',
        tone: 'positive',
      },
      {
        label: 'Potential risk moments',
        value: '2',
        trend: '-3',
        tone: 'neutral',
      },
      {
        label: 'Privacy warnings',
        value: '0',
        trend: '-1',
        tone: 'neutral',
      },
      {
        label: 'Digital wellbeing',
        value: 'Excellent',
        trend: '',
        tone: 'positive',
      },
    ],
  }

  const stats =
    childStats[selectedChild] || childStats[children[0]?.id || ''] || []

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-subhead font-semibold text-gray-900">
              This week at a glance
            </h2>
            <p className="text-footnote text-gray-500">
              High‑level themes across all your children&apos;s online activity.
            </p>
          </div>
          <Badge variant="success">
            <span className="flex items-center gap-1.5">
              <Icon icon={ShieldIcon} size="sm" className="text-inherit" />
              <span>Healthy overall</span>
            </span>
          </Badge>
        </div>
        <p className="text-subhead text-gray-800 leading-relaxed">
          {weeklySummary}
        </p>
        <div className="mt-3 text-[11px] text-gray-500">
          You see{' '}
          <span className="font-semibold text-gray-900">
            behaviours and patterns
          </span>{' '}
          here &mdash; never exact messages or specific websites.
        </div>
      </div>

      <div className="space-y-3">
        {/* Toggle buttons */}
        <div className="flex gap-2">
          {children.map((child) => (
            <Button
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              variant={selectedChild === child.id ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
            >
              {child.name}
            </Button>
          ))}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const StatIcon = statIcons[stat.label]
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm"
              >
                <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                  {StatIcon && (
                    <Icon icon={StatIcon} size="sm" className="text-gray-400" />
                  )}
                  <span>{stat.label}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <div className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  {stat.trend && (
                    <div
                      className={`text-[11px] ${
                        stat.tone === 'positive' ? 'text-safe' : 'text-caution'
                      }`}
                    >
                      {stat.trend}
                      {stat.tone === 'positive' ? ' vs last week' : ' to watch'}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
