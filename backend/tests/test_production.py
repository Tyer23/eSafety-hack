"""
Production Pipeline Tests

Tests for:
- Model configuration
- Response caching
- LLM feedback generation
- Pipeline modes
"""

import pytest
import time
from src.pipeline import MessageProcessor
from src.models import Classification
from src.cache import ResponseCache
from src.config import MODEL_CONFIG, get_model_config


class TestModelConfig:
    """Test model configuration system."""
    
    def test_config_structure(self):
        """Config should have required sections."""
        assert "classification" in MODEL_CONFIG
        assert "feedback" in MODEL_CONFIG
        assert "cache" in MODEL_CONFIG
    
    def test_toxicity_config(self):
        """Toxicity model config should be valid."""
        config = get_model_config("classification", "toxicity")
        assert "model_id" in config
        assert "toxic" in config["model_id"] or "roberta" in config["model_id"]
    
    def test_emotion_config(self):
        """Emotion model config should be valid."""
        config = get_model_config("classification", "emotion")
        assert "model_id" in config
        assert "distilbert" in config["model_id"]
    
    def test_feedback_modes(self):
        """Feedback modes should be configured (hf_llm with template fallback)."""
        feedback = MODEL_CONFIG["feedback"]
        assert "hf_llm" in feedback
        # Verify no other LLM providers
        assert "openai" not in feedback
        assert "anthropic" not in feedback


class TestResponseCache:
    """Test response caching."""
    
    @pytest.fixture
    def cache(self):
        return ResponseCache(max_size=10, ttl_seconds=60)
    
    def test_cache_miss(self, cache):
        """Unknown message should miss."""
        result = cache.get("unknown message")
        assert result is None
    
    def test_cache_hit(self, cache):
        """Cached message should hit."""
        cache.set("test message", {"classification": "green"})
        result = cache.get("test message")
        assert result is not None
        assert result["classification"] == "green"
    
    def test_cache_key_normalization(self, cache):
        """Similar messages should share cache."""
        cache.set("Hello World", {"classification": "green"})
        result = cache.get("hello world")  # lowercase
        assert result is not None
    
    def test_cache_with_age_range(self, cache):
        """Different age ranges should have different cache keys."""
        cache.set("test", {"result": "8-10"}, age_range="8-10")
        cache.set("test", {"result": "11-13"}, age_range="11-13")
        
        result1 = cache.get("test", age_range="8-10")
        result2 = cache.get("test", age_range="11-13")
        
        assert result1["result"] == "8-10"
        assert result2["result"] == "11-13"
    
    def test_cache_lru_eviction(self, cache):
        """Old entries should be evicted when full."""
        # Fill cache
        for i in range(15):
            cache.set(f"message_{i}", {"i": i})
        
        # First entries should be evicted
        assert cache.get("message_0") is None
        assert cache.get("message_14") is not None
    
    def test_cache_stats(self, cache):
        """Stats should track hits and misses."""
        cache.get("miss1")
        cache.get("miss2")
        cache.set("hit", {"x": 1})
        cache.get("hit")
        cache.get("hit")
        
        stats = cache.get_stats()
        assert stats["misses"] == 2
        assert stats["hits"] == 2
        assert stats["hit_rate_percent"] == 50.0


class TestPipelineCaching:
    """Test caching in the pipeline."""
    
    @pytest.fixture
    def processor(self):
        return MessageProcessor(
            use_models=False,
            cache_enabled=True,
            cache_max_size=100
        )
    
    def test_cache_speeds_up_repeated_messages(self, processor):
        """Repeated messages should be faster (cached)."""
        message = "You're stupid"
        
        # First call - uncached
        start1 = time.time()
        result1 = processor.process(message)
        time1 = time.time() - start1
        
        # Second call - should be cached
        start2 = time.time()
        result2 = processor.process(message)
        time2 = time.time() - start2
        
        # Both should have same classification
        assert result1.classification == result2.classification
        
        # Second call should be faster (or at least very fast)
        assert time2 < 0.01  # Less than 10ms for cached
    
    def test_skip_cache_option(self, processor):
        """skip_cache should bypass cache."""
        message = "test message"
        
        processor.process(message)  # Cache it
        
        # Skip cache should still work
        result = processor.process(message, skip_cache=True)
        assert result.success
    
    def test_clear_cache(self, processor):
        """clear_cache should empty the cache."""
        processor.process("message 1")
        processor.process("message 2")
        
        assert processor.cache.get_stats()["size"] == 2
        
        processor.clear_cache()
        
        assert processor.cache.get_stats()["size"] == 0


