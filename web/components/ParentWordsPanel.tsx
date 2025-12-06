'use client'

import { Badge, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui";

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

export default function ParentWordsPanel({
  children
}: ParentWordsPanelProps) {
  // Conversation starters based on AI Safety Guide principles
  const topics = [
    {
      id: "kindness",
      label: "Building digital kindness",
      description:
        "Talk about how words online affect others, even when we can't see their reactions. Practice expressing disagreement without being hurtful.",
      examples: [
        "What makes a message feel kind or unkind to you?",
        "Have you ever regretted something you sent? What would you say differently now?",
        "How do you handle it when someone says something mean to you online?"
      ]
    },
    {
      id: "privacy",
      label: "Protecting personal information",
      description:
        "Discuss what information is safe to share and why privacy matters, without creating fear. Build awareness through understanding.",
      examples: [
        "What kinds of things do you think are okay to share online?",
        "Why might someone want to know your address or school name?",
        "How do you decide if someone online is trustworthy?"
      ]
    },
    {
      id: "wellbeing",
      label: "Healthy digital habits",
      description:
        "Explore balance and self-awareness around screen time, not as restriction but as building good habits together.",
      examples: [
        "How do you feel after spending a lot of time online?",
        "What are some activities you enjoy that don't involve screens?",
        "How do you know when it's time to take a break?"
      ]
    }
  ];

  const firstChild = children[0];
  const wordsForChild = firstChild ? MOCK_WORDS[firstChild.id] ?? [] : [];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-float md:col-span-2">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="conversations" className="border-0">
          <AccordionTrigger className="px-4 sm:px-5 hover:no-underline">
            <div className="text-left">
              <h2 className="text-subhead font-semibold text-gray-900">
                Show Conversation Starting Points
              </h2>
              <p className="text-footnote text-gray-500 mt-1">
                These are meant to build trust and understanding, not to interrogate or monitor.
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 sm:px-5">
            <div className="space-y-4">
              <div className="text-footnote text-gray-600 bg-blurple-light rounded-lg p-3">
                <strong>Privacy Note:</strong> You see behavioral themes, not individual messages.
                Use these insights to start open conversations, not to confront your child.
              </div>

              <div className="space-y-3">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2"
                  >
                    <div className="font-semibold text-gray-900">{topic.label}</div>
                    <div className="text-footnote text-gray-600">
                      {topic.description}
                    </div>
                    <div className="space-y-1.5 pt-2">
                      <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                        Questions to ask together:
                      </div>
                      {topic.examples.map((example, idx) => (
                        <div key={idx} className="text-footnote text-gray-700 pl-3 border-l-2 border-blurple">
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

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
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}


