"""
Text preprocessor for cleaning and normalizing input.
"""

import re
import unicodedata
from typing import Dict, List, Tuple


class TextPreprocessor:
    """Cleans and prepares text for analysis."""
    
    SLANG_MAP: Dict[str, str] = {
        "ur": "your", "u": "you", "r": "are",
        "idk": "I don't know", "omg": "oh my god",
        "lol": "laughing", "lmao": "laughing hard",
        "ngl": "not gonna lie", "tbh": "to be honest",
        "stfu": "shut the fuck up", "gtfo": "get the fuck out",
        "af": "as fuck", "kys": "kill yourself",
        "pls": "please", "plz": "please", "thx": "thanks",
    }
    
    REPEATED_CHARS_PATTERN = re.compile(r'(.)\1{2,}')
    
    def __init__(self, max_length: int = 500):
        self.max_length = max_length
    
    def process(self, text: str) -> Tuple[str, Dict]:
        metadata = {
            "original_length": len(text),
            "was_truncated": False,
        }
        
        cleaned = self._sanitize(text)
        
        if len(cleaned) > self.max_length:
            cleaned = cleaned[:self.max_length]
            metadata["was_truncated"] = True
        
        cleaned = self._normalize_repeated_chars(cleaned)
        cleaned, _ = self._convert_slang(cleaned)
        cleaned = self._normalize_whitespace(cleaned)
        
        return cleaned, metadata
    
    def _sanitize(self, text: str) -> str:
        text = unicodedata.normalize('NFKC', text)
        text = ''.join(char for char in text if char == '\n' or 
                      unicodedata.category(char) != 'Cc')
        text = re.sub(r'<[^>]+>', '', text)
        return text.strip()
    
    def _normalize_repeated_chars(self, text: str) -> str:
        return self.REPEATED_CHARS_PATTERN.sub(r'\1\1', text)
    
    def _convert_slang(self, text: str) -> Tuple[str, List[str]]:
        converted = []
        words = text.split()
        result_words = []
        
        for word in words:
            word_lower = word.lower().strip('.,!?')
            if word_lower in self.SLANG_MAP:
                converted.append(f"{word_lower} -> {self.SLANG_MAP[word_lower]}")
                result_words.append(self.SLANG_MAP[word_lower])
            else:
                result_words.append(word)
        
        return ' '.join(result_words), converted
    
    def _normalize_whitespace(self, text: str) -> str:
        return re.sub(r'\s+', ' ', text).strip()

