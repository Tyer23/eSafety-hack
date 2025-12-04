"""
Main Feedback Generator

Uses Hugging Face LLM for personalized feedback, with template fallback.
"""

import logging
from typing import Optional, Tuple
from ..models import Classification, AnalysisResult, Feedback, Educational
from .templates import TemplateGenerator
from .hf_llm_generator import HuggingFaceLLMGenerator

logger = logging.getLogger(__name__)


class FeedbackGenerator:
    """
    Feedback generator using Hugging Face LLM with template fallback.
    
    Primary mode: Hugging Face LLM for personalized feedback
    Fallback: Template-based feedback if HF API unavailable
    """
    
    def __init__(
        self,
        mode: str = "hf_llm",
        age_range: str = "8-10",
        hf_api_key: Optional[str] = None,
        hf_model_id: Optional[str] = None
    ):
        self.mode = mode
        self.age_range = age_range
        self.template_generator = TemplateGenerator(age_range=age_range)
        
        # Initialize HF LLM (primary mode)
        self.hf_llm = None
        if mode == "hf_llm":
            self.hf_llm = HuggingFaceLLMGenerator(
                api_key=hf_api_key,
                model_id=hf_model_id,
                age_range=age_range
            )
            if not self.hf_llm.is_available():
                logger.warning("HF API key not available, will use template fallback")
        
        logger.info(f"FeedbackGenerator initialized (mode={mode}, age_range={age_range})")
    
    def generate(
        self,
        message: str,
        classification: Classification,
        analysis: AnalysisResult
    ) -> Tuple[Optional[Feedback], Optional[Educational], bool]:
        """
        Generate feedback and educational content.
        
        Returns:
            Tuple of (Feedback, Educational, used_llm)
        """
        if classification == Classification.GREEN:
            return None, None, False
        
        feedback = None
        educational = None
        used_llm = False
        
        # Try HF LLM first (primary mode)
        if self.mode == "hf_llm" and self.hf_llm and self.hf_llm.is_available():
            try:
                feedback = self.hf_llm.generate(message, classification, analysis)
                if feedback:
                    # Validate feedback doesn't contain profanity
                    if self._validate_feedback(feedback):
                        # Filter out alternatives that are too similar to original message
                        feedback.suggested_alternatives = self._filter_original_message(
                            feedback.suggested_alternatives, message
                        )
                        # If all alternatives were filtered, use template fallback
                        if not feedback.suggested_alternatives:
                            logger.warning("All LLM alternatives were too similar to original, falling back to templates")
                            feedback = None
                        else:
                            educational = self.hf_llm.generate_educational(classification, analysis)
                            used_llm = True
                            logger.debug("Used Hugging Face LLM for feedback")
                    else:
                        logger.warning("HF LLM feedback contained profanity, falling back to templates")
                        feedback = None
            except Exception as e:
                logger.warning(f"HF LLM generation failed, using templates: {e}")
        
        # Fall back to templates if HF LLM unavailable or failed
        if feedback is None:
            feedback = self.template_generator.generate(message, classification, analysis)
            if feedback and feedback.suggested_alternatives:
                feedback.suggested_alternatives = self._filter_original_message(
                    feedback.suggested_alternatives, message
                )
            educational = self.template_generator.generate_educational(classification, analysis)
            logger.debug("Used templates for feedback")
        
        return feedback, educational, used_llm
    
    def _validate_feedback(self, feedback: Feedback) -> bool:
        """Validate that feedback doesn't contain profanity."""
        from ..analyzer.patterns import PatternAnalyzer
        import re
        
        # Check main message
        profanity_patterns = PatternAnalyzer.PROFANITY_PATTERNS
        text_lower = feedback.main_message.lower()
        
        for pattern in profanity_patterns:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return False
        
        # Check alternatives
        for alt in feedback.suggested_alternatives:
            alt_lower = alt.lower()
            for pattern in profanity_patterns:
                if re.search(pattern, alt_lower, re.IGNORECASE):
                    return False
        
        # Check tip
        if feedback.communication_tip:
            tip_lower = feedback.communication_tip.lower()
            for pattern in profanity_patterns:
                if re.search(pattern, tip_lower, re.IGNORECASE):
                    return False
        
        return True
    
    def _filter_original_message(self, alternatives: list, original_message: str) -> list:
        """Filter out alternatives that are too similar to the original message."""
        import difflib
        
        original_lower = original_message.lower().strip()
        filtered = []
        
        for alt in alternatives:
            alt_lower = alt.lower().strip()
            
            # Skip if it's exactly the same (case-insensitive)
            if alt_lower == original_lower:
                continue
            
            # Skip if it's very similar (high similarity ratio)
            similarity = difflib.SequenceMatcher(None, original_lower, alt_lower).ratio()
            if similarity > 0.7:  # More than 70% similar
                continue
            
            # Skip if the alternative contains the original message or vice versa
            if original_lower in alt_lower or alt_lower in original_lower:
                # But allow if it's just a small part (like a word)
                original_words = set(original_lower.split())
                alt_words = set(alt_lower.split())
                # If more than 50% of words overlap, skip it
                if len(original_words) > 0 and len(original_words & alt_words) / len(original_words) > 0.5:
                    continue
            
            filtered.append(alt)
        
        return filtered
    
    def set_age_range(self, age_range: str):
        """Update age range."""
        self.age_range = age_range
        self.template_generator = TemplateGenerator(age_range=age_range)
        if self.hf_llm:
            self.hf_llm.age_range = age_range
    
    def get_status(self) -> dict:
        """Get generator status."""
        status = {
            "mode": self.mode,
            "age_range": self.age_range,
            "template_available": True
        }
        
        if self.hf_llm:
            status["hf_llm"] = self.hf_llm.get_status()
        else:
            status["hf_llm"] = {"available": False}
        
        return status
