"""
Toxicity Analyzer - ML-based with robust fallback.
"""

import logging
import re
from typing import Dict, Any
from ..models import ToxicityResult

logger = logging.getLogger(__name__)


class ToxicityAnalyzer:
    """ML-based toxicity detection with comprehensive fallback."""
    
    # Using a public model that doesn't require authentication
    MODEL_ID = "unitary/toxic-bert"
    MODEL_VERSION = "toxic-bert-v1"
    
    # Comprehensive profanity and toxic word lists for fallback
    PROFANITY = {
        # F-word variations
        "fuck", "fucking", "fucked", "fucker", "fucks", "fck", "f*ck", "fuk", "fukk",
        "motherfucker", "motherfucking", "mf",
        "wtf", "stfu", "gtfo", "af",
        # S-word
        "shit", "shitty", "bullshit", "bs", "sh*t",
        # Other profanity
        "ass", "asshole", "bitch", "bastard", "damn", "dammit", "crap",
        "dick", "cock", "pussy", "whore", "slut", "dumbass",
        # Gaming/internet specific
        "noob", "n00b", "retard", "retarded",
    }
    
    TOXIC_PHRASES = {
        # Death/violence threats
        "go die", "kill yourself", "kys", "die", "go kill", 
        "hope you die", "wish you were dead", "drop dead",
        "kill you", "murder you", "beat you up",
        # Hate expressions
        "hate you", "fuck you", "fuck off", "screw you",
        "go to hell", "burn in hell",
        # Severe insults
        "piece of shit", "piece of crap", "worthless",
        "nobody likes you", "everyone hates you",
        "kill myself", "want to die",  # Self-harm detection
        # Hate speech patterns (backup detection)
        "hate muslims", "hate jews", "hate gays", "hate blacks", "hate asians",
        "don't like muslims", "don't like jews", "don't like gays", "don't like blacks", "don't like asians",
        "i don't like muslims", "i don't like jews", "i don't like gays", "i don't like blacks", "i don't like asians",
    }
    
    INSULTS = {
        "stupid", "idiot", "dumb", "moron", "loser", "ugly", "fat",
        "pathetic", "worthless", "useless", "trash", "garbage",
        "disgusting", "nasty", "gross", "freak", "weirdo",
        "suck", "sucks", "sucker", "lame", "cringe",
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
            
            logger.info(f"Loading toxicity model: {self.MODEL_ID}")
            
            self.tokenizer = AutoTokenizer.from_pretrained(self.MODEL_ID)
            self.model = AutoModelForSequenceClassification.from_pretrained(self.MODEL_ID)
            self.model.to(self.device)
            self.model.eval()
            
            self.model_loaded = True
            logger.info("Toxicity model loaded successfully")
            
        except Exception as e:
            logger.warning(f"Failed to load toxicity model: {e}")
            self.model_loaded = False
    
    def analyze(self, text: str) -> ToxicityResult:
        # Always check rules first for profanity (ML models sometimes miss explicit words)
        rule_result = self._analyze_with_rules(text)
        
        # If rule-based says it's safe (score 0.0 with high confidence), trust it over ML
        # This handles whitelisted friendly phrases that ML models might misclassify
        if rule_result.score == 0.0 and rule_result.confidence >= 0.9:
            return rule_result
        
        if self.model_loaded:
            ml_result = self._analyze_with_model(text)
            # Take the higher toxicity score between rule-based and ML
            # But if rule-based found explicit profanity/threats, prioritize that
            if rule_result.score > 0.3:  # Rule-based found something significant
                return rule_result
            # Otherwise, use ML but cap it if rule-based says it's safe
            if rule_result.score == 0.0:
                # ML might give false positives, so use lower of the two
                return rule_result if rule_result.score < ml_result.score else ml_result
            return ml_result if ml_result.score > rule_result.score else rule_result
        
        return rule_result
    
    def _analyze_with_model(self, text: str) -> ToxicityResult:
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
            
            # Handle different model output formats
            # toxic-bert outputs: [non-toxic, toxic]
            # Some models output multiple toxicity types
            if probs.shape[1] == 2:
                toxic_prob = probs[0][1].item()
            else:
                # For multi-label models, take max toxicity score
                toxic_prob = probs[0].max().item()
            
            non_toxic_prob = 1 - toxic_prob
            
            if toxic_prob > 0.6:
                label = "hate"
            elif toxic_prob > 0.3:
                label = "offensive"
            else:
                label = "neither"
            
            return ToxicityResult(
                score=toxic_prob,
                confidence=max(toxic_prob, non_toxic_prob),
                label=label
            )
            
        except Exception as e:
            logger.error(f"Model analysis failed: {e}")
            return self._analyze_with_rules(text)
    
    def _analyze_with_rules(self, text: str) -> ToxicityResult:
        """Comprehensive rule-based toxicity detection."""
        text_lower = text.lower().strip()
        
        # Whitelist: Common friendly phrases that should never be flagged
        FRIENDLY_PHRASES = [
            "how are you",
            "how are you doing",
            "what are you doing",
            "where are you",
            "how do you",
            "can you help",
            "will you",
            "would you",
            "thank you",
            "thanks",
            "please",
            "you're welcome",
            "nice to meet you",
            "good to see you",
            "how's it going",
            "what's up",
            "how's everything",
        ]
        
        # Check whitelist first - if it's a friendly phrase, return safe
        for phrase in FRIENDLY_PHRASES:
            if phrase in text_lower:
                return ToxicityResult(
                    score=0.0,
                    confidence=0.95,
                    label="neither"
                )
        
        # Remove special chars for word matching but keep original for phrase matching
        text_clean = re.sub(r'[^\w\s]', ' ', text_lower)
        words = set(text_clean.split())
        
        score = 0.0
        matched = []
        
        # Check profanity (high weight)
        profanity_found = words & self.PROFANITY
        if profanity_found:
            score += 0.5 + (len(profanity_found) * 0.1)
            matched.extend(profanity_found)
        
        # Check toxic phrases (very high weight)
        for phrase in self.TOXIC_PHRASES:
            if phrase in text_lower:
                score += 0.6
                matched.append(phrase)
        
        # Check insults (medium weight, especially if directed)
        # IMPORTANT: Only count if actual insult words are found
        insults_found = words & self.INSULTS
        if insults_found:
            # Higher score if "you" is present (directed insult)
            # But require both insult word AND "you" to be truly directed
            has_you = "you" in words or "your" in words or "u" in words
            if has_you:
                score += 0.4 + (len(insults_found) * 0.1)
            else:
                score += 0.2 + (len(insults_found) * 0.05)
            matched.extend(insults_found)
        
        # Cap at 1.0
        score = min(1.0, score)
        
        # Determine label
        if score > 0.6:
            label = "hate"
        elif score > 0.3:
            label = "offensive"
        else:
            label = "neither"
        
        confidence = 0.9 if matched else 0.5
        
        return ToxicityResult(
            score=score,
            confidence=confidence,
            label=label
        )
    
    def get_model_info(self) -> Dict[str, Any]:
        return {
            "model_id": self.MODEL_ID,
            "version": self.MODEL_VERSION,
            "model_loaded": self.model_loaded,
            "device": self.device,
        }

