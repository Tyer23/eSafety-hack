import csv
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from statistics import mean

INPUT_FILE = Path("web/data/children_scored.csv")
OUTPUT_FILE = Path("web/data/children_summary.csv")


def parse_date(dt_str: str) -> datetime:
  # Accepts "YYYY-MM-DD HH:MM:SS"
  return datetime.strptime(dt_str.split(".")[0], "%Y-%m-%d %H:%M:%S")


def week_start(dt: datetime) -> datetime:
  return dt - timedelta(days=dt.weekday())


def load_scored_rows(path: Path):
  with path.open(newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
      try:
        row["parsed_dt"] = parse_date(row["date"])
      except Exception:
        continue
      row["kindness_score"] = int(row.get("kindness_score", 0) or 0)
      row["privacy_awareness_score"] = int(row.get("privacy_awareness_score", 0) or 0)
      row["digital_wellbeing_score"] = int(row.get("digital_wellbeing_score", 0) or 0)
      yield row


def build_summary(rows):
  fieldnames = [
    "child_id",
    "child_name",
    "week_of",
    "weekly_summary",
    "focus_theme",
    "best_day",
    "overall_trend",
    "kind_interactions",
    "potential_risks",
    "privacy_warnings",
    "digital_wellbeing",
    "positive_progress",
    "gentle_flags",
    "day_statuses",
    "video_prompt",
  ]

  grouped = defaultdict(list)
  for row in rows:
    key = (row["child_id"], row["child_name"], week_start(row["parsed_dt"]).date())
    grouped[key].append(row)

  summaries = []
  for (child_id, child_name, wk_start), items in grouped.items():
    kindness = [r["kindness_score"] for r in items]
    privacy = [r["privacy_awareness_score"] for r in items]
    wellbeing = [r["digital_wellbeing_score"] for r in items]

    kind_interactions = sum(1 for k in kindness if k >= 70)
    potential_risks = sum(1 for w in wellbeing if w <= 40)
    privacy_warnings = sum(1 for p in privacy if p <= 50)
    avg_wellbeing = round(mean(wellbeing), 1) if wellbeing else 0

    by_day = defaultdict(list)
    for r in items:
      day = r["parsed_dt"].date().isoformat()
      by_day[day].append(r)
    day_statuses_parts = []
    for day, records in sorted(by_day.items()):
      avg_k = mean([r["kindness_score"] for r in records])
      status = "excellent" if avg_k >= 80 else "good" if avg_k >= 60 else "needs-attention"
      day_statuses_parts.append(f"{day}:{status}")
    day_statuses = "|".join(day_statuses_parts)

    # Best day by kindness average
    best_day = None
    best_day_score = -1
    for day, records in by_day.items():
      avg_k = mean([r["kindness_score"] for r in records])
      if avg_k > best_day_score:
        best_day_score = avg_k
        best_day = day

    focus_theme = "Kind language" if mean(kindness) >= mean([*privacy, *wellbeing]) else "Healthy habits"
    overall_trend = "Steady"

    weekly_summary = (
      f"{child_name} shared {kind_interactions} kind interactions, "
      f"had {privacy_warnings} privacy warnings, and maintained an average wellbeing of {avg_wellbeing}."
    )
    positive_progress = "Kept conversations positive; Practiced safe sharing" if kind_interactions else "Engaged steadily"
    gentle_flags = []
    if privacy_warnings:
      gentle_flags.append("Watch for personal info sharing")
    if potential_risks:
      gentle_flags.append("Check in on mood and balance")
    gentle_flags = ";".join(gentle_flags) if gentle_flags else "None noted"

    video_prompt = "Celebrate kind posts and remind about privacy pauses"

    summaries.append(
      {
        "child_id": child_id,
        "child_name": child_name,
        "week_of": wk_start.isoformat(),
        "weekly_summary": weekly_summary,
        "focus_theme": focus_theme,
        "best_day": best_day or wk_start.isoformat(),
        "overall_trend": overall_trend,
        "kind_interactions": kind_interactions,
        "potential_risks": potential_risks,
        "privacy_warnings": privacy_warnings,
        "digital_wellbeing": avg_wellbeing,
        "positive_progress": positive_progress,
        "gentle_flags": gentle_flags,
        "day_statuses": day_statuses,
        "video_prompt": video_prompt,
      }
    )

  return fieldnames, summaries


def main():
  rows = list(load_scored_rows(INPUT_FILE))
  fieldnames, summaries = build_summary(rows)
  with OUTPUT_FILE.open("w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(summaries)
  print(f"Wrote {len(summaries)} summaries to {OUTPUT_FILE}")


if __name__ == "__main__":
  main()
