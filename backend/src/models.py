"""
Data models for the Kid Message Safety System.
"""

from enum import Enum
from typing import Optional, List, Dict
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class Classification(str, Enum):
    GREEN = "green"
    YELLOW = "yellow"
    RED = "red"


class EmotionType(str, Enum):
    ANGER = "anger"
    JOY = "joy"
    SADNESS = "sadness"
    FEAR = "fear"
    SURPRISE = "surprise"
    DISGUST = "disgust"
    NEUTRAL = "neutral"
    FRUSTRATION = "frustration"


class IntentType(str, Enum):
    EXPRESS_DISLIKE = "express_dislike"
    CRITICISM = "criticism"
    PERSONAL_ATTACK = "personal_attack"
    EXCLUSION = "exclusion"
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    REQUEST = "request"
    THREAT = "threat"


class DetectedIssue(str, Enum):
    HARSH_CRITICISM = "harsh_criticism"
    PERSONAL_ATTACK = "personal_attack"
    EXCLUSION_LANGUAGE = "exclusion_language"
    DISMISSIVE_TONE = "dismissive_tone"
    THREAT = "threat"
    NAME_CALLING = "name_calling"
    PROFANITY = "profanity"
    HATE_SPEECH = "hate_speech"


class ToxicityResult(BaseModel):
    score: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    label: str


class EmotionResult(BaseModel):
    primary_emotion: EmotionType
    scores: Dict[str, float] = Field(default_factory=dict)
    intensity: float = Field(..., ge=0.0, le=1.0)


class PatternResult(BaseModel):
    exclusion_detected: bool = False
    harsh_criticism_detected: bool = False
    dismissive_detected: bool = False
    personal_attack_detected: bool = False
    threat_detected: bool = False
    profanity_detected: bool = False
    hate_speech_detected: bool = False
    matched_patterns: List[str] = Field(default_factory=list)


class AnalysisResult(BaseModel):
    toxicity: ToxicityResult
    emotion: EmotionResult
    patterns: PatternResult
    detected_issues: List[DetectedIssue] = Field(default_factory=list)
    intent: IntentType = IntentType.NEUTRAL


class Feedback(BaseModel):
    main_message: str
    suggested_alternatives: List[str] = Field(default_factory=list)
    communication_tip: Optional[str] = None


class Educational(BaseModel):
    skill_focus: str
    age_appropriate: bool = True
    follow_up_question: Optional[str] = None


class ProcessingMetadata(BaseModel):
    processing_time_ms: float
    model_versions: Dict[str, str] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    used_llm: bool = False
    fallback_used: bool = False


class ProcessingResult(BaseModel):
    success: bool = True
    classification: Classification
    confidence: float = Field(..., ge=0.0, le=1.0)
    analysis: AnalysisResult
    feedback: Optional[Feedback] = None
    educational: Optional[Educational] = None
    metadata: ProcessingMetadata
    error_message: Optional[str] = None

