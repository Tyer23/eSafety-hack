"""
Sexual Content Analyzer - Detects sexual content and age-inappropriate material.
"""

import logging
import re
from typing import Dict, List, Set
from ..models import PatternResult

logger = logging.getLogger(__name__)


class SexualContentAnalyzer:
    """Detects sexual content and age-inappropriate material."""
    
    # Explicit sexual terms
    EXPLICIT_SEXUAL_TERMS: Set[str] = {
        "sex", "sexual", "sexy", "porn", "pornography", "pornographic",
        "nude", "naked", "nudity", "masturbate", "masturbation",
        "orgasm", "orgasmic", "ejaculate", "ejaculation",
        "penis", "vagina", "breast", "breasts", "nipple", "nipples",
        "clitoris", "erection", "erect", "hard-on",
        "fuck", "fucking", "fucked", "fucker",  # Profanity but also sexual
        "dick", "cock", "pussy", "ass", "asshole",
        "whore", "slut", "prostitute", "hooker",
    }
    
    # Sexual phrases and requests
    SEXUAL_PHRASES: List[str] = [
        "have sex", "want sex", "need sex", "have sex with",
        "show me your", "send me nudes", "send nudes",
        "take off your", "take your clothes off",
        "let's have sex", "want to have sex", "going to have sex",
        "I'm horny", "I'm turned on", "you turn me on",
        "let's hook up", "want to hook up", "hook up with",
        "make out", "make out with", "kiss me", "touch me",
        "I want you", "I need you", "come to bed",
        "sext", "sexting", "dirty talk",
    ]
    
    # Suggestive/innuendo patterns
    SUGGESTIVE_PATTERNS: List[re.Pattern] = [
        re.compile(r"you're\s+(hot|sexy|attractive|beautiful|gorgeous)", re.IGNORECASE),
        re.compile(r"that's\s+(hot|sexy)", re.IGNORECASE),
        re.compile(r"i\s+(like|love|want)\s+your\s+(body|looks)", re.IGNORECASE),
        re.compile(r"you\s+look\s+(hot|sexy|good)", re.IGNORECASE),
    ]
    
    # Age-inappropriate content
    DRUG_ALCOHOL_TERMS: Set[str] = {
        "drunk", "alcohol", "beer", "wine", "liquor", "vodka", "whiskey",
        "drugs", "drug", "cocaine", "marijuana", "weed", "pot", "cannabis",
        "high", "stoned", "buzzed", "intoxicated",
        "smoke", "smoking", "cigarette", "cigar",
    }
    
    GAMBLING_TERMS: Set[str] = {
        "bet", "gambling", "casino", "poker", "blackjack",
        "lottery", "wager", "stakes",
    }
    
    # Whitelist - innocent uses
    INNOCENT_PHRASES: List[str] = [
        "I like that song",
        "I like that picture",
        "I like that game",
        "Can you help me",
        "I need help",
        "That's nice",
        "That's good",
        "I like you as a friend",
        "I like your drawing",
        "I like your idea",
    ]
    
    def __init__(self):
        self._compile_patterns()
    
    def _compile_patterns(self):
        """Compile regex patterns."""
        self.sexual_phrases_re = [re.compile(re.escape(phrase), re.IGNORECASE) 
                                  for phrase in self.SEXUAL_PHRASES]
    
    def analyze(self, text: str) -> Dict[str, bool]:
        """
        Analyze text for sexual content and age-inappropriate material.
        
        Returns:
            Dict with detection flags
        """
        text_lower = text.lower().strip()
        matched_patterns = []
        
        # Check whitelist first
        if self._is_innocent(text_lower):
            return {
                "sexual_content_detected": False,
                "age_inappropriate_detected": False,
                "matched_patterns": []
            }
        
        # Check for explicit sexual content
        sexual_detected = self._detect_explicit_sexual(text_lower, matched_patterns)
        
        # Check for suggestive content
        suggestive_detected = self._detect_suggestive(text_lower, matched_patterns)
        
        # Check for age-inappropriate content
        age_inappropriate = self._detect_age_inappropriate(text_lower, matched_patterns)
        
        return {
            "sexual_content_detected": sexual_detected or suggestive_detected,
            "age_inappropriate_detected": age_inappropriate,
            "matched_patterns": matched_patterns
        }
    
    def _is_innocent(self, text_lower: str) -> bool:
        """Check if text matches innocent phrases."""
        for phrase in self.INNOCENT_PHRASES:
            if phrase.lower() in text_lower:
                return True
        return False
    
    def _detect_explicit_sexual(self, text_lower: str, matched: List[str]) -> bool:
        """Detect explicit sexual content."""
        # Check explicit terms
        words = set(re.findall(r'\b\w+\b', text_lower))
        sexual_words = words & self.EXPLICIT_SEXUAL_TERMS
        
        if sexual_words:
            matched.extend([f"explicit_term:{word}" for word in sexual_words])
            return True
        
        # Check sexual phrases
        for phrase_re in self.sexual_phrases_re:
            if phrase_re.search(text_lower):
                matched.append(f"sexual_phrase:{phrase_re.pattern}")
                return True
        
        return False
    
    def _detect_suggestive(self, text_lower: str, matched: List[str]) -> bool:
        """Detect suggestive/innuendo content."""
        for pattern in self.SUGGESTIVE_PATTERNS:
            if pattern.search(text_lower):
                matched.append(f"suggestive:{pattern.pattern}")
                return True
        return False
    
    def _detect_age_inappropriate(self, text_lower: str, matched: List[str]) -> bool:
        """Detect age-inappropriate content (drugs, alcohol, gambling)."""
        words = set(re.findall(r'\b\w+\b', text_lower))
        
        # Check drug/alcohol terms
        drug_alcohol = words & self.DRUG_ALCOHOL_TERMS
        if drug_alcohol:
            matched.extend([f"drug_alcohol:{word}" for word in drug_alcohol])
            return True
        
        # Check gambling terms
        gambling = words & self.GAMBLING_TERMS
        if gambling:
            matched.extend([f"gambling:{word}" for word in gambling])
            return True
        
        return False

