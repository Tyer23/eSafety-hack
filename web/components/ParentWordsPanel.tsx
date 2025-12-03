import { Badge } from "@/components/ui";

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
  // In Streamlit you had a "Topics of Discussion" select box and a child selector.
  // Here we show the same ideas but in a more guided, visual way.
  const topics = [
    {
      id: "kindness",
      label: "Kind vs unkind language",
      description:
        "Spot phrases that might hurt someone and practise kinder alternatives."
    },
    {
      id: "privacy",
      label: "Sharing personal information",
      description:
        "Learn how your child handles addresses, phone numbers, and secrets."
    },
    {
      id: "wellbeing",
      label: "Digital wellbeing",
      description:
        "Notice when screen time or late‑night use might be creeping up."
    }
  ];

  const firstChild = children[0];
  const wordsForChild = firstChild ? MOCK_WORDS[firstChild.id] ?? [] : [];

  return (
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-subhead font-semibold text-gray-900">
            Conversation starting points
          </h2>
          <p className="text-footnote text-gray-500">
            Use these themes and examples to talk with your child, not to
            monitor them.
          </p>
        </div>
        <Badge variant="secondary">Inspired by Streamlit dashboard</Badge>
      </div>

      <div className="space-y-2">
        <div className="text-[11px] font-medium text-gray-600">
          Themes to explore together
        </div>
        <div className="grid gap-2">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-footnote text-gray-900 shadow-sm"
            >
              <div className="font-semibold">{topic.label}</div>
              <div className="text-gray-600 text-[11px]">
                {topic.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {firstChild && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-medium text-gray-600">
              Example phrases from{" "}
              <span className="text-gray-900">{firstChild.name}</span>
            </div>
            <span className="text-[10px] text-gray-500">
              Shown as categories, not exact chat logs.
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {wordsForChild.map((word) => (
              <Badge key={word} variant="destructive">
                {word}
              </Badge>
            ))}
            {!wordsForChild.length && (
              <span className="text-[11px] text-gray-500">
                No recent risky phrases detected for this child.
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}


