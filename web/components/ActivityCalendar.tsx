"use client";

import { useState } from "react";

interface DayStatus {
  date: number;
  status: "excellent" | "good" | "needs-attention" | "neutral";
}

export default function ActivityCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const today = new Date();

  // Mock data: days with different statuses
  const dayStatuses: Record<string, DayStatus["status"]> = {
    [`${currentYear}-${currentMonth + 1}-1`]: "excellent",
    [`${currentYear}-${currentMonth + 1}-3`]: "good",
    [`${currentYear}-${currentMonth + 1}-5`]: "needs-attention",
    [`${currentYear}-${currentMonth + 1}-7`]: "excellent",
    [`${currentYear}-${currentMonth + 1}-10`]: "good",
    [`${currentYear}-${currentMonth + 1}-12`]: "excellent",
    [`${currentYear}-${currentMonth + 1}-15`]: "good",
    [`${currentYear}-${currentMonth + 1}-18`]: "excellent",
    [`${currentYear}-${currentMonth + 1}-20`]: "needs-attention",
    [`${currentYear}-${currentMonth + 1}-22`]: "good",
    [`${currentYear}-${currentMonth + 1}-25`]: "excellent",
    [`${currentYear}-${currentMonth + 1}-28`]: "good",
  };

  const getStatusColor = (status: DayStatus["status"]) => {
    switch (status) {
      case "excellent":
        return "bg-pastel-purple-400/60";
      case "good":
        return "bg-pastel-blue-400/60";
      case "needs-attention":
        return "bg-pastel-pink-400/60";
      default:
        return "bg-slate-100";
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const isToday = (date: number) => {
    return (
      today.getDate() === date &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <p className="text-xs text-slate-500">Daily activity overview</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
          >
            ←
          </button>
          <button
            onClick={goToNextMonth}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-[10px] font-medium text-slate-500"
          >
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1;
          const dateKey = `${currentYear}-${currentMonth + 1}-${date}`;
          const status = dayStatuses[dateKey] || "neutral";

          return (
            <div
              key={date}
              className="relative flex aspect-square items-center justify-center"
            >
              {status !== "neutral" ? (
                <div
                  className={`h-8 w-8 rounded-full ${getStatusColor(
                    status
                  )} flex items-center justify-center text-xs font-medium text-slate-800 shadow-sm backdrop-blur-sm`}
                >
                  {date}
                </div>
              ) : (
                <div
                  className={`h-8 w-8 flex items-center justify-center text-xs text-slate-600 ${
                    isToday(date)
                      ? "rounded-full border-2 border-pastel-blue-500 font-semibold"
                      : ""
                  }`}
                >
                  {date}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-pastel-purple-400/60" />
          <span className="text-slate-700">Excellent day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-pastel-blue-400/60" />
          <span className="text-slate-700">Good day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-pastel-pink-400/60" />
          <span className="text-slate-700">Needs attention</span>
        </div>
      </div>
    </div>
  );
}
