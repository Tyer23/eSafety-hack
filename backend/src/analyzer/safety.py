"""
Safety Analyzer - Combines all analysis components.
"""

import logging
from typing import Dict, Any, List
from ..models import (
    AnalysisResult, DetectedIssue, IntentType, EmotionType, PatternResult
)
from .toxicity import ToxicityAnalyzer
from .emotion import EmotionAnalyzer
from .patterns import PatternAnalyzer
from .hate_speech import HateSpeechAnalyzer
from .sexual_content import SexualContentAnalyzer
from .self_harm import SelfHarmAnalyzer
from .bullying import BullyingAnalyzer

logger = logging.getLogger(__name__)


class SafetyAnalyzer:
    """Multi-model ensemble for comprehensive message analysis."""
    
    def __init__(self, use_models: bool = True, device: str = "cpu"):
        logger.info(f"Initializing SafetyAnalyzer (use_models={use_models})")
        
        self.toxicity_analyzer = ToxicityAnalyzer(use_model=use_models, device=device)
        self.emotion_analyzer = EmotionAnalyzer(use_model=use_models, device=device)
        self.pattern_analyzer = PatternAnalyzer()
        self.hate_speech_analyzer = HateSpeechAnalyzer(use_model=use_models, device=device)
        self.sexual_content_analyzer = SexualContentAnalyzer()
        self.self_harm_analyzer = SelfHarmAnalyzer()
        self.bullying_analyzer = BullyingAnalyzer()
        
        self._use_models = use_models
    
    def analyze(self, text: str) -> AnalysisResult:
        logger.debug(f"Analyzing: {text[:50]}...")
        
        toxicity = self.toxicity_analyzer.analyze(text)
        emotion = self.emotion_analyzer.analyze(text)
        patterns = self.pattern_analyzer.analyze(text)
        
        # Run new analyzers (order matters - self-harm before threat patterns)
        self_harm_result = self.self_harm_analyzer.analyze(text)
        hate_speech_result = self.hate_speech_analyzer.analyze(text)
        sexual_content_result = self.sexual_content_analyzer.analyze(text)
        bullying_result = self.bullying_analyzer.analyze(text)
        
        # Merge results into PatternResult
        enhanced_patterns = self._merge_pattern_results(
            patterns, hate_speech_result, sexual_content_result,
            self_harm_result, bullying_result
        )
        
        issues = self._aggregate_issues(toxicity, enhanced_patterns)
        intent = self._determine_intent(text, toxicity, emotion, enhanced_patterns)
        
        return AnalysisResult(
            toxicity=toxicity,
            emotion=emotion,
            patterns=enhanced_patterns,
            detected_issues=issues,
            intent=intent
        )
    
    def _merge_pattern_results(
        self, 
        base_patterns: PatternResult,
        hate_speech_result: Dict,
        sexual_content_result: Dict,
        self_harm_result: Dict,
        bullying_result: Dict
    ) -> PatternResult:
        """Merge all analyzer results into PatternResult."""
        # Update base patterns with new detections
        base_patterns.hate_speech_detected = base_patterns.hate_speech_detected or hate_speech_result.get("hate_speech_detected", False)
        base_patterns.sexual_content_detected = sexual_content_result.get("sexual_content_detected", False)
        base_patterns.self_harm_detected = self_harm_result.get("self_harm_detected", False)
        base_patterns.bullying_detected = bullying_result.get("bullying_detected", False)
        base_patterns.age_inappropriate_detected = sexual_content_result.get("age_inappropriate_detected", False)
        
        # If self-harm detected, override threat detection (self-harm is more specific)
        if base_patterns.self_harm_detected:
            base_patterns.threat_detected = False  # Don't double-count as threat
        
        # Merge matched patterns
        all_matched = list(base_patterns.matched_patterns)
        all_matched.extend(hate_speech_result.get("matched_patterns", []))
        all_matched.extend(sexual_content_result.get("matched_patterns", []))
        all_matched.extend(self_harm_result.get("matched_patterns", []))
        all_matched.extend(bullying_result.get("matched_patterns", []))
        base_patterns.matched_patterns = all_matched
        
        return base_patterns
    
    def _aggregate_issues(self, toxicity, patterns) -> List[DetectedIssue]:
        issues = []
        
        # Critical issues (highest priority) - always RED
        if patterns.self_harm_detected:
            issues.append(DetectedIssue.SELF_HARM)
        if patterns.hate_speech_detected:
            issues.append(DetectedIssue.HATE_SPEECH)
        if patterns.sexual_content_detected:
            issues.append(DetectedIssue.SEXUAL_CONTENT)
        # Check threat and violence (but not if self-harm already detected)
        if patterns.threat_detected and not patterns.self_harm_detected:
            issues.append(DetectedIssue.THREAT)
        if patterns.violence_detected:
            # Violence can also be a threat, but prioritize violence flag
            if DetectedIssue.THREAT not in issues:
                issues.append(DetectedIssue.VIOLENCE)
            else:
                # If both detected, keep threat (more specific)
                pass
        
        # Serious issues - usually RED
        if patterns.profanity_detected:
            issues.append(DetectedIssue.PROFANITY)
        if patterns.personal_attack_detected:
            issues.append(DetectedIssue.PERSONAL_ATTACK)
        if patterns.bullying_detected:
            issues.append(DetectedIssue.BULLYING)
        
        # Moderate issues - usually YELLOW
        if patterns.exclusion_detected:
            issues.append(DetectedIssue.EXCLUSION_LANGUAGE)
        if patterns.harsh_criticism_detected:
            issues.append(DetectedIssue.HARSH_CRITICISM)
        if patterns.dismissive_detected:
            issues.append(DetectedIssue.DISMISSIVE_TONE)
        
        # Age-inappropriate content
        if patterns.age_inappropriate_detected:
            issues.append(DetectedIssue.AGE_INAPPROPRIATE)
        
        # Fallback: if toxicity model says "hate" but we haven't flagged it
        if toxicity.label == "hate" and DetectedIssue.HATE_SPEECH not in issues:
            if DetectedIssue.PERSONAL_ATTACK not in issues:
                issues.append(DetectedIssue.PERSONAL_ATTACK)
        
        return issues
    
    def _determine_intent(self, text, toxicity, emotion, patterns) -> IntentType:
        # Highest priority intents
        if patterns.self_harm_detected:
            return IntentType.THREAT  # Self-harm is a threat to self
        if patterns.hate_speech_detected:
            return IntentType.PERSONAL_ATTACK  # Hate speech is a form of attack
        if patterns.threat_detected or patterns.violence_detected:
            return IntentType.THREAT
        if patterns.sexual_content_detected:
            return IntentType.PERSONAL_ATTACK  # Sexual content directed at someone
        if patterns.personal_attack_detected or patterns.profanity_detected:
            return IntentType.PERSONAL_ATTACK
        if patterns.bullying_detected:
            return IntentType.PERSONAL_ATTACK  # Bullying is a form of attack
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
            "hate_speech": self.hate_speech_analyzer.get_model_info(),
            "use_models": self._use_models,
        }
    
    def is_ready(self) -> bool:
        return True

