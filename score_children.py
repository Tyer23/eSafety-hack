import csv
import sys
from pathlib import Path

# Ensure we can import the scorer from web/
REPO_ROOT = Path(__file__).resolve().parent
WEB_DIR = REPO_ROOT / "web"
if str(WEB_DIR) not in sys.path:
  sys.path.insert(0, str(REPO_ROOT))

from web.child_digital_interaction_scorer import ChildDigitalInteractionScorer  # type: ignore


def load_rows(csv_path: Path):
  with csv_path.open(newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    return list(reader)


def score_child(file_path: Path, child_id: str, child_name: str, scorer: ChildDigitalInteractionScorer):
  rows = load_rows(file_path)
  scored_rows = []
  for row in rows:
    text = row.get("text", "")
    timestamp = row.get("timestamp", "")
    context = row.get("context", "") or "message"
    scores = scorer.score(text, context=context)
    scored_rows.append(
      {
        "child_id": child_id,
        "child_name": child_name,
        "date": timestamp,
        "context": context,
        "text": text,
        "kindness_score": scores.get("kindness_score"),
        "privacy_awareness_score": scores.get("privacy_awareness_score"),
        "digital_wellbeing_score": scores.get("digital_wellbeing_score"),
        "explanation": scores.get("explanation", ""),
        "raw": scores.get("raw", ""),
      }
    )
  return scored_rows


def main():
  data_dir = REPO_ROOT / "web" / "data"
  inputs = [
    (data_dir / "jamie.csv", "kid_01", "Jamie"),
    (data_dir / "emma.csv", "kid_02", "Emma"),
  ]

  scorer = ChildDigitalInteractionScorer()

  all_rows = []
  for csv_path, child_id, child_name in inputs:
    scored = score_child(csv_path, child_id, child_name, scorer)
    all_rows.extend(scored)

  out_path = data_dir / "children_scored.csv"
  fieldnames = [
    "child_id",
    "child_name",
    "date",
    "context",
    "text",
    "kindness_score",
    "privacy_awareness_score",
    "digital_wellbeing_score",
    "explanation",
    "raw",
  ]
  with out_path.open("w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(all_rows)
  print(f"Wrote {len(all_rows)} rows to {out_path}")


if __name__ == "__main__":
  main()
