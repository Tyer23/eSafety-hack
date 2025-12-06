'use client'

import { useState } from 'react'
import { Badge, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui";
import {
  CONVERSATION_SCRIPTS,
  SCRIPT_CATEGORIES,
  ESAFETY_RESOURCES,
  getScriptsByCategory,
  type ScriptCategory,
  type ConversationScript
} from "@/data/conversation-scripts";

interface ChildInfo {
  id: string;
  name: string;
}

interface ParentWordsPanelProps {
  children: ChildInfo[];
}

const MOCK_WORDS: Record<string, string[]> = {
  kid_01: ["stupid", "no one likes you", "I hate you"],
  kid_02: ["you can&apos;t sit with us", "go away", "loser"]
};

// Featured categories to show by default (curated selection)
const FEATURED_CATEGORIES: ScriptCategory[] = [
  "starting-conversations",
  "being-curious",
  "when-things-go-wrong",
  "building-trust"
];

export default function ParentWordsPanel({
  children
}: ParentWordsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<ScriptCategory | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const firstChild = children[0];
  const wordsForChild = firstChild ? MOCK_WORDS[firstChild.id] ?? [] : [];

  // Get scripts for selected category or featured ones
  const displayedScripts = selectedCategory
    ? getScriptsByCategory(selectedCategory)
    : CONVERSATION_SCRIPTS.filter(s => FEATURED_CATEGORIES.includes(s.category));

  const allCategories = Object.keys(SCRIPT_CATEGORIES) as ScriptCategory[];
  const categoriesToShow = showAllCategories ? allCategories : FEATURED_CATEGORIES;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-card md:col-span-2">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="conversations" className="border-0">
          <AccordionTrigger className="px-4 sm:px-5 hover:no-underline">
            <div className="text-left">
              <h2 className="text-subhead font-semibold text-gray-900">
                Conversation Scripts
              </h2>
              <p className="text-footnote text-gray-500 mt-1">
                Based on eSafety Commissioner guidance for parents
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 sm:px-5">
            <div className="space-y-4">
              {/* Privacy note */}
              <div className="text-footnote text-gray-600 bg-blurple-light rounded-lg p-3">
                <strong>Tip:</strong> Lots of little chats are more effective than one big conversation.
                Chat while doing something else together, like taking a walk or a car trip.
              </div>

              {/* Category filters */}
              <div className="space-y-2">
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                  Choose a topic:
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-full text-footnote font-medium transition-colors ${
                      selectedCategory === null
                        ? 'bg-blurple text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Featured
                  </button>
                  {categoriesToShow.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-footnote font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-blurple text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {SCRIPT_CATEGORIES[cat].label}
                    </button>
                  ))}
                  {!showAllCategories && (
                    <button
                      onClick={() => setShowAllCategories(true)}
                      className="px-3 py-1.5 rounded-full text-footnote font-medium bg-gray-100 text-blurple hover:bg-gray-200 transition-colors"
                    >
                      + More topics
                    </button>
                  )}
                </div>
                {selectedCategory && (
                  <p className="text-footnote text-gray-500 mt-1">
                    {SCRIPT_CATEGORIES[selectedCategory].description}
                  </p>
                )}
              </div>

              {/* Scripts */}
              <div className="space-y-3">
                {displayedScripts.map((script) => (
                  <ScriptCard key={script.id} script={script} />
                ))}
              </div>

              {/* Pattern themes */}
              {firstChild && wordsForChild.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <div className="text-footnote font-medium text-gray-700">
                    Pattern themes from{" "}
                    <span className="text-gray-900">{firstChild.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {wordsForChild.map((word) => (
                      <Badge key={word} variant="destructive">
                        {word}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-500 italic">
                    These represent themes, not exact messages. Use them to understand patterns and start conversations.
                  </p>
                </div>
              )}

              {/* eSafety resources */}
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                  More from eSafety:
                </div>
                <div className="flex flex-wrap gap-2">
                  {ESAFETY_RESOURCES.slice(0, 3).map((resource) => (
                    <a
                      key={resource.url}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-footnote text-blurple hover:underline"
                    >
                      {resource.title} →
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

function ScriptCard({ script }: { script: ConversationScript }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold text-gray-900">{script.title}</div>
            <div className="text-footnote text-gray-600 mt-0.5">
              {script.description}
            </div>
          </div>
          <span className="text-gray-400 text-lg flex-shrink-0">
            {expanded ? '−' : '+'}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="space-y-3 pt-2">
          {/* Age group badge */}
          {script.ageGroup !== 'all' && (
            <div className="flex gap-1.5">
              <Badge variant="secondary" className="text-[10px]">
                {script.ageGroup === 'under-8' && 'Under 8'}
                {script.ageGroup === '8-12' && 'Ages 8-12'}
                {script.ageGroup === '13-18' && 'Ages 13-18'}
              </Badge>
            </div>
          )}

          {/* Scripts */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
              Things you can say:
            </div>
            {script.scripts.map((line, idx) => (
              <div
                key={idx}
                className="text-footnote text-gray-700 pl-3 border-l-2 border-blurple bg-white rounded-r-lg py-1.5 pr-2"
              >
                "{line}"
              </div>
            ))}
          </div>

          {/* Tips */}
          {script.tips && script.tips.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                Tips:
              </div>
              <ul className="text-footnote text-gray-600 space-y-1 list-disc list-inside">
                {script.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
