import { NextResponse } from "next/server";

interface RiskTheme {
  id: string;
  label: string;
  level: "low" | "medium" | "high";
  occurrences: number;
  description: string;
}

interface ParentSummary {
  parentId: string;
  children: { id: string; name: string }[];
  weeklySummary: string;
  themes: RiskTheme[];
}

export async function GET() {
  // Static mock payload for now – ideal place to hook in analytics + ML later.
  const data: ParentSummary = {
    parentId: "parent_01",
    children: [
      { id: "kid_01", name: "Jamie" },
      { id: "kid_02", name: "Emma" }
    ],
    weeklySummary:
      "Jamie and Emma mostly used kind language this week. There were a few moments of frustration, and one case where Jamie almost shared personal information but stopped after a warning.",
    themes: [
      {
        id: "kindness",
        label: "Kind vs unkind language",
        level: "low",
        occurrences: 3,
        description:
          "Most interactions were kind. A few messages sounded sharp, but your children generally corrected themselves."
      },
      {
        id: "privacy",
        label: "Sharing personal information",
        level: "medium",
        occurrences: 1,
        description:
          "Jamie nearly shared your street name once, then deleted it after the guardian nudged them."
      },
      {
        id: "wellbeing",
        label: "Late‑night usage",
        level: "low",
        occurrences: 0,
        description:
          "No concerning late‑night activity this week. Screen time stayed within healthy ranges."
      }
    ]
  };

  return NextResponse.json(data);
}


