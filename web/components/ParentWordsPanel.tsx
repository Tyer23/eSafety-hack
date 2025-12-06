'use client'

import { useState } from 'react'
import { Badge, Button, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui";
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

// More realistic pattern data for children
const CHILD_PATTERNS: Record<string, {
  name: string;
  age: number;
  recentThemes: { theme: string; frequency: 'occasional' | 'frequent'; sentiment: 'concern' | 'neutral' | 'positive' }[];
  positivePatterns: string[];
  areasToWatch: string[];
  lastUpdated: string;
}> = {
  kid_01: {
    name: 'Jamie',
    age: 11,
    recentThemes: [
      { theme: 'Feeling left out', frequency: 'occasional', sentiment: 'concern' },
      { theme: 'Gaming frustration', frequency: 'frequent', sentiment: 'neutral' },
      { theme: 'Friendship changes', frequency: 'occasional', sentiment: 'concern' },
    ],
    positivePatterns: [
      'Often helps friends with homework questions',
      'Responds kindly when others are upset',
      'Takes breaks from gaming without prompting',
    ],
    areasToWatch: [
      'Some negative self-talk when losing games',
      'Mentioned feeling excluded from a group chat',
    ],
    lastUpdated: '2 hours ago',
  },
  kid_02: {
    name: 'Emma',
    age: 14,
    recentThemes: [
      { theme: 'Social comparison', frequency: 'occasional', sentiment: 'concern' },
      { theme: 'Homework stress', frequency: 'frequent', sentiment: 'neutral' },
      { theme: 'Creative projects', frequency: 'frequent', sentiment: 'positive' },
    ],
    positivePatterns: [
      'Shares encouraging messages with friends',
      'Sets screen time limits independently',
      'Reports suspicious accounts proactively',
    ],
    areasToWatch: [
      'Comparing herself to influencers on social media',
      'Staying up late on school nights',
    ],
    lastUpdated: '4 hours ago',
  }
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
  const [patternsOpen, setPatternsOpen] = useState<string>("");
  const [scriptsOpen, setScriptsOpen] = useState<string>("");

  const firstChild = children[0];
  const childPattern = firstChild ? CHILD_PATTERNS[firstChild.id] : null;

  // Get scripts for selected category or featured ones
  const displayedScripts = selectedCategory
    ? getScriptsByCategory(selectedCategory)
    : CONVERSATION_SCRIPTS.filter(s => FEATURED_CATEGORIES.includes(s.category));

  const allCategories = Object.keys(SCRIPT_CATEGORIES) as ScriptCategory[];
  const categoriesToShow = showAllCategories ? allCategories : FEATURED_CATEGORIES;

  return (
    <div className="space-y-4">
      {/* Pattern Themes Accordion - Above Conversation Scripts */}
      {childPattern && (
        <section className="rounded-2xl border border-gray-200 bg-white shadow-card">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={patternsOpen}
            onValueChange={setPatternsOpen}
          >
            <AccordionItem value="patterns" className="border-0">
              <AccordionTrigger className="px-4 sm:px-5 hover:no-underline">
                <div className="text-left">
                  <h2 className="text-subhead font-semibold text-gray-900">
                    {patternsOpen === "patterns" ? "Hide" : "Show"} Pattern Themes for {childPattern.name}
                  </h2>
                  <p className="text-footnote text-gray-500 mt-1">
                    Behavioral patterns detected in digital activity · Updated {childPattern.lastUpdated}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-5">
                <div className="space-y-4">
                  {/* Privacy note */}
                  <div className="text-footnote text-gray-600 bg-warning-bg border border-warning rounded-lg p-3">
                    <strong>Privacy Note:</strong> These are behavioral themes, not exact messages.
                    Use them to understand patterns and start supportive conversations.
                  </div>

                  {/* Recent themes */}
                  <div className="space-y-2">
                    <div className="text-caption font-medium text-gray-500 uppercase tracking-wide">
                      Recent themes detected:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {childPattern.recentThemes.map((item) => (
                        <Badge
                          key={item.theme}
                          variant={
                            item.sentiment === 'concern' ? 'destructive' :
                            item.sentiment === 'positive' ? 'success' : 'secondary'
                          }
                        >
                          {item.theme}
                          {item.frequency === 'frequent' && (
                            <span className="ml-1 opacity-70">•••</span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Positive patterns */}
                  <div className="space-y-2">
                    <div className="text-caption font-medium text-gray-500 uppercase tracking-wide">
                      Positive patterns:
                    </div>
                    <ul className="space-y-1.5">
                      {childPattern.positivePatterns.map((pattern, idx) => (
                        <li
                          key={idx}
                          className="text-footnote text-gray-700 pl-3 border-l-2 border-safe flex items-start gap-2"
                        >
                          <span className="text-safe">✓</span>
                          {pattern}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas to watch */}
                  <div className="space-y-2">
                    <div className="text-caption font-medium text-gray-500 uppercase tracking-wide">
                      Areas to watch:
                    </div>
                    <ul className="space-y-1.5">
                      {childPattern.areasToWatch.map((area, idx) => (
                        <li
                          key={idx}
                          className="text-footnote text-gray-700 pl-3 border-l-2 border-caution flex items-start gap-2"
                        >
                          <span className="text-caution">!</span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Child info */}
                  <div className="pt-2 border-t border-gray-200 text-footnote text-gray-500">
                    {childPattern.name}, {childPattern.age} years old
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      )}

      {/* Conversation Scripts Accordion */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-card">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={scriptsOpen}
          onValueChange={setScriptsOpen}
        >
          <AccordionItem value="conversations" className="border-0">
            <AccordionTrigger className="px-4 sm:px-5 hover:no-underline">
              <div className="text-left">
                <h2 className="text-subhead font-semibold text-gray-900">
                  {scriptsOpen === "conversations" ? "Hide" : "Show"} Conversation Scripts
                </h2>
                <p className="text-footnote text-gray-500 mt-1">
                  Based on eSafety Commissioner guidance for parents
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-5">
              <div className="space-y-4">
                {/* Tip */}
                <div className="text-footnote text-gray-600 bg-blurple-light rounded-lg p-3">
                  <strong>Tip:</strong> Lots of little chats are more effective than one big conversation.
                  Chat while doing something else together, like taking a walk or a car trip.
                </div>

                {/* Category filters */}
                <div className="space-y-2">
                  <div className="text-caption font-medium text-gray-500 uppercase tracking-wide">
                    Choose a topic:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === null ? "default" : "secondary"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Featured
                    </Button>
                    {categoriesToShow.map((cat) => (
                      <Button
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "secondary"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {SCRIPT_CATEGORIES[cat].label}
                      </Button>
                    ))}
                    {!showAllCategories && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-blurple"
                        onClick={() => setShowAllCategories(true)}
                      >
                        + More topics
                      </Button>
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

                {/* eSafety resources */}
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <div className="text-caption font-medium text-gray-500 uppercase tracking-wide">
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
    </div>
  );
}

function ScriptCard({ script }: { script: ConversationScript }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
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
              <Badge variant="secondary">
                {script.ageGroup === 'under-8' && 'Under 8'}
                {script.ageGroup === '8-12' && 'Ages 8-12'}
                {script.ageGroup === '13-18' && 'Ages 13-18'}
              </Badge>
            </div>
          )}

          {/* Scripts */}
          <div className="space-y-1.5">
            <div className="text-caption font-medium text-gray-500 uppercase tracking-wide">
              Things you can say:
            </div>
            {script.scripts.map((line, idx) => (
              <div
                key={idx}
                className="text-footnote text-gray-700 pl-3 border-l-2 border-blurple bg-gray-50 rounded-r-lg py-1.5 pr-2"
              >
                "{line}"
              </div>
            ))}
          </div>

          {/* Tips */}
          {script.tips && script.tips.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <div className="text-caption font-medium text-gray-500 uppercase tracking-wide">
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
