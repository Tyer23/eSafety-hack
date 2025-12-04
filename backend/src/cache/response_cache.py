"""
Response Cache for Production Pipeline

Caches analysis results for repeated messages to reduce latency.
"""

import hashlib
import time
import logging
from typing import Optional, Dict, Any
from collections import OrderedDict
from threading import Lock

logger = logging.getLogger(__name__)


class ResponseCache:
    """
    LRU cache for message analysis results.
    
    Thread-safe with TTL support.
    """
    
    def __init__(self, max_size: int = 1000, ttl_seconds: int = 3600):
        """
        Initialize cache.
        
        Args:
            max_size: Maximum number of cached entries
            ttl_seconds: Time-to-live for entries (1 hour default)
        """
        self.max_size = max_size
        self.ttl = ttl_seconds
        self._cache: OrderedDict = OrderedDict()
        self._lock = Lock()
        self._hits = 0
        self._misses = 0
    
    def _make_key(self, message: str, age_range: str = "8-10") -> str:
        """Create cache key from message and parameters."""
        content = f"{message.lower().strip()}:{age_range}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def get(self, message: str, age_range: str = "8-10") -> Optional[Dict[str, Any]]:
        """
        Get cached result if exists and not expired.
        
        Returns:
            Cached result dict or None if not found/expired
        """
        key = self._make_key(message, age_range)
        
        with self._lock:
            if key not in self._cache:
                self._misses += 1
                return None
            
            entry = self._cache[key]
            
            # Check TTL
            if time.time() - entry["timestamp"] > self.ttl:
                del self._cache[key]
                self._misses += 1
                return None
            
            # Move to end (LRU)
            self._cache.move_to_end(key)
            self._hits += 1
            
            return entry["result"]
    
    def set(self, message: str, result: Dict[str, Any], age_range: str = "8-10"):
        """
        Cache a result.
        
        Args:
            message: Original message
            result: ProcessingResult as dict
            age_range: Age range used
        """
        key = self._make_key(message, age_range)
        
        with self._lock:
            # Remove oldest if at capacity
            if len(self._cache) >= self.max_size:
                self._cache.popitem(last=False)
            
            self._cache[key] = {
                "result": result,
                "timestamp": time.time()
            }
    
    def clear(self):
        """Clear all cached entries."""
        with self._lock:
            self._cache.clear()
            self._hits = 0
            self._misses = 0
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        with self._lock:
            total = self._hits + self._misses
            hit_rate = (self._hits / total * 100) if total > 0 else 0
            
            return {
                "enabled": True,
                "size": len(self._cache),
                "max_size": self.max_size,
                "hits": self._hits,
                "misses": self._misses,
                "hit_rate_percent": round(hit_rate, 2),
                "ttl_seconds": self.ttl
            }


# Global cache instance
_global_cache: Optional[ResponseCache] = None


def get_cache(max_size: int = 1000, ttl_seconds: int = 3600) -> ResponseCache:
    """Get or create global cache instance."""
    global _global_cache
    if _global_cache is None:
        _global_cache = ResponseCache(max_size, ttl_seconds)
    return _global_cache