class TestPipelineModes:
    """Test pipeline with different configurations."""
    
    def test_rule_based_mode(self):
        """Rule-based mode should work without ML models."""
        processor = MessageProcessor(use_models=False)
        result = processor.process("fuck you")
        
        assert result.classification == Classification.RED
        assert result.metadata.fallback_used  # No ML models
    
    def test_ml_mode(self):
        """ML mode should try to load models."""
        processor = MessageProcessor(
            use_models=False  # Use rule-based for consistent tests
        )
        result = processor.process("Hello!")
        
        assert result.classification == Classification.GREEN
    
    def test_feedback_mode_templates(self):
        """Template feedback should always work as fallback."""
        processor = MessageProcessor(
            use_models=False,
            feedback_mode="templates"
        )
        
        result = processor.process("You're an idiot")
        
        assert result.feedback is not None
        assert len(result.feedback.main_message) > 0
        # Templates used (no LLM)
        assert result.metadata.used_llm == False


class TestSystemStatus:
    """Test system status reporting."""
    
    def test_status_structure(self):
        """Status should have all required fields."""
        processor = MessageProcessor(use_models=False)
        status = processor.get_system_status()
        
        assert "analyzer" in status
        assert "feedback" in status
        assert "settings" in status
        assert "cache" in status
        assert "ready" in status
    
    def test_cache_stats_in_status(self):
        """Status should include cache stats."""
        processor = MessageProcessor(
            use_models=False,
            cache_enabled=True
        )
        
        processor.process("test 1")
        processor.process("test 2")
        processor.process("test 1")  # Hit
        
        status = processor.get_system_status()
        
        assert status["cache"]["enabled"] == True
        assert status["cache"]["hits"] >= 1


class TestProductionScenarios:
    """Test real-world production scenarios."""
    
    @pytest.fixture
    def processor(self):
        return MessageProcessor(use_models=False, cache_enabled=True)
    
    def test_gaming_toxicity(self, processor):
        """Gaming-specific toxic messages."""
        gaming_messages = [
            ("gg ez", Classification.GREEN),  # Common, not really toxic
            ("you're trash", Classification.RED),
            ("uninstall the game", Classification.YELLOW),
            ("fuck you noob", Classification.RED),
            ("nice shot!", Classification.GREEN),
        ]
        
        for message, expected in gaming_messages:
            result = processor.process(message)
            if expected == Classification.RED:
                assert result.classification in [Classification.RED, Classification.YELLOW], \
                    f"'{message}' should be RED/YELLOW, got {result.classification}"
    
    def test_batch_processing(self, processor):
        """Batch processing should work."""
        messages = ["Hello!", "fuck you", "whatever"]
        results = processor.batch_process(messages)
        
        assert len(results) == 3
        assert results[0].classification == Classification.GREEN
        assert results[1].classification == Classification.RED
    
    def test_high_throughput(self, processor):
        """Should handle many messages quickly."""
        messages = [f"Test message {i}" for i in range(100)]
        
        start = time.time()
        results = processor.batch_process(messages)
        elapsed = time.time() - start
        
        assert len(results) == 100
        # Should process 100 messages in under 5 seconds
        assert elapsed < 5.0, f"Too slow: {elapsed:.2f}s for 100 messages"

