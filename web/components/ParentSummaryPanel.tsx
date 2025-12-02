"use client";

import { useState } from "react";

interface ChildInfo {
  id: string;
  name: string;
}

interface ParentSummaryPanelProps {
  children: ChildInfo[];
}

export default function ParentSummaryPanel({
  children
}: ParentSummaryPanelProps) {
  const [selectedChild, setSelectedChild] = useState<string>(children[0]?.id || "");

  // Static demo data – will be wired to an API / ML summaries later.
  const weeklySummary =
    "This week, Jamie and Emma showed mostly kind and curious behaviour online. " +
    "There were a few moments of unkind language and one near‑miss with sharing personal information, " +
    "but they responded well after a gentle nudge from the guardian.";

  // Stats data for each child
  const childStats: Record<string, Array<{
    label: string;
    value: string;
    trend: string;
    tone: "positive" | "neutral";
  }>> = {
    kid_01: [
      {
        label: "Kind interactions",
        value: "18",
        trend: "+4",
        tone: "positive"
      },
      {
        label: "Potential risk moments",
        value: "5",
        trend: "-2",
        tone: "neutral"
      },
      {
        label: "Privacy warnings",
        value: "1",
        trend: "0",
        tone: "neutral"
      },
      {
        label: "Digital wellbeing",
        value: "Balanced",
        trend: "",
        tone: "positive"
      }
    ],
    kid_02: [
      {
        label: "Kind interactions",
        value: "22",
        trend: "+6",
        tone: "positive"
      },
      {
        label: "Potential risk moments",
        value: "2",
        trend: "-3",
        tone: "neutral"
      },
      {
        label: "Privacy warnings",
        value: "0",
        trend: "-1",
        tone: "neutral"
      },
      {
        label: "Digital wellbeing",
        value: "Excellent",
        trend: "",
        tone: "positive"
      }
    ]
  };

  const stats = childStats[selectedChild] || childStats[children[0]?.id || ""] || [];

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              This week at a glance
            </h2>
            <p className="text-xs text-slate-500">
              High‑level themes across all your children&apos;s online
              activity.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Healthy overall</span>
          </div>
        </div>
        <p className="text-sm text-slate-800 leading-relaxed">{weeklySummary}</p>
        <div className="mt-3 text-[11px] text-slate-500">
          You see{" "}
          <span className="font-semibold text-slate-900">
            behaviours and patterns
          </span>{" "}
          here &mdash; never exact messages or specific websites.
        </div>
      </div>

      <div className="space-y-3">
        {/* Toggle buttons */}
        <div className="flex gap-2">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedChild === child.id
                  ? "bg-pastel-purple-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {child.name}
            </button>
          ))}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm"
            >
              <div className="text-[11px] text-slate-500">{stat.label}</div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="text-lg font-semibold text-slate-900">
                  {stat.value}
                </div>
                {stat.trend && (
                  <div
                    className={`text-[11px] ${
                      stat.tone === "positive"
                        ? "text-emerald-600"
                        : "text-amber-500"
                    }`}
                  >
                    {stat.trend}
                    {stat.tone === "positive" ? " vs last week" : " to watch"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
