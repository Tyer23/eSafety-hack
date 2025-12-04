"""
Safety Analyzer - Combines all analysis components.
"""

import logging
from typing import Dict, Any, List
from ..models import (
    AnalysisResult, DetectedIssue, IntentType, EmotionType
)
from .toxicity import ToxicityAnalyzer
from .emotion import EmotionAnalyzer
from .patterns import PatternAnalyzer

logger = logging.getLogger(__name__)


class SafetyAnalyzer:
    """Multi-model ensemble for comprehensive message analysis."""
    
    def __init__(self, use_models: bool = True, device: str = "cpu"):
        logger.info(f"Initializing SafetyAnalyzer (use_models={use_models})")
        
        self.toxicity_analyzer = ToxicityAnalyzer(use_model=use_models, device=device)
        self.emotion_analyzer = EmotionAnalyzer(use_model=use_models, device=device)
        self.pattern_analyzer = PatternAnalyzer()
        
        self._use_models = use_models
    
    def analyze(self, text: str) -> AnalysisResult:
        logger.debug(f"Analyzing: {text[:50]}...")
        
        toxicity = self.toxicity_analyzer.analyze(text)
        emotion = self.emotion_analyzer.analyze(text)
        patterns = self.pattern_analyzer.analyze(text)
        
        issues = self._aggregate_issues(toxicity, patterns)
        intent = self._determine_intent(text, toxicity, emotion, patterns)
        
        return AnalysisResult(
            toxicity=toxicity,
            emotion=emotion,
            patterns=patterns,
            detected_issues=issues,
            intent=intent
        )
    
    def _aggregate_issues(self, toxicity, patterns) -> List[DetectedIssue]:
        issues = []
        
        # Check hate speech first (highest priority)
        if patterns.hate_speech_detected:
            issues.append(DetectedIssue.HATE_SPEECH)
        if patterns.profanity_detected:
            issues.append(DetectedIssue.PROFANITY)
        if patterns.threat_detected:
            issues.append(DetectedIssue.THREAT)
        if patterns.personal_attack_detected:
            issues.append(DetectedIssue.PERSONAL_ATTACK)
        if patterns.exclusion_detected:
            issues.append(DetectedIssue.EXCLUSION_LANGUAGE)
        if patterns.harsh_criticism_detected:
            issues.append(DetectedIssue.HARSH_CRITICISM)
        if patterns.dismissive_detected:
            issues.append(DetectedIssue.DISMISSIVE_TONE)
        
        if toxicity.label == "hate" and DetectedIssue.PERSONAL_ATTACK not in issues and DetectedIssue.HATE_SPEECH not in issues:
            issues.append(DetectedIssue.PERSONAL_ATTACK)
        
        return issues
    
    def _determine_intent(self, text, toxicity, emotion, patterns) -> IntentType:
        if patterns.hate_speech_detected:
            return IntentType.PERSONAL_ATTACK  # Hate speech is a form of attack
        if patterns.threat_detected:
            return IntentType.THREAT
        if patterns.personal_attack_detected or patterns.profanity_detected:
            return IntentType.PERSONAL_ATTACK
        if patterns.exclusion_detected:
            return IntentType.EXCLUSION
        if patterns.harsh_criticism_detected or patterns.dismissive_detected:
            return IntentType.CRITICISM
        if toxicity.score > 0.5:
            return IntentType.PERSONAL_ATTACK if emotion.primary_emotion == EmotionType.ANGER else IntentType.CRITICISM
        if emotion.primary_emotion == EmotionType.JOY:
            return IntentType.POSITIVE
        return IntentType.NEUTRAL
    
    def get_analyzer_info(self) -> Dict[str, Any]:
        return {
            "toxicity": self.toxicity_analyzer.get_model_info(),
            "emotion": self.emotion_analyzer.get_model_info(),
            "use_models": self._use_models,
        }
    
    def is_ready(self) -> bool:
        return True

