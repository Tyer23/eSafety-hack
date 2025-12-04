"""
Decision Engine - Classifies messages as GREEN/YELLOW/RED.
"""

import logging
from typing import List
from dataclasses import dataclass
from ..models import AnalysisResult, Classification, DetectedIssue, EmotionType

logger = logging.getLogger(__name__)


@dataclass
class ClassificationResult:
    classification: Classification
    confidence: float
    reasons: List[str]
    feedback_type: str


class DecisionEngine:
    """Determines message classification."""
    
    # Issues that immediately trigger RED (critical/severe)
    RED_FLAGS = {
        DetectedIssue.SELF_HARM,  # Highest priority - immediate danger
        DetectedIssue.HATE_SPEECH,  # Hate speech is always RED
        DetectedIssue.SEXUAL_CONTENT,  # Sexual content is always RED for kids
        DetectedIssue.THREAT,  # Threats are always RED
        DetectedIssue.VIOLENCE,  # Violence is always RED
        DetectedIssue.PROFANITY,  # Profanity is RED
        DetectedIssue.PERSONAL_ATTACK,  # Personal attacks are RED
        DetectedIssue.BULLYING,  # Bullying is RED
    }
    
    # Issues that trigger YELLOW
    YELLOW_FLAGS = {
        DetectedIssue.HARSH_CRITICISM,
        DetectedIssue.EXCLUSION_LANGUAGE,
        DetectedIssue.DISMISSIVE_TONE,
        DetectedIssue.NAME_CALLING,
    }
    
    def classify(self, analysis: AnalysisResult) -> ClassificationResult:
        reasons = []
        
        # Check for immediate RED flags (profanity, threats, attacks)
        for issue in analysis.detected_issues:
            if issue in self.RED_FLAGS:
                reasons.append(f"Detected: {issue.value}")
        
        if reasons:
            return ClassificationResult(
                classification=Classification.RED,
                confidence=0.95,
                reasons=reasons,
                feedback_type="urgent_coaching"
            )
        
        # Check toxicity score
        if analysis.toxicity.score > 0.6:
            reasons.append(f"High toxicity: {analysis.toxicity.score:.2f}")
            return ClassificationResult(
                classification=Classification.RED,
                confidence=analysis.toxicity.confidence,
                reasons=reasons,
                feedback_type="urgent_coaching"
            )
        
        # Check for YELLOW flags
        for issue in analysis.detected_issues:
            if issue in self.YELLOW_FLAGS:
                reasons.append(f"Detected: {issue.value}")
        
        # Age-inappropriate content should be at least YELLOW
        if DetectedIssue.AGE_INAPPROPRIATE in analysis.detected_issues:
            reasons.append("Age-inappropriate content detected")
            return ClassificationResult(
                classification=Classification.YELLOW,
                confidence=0.8,
                reasons=reasons,
                feedback_type="gentle_suggestion"
            )
        
        if reasons or analysis.toxicity.score > 0.3:
            if not reasons:
                reasons.append(f"Moderate concerns: {analysis.toxicity.score:.2f}")
            return ClassificationResult(
                classification=Classification.YELLOW,
                confidence=0.75,
                reasons=reasons,
                feedback_type="gentle_suggestion"
            )
        
        # Default to GREEN
        return ClassificationResult(
            classification=Classification.GREEN,
            confidence=0.9,
            reasons=["Message appears constructive"],
            feedback_type="none"
        )

