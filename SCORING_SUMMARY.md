# Child Digital Interaction Scorer & Summary Pipeline

## What it does
- **`web/child_digital_interaction_scorer.py`**: Scores a piece of text (with its context like `message` or `search`) on kindness, privacy awareness, and digital wellbeing using OpenAI chat completions. If the model response is unusable, it falls back to a lightweight heuristic to avoid empty/zero outputs.
- **`score_children.py`**: Runs the scorer on children csv data, writing all scored rows to `web/data/children_scored.csv`.
- **`summarize_children.py`**: Aggregates `children_scored.csv` into weekly-style summaries similar to `child_behaviour.csv`, outputting `web/data/children_summary.csv`.

## Setup
1) Install deps: `pip3 install openai`
2) Provide OpenAI API key: set `OPENAI_API_KEY` in your environment or in a `.env` file at the repo root:
   ```
   OPENAI_API_KEY=sk-...
   ```

## Scorer details
- Default model: `gpt-4o-mini` (can be changed via the `ChildDigitalInteractionScorer` constructor).
- Prompt includes:
  - the message text
  - the context (e.g., `message`, `search`)
  - a strict JSON response format with the three scores and a brief explanation
- Safety net: if the model output isn’t valid JSON or all scores are zero, a heuristic fallback computes approximate scores.
- Outputs a dict with: `kindness_score`, `privacy_awareness_score`, `digital_wellbeing_score`, `explanation`, `raw`.

## Run scoring (per-child rows -> scored rows)
From repo root:
```
python3 score_children.py
```
Reads `web/data/jamie.csv` and `web/data/emma.csv`; writes combined `web/data/children_scored.csv` with columns:
`child_id, child_name, date, context, text, kindness_score, privacy_awareness_score, digital_wellbeing_score, explanation, raw`.

## Run summarization (scored rows -> weekly summaries)
From repo root:
```
python3 summarize_children.py
```
Reads `web/data/children_scored.csv`; writes `web/data/children_summary.csv` with columns similar to `child_behaviour.csv`:
`child_id, child_name, week_of, weekly_summary, focus_theme, best_day, overall_trend, kind_interactions, potential_risks, privacy_warnings, digital_wellbeing, positive_progress, gentle_flags, day_statuses`.

Notes:
- Summaries are grouped by child and week (week start = Monday).
- `video_prompt` is not included; intended to be generated later by a parent agent.

### How each summary column is derived
- `child_id`, `child_name`: Passed through from the scored rows.
- `week_of`: Monday of the week for each grouped set of rows.
- `weekly_summary`: Text string highlighting counts of kind interactions, privacy warnings, and average digital wellbeing (example: “Jamie shared 5 kind interactions, had 1 privacy warning, and maintained an average wellbeing of 72.3.”).
- `focus_theme`: Simple heuristic comparing averages; defaults to:
  - `"Kind language"` if kindness mean is greater than or equal to the combined mean of privacy/wellbeing.
  - Otherwise `"Healthy habits"`.
- `best_day`: Day with the highest average kindness score that week (ISO date).
- `overall_trend`: Currently set to `"Steady"` as a placeholder.
- `kind_interactions`: Count of rows with kindness_score >= 70.
- `potential_risks`: Count of rows with digital_wellbeing_score <= 40.
- `privacy_warnings`: Count of rows with privacy_awareness_score <= 50.
- `digital_wellbeing`: Mean of digital_wellbeing_score across the week, rounded to 1 decimal.
- `positive_progress`: Short note based on whether there were kind interactions (e.g., “Kept conversations positive; Practiced safe sharing” or “Engaged steadily”).
- `gentle_flags`: Concise flags; includes “Watch for personal info sharing” if any privacy warnings; “Check in on mood and balance” if any potential risks; otherwise “None noted.”
- `day_statuses`: Concatenated daily statuses derived from average daily kindness:
  - `excellent` if daily avg kindness >= 80
  - `good` if >= 60
  - `needs-attention` otherwise
  Formatted as `YYYY-MM-DD:status` segments joined by `|`.
