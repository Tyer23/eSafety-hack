import fs from "fs";
import path from "path";
import { ChildBehaviour, DayStatus, ParentBehaviourData, ChildStatsItem } from "./types";

const CSV_PATH = path.join(process.cwd(), "data", "child_behaviour.csv");

let cachedData: ParentBehaviourData | null = null;

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current.trim());
  return values;
}

function parseDayStatuses(raw: string): Record<string, DayStatus> {
  if (!raw) return {};
  return raw.split("|").reduce<Record<string, DayStatus>>((acc, chunk) => {
    const [date, status] = chunk.split(":");
    if (date && status) {
      const trimmedStatus = status.trim() as DayStatus;
      acc[date.trim()] = trimmedStatus || "neutral";
    }
    return acc;
  }, {});
}

function toStats(child: Omit<ChildBehaviour, "stats">): ChildStatsItem[] {
  return [
    {
      label: "Kind interactions",
      value: String(child.kindInteractions),
      trend: child.overallTrend === "Improving" ? "+3 vs last week" : "",
      tone: "positive",
    },
    {
      label: "Potential risk moments",
      value: String(child.potentialRisks),
      trend: child.potentialRisks > 3 ? "watch" : "-1 vs last week",
      tone: child.potentialRisks > 3 ? "caution" : "neutral",
    },
    {
      label: "Privacy warnings",
      value: String(child.privacyWarnings),
      trend: child.privacyWarnings ? "steady" : "-1 vs last week",
      tone: child.privacyWarnings ? "neutral" : "positive",
    },
    {
      label: "Digital wellbeing",
      value: child.digitalWellbeing,
      tone: "positive",
    },
  ];
}

function loadFromCsv(): ParentBehaviourData {
  const raw = fs.readFileSync(CSV_PATH, "utf8");
  const lines = raw.trim().split(/\r?\n/);
  const [, ...rows] = lines; // skip header

  const children: ChildBehaviour[] = rows.map((line) => {
    const [
      childId,
      childName,
      weekOf,
      weeklySummary,
      focusTheme,
      bestDay,
      overallTrend,
      kindInteractions,
      potentialRisks,
      privacyWarnings,
      digitalWellbeing,
      positiveProgress,
      gentleFlags,
      dayStatuses,
      videoPrompt,
    ] = splitCsvLine(line);

    const base: Omit<ChildBehaviour, "stats"> = {
      id: childId,
      name: childName,
      weekOf,
      weeklySummary,
      focusTheme,
      bestDay,
      overallTrend,
      kindInteractions: Number(kindInteractions),
      potentialRisks: Number(potentialRisks),
      privacyWarnings: Number(privacyWarnings),
      digitalWellbeing,
      positiveProgress: positiveProgress ? positiveProgress.split(";").map((item) => item.trim()).filter(Boolean) : [],
      gentleFlags: gentleFlags ? gentleFlags.split(";").map((item) => item.trim()).filter(Boolean) : [],
      dayStatuses: parseDayStatuses(dayStatuses),
      videoPrompt,
    };

    return { ...base, stats: toStats(base) };
  });

  const focusTheme = children[0]?.focusTheme || "Kindness";
  const bestDay = children[0]?.bestDay || "Monday";
  const overallTrend = children[0]?.overallTrend || "Steady";

  const weeklySummary = children
    .map((child) => `${child.name}: ${child.weeklySummary}`)
    .join(" ");

  const themes: ParentBehaviourData["themes"] = [
    {
      id: "kindness",
      label: "Kind vs unkind language",
      level: "low",
      occurrences: children.reduce((sum, child) => sum + child.kindInteractions, 0),
      description: "Most interactions are kind. We keep reinforcing the wins before flagging concerns.",
    },
    {
      id: "privacy",
      label: "Sharing personal information",
      level: children.some((child) => child.privacyWarnings > 0) ? "medium" : "low",
      occurrences: children.reduce((sum, child) => sum + child.privacyWarnings, 0),
      description: "A few close calls with sharing addresses. Remind children to pause and ask before posting details.",
    },
    {
      id: "wellbeing",
      label: "Digital wellbeing",
      level: "low",
      occurrences: children.filter((child) => child.digitalWellbeing.toLowerCase().includes("late")).length,
      description: "Evenings are mostly balanced. Continue encouraging wind-down routines before bed.",
    },
  ];

  return {
    parentId: "parent_01",
    weeklySummary,
    focusTheme,
    bestDay,
    overallTrend,
    children,
    themes,
  };
}

export function getParentBehaviourData(forceReload = false): ParentBehaviourData {
  if (cachedData && !forceReload) {
    return cachedData;
  }
  cachedData = loadFromCsv();
  return cachedData;
}
