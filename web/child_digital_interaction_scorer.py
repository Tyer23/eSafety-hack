import json
import re
from typing import Any, Dict


def clamp(value: Any, low: int = 0, high: int = 100) -> int:
  try:
    num = int(float(value))
  except Exception:
    num = 0
  return max(low, min(high, num))


class ChildDigitalInteractionScorer:
  """
  Lightweight, dependency-free scorer that uses simple heuristics.
  This avoids heavyweight model downloads and works fully offline.
  """

  def __init__(self) -> None:
    # Keyword lists are intentionally small and easy to tweak.
    self.negative_kindness = {"dumb", "stupid", "hate", "idiot", "loser", "kill", "bully", "ugly"}
    self.positive_kindness = {"thank", "thanks", "great", "good job", "awesome", "nice", "love", "happy", "kind"}

    self.privacy_risky_terms = {"phone", "number", "address", "email", "location"}
    self.phone_pattern = re.compile(r"\b\d{5,}\b")
    self.us_phone_pattern = re.compile(r"\b\d{3}[- ]?\d{3}[- ]?\d{4}\b")
    self.email_pattern = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")

    self.wellbeing_negative = {"ignored", "alone", "sad", "upset", "anxious", "tired", "add me", "spam"}
    self.wellbeing_positive = {"balance", "break", "rest", "healthy", "good day", "fun", "enjoy"}

  def _score_kindness(self, text: str) -> int:
    lower = text.lower()
    score = 60
    if any(word in lower for word in self.negative_kindness):
      score -= 40
    if any(word in lower for word in self.positive_kindness):
      score += 20
    return clamp(score)

  def _score_privacy(self, text: str) -> int:
    lower = text.lower()
    score = 85
    if self.phone_pattern.search(text) or self.us_phone_pattern.search(text):
      score -= 50
    if self.email_pattern.search(text):
      score -= 50
    if any(term in lower for term in self.privacy_risky_terms):
      score -= 20
    return clamp(score)

  def _score_wellbeing(self, text: str) -> int:
    lower = text.lower()
    score = 70
    if any(word in lower for word in self.wellbeing_negative):
      score -= 25
    if any(word in lower for word in self.wellbeing_positive):
      score += 15
    return clamp(score)

  def score(self, text: str) -> Dict[str, Any]:
    kindness = self._score_kindness(text)
    privacy = self._score_privacy(text)
    wellbeing = self._score_wellbeing(text)

    explanation_parts = []
    if kindness < 50:
      explanation_parts.append("Detected unfriendly language.")
    elif kindness > 70:
      explanation_parts.append("Detected positive/supportive language.")

    if privacy < 70:
      explanation_parts.append("Detected potential personal information.")

    if wellbeing < 60:
      explanation_parts.append("Detected negative wellbeing indicators.")
    elif wellbeing > 80:
      explanation_parts.append("Detected healthy/balanced tone.")

    if not explanation_parts:
      explanation_parts.append("No strong signals detected; neutral assessment.")

    return {
      "kindness_score": kindness,
      "privacy_awareness_score": privacy,
      "digital_wellbeing_score": wellbeing,
      "explanation": " ".join(explanation_parts),
    }


if __name__ == "__main__":
  scorer = ChildDigitalInteractionScorer()

  test_samples = [
    "Thank you for helping me with my homework!",
    "Here is my phone number 0412345678, can you add me?",
    "Everyone ignored me in the group chat today.",
    "You are so dumb, why would you say that?",
    "I hope you're having a good day :)",
    "Text me at 555-123-9876",
  ]

  for sample in test_samples:
    scores = scorer.score(sample)
    print(json.dumps({"text": sample, "scores": scores}, indent=2))
    print("-" * 60)
