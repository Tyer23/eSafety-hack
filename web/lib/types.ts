export type DayStatus = "excellent" | "good" | "needs-attention" | "neutral";

export interface ChildStatsItem {
  label: string;
  value: string;
  trend?: string;
  tone: "positive" | "neutral" | "caution";
}

export interface ChildBehaviour {
  id: string;
  name: string;
  weekOf: string;
  weeklySummary: string;
  focusTheme: string;
  bestDay: string;
  overallTrend: string;
  kindInteractions: number;
  potentialRisks: number;
  privacyWarnings: number;
  digitalWellbeing: string;
  positiveProgress: string[];
  gentleFlags: string[];
  dayStatuses: Record<string, DayStatus>;
  videoPrompt: string;
  stats: ChildStatsItem[];
  // ML-based scores (calculated from classification data)
  mlScores?: {
    kindnessScore: number;
    positivityScore: number;
    privacyAwarenessScore: number;
    digitalWellbeingScore: number;
    overallEmotion: {
      primary: string;
      distribution: Record<string, number>;
    };
    themes: string[];
  };
}

export interface ParentBehaviourData {
  parentId: string;
  weeklySummary: string;
  focusTheme: string;
  bestDay: string;
  overallTrend: string;
  children: ChildBehaviour[];
  themes: Array<{
    id: string;
    label: string;
    level: "low" | "medium" | "high";
    occurrences: number;
    description: string;
  }>;
}

export interface ChatAgentResponse {
  reply: string;
  childId: string;
  videoPlan?: {
    title: string;
    prompt: string;
    status: "mocked" | "queued" | "skipped";
    previewUrl?: string;
    note?: string;
  };
  highlights: {
    weeklySummary: string;
    focusTheme: string;
    positiveProgress: string[];
    gentleFlags: string[];
  };
}
