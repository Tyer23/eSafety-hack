"""
Pytest configuration and shared fixtures.
"""

import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


@pytest.fixture(scope="session")
def processor():
    """Shared processor (rule-based for fast tests)."""
    from src.pipeline import MessageProcessor
    return MessageProcessor(use_models=False)


@pytest.fixture(scope="session")
def analyzer():
    """Shared safety analyzer."""
    from src.analyzer import SafetyAnalyzer
    return SafetyAnalyzer(use_models=False)


@pytest.fixture
def sample_messages():
    """Sample messages for each classification."""
    return {
        "green": [
            "Hello, how are you?",
            "Can we try again?",
            "I don't like this game",
            "Maybe we could play something else?",
        ],
        "yellow": [
            "This is boring",
            "Whatever",
            "I don't care",
        ],
        "red": [
            "You're stupid",
            "fuck you",
            "go die",
            "I hate you, go kill yourself",
            "Nobody likes you",
            "You're an idiot",
        ]
    }

