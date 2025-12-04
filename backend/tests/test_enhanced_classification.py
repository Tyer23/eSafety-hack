"""
Comprehensive tests for enhanced classification system.

Tests for:
- Sexual content detection
- Hate speech detection (proper)
- Bullying/cyberbullying
- Self-harm content
- Violence/threats
- Age-inappropriate content
"""

import pytest
from src.models import Classification, DetectedIssue
from src.pipeline import MessageProcessor


@pytest.fixture
def processor():
    """Processor with models enabled."""
    return MessageProcessor(use_models=True, feedback_mode="hf_llm")


class TestSexualContentDetection:
    """Test sexual content detection."""
    
    def test_explicit_sexual_content(self, processor):
        """Test explicit sexual content."""
        messages = [
            "I want to have sex with you",
            "Let's have sex",
            "Show me your body",
            "Send me nudes",
            "I'm horny",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            assert result.classification == Classification.RED, f"Failed for: {msg}"
            assert DetectedIssue.SEXUAL_CONTENT in result.analysis.detected_issues, f"Missing sexual content flag for: {msg}"
    
    def test_sexual_innuendo(self, processor):
        """Test sexual innuendo and suggestive content."""
        messages = [
            "That's hot",
            "You're sexy",
            "I like your body",
            "Want to hook up?",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            # Should be at least YELLOW, possibly RED depending on context
            assert result.classification in [Classification.YELLOW, Classification.RED], f"Failed for: {msg}"
    
    def test_sexual_terms(self, processor):
        """Test detection of sexual terms."""
        messages = [
            "porn",
            "pornography",
            "masturbation",
            "orgasm",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            # Should flag sexual content
            assert result.classification in [Classification.YELLOW, Classification.RED], f"Failed for: {msg}"
    
    def test_innocent_uses_of_words(self, processor):
        """Test that innocent uses don't trigger false positives."""
        messages = [
            "I like that song",
            "That's a nice picture",
            "Can you help me?",
            "I need help with homework",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            # Should NOT flag as sexual content
            assert DetectedIssue.SEXUAL_CONTENT not in result.analysis.detected_issues, f"False positive for: {msg}"


class TestHateSpeechDetection:
    """Test proper hate speech detection."""
    
    def test_racial_hate_speech(self, processor):
        """Test racial hate speech."""
        messages = [
            "I hate all black people",
            "Blacks are stupid",
            "All whites are racists",
            "Asians are bad drivers",
            "I don't like Jews",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            assert result.classification == Classification.RED, f"Failed for: {msg}"
            assert DetectedIssue.HATE_SPEECH in result.analysis.detected_issues, f"Missing hate speech flag for: {msg}"
    
    def test_religious_hate_speech(self, processor):
        """Test religious hate speech."""
        messages = [
            "I hate Muslims",
            "All Muslims are terrorists",
            "Christians are idiots",
            "Jews control everything",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            assert result.classification == Classification.RED, f"Failed for: {msg}"
            assert DetectedIssue.HATE_SPEECH in result.analysis.detected_issues, f"Missing hate speech flag for: {msg}"
    
    def test_lgbtq_hate_speech(self, processor):
        """Test LGBTQ+ hate speech."""
        messages = [
            "I hate gays",
            "All gays should die",
            "Lesbians are disgusting",
            "Trans people are freaks",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            assert result.classification == Classification.RED, f"Failed for: {msg}"
            assert DetectedIssue.HATE_SPEECH in result.analysis.detected_issues, f"Missing hate speech flag for: {msg}"
    
    def test_coded_hate_speech(self, processor):
        """Test coded/subtle hate speech."""
        messages = [
            "Those people are ruining everything",
            "They don't belong here",
            "We need to keep our country pure",
            "Certain groups are problematic",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            # Should detect as at least YELLOW, possibly RED
            assert result.classification in [Classification.YELLOW, Classification.RED], f"Failed for: {msg}"
    
    def test_not_hate_speech(self, processor):
        """Test that legitimate criticism isn't flagged."""
        messages = [
            "I don't like that politician",
            "That policy is bad",
            "I disagree with that idea",
            "That's not a good plan",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            # Should NOT flag as hate speech
            assert DetectedIssue.HATE_SPEECH not in result.analysis.detected_issues, f"False positive for: {msg}"


class TestBullyingDetection:
    """Test bullying and cyberbullying detection."""
    
    def test_cyberbullying(self, processor):
        """Test cyberbullying patterns."""
        messages = [
            "Nobody likes you",
            "Everyone thinks you're weird",
            "You have no friends",
            "You're such a loser",
            "Why are you so ugly?",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            assert result.classification in [Classification.YELLOW, Classification.RED], f"Failed for: {msg}"
            assert DetectedIssue.BULLYING in result.analysis.detected_issues or \
                   DetectedIssue.PERSONAL_ATTACK in result.analysis.detected_issues, f"Missing bullying flag for: {msg}"
    
    def test_exclusion_bullying(self, processor):
        """Test exclusion-based bullying."""
        messages = [
            "You can't sit with us",
            "We don't want you here",
            "You're not invited",
            "Go away, nobody wants you",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            assert result.classification in [Classification.YELLOW, Classification.RED], f"Failed for: {msg}"


class TestSelfHarmDetection:
    """Test self-harm and suicide content detection."""
    
    def test_explicit_self_harm(self, processor):
        """Test explicit self-harm content."""
        messages = [
            "I want to kill myself",
            "I'm going to hurt myself",
            "I should just die",
            "I want to cut myself",
            "I wish I was dead",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            assert result.classification == Classification.RED, f"Failed for: {msg}"
            assert DetectedIssue.SELF_HARM in result.analysis.detected_issues, f"Missing self-harm flag for: {msg}"
    
    def test_suicide_ideation(self, processor):
        """Test suicide ideation."""
        messages = [
            "I want to die",
            "I should kill myself",
            "Life isn't worth living",
            "I want to end it all",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            assert result.classification == Classification.RED, f"Failed for: {msg}"
            assert DetectedIssue.SELF_HARM in result.analysis.detected_issues, f"Missing self-harm flag for: {msg}"
    
    def test_not_self_harm(self, processor):
        """Test that normal expressions aren't flagged."""
        messages = [
            "I'm so tired I could die",
            "That test was killer",
            "I'm dying of laughter",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            # Should NOT flag as self-harm (these are idioms)
            assert DetectedIssue.SELF_HARM not in result.analysis.detected_issues, f"False positive for: {msg}"


class TestViolenceDetection:
    """Test violence and threat detection."""
    
    def test_direct_threats(self, processor):
        """Test direct threats of violence."""
        messages = [
            "I'm going to kill you",
            "I'll beat you up",
            "I'm going to hurt you",
            "I'll punch you",
            "I'm going to fight you",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            assert result.classification == Classification.RED, f"Failed for: {msg}"
            assert DetectedIssue.THREAT in result.analysis.detected_issues, f"Missing threat flag for: {msg}"
    
    def test_violence_descriptions(self, processor):
        """Test descriptions of violence."""
        messages = [
            "I want to hurt someone",
            "I'm going to attack them",
            "Let's fight",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            assert result.classification in [Classification.YELLOW, Classification.RED], f"Failed for: {msg}"


class TestAgeInappropriateContent:
    """Test age-inappropriate content detection."""
    
    def test_drug_alcohol_references(self, processor):
        """Test drug and alcohol references."""
        messages = [
            "Let's get drunk",
            "Want some drugs?",
            "I'm high",
            "Let's smoke weed",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            assert result.classification in [Classification.YELLOW, Classification.RED], f"Failed for: {msg}"
            assert DetectedIssue.AGE_INAPPROPRIATE in result.analysis.detected_issues, f"Missing age-inappropriate flag for: {msg}"
    
    def test_gambling_references(self, processor):
        """Test gambling references."""
        messages = [
            "Let's bet money",
            "I'm going to gamble",
        ]
        
        for msg in messages:
            result = processor.process(msg)
            assert result.classification in [Classification.YELLOW, Classification.RED], f"Failed for: {msg}"


class TestRobustness:
    """Test robustness of classification system."""
    
    def test_mixed_content(self, processor):
        """Test messages with multiple issues."""
        messages = [
            "I hate gays and want to kill myself",  # Hate speech + self-harm
            "You're stupid and I'll beat you up",  # Personal attack + threat
            "Send nudes or I'll hurt you",  # Sexual content + threat
        ]
        
        for msg in messages:
            result = processor.process(msg)
            assert result.classification == Classification.RED, f"Failed for: {msg}"
            assert len(result.analysis.detected_issues) >= 2, f"Should detect multiple issues for: {msg}"
    
    def test_context_awareness(self, processor):
        """Test that context is considered."""
        # Gaming context
        gaming_messages = [
            "I'm going to kill you in the game",
            "You're dead in this match",
        ]
        
        for msg in gaming_messages:
            result = processor.process(msg)
            # Should be less severe in gaming context
            assert result.classification in [Classification.GREEN, Classification.YELLOW], f"Failed for: {msg}"
    
    def test_typos_and_obfuscation(self, processor):
        """Test detection with typos and obfuscation."""
        messages = [
            "f*ck you",  # Obfuscated profanity
            "I h8 u",  # Leetspeak
            "you're st00pid",  # Number substitution
            "f u c k",  # Spaced out
        ]
        
        for msg in messages:
            result = processor.process(msg)
            # Should still detect
            assert result.classification in [Classification.YELLOW, Classification.RED], f"Failed for: {msg}"
    
    def test_multilingual_content(self, processor):
        """Test multilingual content (if supported)."""
        # This is a stretch goal - may not be fully supported
        messages = [
            "Je te déteste",  # French: I hate you
            "Te odio",  # Spanish: I hate you
        ]
        
        # For now, just ensure it doesn't crash
        for msg in messages:
            result = processor.process(msg)
            assert result.success, f"Should process without crashing: {msg}"


class TestEdgeCases:
    """Test edge cases and boundary conditions."""
    
    def test_empty_message(self, processor):
        """Test empty message."""
        result = processor.process("")
        assert not result.success or result.classification == Classification.GREEN
    
    def test_very_long_message(self, processor):
        """Test very long message."""
        long_msg = "You're stupid. " * 100
        result = processor.process(long_msg)
        assert result.success
        assert result.classification in [Classification.YELLOW, Classification.RED]
    
    def test_only_profanity(self, processor):
        """Test message with only profanity."""
        result = processor.process("fuck")
        assert result.classification == Classification.RED
        assert DetectedIssue.PROFANITY in result.analysis.detected_issues
    
    def test_positive_with_negative_word(self, processor):
        """Test positive message that contains negative word."""
        result = processor.process("I don't hate you, I like you")
        # Should be GREEN despite containing "hate"
        assert result.classification == Classification.GREEN

