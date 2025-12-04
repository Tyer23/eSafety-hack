"""
Pattern Analyzer - Rule-based detection for kid-specific issues.
"""

import re
from typing import List, Set
from ..models import PatternResult


class PatternAnalyzer:
    """Detects kid-specific communication patterns."""
    
    EXCLUSION_PATTERNS = [
        r"not invited", r"don'?t want you", r"go away", r"leave( me)? alone",
        r"nobody (wants|likes) you", r"you can'?t (play|come|join)",
        r"not your friend", r"don'?t talk to me", r"no one (likes|wants|cares)",
    ]
    
    THREAT_PATTERNS = [
        r"(go\s+)?die", r"kill\s+(your)?self", r"kys",
        r"(i'?ll|gonna|going to)\s+(hit|punch|kick|hurt|kill)\s+you",  # Only if directed at "you"
        r"you'?re\s+(dead|done|finished)", r"hope you die",
        r"wish you were dead", r"drop dead",
    ]
    
    PROFANITY_PATTERNS = [
        r"\bf+u+c+k+", r"\bs+h+i+t+", r"\ba+s+s+h+o+l+e*",
        r"\bb+i+t+c+h+", r"\bd+i+c+k+", r"\bc+o+c+k+",
        r"wtf", r"stfu", r"gtfo", r"af\b",
        r"motherfucker", r"bullshit", r"dumbass",
    ]
    
    HARSH_CRITICISM_PATTERNS = [
        r"(you'?re|ur|u r)\s+(so\s+)?(stupid|dumb|idiot|moron|ugly|fat)",
        r"(that'?s|this is|it'?s)\s+(so\s+)?(stupid|dumb|lame|bad|terrible)",
        r"what'?s wrong with you", r"are you (stupid|dumb|crazy)",
    ]
    
    DISMISSIVE_PATTERNS = [
        r"\bwhatever\b", r"don'?t care", r"who cares",
        r"\b(boring|lame)\b", r"no one (asked|cares)",
    ]
    
    HATE_SPEECH_PATTERNS = [
        r"hate\s+(minorities|blacks?|whites?|asians?|jews?|muslims?|gays?|lesbians?|trans|immigrants?|refugees?)",
        r"i\s+hate\s+(minorities|blacks?|whites?|asians?|jews?|muslims?|gays?|lesbians?|trans|immigrants?|refugees?)",
        r"(don'?t|do\s+not)\s+like\s+(minorities|blacks?|whites?|asians?|jews?|muslims?|gays?|lesbians?|trans|immigrants?|refugees?)",
        r"i\s+(don'?t|do\s+not)\s+like\s+(minorities|blacks?|whites?|asians?|jews?|muslims?|gays?|lesbians?|trans|immigrants?|refugees?)",
        r"(all|every)\s+(minorities|blacks?|whites?|asians?|jews?|muslims?|gays?|lesbians?|trans|immigrants?|refugees?)",
        r"(minorities|blacks?|whites?|asians?|jews?|muslims?|gays?|lesbians?|trans|immigrants?|refugees?)\s+(are|is)\s+(stupid|bad|evil|disgusting|terrible|awful)",
        r"(minorities|blacks?|whites?|asians?|jews?|muslims?|gays?|lesbians?|trans|immigrants?|refugees?)\s+should\s+(die|leave|go away)",
    ]
    
    PERSONAL_ATTACK_WORDS: Set[str] = {
        "stupid", "dumb", "idiot", "moron", "loser", "ugly", "fat",
        "freak", "weirdo", "pathetic", "worthless", "useless",
        "trash", "garbage", "disgusting",
    }
    
    def __init__(self):
        self._compile_patterns()
    
    def _compile_patterns(self):
        self.exclusion_re = [re.compile(p, re.IGNORECASE) for p in self.EXCLUSION_PATTERNS]
        self.threat_re = [re.compile(p, re.IGNORECASE) for p in self.THREAT_PATTERNS]
        self.profanity_re = [re.compile(p, re.IGNORECASE) for p in self.PROFANITY_PATTERNS]
        self.harsh_re = [re.compile(p, re.IGNORECASE) for p in self.HARSH_CRITICISM_PATTERNS]
        self.dismissive_re = [re.compile(p, re.IGNORECASE) for p in self.DISMISSIVE_PATTERNS]
        self.hate_speech_re = [re.compile(p, re.IGNORECASE) for p in self.HATE_SPEECH_PATTERNS]
    
    VIOLENCE_PATTERNS = [
        r"i'?ll\s+(beat|punch|kick|hit|attack|hurt)\s+(you|them)",
        r"i'?m\s+going\s+to\s+(beat|punch|kick|hit|attack|hurt)\s+(you|them)",
        r"let'?s\s+fight",
        r"i\s+want\s+to\s+(fight|hurt|attack)",
        r"i'?m\s+going\s+to\s+attack\s+(them|you)",
    ]
    
    def analyze(self, text: str) -> PatternResult:
        text_lower = text.lower()
        matched: List[str] = []
        
        exclusion = self._check_patterns(text, self.exclusion_re, matched, "exclusion")
        threat = self._check_patterns(text, self.threat_re, matched, "threat")
        profanity = self._check_patterns(text, self.profanity_re, matched, "profanity")
        harsh = self._check_patterns(text, self.harsh_re, matched, "harsh")
        dismissive = self._check_patterns(text, self.dismissive_re, matched, "dismissive")
        hate_speech = self._check_patterns(text, self.hate_speech_re, matched, "hate_speech")
        personal_attack = self._check_personal_attacks(text_lower, matched)
        
        # Check for violence
        violence_re = [re.compile(p, re.IGNORECASE) for p in self.VIOLENCE_PATTERNS]
        violence = self._check_patterns(text, violence_re, matched, "violence")
        
        return PatternResult(
            exclusion_detected=exclusion,
            harsh_criticism_detected=harsh,
            dismissive_detected=dismissive,
            personal_attack_detected=personal_attack,
            threat_detected=threat,
            profanity_detected=profanity,
            hate_speech_detected=hate_speech,
            violence_detected=violence,
            matched_patterns=matched
        )
    
    def _check_patterns(self, text: str, patterns: List[re.Pattern], 
                       matched: List[str], category: str) -> bool:
        found = False
        for pattern in patterns:
            if pattern.search(text):
                found = True
                matched.append(f"{category}:{pattern.pattern}")
        return found
    
    def _check_personal_attacks(self, text_lower: str, matched: List[str]) -> bool:
        # Whitelist friendly phrases
        FRIENDLY_PATTERNS = [
            r"how are you",
            r"what are you doing",
            r"where are you",
            r"can you help",
            r"will you",
            r"would you",
            r"thank you",
            r"you're welcome",
        ]
        
        # Skip if it's a friendly phrase
        for pattern in FRIENDLY_PATTERNS:
            if re.search(pattern, text_lower):
                return False
        
        words = set(re.findall(r'\b\w+\b', text_lower))
        attack_words = words & self.PERSONAL_ATTACK_WORDS
        
        if attack_words:
            # Require both attack word AND "you" to be a personal attack
            is_directed = any(w in text_lower for w in ["you", "your", "u ", "ur "])
            if is_directed:
                for word in attack_words:
                    matched.append(f"personal_attack:{word}")
                return True
        return False
    
    def get_severity_score(self, result: PatternResult) -> float:
        score = 0.0
        if result.hate_speech_detected:
            score += 0.6  # High severity - hate speech is very serious
        if result.threat_detected:
            score += 0.5
        if result.profanity_detected:
            score += 0.4
        if result.personal_attack_detected:
            score += 0.3
        if result.exclusion_detected:
            score += 0.2
        if result.harsh_criticism_detected:
            score += 0.2
        if result.dismissive_detected:
            score += 0.1
        return min(1.0, score)

