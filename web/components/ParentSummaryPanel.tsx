'use client'

import { useMemo, useState } from 'react'
import { Badge, Button, Icon } from '@/components/ui'
import {
  ShieldIcon,
  HeartHandshakeIcon,
  LocateIcon,
  FlagIcon,
} from '@/components/ui/icons'
import { ParentBehaviourData } from '@/lib/types'

interface ParentSummaryPanelProps {
  data: ParentBehaviourData
}

export default function ParentSummaryPanel({
  data,
}: ParentSummaryPanelProps) {
  const [selectedChild, setSelectedChild] = useState<string>(
    data.children[0]?.id || ''
  )
  const child = data.children.find((item) => item.id === selectedChild) || data.children[0]
  const stats = child?.stats ?? []

  const toneBadge = useMemo(() => {
    const trend = child?.overallTrend?.toLowerCase() ?? 'steady'
    if (trend.includes('improv')) return { label: 'Improving', variant: 'success' as const }
    if (trend.includes('watch')) return { label: 'Keep watch', variant: 'default' as const }
    return { label: 'Steady', variant: 'default' as const }
  }, [child?.overallTrend])

  // Icon mapping for stats
  const statIcons: Record<string, typeof HeartHandshakeIcon> = {
    'Kind interactions': HeartHandshakeIcon,
    'Digital wellbeing': ShieldIcon,
    'Privacy warnings': LocateIcon,
    'Potential risk moments': FlagIcon,
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h2 className="text-subhead font-semibold text-gray-900">
              This Week at a Glance
            </h2>
            <p className="text-footnote text-gray-500 mt-1">
              High‑level themes across all your children&apos;s online activity.
            </p>
          </div>
          <Badge variant={toneBadge.variant}>
            <span className="flex items-center gap-1.5">
              <Icon icon={ShieldIcon} size="sm" className="text-inherit" />
              <span>{toneBadge.label}</span>
            </span>
          </Badge>
        </div>
        <p className="text-subhead text-gray-800 leading-relaxed">
          {data.weeklySummary}
        </p>
        <div className="mt-4 text-[11px] text-gray-500">
          You see{' '}
          <span className="font-semibold text-gray-900">
            behaviours and patterns
          </span>{' '}
          here &mdash; never exact messages or specific websites.
        </div>
      </div>

      <div className="space-y-4">
        {/* Toggle buttons */}
        <div className="flex gap-3">
          {data.children.map((childOption) => (
            <Button
              key={childOption.id}
              onClick={() => setSelectedChild(childOption.id)}
              variant={selectedChild === childOption.id ? 'default' : 'secondary'}
              size="sm"
              className="flex-1"
            >
              {childOption.name}
            </Button>
          ))}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => {
            const StatIcon = statIcons[stat.label]
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-100 bg-white px-4 py-5 shadow-sm"
              >
                <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mb-3">
                  {StatIcon && (
                    <Icon icon={StatIcon} size="sm" className="text-gray-400" />
                  )}
                  <span>{stat.label}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  {stat.trend && (
                    <div
                      className={`text-[11px] font-medium ${
                        stat.tone === 'positive'
                          ? 'text-safe'
                          : stat.tone === 'caution'
                            ? 'text-caution'
                            : 'text-gray-500'
                      }`}
                    >
                      {stat.trend}
                    </div>
                  )}
                </div>
                {stat.trend && (
                  <div className="text-[10px] text-gray-400 mt-1">
                    {stat.tone === 'positive'
                      ? 'vs last week'
                      : stat.tone === 'caution'
                        ? 'to watch'
                        : 'vs last week'}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
            Positive progress
          </div>
          <ul className="list-disc pl-4 text-sm text-gray-800 space-y-1">
            {child?.positiveProgress?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
            Gentle flags
          </div>
          <ul className="list-disc pl-4 text-sm text-gray-800 space-y-1">
            {child?.gentleFlags?.length ? (
              child.gentleFlags.map((item) => <li key={item}>{item}</li>)
            ) : (
              <li className="text-gray-500">No flags noted this week.</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}
