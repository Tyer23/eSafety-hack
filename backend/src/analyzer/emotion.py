"""
Emotion Analyzer - ML-based emotion detection.
"""

import logging
from typing import Dict, List
from ..models import EmotionResult, EmotionType

logger = logging.getLogger(__name__)


class EmotionAnalyzer:
    """ML-based emotion detection with fallback."""
    
    MODEL_ID = "bhadresh-savani/distilbert-base-uncased-emotion"
    MODEL_VERSION = "distilbert-emotion-v2"
    
    EMOTION_KEYWORDS: Dict[EmotionType, List[str]] = {
        EmotionType.ANGER: [
            "hate", "angry", "mad", "furious", "annoyed", "stupid",
            "idiot", "dumb", "shut up", "worst", "terrible", "fuck", "fucking"
        ],
        EmotionType.SADNESS: [
            "sad", "crying", "hurt", "lonely", "miss", "sorry", "upset"
        ],
        EmotionType.FEAR: [
            "scared", "afraid", "worried", "nervous", "anxious"
        ],
        EmotionType.JOY: [
            "happy", "love", "great", "awesome", "amazing", "fun", "yay", "nice"
        ],
        EmotionType.FRUSTRATION: [
            "frustrated", "stuck", "can't", "won't work", "ugh", "again"
        ]
    }
    
    LABEL_MAP = {
        "anger": EmotionType.ANGER,
        "sadness": EmotionType.SADNESS,
        "fear": EmotionType.FEAR,
        "joy": EmotionType.JOY,
        "surprise": EmotionType.SURPRISE,
        "love": EmotionType.JOY,
    }
    
    def __init__(self, use_model: bool = True, device: str = "cpu"):
        self.device = device
        self.model = None
        self.tokenizer = None
        self.model_loaded = False
        
        if use_model:
            self._load_model()
    
    def _load_model(self) -> None:
        try:
            from transformers import AutoModelForSequenceClassification, AutoTokenizer
            
            logger.info(f"Loading emotion model: {self.MODEL_ID}")
            
            self.tokenizer = AutoTokenizer.from_pretrained(self.MODEL_ID)
            self.model = AutoModelForSequenceClassification.from_pretrained(self.MODEL_ID)
            self.model.to(self.device)
            self.model.eval()
            
            self.model_loaded = True
            logger.info("Emotion model loaded successfully")
            
        except Exception as e:
            logger.warning(f"Failed to load emotion model: {e}")
            self.model_loaded = False
    
    def analyze(self, text: str) -> EmotionResult:
        if self.model_loaded:
            return self._analyze_with_model(text)
        return self._analyze_with_rules(text)
    
    def _analyze_with_model(self, text: str) -> EmotionResult:
        try:
            import torch
            import torch.nn.functional as F
            
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True, 
                                    max_length=512, padding=True)
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = F.softmax(outputs.logits, dim=-1)
            
            labels = self.model.config.id2label
            scores = {}
            for idx, prob in enumerate(probs[0]):
                label = labels[idx]
                emotion_type = self.LABEL_MAP.get(label, EmotionType.NEUTRAL)
                scores[emotion_type.value] = prob.item()
            
            max_idx = probs[0].argmax().item()
            max_label = labels[max_idx]
            primary_emotion = self.LABEL_MAP.get(max_label, EmotionType.NEUTRAL)
            intensity = probs[0].max().item()
            
            return EmotionResult(
                primary_emotion=primary_emotion,
                scores=scores,
                intensity=intensity
            )
            
        except Exception as e:
            logger.error(f"Model analysis failed: {e}")
            return self._analyze_with_rules(text)
    
    def _analyze_with_rules(self, text: str) -> EmotionResult:
        text_lower = text.lower()
        scores: Dict[str, float] = {}
        total_matches = 0
        
        for emotion_type, keywords in self.EMOTION_KEYWORDS.items():
            matches = sum(1 for kw in keywords if kw in text_lower)
            scores[emotion_type.value] = matches
            total_matches += matches
        
        if total_matches > 0:
            for key in scores:
                scores[key] = scores[key] / (total_matches + 1)
            primary_emotion = max(EmotionType, key=lambda e: scores.get(e.value, 0.0))
            intensity = min(1.0, scores[primary_emotion.value] + 0.3)
        else:
            scores[EmotionType.NEUTRAL.value] = 1.0
            primary_emotion = EmotionType.NEUTRAL
            intensity = 0.3
        
        return EmotionResult(primary_emotion=primary_emotion, scores=scores, intensity=intensity)
    
    def get_model_info(self) -> Dict:
        return {
            "model_id": self.MODEL_ID,
            "version": self.MODEL_VERSION,
            "model_loaded": self.model_loaded,
        }

