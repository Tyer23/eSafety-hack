"use client";

import { useMemo, useState } from "react";
import { Badge, Button } from "@/components/ui";
import { ParentBehaviourData } from "@/lib/types";

interface ParentSummaryPanelProps {
  data: ParentBehaviourData;
}

export default function ParentSummaryPanel({ data }: ParentSummaryPanelProps) {
  const [selectedChild, setSelectedChild] = useState<string>(data.children[0]?.id || "");
  const child = data.children.find((item) => item.id === selectedChild) || data.children[0];
  const stats = child?.stats ?? [];

  const toneBadge = useMemo(() => {
    const trend = child?.overallTrend?.toLowerCase() ?? "steady";
    if (trend.includes("improv")) return { label: "Improving", variant: "success" as const };
    if (trend.includes("watch")) return { label: "Keep watch", variant: "default" as const };
    return { label: "Steady", variant: "default" as const };
  }, [child?.overallTrend]);

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-subhead font-semibold text-gray-900">
              This week at a glance
            </h2>
            <p className="text-footnote text-gray-500">
              High‑level themes across all your children&apos;s online
              activity.
            </p>
          </div>
          <Badge variant={toneBadge.variant}>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span>{toneBadge.label}</span>
            </span>
          </Badge>
        </div>
        <p className="text-subhead text-gray-800 leading-relaxed">{data.weeklySummary}</p>
        <div className="mt-3 text-[11px] text-gray-500">
          You see{" "}
          <span className="font-semibold text-gray-900">
            behaviours and patterns
          </span>{" "}
          here &mdash; never exact messages or specific websites.
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          {data.children.map((childOption) => (
            <Button
              key={childOption.id}
              onClick={() => setSelectedChild(childOption.id)}
              variant={selectedChild === childOption.id ? "default" : "outline"}
              size="sm"
              className="flex-1"
            >
              {childOption.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm"
            >
              <div className="text-[11px] text-gray-500">{stat.label}</div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="text-lg font-semibold text-gray-900">
                  {stat.value}
                </div>
                {stat.trend && (
                  <div
                    className={`text-[11px] ${
                      stat.tone === "positive"
                        ? "text-safe"
                        : stat.tone === "caution"
                          ? "text-caution"
                          : "text-gray-500"
                    }`}
                  >
                    {stat.trend}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Positive progress</div>
          <ul className="list-disc pl-4 text-sm text-gray-800 space-y-1">
            {child?.positiveProgress?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Gentle flags</div>
          <ul className="list-disc pl-4 text-sm text-gray-800 space-y-1">
            {child?.gentleFlags?.length ? child.gentleFlags.map((item) => (
              <li key={item}>{item}</li>
            )) : (
              <li className="text-gray-500">No flags noted this week.</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
