"""
Bullying Analyzer - Detects bullying and cyberbullying patterns.
"""

import logging
import re
from typing import Dict, List

logger = logging.getLogger(__name__)


class BullyingAnalyzer:
    """Detects bullying and cyberbullying patterns."""
    
    # Cyberbullying patterns
    CYBERBULLYING_PATTERNS: List[re.Pattern] = [
        re.compile(r"nobody\s+(likes|loves|wants)\s+you", re.IGNORECASE),
        re.compile(r"everyone\s+(hates|dislikes)\s+you", re.IGNORECASE),
        re.compile(r"no\s+one\s+(likes|loves|wants)\s+you", re.IGNORECASE),
        re.compile(r"you\s+have\s+no\s+friends", re.IGNORECASE),
        re.compile(r"you'?re\s+such\s+a\s+loser", re.IGNORECASE),
        re.compile(r"why\s+are\s+you\s+so\s+(ugly|weird|stupid|dumb)", re.IGNORECASE),
        re.compile(r"you'?re\s+so\s+(ugly|weird|annoying|pathetic)", re.IGNORECASE),
        re.compile(r"everyone\s+thinks\s+you'?re\s+(weird|stupid|ugly)", re.IGNORECASE),
        re.compile(r"you'?re\s+the\s+worst", re.IGNORECASE),
        re.compile(r"nobody\s+cares\s+about\s+you", re.IGNORECASE),
    ]
    
    # Exclusion bullying
    EXCLUSION_PATTERNS: List[re.Pattern] = [
        re.compile(r"you\s+can'?t\s+(sit|play|join|come)\s+with\s+(us|me)", re.IGNORECASE),
        re.compile(r"we\s+don'?t\s+want\s+you\s+(here|around)", re.IGNORECASE),
        re.compile(r"you'?re\s+not\s+invited", re.IGNORECASE),
        re.compile(r"go\s+away,\s+(nobody|no one)\s+wants\s+you", re.IGNORECASE),
        re.compile(r"you'?re\s+not\s+(welcome|allowed)", re.IGNORECASE),
    ]
    
    # Repeated harassment patterns
    HARASSMENT_PATTERNS: List[re.Pattern] = [
        re.compile(r"stop\s+(being|acting)\s+so\s+(weird|annoying|stupid)", re.IGNORECASE),
        re.compile(r"why\s+do\s+you\s+always\s+(act|be)\s+so", re.IGNORECASE),
    ]
    
    def analyze(self, text: str) -> Dict[str, any]:
        """
        Analyze text for bullying patterns.
        
        Returns:
            Dict with bullying_detected, type, and matched_patterns
        """
        text_lower = text.lower()
        matched_patterns = []
        bullying_type = None
        
        # Check cyberbullying
        for pattern in self.CYBERBULLYING_PATTERNS:
            if pattern.search(text_lower):
                matched_patterns.append(f"cyberbullying:{pattern.pattern[:50]}")
                bullying_type = "cyberbullying"
                break
        
        # Check exclusion
        if not bullying_type:
            for pattern in self.EXCLUSION_PATTERNS:
                if pattern.search(text_lower):
                    matched_patterns.append(f"exclusion:{pattern.pattern[:50]}")
                    bullying_type = "exclusion"
                    break
        
        # Check harassment
        if not bullying_type:
            for pattern in self.HARASSMENT_PATTERNS:
                if pattern.search(text_lower):
                    matched_patterns.append(f"harassment:{pattern.pattern[:50]}")
                    bullying_type = "harassment"
                    break
        
        return {
            "bullying_detected": len(matched_patterns) > 0,
            "type": bullying_type,
            "matched_patterns": matched_patterns
        }

