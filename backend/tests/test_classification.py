"""
Tests for message classification accuracy.
"""

import pytest
from src.pipeline import MessageProcessor
from src.models import Classification


class TestGreenClassification:
    """Safe messages should be GREEN."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.processor = MessageProcessor(use_models=False)
    
    @pytest.mark.parametrize("message", [
        "Hello, how are you?",
        "Can we try again?",
        "I don't like this game",
        "Maybe we could play something else?",
        "I'm feeling tired",
        "That's not my favorite",
        "Can you help me?",
        "Great job!",
        "You played well!",
    ])
    def test_safe_messages_green(self, message):
        result = self.processor.process(message)
        assert result.classification == Classification.GREEN, \
            f"'{message}' should be GREEN, got {result.classification}"


class TestRedClassification:
    """Harmful messages must be RED."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.processor = MessageProcessor(use_models=False)
    
    @pytest.mark.parametrize("message,reason", [
        # Profanity
        ("fuck you", "profanity"),
        ("what the fuck", "profanity"),
        ("you fucking idiot", "profanity + insult"),
        ("this is bullshit", "profanity"),
        ("shut the fuck up", "profanity"),
        ("stfu", "profanity abbreviation"),
        
        # Threats
        ("go die", "death threat"),
        ("kill yourself", "suicide threat"),
        ("kys", "suicide abbreviation"),
        ("I hope you die", "death wish"),
        
        # Personal attacks
        ("you're stupid", "insult"),
        ("you're an idiot", "insult"),
        ("you're so dumb", "insult"),
        ("you're ugly", "insult"),
        ("you're pathetic", "insult"),
        
        # Combined
        ("fuck you, go die", "profanity + threat"),
        ("you stupid idiot", "multiple insults"),
    ])
    def test_harmful_messages_red(self, message, reason):
        result = self.processor.process(message)
        assert result.classification == Classification.RED, \
            f"'{message}' ({reason}) should be RED, got {result.classification}"


class TestYellowClassification:
    """Borderline messages should be YELLOW."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.processor = MessageProcessor(use_models=False)
    
    @pytest.mark.parametrize("message", [
        "This is boring",
        "Whatever",
        "I don't care",
        "This game is lame",
    ])
    def test_borderline_messages_yellow(self, message):
        result = self.processor.process(message)
        assert result.classification in [Classification.YELLOW, Classification.RED], \
            f"'{message}' should be YELLOW/RED, got {result.classification}"


class TestEdgeCases:
    """Edge cases and special inputs."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.processor = MessageProcessor(use_models=False)
    
    def test_empty_message(self):
        result = self.processor.process("")
        assert result.success == False
    
    def test_whitespace_only(self):
        result = self.processor.process("   ")
        assert result.success == False
    
    def test_mixed_case_profanity(self):
        """FUCK YOU should still be caught."""
        result = self.processor.process("FUCK YOU")
        assert result.classification == Classification.RED
    
    def test_repeated_chars(self):
        """fuuuuck should still be caught."""
        result = self.processor.process("fuuuuuck you")
        assert result.classification == Classification.RED
    
    def test_long_message(self):
        """Long messages should be handled."""
        long_msg = "This is a test. " * 100
        result = self.processor.process(long_msg)
        assert result.success == True
    
    def test_gaming_context(self):
        """Gaming-specific toxic messages."""
        result = self.processor.process("Garen, fuck your spinning")
        assert result.classification == Classification.RED


class TestQuickClassify:
    """Test quick classification method."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.processor = MessageProcessor(use_models=False)
    
    def test_quick_green(self):
        assert self.processor.quick_classify("Hello!") == Classification.GREEN
    
    def test_quick_red(self):
        assert self.processor.quick_classify("fuck you") == Classification.RED

