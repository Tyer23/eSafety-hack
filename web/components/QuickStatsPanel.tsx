"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui";

interface QuickStatsPanelProps {
  focusTheme: string;
  bestDay: string;
  overallTrend: string;
}

export default function QuickStatsPanel({ focusTheme, bestDay, overallTrend }: QuickStatsPanelProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-card">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="quick-stats" className="border-0">
          <AccordionTrigger className="px-4 sm:px-5 hover:no-underline">
            <div className="text-left">
              <h2 className="text-subhead font-semibold text-gray-900">
                Quick Stats
              </h2>
              <p className="text-footnote text-gray-500 mt-1">
                Weekly highlights and trends at a glance
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 sm:px-5 pb-5">
            <div className="space-y-5 text-subhead">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This week&apos;s focus</span>
                <span className="font-semibold text-blurple">
                  {focusTheme}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Best day</span>
                <span className="font-semibold text-safe">
                  {bestDay}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Overall trend</span>
                <span className="font-semibold text-safe">
                  {overallTrend}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
