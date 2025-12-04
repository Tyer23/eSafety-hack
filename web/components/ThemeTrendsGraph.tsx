"use client";

import { useState, useMemo } from "react";

interface MonthData {
  month: string;
  jamie: number;
  emma: number;
}

type Metric = "positivity" | "kindness" | "privacy" | "wellbeing";

export default function ThemeTrendsGraph() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(11); // Start at most recent month
  const [selectedMetric, setSelectedMetric] = useState<Metric>("positivity");

  // Generate month names for the past 12 months
  const getMonthNames = () => {
    const months: string[] = [];
    const monthAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(monthAbbr[date.getMonth()]);
    }
    return months;
  };

  const monthNames = getMonthNames();

  // Generate data for the past 12 months with different metrics
  const generateData = (): Record<Metric, MonthData[]> => {
    const baseData: MonthData[] = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthName = monthAbbr[date.getMonth()];
      
      // Generate realistic-looking data with some variation
      const baseJamie = 75 + Math.sin(i * 0.5) * 15 + (Math.random() - 0.5) * 10;
      const baseEmma = 80 + Math.cos(i * 0.5) * 12 + (Math.random() - 0.5) * 8;
      
      baseData.push({
        month: monthName,
        jamie: Math.max(50, Math.min(100, Math.round(baseJamie))),
        emma: Math.max(55, Math.min(100, Math.round(baseEmma)))
      });
    }

    // Different metrics have slight variations
    return {
      positivity: baseData.map(d => ({
        ...d,
        jamie: d.jamie,
        emma: d.emma
      })),
      kindness: baseData.map(d => ({
        ...d,
        jamie: Math.max(50, Math.min(100, d.jamie + (Math.random() - 0.5) * 5)),
        emma: Math.max(55, Math.min(100, d.emma + (Math.random() - 0.5) * 5))
      })),
      privacy: baseData.map(d => ({
        ...d,
        jamie: Math.max(50, Math.min(100, d.jamie - 5 + (Math.random() - 0.5) * 8)),
        emma: Math.max(55, Math.min(100, d.emma - 3 + (Math.random() - 0.5) * 8))
      })),
      wellbeing: baseData.map(d => ({
        ...d,
        jamie: Math.max(50, Math.min(100, d.jamie + 3 + (Math.random() - 0.5) * 6)),
        emma: Math.max(55, Math.min(100, d.emma + 5 + (Math.random() - 0.5) * 6))
      }))
    };
  };

  const allData = useMemo(() => generateData(), []);
  const data = allData[selectedMetric];

  const graphHeight = 300;
  const graphWidth = 600;
  const maxValue = 100;
  const padding = 40;

  const getY = (value: number) => {
    return graphHeight - padding - (value / maxValue) * (graphHeight - padding * 2);
  };

  const getX = (index: number) => {
    return padding + (index / (data.length - 1)) * (graphWidth - padding * 2);
  };

  // Generate smooth curve points using bezier-like interpolation
  const generateSmoothPoints = (values: number[]) => {
    const points: string[] = [];
    values.forEach((value, i) => {
      const x = getX(i);
      const y = getY(value);
      if (i === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        const prevX = getX(i - 1);
        const prevY = getY(values[i - 1]);
        const cp1x = prevX + (x - prevX) / 2;
        const cp1y = prevY;
        const cp2x = x - (x - prevX) / 2;
        const cp2y = y;
        points.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`);
      }
    });
    return points.join(" ");
  };

  const jamiePath = generateSmoothPoints(data.map(d => d.jamie));
  const emmaPath = generateSmoothPoints(data.map(d => d.emma));

  const metricLabels: Record<Metric, string> = {
    positivity: "Positivity",
    kindness: "Kindness",
    privacy: "Privacy Awareness",
    wellbeing: "Digital Wellbeing"
  };

  const scrollMonths = (direction: "up" | "down") => {
    if (direction === "up" && selectedMonthIndex > 0) {
      setSelectedMonthIndex(selectedMonthIndex - 1);
    } else if (direction === "down" && selectedMonthIndex < monthNames.length - 1) {
      setSelectedMonthIndex(selectedMonthIndex + 1);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-title-2 font-bold text-gray-900">Positivity</h2>
          <p className="text-subhead text-gray-500 mt-1">Children&apos;s positivity metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-footnote text-gray-600">Range:</span>
          <select
            className="rounded-lg border border-gray-200 bg-white pl-3 pr-8 py-1.5 text-footnote font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blurple transition-colors"
            defaultValue="Last 12 months"
          >
            <option>Last 12 months</option>
            <option>Last 6 months</option>
            <option>Last 3 months</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Months Selector - Horizontal on mobile, Vertical on desktop */}
        <div className="flex md:flex-col items-center gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[300px] pb-2 md:pb-0">
          {/* Left/Up scroll button */}
          <button
            onClick={() => scrollMonths("up")}
            disabled={selectedMonthIndex === 0}
            className={`text-gray-400 hover:text-gray-600 ${selectedMonthIndex === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <svg className="w-4 h-4 md:rotate-0 -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          {monthNames.map((month, index) => (
            <button
              key={`${month}-${index}`}
              onClick={() => setSelectedMonthIndex(index)}
              className={`px-3 py-2 rounded-lg text-footnote font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedMonthIndex === index
                  ? "bg-blurple text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {month}
            </button>
          ))}
          {/* Right/Down scroll button */}
          <button
            onClick={() => scrollMonths("down")}
            disabled={selectedMonthIndex === monthNames.length - 1}
            className={`text-gray-400 hover:text-gray-600 ${selectedMonthIndex === monthNames.length - 1 ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <svg className="w-4 h-4 md:rotate-0 -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Main Graph Area */}
        <div className="flex-1 relative">
          {/* Graph Container with dotted background */}
          <div
            className="relative rounded-lg border border-slate-200"
            style={{
              height: `${graphHeight}px`,
              backgroundImage: `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0",
            }}
          >
            <svg
              width="100%"
              height={graphHeight}
              className="absolute inset-0"
              viewBox={`0 0 ${graphWidth} ${graphHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((value) => {
                const y = getY(value);
                return (
                  <line
                    key={value}
                    x1={padding}
                    y1={y}
                    x2={graphWidth - padding}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                );
              })}

              {/* Jamie's Line (Alert Red) */}
              <path
                d={jamiePath}
                fill="none"
                stroke="#FF6B6B"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Emma's Line (Blurple) */}
              <path
                d={emmaPath}
                fill="none"
                stroke="#6B7FFF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points for Jamie */}
              {data.map((d, i) => {
                const x = getX(i);
                const y = getY(d.jamie);
                return (
                  <circle
                    key={`jamie-${i}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#FF6B6B"
                    className="drop-shadow-sm"
                  />
                );
              })}

              {/* Data points for Emma */}
              {data.map((d, i) => {
                const x = getX(i);
                const y = getY(d.emma);
                return (
                  <circle
                    key={`emma-${i}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#6B7FFF"
                    className="drop-shadow-sm"
                  />
                );
              })}
            </svg>
          </div>

          {/* Bottom Section with Legend and Filter */}
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            {/* Legend */}
            <div className="flex items-center gap-6 text-footnote">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-alert" />
                <span className="text-gray-700 font-semibold">Jamie</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-blurple" />
                <span className="text-gray-700 font-semibold">Emma</span>
              </div>
            </div>

            {/* Metric Filter */}
            <div>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as Metric)}
                className="w-full md:w-auto rounded-lg border border-gray-200 bg-white pl-3 pr-8 py-1.5 text-footnote font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blurple transition-colors"
              >
                <option value="positivity">Positivity</option>
                <option value="kindness">Kindness</option>
                <option value="privacy">Privacy Awareness</option>
                <option value="wellbeing">Digital Wellbeing</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
