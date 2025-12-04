"""
Hate Speech Analyzer - Proper hate speech detection using ML models and patterns.
"""

import logging
import re
from typing import Dict, List, Optional
from ..models import ToxicityResult

logger = logging.getLogger(__name__)


class HateSpeechAnalyzer:
    """Detects hate speech using ML models and pattern matching."""
    
    # Primary model for hate speech detection
    HATE_SPEECH_MODEL_ID = "cardiffnlp/twitter-roberta-base-hate-latest"
    
    # Fallback model
    FALLBACK_MODEL_ID = "unitary/toxic-bert"
    
    # Explicit hate speech patterns (comprehensive)
    HATE_SPEECH_PATTERNS: List[re.Pattern] = [
        # Racial hate speech
        re.compile(r"i\s+hate\s+(blacks?|whites?|asians?|hispanics?|latinos?)", re.IGNORECASE),
        re.compile(r"(blacks?|whites?|asians?|hispanics?|latinos?)\s+(are|is)\s+(stupid|bad|evil|disgusting|inferior)", re.IGNORECASE),
        re.compile(r"all\s+(blacks?|whites?|asians?|hispanics?|latinos?)\s+", re.IGNORECASE),
        
        # Religious hate speech
        re.compile(r"i\s+hate\s+(muslims?|jews?|christians?|hindus?)", re.IGNORECASE),
        re.compile(r"(muslims?|jews?|christians?|hindus?)\s+(are|is)\s+(terrorists?|evil|bad)", re.IGNORECASE),
        re.compile(r"(muslims?|jews?|christians?|hindus?)\s+control\s+(everything|the world|all)", re.IGNORECASE),
        re.compile(r"all\s+(muslims?|jews?|christians?|hindus?)\s+", re.IGNORECASE),
        
        # LGBTQ+ hate speech
        re.compile(r"i\s+hate\s+(gays?|lesbians?|trans|queers?|homosexuals?)", re.IGNORECASE),
        re.compile(r"(gays?|lesbians?|trans|queers?|homosexuals?)\s+(are|is)\s+(disgusting|wrong|bad|freaks?)", re.IGNORECASE),
        re.compile(r"(gays?|lesbians?|trans|queers?)\s+should\s+(die|burn|go away)", re.IGNORECASE),
        re.compile(r"trans\s+people\s+(are|is)\s+(freaks?|weird|disgusting)", re.IGNORECASE),
        
        # Immigrant/refugee hate speech
        re.compile(r"i\s+hate\s+(immigrants?|refugees?|foreigners?)", re.IGNORECASE),
        re.compile(r"(immigrants?|refugees?|foreigners?)\s+(are|is)\s+(bad|evil|taking over)", re.IGNORECASE),
        
        # General hate patterns
        re.compile(r"i\s+hate\s+(all|every)\s+(minorities|people of color)", re.IGNORECASE),
        re.compile(r"(minorities|people of color)\s+(are|is)\s+(bad|evil|inferior)", re.IGNORECASE),
        
        # Coded hate speech
        re.compile(r"those\s+people\s+(are|is)\s+(ruining|destroying)", re.IGNORECASE),
        re.compile(r"they\s+don'?t\s+belong\s+here", re.IGNORECASE),
        re.compile(r"we\s+need\s+to\s+keep\s+(our|the)\s+(country|place)\s+pure", re.IGNORECASE),
    ]
    
    def __init__(self, use_model: bool = True, device: str = "cpu"):
        self.device = device
        self.model = None
        self.tokenizer = None
        self.model_loaded = False
        self._use_model = use_model
        
        if use_model:
            self._load_model()
    
    def _load_model(self) -> None:
        """Load hate speech detection model."""
        try:
            from transformers import AutoModelForSequenceClassification, AutoTokenizer
            
            logger.info(f"Loading hate speech model: {self.HATE_SPEECH_MODEL_ID}")
            
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(self.HATE_SPEECH_MODEL_ID)
                self.model = AutoModelForSequenceClassification.from_pretrained(self.HATE_SPEECH_MODEL_ID)
                self.model.to(self.device)
                self.model.eval()
                self.model_loaded = True
                logger.info("Hate speech model loaded successfully")
            except Exception as e:
                logger.warning(f"Failed to load primary hate speech model: {e}")
                logger.info(f"Trying fallback model: {self.FALLBACK_MODEL_ID}")
                # Try fallback
                self.tokenizer = AutoTokenizer.from_pretrained(self.FALLBACK_MODEL_ID)
                self.model = AutoModelForSequenceClassification.from_pretrained(self.FALLBACK_MODEL_ID)
                self.model.to(self.device)
                self.model.eval()
                self.model_loaded = True
                logger.info("Fallback model loaded successfully")
                
        except Exception as e:
            logger.warning(f"Failed to load hate speech models: {e}")
            self.model_loaded = False
    
    def analyze(self, text: str) -> Dict[str, any]:
        """
        Analyze text for hate speech.
        
        Returns:
            Dict with hate_speech_detected, confidence, and matched_patterns
        """
        # Always check patterns first (fast and reliable for explicit content)
        pattern_result = self._analyze_with_patterns(text)
        
        if not self.model_loaded:
            return pattern_result
        
        # Use ML model for more nuanced detection
        ml_result = self._analyze_with_model(text)
        
        # Combine results: if either detects hate speech, flag it
        hate_speech_detected = pattern_result["hate_speech_detected"] or ml_result["hate_speech_detected"]
        confidence = max(pattern_result["confidence"], ml_result["confidence"])
        matched_patterns = pattern_result["matched_patterns"] + ml_result.get("matched_patterns", [])
        
        return {
            "hate_speech_detected": hate_speech_detected,
            "confidence": confidence,
            "matched_patterns": matched_patterns
        }
    
    def _analyze_with_patterns(self, text: str) -> Dict[str, any]:
        """Analyze using regex patterns."""
        text_lower = text.lower()
        matched_patterns = []
        
        for pattern in self.HATE_SPEECH_PATTERNS:
            if pattern.search(text):
                matched_patterns.append(f"pattern:{pattern.pattern[:50]}")
        
        return {
            "hate_speech_detected": len(matched_patterns) > 0,
            "confidence": 0.9 if matched_patterns else 0.5,
            "matched_patterns": matched_patterns
        }
    
    def _analyze_with_model(self, text: str) -> Dict[str, any]:
        """Analyze using ML model."""
        try:
            import torch
            import torch.nn.functional as F
            
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding=True
            )
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = F.softmax(outputs.logits, dim=-1)
            
            # Get model labels
            labels = self.model.config.id2label
            max_idx = probs[0].argmax().item()
            max_label = labels[max_idx].lower()
            max_prob = probs[0][max_idx].item()
            
            # Check if it's hate speech
            # Model outputs: hate, offensive, or neither
            is_hate = max_label in ["hate", "hateful", "hate_speech"]
            is_offensive = max_label in ["offensive", "toxic"]
            
            # Consider it hate speech if:
            # 1. Label is explicitly "hate"
            # 2. Or label is "offensive" with high confidence (>0.7)
            hate_speech_detected = is_hate or (is_offensive and max_prob > 0.7)
            
            return {
                "hate_speech_detected": hate_speech_detected,
                "confidence": max_prob,
                "matched_patterns": [f"model:{max_label}"]
            }
            
        except Exception as e:
            logger.error(f"Model analysis failed: {e}")
            return {
                "hate_speech_detected": False,
                "confidence": 0.0,
                "matched_patterns": []
            }
    
    def get_model_info(self) -> Dict[str, any]:
        """Get model information."""
        return {
            "model_id": self.HATE_SPEECH_MODEL_ID if self.model_loaded else None,
            "model_loaded": self.model_loaded,
            "device": self.device,
        }

