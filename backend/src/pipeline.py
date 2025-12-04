"""
Production Processing Pipeline

Features:
- ML-based classification (toxicity, emotion)
- Hugging Face LLM feedback generation (with template fallback)
- Response caching
- Graceful fallbacks
"""

import time
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timezone

from .models import (
    ProcessingResult, ProcessingMetadata, Classification, 
    AnalysisResult, ToxicityResult, EmotionResult, PatternResult,
    EmotionType, IntentType
)
from .preprocessor import TextPreprocessor
from .analyzer import SafetyAnalyzer
from .classifier import DecisionEngine
from .feedback import FeedbackGenerator
from .cache import ResponseCache

logger = logging.getLogger(__name__)


class MessageProcessor:
    """
    Production message processor with Hugging Face LLM feedback.
    
    Uses ML classification models and Hugging Face LLM for personalized feedback.
    Falls back to templates if HF API is unavailable.
    """
    
    def __init__(
        self,
        use_models: bool = True,
        device: str = "cpu",
        feedback_mode: str = "hf_llm",
        age_range: str = "8-10",
        cache_enabled: bool = True,
        cache_max_size: int = 1000,
        hf_api_key: Optional[str] = None,
        hf_model_id: Optional[str] = None
    ):
        logger.info(f"Initializing MessageProcessor (models={use_models}, feedback={feedback_mode})")
        start = time.time()
        
        # Initialize components
        self.preprocessor = TextPreprocessor(max_length=500)
        self.analyzer = SafetyAnalyzer(use_models=use_models, device=device)
        self.decision_engine = DecisionEngine()
        self.feedback_generator = FeedbackGenerator(
            mode=feedback_mode,
            age_range=age_range,
            hf_api_key=hf_api_key,
            hf_model_id=hf_model_id
        )
        
        # Initialize cache
        self.cache_enabled = cache_enabled
        self.cache = ResponseCache(max_size=cache_max_size) if cache_enabled else None
        
        # Store config
        self._use_models = use_models
        self._device = device
        self._age_range = age_range
        self._feedback_mode = feedback_mode
        
        init_time = time.time() - start
        logger.info(f"MessageProcessor ready in {init_time:.2f}s")
    
    def process(
        self, 
        message: str, 
        age_range: Optional[str] = None,
        skip_cache: bool = False
    ) -> ProcessingResult:
        """
        Process a message through the full pipeline.
        
        Args:
            message: Message to analyze
            age_range: Override age range (default uses init value)
            skip_cache: Force fresh analysis even if cached
            
        Returns:
            ProcessingResult with classification, analysis, and feedback
        """
        start = time.time()
        effective_age = age_range or self._age_range
        
        # Validate input
        if not message or not message.strip():
            return self._error_result("Message cannot be empty")
        
        # Check cache
        if self.cache_enabled and self.cache and not skip_cache:
            cached = self.cache.get(message, effective_age)
            if cached:
                logger.debug("Cache hit")
                cached["metadata"]["processing_time_ms"] = 1
                cached["metadata"]["cache_hit"] = True
                return ProcessingResult(**cached)
        
        # Preprocess
        cleaned, preprocess_meta = self.preprocessor.process(message)
        
        # Analyze
        analysis = self.analyzer.analyze(cleaned)
        
        # Classify
        classification_result = self.decision_engine.classify(analysis)
        
        # Generate feedback if needed
        feedback, educational, used_llm = None, None, False
        if classification_result.classification != Classification.GREEN:
            if effective_age != self._age_range:
                self.feedback_generator.set_age_range(effective_age)
            
            feedback, educational, used_llm = self.feedback_generator.generate(
                message,
                classification_result.classification,
                analysis
            )
            
            if effective_age != self._age_range:
                self.feedback_generator.set_age_range(self._age_range)
        
        # Build result
        processing_time = (time.time() - start) * 1000
        
        result = ProcessingResult(
            success=True,
            classification=classification_result.classification,
            confidence=classification_result.confidence,
            analysis=analysis,
            feedback=feedback,
            educational=educational,
            metadata=ProcessingMetadata(
                processing_time_ms=processing_time,
                model_versions=self._get_model_versions(),
                timestamp=datetime.now(timezone.utc),
                used_llm=used_llm,
                fallback_used=not self.analyzer.toxicity_analyzer.model_loaded
            )
        )
        
        # Cache result
        if self.cache_enabled and self.cache:
            self.cache.set(message, result.model_dump(), effective_age)
        
        return result
    
    def quick_classify(self, message: str) -> Classification:
        """Quick classification without feedback generation."""
        cleaned, _ = self.preprocessor.process(message)
        analysis = self.analyzer.analyze(cleaned)
        return self.decision_engine.classify(analysis).classification
    
    def batch_process(
        self, 
        messages: list,
        age_range: Optional[str] = None
    ) -> list:
        """Process multiple messages."""
        return [self.process(msg, age_range) for msg in messages]
    
    def _error_result(self, error: str) -> ProcessingResult:
        """Create error result."""
        dummy = AnalysisResult(
            toxicity=ToxicityResult(score=0, confidence=0, label="error"),
            emotion=EmotionResult(
                primary_emotion=EmotionType.NEUTRAL,
                scores={},
                intensity=0
            ),
            patterns=PatternResult(),
            detected_issues=[],
            intent=IntentType.NEUTRAL
        )
        return ProcessingResult(
            success=False,
            classification=Classification.GREEN,
            confidence=0,
            analysis=dummy,
            metadata=ProcessingMetadata(processing_time_ms=0, model_versions={}),
            error_message=error
        )
    
    def _get_model_versions(self) -> Dict[str, str]:
        """Get model version info."""
        return {
            "toxicity": "toxic-bert-v1" if self.analyzer.toxicity_analyzer.model_loaded else "rules-v1",
            "emotion": "distilbert-emotion-v2" if self.analyzer.emotion_analyzer.model_loaded else "rules-v1",
            "feedback": "templates-v1"
        }
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get comprehensive system status."""
        status = {
            "analyzer": self.analyzer.get_analyzer_info(),
            "feedback": self.feedback_generator.get_status(),
            "settings": {
                "use_models": self._use_models,
                "device": self._device,
                "age_range": self._age_range,
                "feedback_mode": self._feedback_mode
            },
            "cache": self.cache.get_stats() if self.cache else {"enabled": False},
            "ready": True
        }
        return status
    
    def set_age_range(self, age_range: str):
        """Update default age range."""
        if age_range not in ["8-10", "11-13"]:
            raise ValueError("Age range must be '8-10' or '11-13'")
        self._age_range = age_range
        self.feedback_generator.set_age_range(age_range)
    
    def clear_cache(self):
        """Clear the response cache."""
        if self.cache:
            self.cache.clear()


