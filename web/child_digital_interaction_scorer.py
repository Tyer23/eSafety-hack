import json
import os
import re
from pathlib import Path
from typing import Any, Dict

from openai import OpenAI, OpenAIError

PROMPT_TEMPLATE = """
You are an evaluator of digital communication written by or directed at CHILDREN.

Analyse the message and produce three scores between 0 and 100, plus a brief explanation.

Return ONLY valid JSON, nothing else:
{{
  "kindness_score": <int 0-100>,
  "privacy_awareness_score": <int 0-100>,
  "digital_wellbeing_score": <int 0-100>,
  "explanation": "<brief reasoning>"
}}

Context: {context}
Message: {text}
"""


def _load_env_api_key() -> None:
  """Load OPENAI_API_KEY from .env if not already present."""
  if os.getenv("OPENAI_API_KEY"):
    return
  env_path = Path(".env")
  if not env_path.exists():
    return
  for line in env_path.read_text().splitlines():
    if line.strip().startswith("#") or "=" not in line:
      continue
    key, _, value = line.partition("=")
    if key.strip() == "OPENAI_API_KEY":
      os.environ["OPENAI_API_KEY"] = value.strip().strip('"').strip("'")
      break


def _safe_json_parse(text: str) -> Dict[str, Any]:
  try:
    return json.loads(text)
  except json.JSONDecodeError:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
      try:
        return json.loads(match.group(0))
      except json.JSONDecodeError:
        pass
  return {}


def _clamp_score(value: Any) -> int:
  try:
    num = int(float(value))
  except Exception:
    num = 0
  return max(0, min(100, num))


class ChildDigitalInteractionScorer:
  """
  OpenAI-based scorer using chat completions.
  Requires OPENAI_API_KEY to be set (loaded from .env if present).
  """

  def __init__(self, model: str = "gpt-4o-mini") -> None:
    _load_env_api_key()
    self.client = OpenAI()
    self.model = model

  @staticmethod
  def _fallback_scores(text: str, raw_output: str) -> Dict[str, Any]:
    """Heuristic backup when the model output is unusable."""
    lower = text.lower()

    kindness = 60
    if any(word in lower for word in ["dumb", "stupid", "hate", "idiot", "loser", "bully", "kill"]):
      kindness -= 40
    if any(word in lower for word in ["thank", "thanks", "great", "good job", "awesome", "nice", "love", "happy", "kind"]):
      kindness += 20
    kindness = _clamp_score(kindness)

    privacy = 85
    if re.search(r"\b\d{5,}\b", text) or re.search(r"\b\d{3}[- ]?\d{3}[- ]?\d{4}\b", text):
      privacy -= 50
    if re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text):
      privacy -= 50
    if any(term in lower for term in ["phone", "number", "address", "email", "location"]):
      privacy -= 20
    privacy = _clamp_score(privacy)

    wellbeing = 70
    if any(word in lower for word in ["ignored", "alone", "sad", "upset", "anxious", "tired"]):
      wellbeing -= 25
    if any(word in lower for word in ["balance", "break", "rest", "healthy", "good day", "fun", "enjoy"]):
      wellbeing += 15
    wellbeing = _clamp_score(wellbeing)

    explanation = f"Heuristic fallback applied because model output was invalid ({raw_output!r})."
    return {
      "kindness_score": kindness,
      "privacy_awareness_score": privacy,
      "digital_wellbeing_score": wellbeing,
      "explanation": explanation,
      "raw": raw_output.strip(),
    }

  def score(self, text: str, context: str = "message") -> Dict[str, Any]:
    prompt = PROMPT_TEMPLATE.format(text=text, context=context)
    try:
      response = self.client.chat.completions.create(
        model=self.model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        response_format={"type": "json_object"},
      )
      raw_output = response.choices[0].message.content or ""
    except OpenAIError as e:
      return self._fallback_scores(text, f"OpenAI error: {e}")

    parsed = _safe_json_parse(raw_output)
    if not isinstance(parsed, dict):
      return self._fallback_scores(text, raw_output)

    result = {
      "kindness_score": _clamp_score(parsed.get("kindness_score")),
      "privacy_awareness_score": _clamp_score(parsed.get("privacy_awareness_score")),
      "digital_wellbeing_score": _clamp_score(parsed.get("digital_wellbeing_score")),
      "explanation": (parsed.get("explanation") or "").strip() or raw_output.strip(),
      "raw": raw_output.strip(),
    }

    if (
      not parsed
      or sum(result[k] for k in ["kindness_score", "privacy_awareness_score", "digital_wellbeing_score"]) == 0
    ):
      return self._fallback_scores(text, raw_output)

    return result


if __name__ == "__main__":
  scorer = ChildDigitalInteractionScorer()

  test_samples = [
    "Thank you for helping me with my homework!",
    "Here is my phone number 0412345678, can you add me?",
    "Everyone ignored me in the group chat today.",
    "You are so dumb, why would you say that?",
    "I hope you're having a good day :)",
  ]

  for sample in test_samples:
    scores = scorer.score(sample)
    print(json.dumps({"text": sample, "scores": scores}, indent=2))
    print("-" * 60)
