"""
Tests for toxicity detection.
"""

import pytest
from src.analyzer import SafetyAnalyzer
from src.analyzer.toxicity import ToxicityAnalyzer


class TestProfanityDetection:
    """Profanity must always be detected."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.analyzer = SafetyAnalyzer(use_models=False)
    
    @pytest.mark.parametrize("message", [
        "fuck",
        "fuck you",
        "fucking hell",
        "what the fuck",
        "motherfucker",
        "shit",
        "bullshit",
        "shitty",
        "asshole",
        "bitch",
        "stfu",
        "gtfo",
    ])
    def test_profanity_detected(self, message):
        result = self.analyzer.analyze(message)
        assert result.patterns.profanity_detected, \
            f"Profanity not detected in '{message}'"
        assert result.toxicity.score >= 0.4, \
            f"Toxicity score too low for '{message}': {result.toxicity.score}"


class TestThreatDetection:
    """Threats must always be detected."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.analyzer = SafetyAnalyzer(use_models=False)
    
    @pytest.mark.parametrize("message", [
        "go die",
        "kill yourself",
        "kys",
        "I hope you die",
        "drop dead",
        "go kill yourself",
    ])
    def test_threats_detected(self, message):
        result = self.analyzer.analyze(message)
        assert result.patterns.threat_detected, \
            f"Threat not detected in '{message}'"


class TestInsultDetection:
    """Insults directed at someone should be detected."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.analyzer = SafetyAnalyzer(use_models=False)
    
    @pytest.mark.parametrize("message", [
        "you're stupid",
        "you're an idiot",
        "you're so dumb",
        "you're ugly",
        "you're pathetic",
        "you're worthless",
    ])
    def test_personal_attacks_detected(self, message):
        result = self.analyzer.analyze(message)
        assert result.patterns.personal_attack_detected, \
            f"Personal attack not detected in '{message}'"


class TestSafeMessages:
    """Safe messages should have low toxicity."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.analyzer = SafetyAnalyzer(use_models=False)
    
    @pytest.mark.parametrize("message", [
        "Hello, how are you?",
        "Great game!",
        "You played well",
        "Can we try again?",
        "I don't like this",
    ])
    def test_safe_messages_low_toxicity(self, message):
        result = self.analyzer.analyze(message)
        assert result.toxicity.score < 0.3, \
            f"Toxicity too high for safe message '{message}': {result.toxicity.score}"
        assert not result.patterns.profanity_detected
        assert not result.patterns.threat_detected


class TestToxicityAnalyzerDirect:
    """Direct tests on ToxicityAnalyzer."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.analyzer = ToxicityAnalyzer(use_model=False)
    
    def test_high_toxicity_score(self):
        result = self.analyzer.analyze("fuck you stupid idiot")
        assert result.score > 0.6
        assert result.label in ["hate", "offensive"]
    
    def test_low_toxicity_score(self):
        result = self.analyzer.analyze("Hello friend")
        assert result.score < 0.3
        assert result.label == "neither"

