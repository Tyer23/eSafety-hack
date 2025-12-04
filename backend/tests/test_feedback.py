"""
Tests for feedback quality.
"""

import pytest
from src.pipeline import MessageProcessor
from src.models import Classification
from src.feedback import TemplateGenerator
from src.analyzer import SafetyAnalyzer


class TestFeedbackGeneration:
    """Feedback should be generated for non-green messages."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.processor = MessageProcessor(use_models=False)
    
    def test_red_generates_feedback(self):
        result = self.processor.process("You're stupid")
        assert result.classification == Classification.RED
        assert result.feedback is not None
        assert len(result.feedback.main_message) > 0
    
    def test_green_no_feedback(self):
        result = self.processor.process("Hello!")
        assert result.classification == Classification.GREEN
        assert result.feedback is None
    
    def test_feedback_has_alternatives(self):
        result = self.processor.process("fuck you")
        assert result.feedback is not None
        assert len(result.feedback.suggested_alternatives) >= 2


class TestFeedbackQuality:
    """Feedback should be supportive, not shaming."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.processor = MessageProcessor(use_models=False)
    
    def test_feedback_not_shaming(self):
        result = self.processor.process("You're an idiot")
        assert result.feedback is not None
        
        # Should not contain shaming language
        msg_lower = result.feedback.main_message.lower()
        shaming_words = ["bad kid", "naughty", "shame on you", "wrong"]
        for word in shaming_words:
            assert word not in msg_lower, \
                f"Feedback contains shaming language: {word}"
    
    def test_feedback_acknowledges_feelings(self):
        result = self.processor.process("I hate you")
        assert result.feedback is not None
        
        # Should acknowledge emotions
        msg_lower = result.feedback.main_message.lower()
        ack_words = ["feel", "upset", "frustrated", "angry", "understand"]
        has_ack = any(word in msg_lower for word in ack_words)
        assert has_ack, "Feedback should acknowledge feelings"
    
    def test_feedback_reasonable_length(self):
        result = self.processor.process("go die")
        assert result.feedback is not None
        
        # Not too short, not too long
        words = result.feedback.main_message.split()
        assert 10 < len(words) < 100, \
            f"Feedback length unexpected: {len(words)} words"


class TestFeedbackForDifferentIssues:
    """Different issues should get appropriate feedback."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.analyzer = SafetyAnalyzer(use_models=False)
        self.generator = TemplateGenerator(age_range="8-10")
    
    def test_profanity_feedback(self):
        analysis = self.analyzer.analyze("fuck you")
        feedback = self.generator.generate("fuck you", Classification.RED, analysis)
        
        assert feedback is not None
        assert "words" in feedback.main_message.lower() or \
               "hurt" in feedback.main_message.lower()
    
    def test_threat_feedback(self):
        analysis = self.analyzer.analyze("go die")
        feedback = self.generator.generate("go die", Classification.RED, analysis)
        
        assert feedback is not None
        # Should address the seriousness
        assert any(word in feedback.main_message.lower() 
                  for word in ["serious", "hurt", "scare"])


class TestEducationalContent:
    """Educational content should be generated."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.processor = MessageProcessor(use_models=False)
    
    def test_educational_generated(self):
        result = self.processor.process("You're stupid")
        assert result.educational is not None
        assert len(result.educational.skill_focus) > 0
    
    def test_follow_up_question(self):
        result = self.processor.process("fuck off")
        assert result.educational is not None
        assert result.educational.follow_up_question is not None
        assert "?" in result.educational.follow_up_question

