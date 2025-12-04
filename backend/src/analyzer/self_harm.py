"""
Self-Harm Analyzer - Detects self-harm and suicide-related content.
"""

import logging
import re
from typing import Dict, List

logger = logging.getLogger(__name__)


class SelfHarmAnalyzer:
    """Detects self-harm and suicide-related content."""
    
    # Explicit self-harm phrases
    SELF_HARM_PATTERNS: List[re.Pattern] = [
        re.compile(r"i\s+(want|wish|need|'?m\s+going|'?ll|gonna)\s+to\s+(kill|hurt|harm)\s+myself", re.IGNORECASE),
        re.compile(r"i\s+(want|wish|'?m\s+going|'?ll|gonna)\s+to\s+die", re.IGNORECASE),
        re.compile(r"i\s+should\s+(kill|hurt|harm)\s+myself", re.IGNORECASE),
        re.compile(r"i\s+should\s+just\s+die", re.IGNORECASE),
        re.compile(r"i\s+want\s+to\s+end\s+(it|my life|everything)", re.IGNORECASE),
        re.compile(r"i\s+(want|wish)\s+i\s+was\s+dead", re.IGNORECASE),
        re.compile(r"i\s+(want|wish)\s+i\s+were\s+dead", re.IGNORECASE),
        re.compile(r"life\s+isn'?t\s+worth\s+(living|it)", re.IGNORECASE),
        re.compile(r"i\s+want\s+to\s+cut\s+(myself|my)", re.IGNORECASE),
        re.compile(r"i\s+(want|'?m\s+going|'?ll|gonna)\s+to\s+hurt\s+myself", re.IGNORECASE),
        re.compile(r"i\s+should\s+cut\s+(myself|my)", re.IGNORECASE),
        re.compile(r"killing\s+myself", re.IGNORECASE),
        re.compile(r"suicide", re.IGNORECASE),
        re.compile(r"commit\s+suicide", re.IGNORECASE),
        re.compile(r"end\s+my\s+life", re.IGNORECASE),
    ]
    
    # Suicide ideation patterns
    SUICIDE_IDEATION: List[re.Pattern] = [
        re.compile(r"i\s+don'?t\s+want\s+to\s+live", re.IGNORECASE),
        re.compile(r"i\s+hate\s+my\s+life", re.IGNORECASE),
        re.compile(r"nobody\s+(would|will)\s+miss\s+me", re.IGNORECASE),
        re.compile(r"everyone\s+(would|will)\s+be\s+better\s+without\s+me", re.IGNORECASE),
        re.compile(r"i'?m\s+better\s+off\s+dead", re.IGNORECASE),
    ]
    
    # Common idioms that should NOT trigger (false positives)
    INNOCENT_IDIOMS: List[re.Pattern] = [
        re.compile(r"i'?m\s+(so\s+)?tired\s+i\s+could\s+die", re.IGNORECASE),
        re.compile(r"that\s+(was|is)\s+killer", re.IGNORECASE),
        re.compile(r"i'?m\s+dying\s+(of|from)\s+(laughter|boredom)", re.IGNORECASE),
        re.compile(r"that\s+killed\s+me", re.IGNORECASE),
        re.compile(r"you\s+killed\s+it", re.IGNORECASE),  # Positive: "you did great"
        re.compile(r"that\s+was\s+to\s+die\s+for", re.IGNORECASE),  # Positive: "that was amazing"
    ]
    
    def analyze(self, text: str) -> Dict[str, any]:
        """
        Analyze text for self-harm content.
        
        Returns:
            Dict with self_harm_detected, severity, and matched_patterns
        """
        text_lower = text.lower()
        matched_patterns = []
        
        # Check innocent idioms first (avoid false positives)
        for idiom in self.INNOCENT_IDIOMS:
            if idiom.search(text_lower):
                return {
                    "self_harm_detected": False,
                    "severity": "none",
                    "matched_patterns": []
                }
        
        # Check explicit self-harm patterns
        for pattern in self.SELF_HARM_PATTERNS:
            if pattern.search(text_lower):
                matched_patterns.append(f"explicit:{pattern.pattern[:50]}")
                return {
                    "self_harm_detected": True,
                    "severity": "high",
                    "matched_patterns": matched_patterns
                }
        
        # Check suicide ideation
        for pattern in self.SUICIDE_IDEATION:
            if pattern.search(text_lower):
                matched_patterns.append(f"ideation:{pattern.pattern[:50]}")
                return {
                    "self_harm_detected": True,
                    "severity": "medium",
                    "matched_patterns": matched_patterns
                }
        
        return {
            "self_harm_detected": False,
            "severity": "none",
            "matched_patterns": []
        }

