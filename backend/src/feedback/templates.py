"""
Template-based Feedback Generator.
"""

import random
from typing import Optional, List
from ..models import Classification, AnalysisResult, Feedback, Educational, DetectedIssue, EmotionType


class TemplateGenerator:
    """Generates feedback using templates."""
    
    ACKNOWLEDGMENTS = {
        EmotionType.ANGER: [
            "I can tell you're feeling really frustrated right now.",
            "It sounds like something is really bothering you.",
            "I understand you're feeling upset.",
        ],
        EmotionType.FRUSTRATION: [
            "I get it, that sounds frustrating!",
            "Feeling stuck is no fun, I understand.",
        ],
        EmotionType.NEUTRAL: [
            "I see what you're trying to say.",
        ],
    }
    
    EXPLANATIONS = {
        DetectedIssue.PROFANITY: {
            "8-10": "Those words can be really hurtful and aren't okay to use, even when we're upset.",
            "11-13": "Using those words can hurt others and often makes situations worse, not better.",
        },
        DetectedIssue.THREAT: {
            "8-10": "Saying things about hurting someone is really serious, even if you don't mean it.",
            "11-13": "Threats can scare people and have real consequences, even online.",
        },
        DetectedIssue.PERSONAL_ATTACK: {
            "8-10": "Words like that can really hurt someone's feelings, like a punch but on the inside.",
            "11-13": "Attacking someone personally doesn't help solve problems - it just creates more.",
        },
        DetectedIssue.HARSH_CRITICISM: {
            "8-10": "When we say something is 'bad' or 'stupid', it doesn't help anyone get better.",
            "11-13": "Harsh criticism rarely helps. Specific, constructive feedback works better.",
        },
        DetectedIssue.EXCLUSION_LANGUAGE: {
            "8-10": "How would you feel if someone said this to you? It would feel pretty lonely, right?",
            "11-13": "Excluding people can make them feel invisible and really hurts.",
        },
        DetectedIssue.DISMISSIVE_TONE: {
            "8-10": "When we act like something doesn't matter, it can make others feel unimportant.",
            "11-13": "Being dismissive shows we don't value others' thoughts, even if we disagree.",
        },
    }
    
    SUGGESTIONS = {
        DetectedIssue.PROFANITY: [
            "I'm really frustrated right now",
            "This is making me upset",
            "I need to take a break",
        ],
        DetectedIssue.THREAT: [
            "I'm too angry to talk right now",
            "I need to step away and calm down",
            "I'm going to take a break",
        ],
        DetectedIssue.PERSONAL_ATTACK: [
            "I'm feeling really upset right now",
            "I don't like what happened",
            "Can we talk about this differently?",
        ],
        DetectedIssue.HARSH_CRITICISM: [
            "What if we tried it this way instead?",
            "I think it could be even better if...",
            "Here's an idea that might help...",
        ],
        DetectedIssue.EXCLUSION_LANGUAGE: [
            "I need some time by myself right now",
            "Maybe we can hang out later?",
            "I'm not up for that right now, but thanks",
        ],
        DetectedIssue.DISMISSIVE_TONE: [
            "I feel differently about it",
            "That's not really my thing",
            "I'd rather do something else",
        ],
    }
    
    TIPS = {
        DetectedIssue.PROFANITY: "When you're angry, try typing out your feelings, then delete and rewrite without the bad words.",
        DetectedIssue.THREAT: "When you feel like saying something scary, step away from the screen. Take 10 deep breaths first.",
        DetectedIssue.PERSONAL_ATTACK: "Try 'I feel...' instead of 'You are...' - it helps others understand without getting defensive.",
        DetectedIssue.HARSH_CRITICISM: "The 'sandwich' trick: Say something nice, your suggestion, then something nice again!",
        DetectedIssue.EXCLUSION_LANGUAGE: "You can set boundaries kindly. 'Not right now' is better than 'Go away'.",
        DetectedIssue.DISMISSIVE_TONE: "Everyone's opinion matters. You can disagree respectfully.",
    }
    
    def __init__(self, age_range: str = "8-10"):
        self.age_range = age_range if age_range in ["8-10", "11-13"] else "8-10"
    
    def generate(self, message: str, classification: Classification, 
                 analysis: AnalysisResult) -> Optional[Feedback]:
        if classification == Classification.GREEN:
            return None
        
        primary_issue = (analysis.detected_issues[0] if analysis.detected_issues 
                        else DetectedIssue.HARSH_CRITICISM)
        
        main_message = self._build_main_message(message, analysis.emotion.primary_emotion, 
                                                primary_issue, classification)
        alternatives = self._get_alternatives(primary_issue, message)
        tip = self.TIPS.get(primary_issue, self.TIPS[DetectedIssue.PERSONAL_ATTACK])
        
        return Feedback(
            main_message=main_message,
            suggested_alternatives=alternatives,
            communication_tip=tip
        )
    
    def _build_main_message(self, message: str, emotion: EmotionType, issue: DetectedIssue, 
                           classification: Classification) -> str:
        parts = []
        
        ack_options = self.ACKNOWLEDGMENTS.get(emotion, self.ACKNOWLEDGMENTS[EmotionType.NEUTRAL])
        parts.append(random.choice(ack_options))
        
        # Extract specific context from message for more nuanced feedback
        message_lower = message.lower()
        context_items = []
        if "drawing" in message_lower or "art" in message_lower or "picture" in message_lower:
            context_items.append("drawing")
        if "game" in message_lower or "playing" in message_lower:
            context_items.append("game")
        if "haircut" in message_lower or "hair" in message_lower:
            context_items.append("haircut")
        if "shirt" in message_lower or "clothes" in message_lower or "outfit" in message_lower:
            context_items.append("clothing")
        if "food" in message_lower or "lunch" in message_lower or "dinner" in message_lower:
            context_items.append("food")
        
        # Add context-specific explanation if we found something
        if context_items and issue in [DetectedIssue.HARSH_CRITICISM, DetectedIssue.PERSONAL_ATTACK]:
            item = context_items[0]
            if issue == DetectedIssue.HARSH_CRITICISM:
                parts.append(f"When we say we don't like someone's {item}, it can hurt their feelings.")
            elif issue == DetectedIssue.PERSONAL_ATTACK:
                parts.append(f"Words about someone's {item} can really hurt, even if we're frustrated.")
        elif issue in self.EXPLANATIONS:
            exp = self.EXPLANATIONS[issue].get(self.age_range, 
                  list(self.EXPLANATIONS[issue].values())[0])
            parts.append(exp)
        
        parts.append("Let's find a better way to express what you're feeling.")
        
        return " ".join(parts)
    
    def _get_alternatives(self, issue: DetectedIssue, message: str = "") -> List[str]:
        alternatives = self.SUGGESTIONS.get(issue, self.SUGGESTIONS[DetectedIssue.PERSONAL_ATTACK])[:3]
        
        # Add context-specific alternatives if we can identify the topic
        message_lower = message.lower()
        if "drawing" in message_lower or "art" in message_lower:
            alternatives.insert(0, "I'm not a fan of this style")
            alternatives.insert(1, "This isn't really my thing")
        elif "game" in message_lower:
            alternatives.insert(0, "I'm not enjoying this game right now")
        elif "haircut" in message_lower or "hair" in message_lower:
            alternatives.insert(0, "I prefer a different style")
        
        # Filter out alternatives that are too similar to the original message
        filtered = []
        original_lower = message.lower().strip()
        
        for alt in alternatives:
            alt_lower = alt.lower().strip()
            
            # Skip if it's exactly the same (case-insensitive)
            if alt_lower == original_lower:
                continue
            
            # Skip if it's very similar
            import difflib
            similarity = difflib.SequenceMatcher(None, original_lower, alt_lower).ratio()
            if similarity > 0.7:  # More than 70% similar
                continue
            
            # Skip if the alternative contains the original message or vice versa
            if original_lower in alt_lower or alt_lower in original_lower:
                original_words = set(original_lower.split())
                alt_words = set(alt_lower.split())
                if len(original_words) > 0 and len(original_words & alt_words) / len(original_words) > 0.5:
                    continue
            
            filtered.append(alt)
        
        return filtered[:3]  # Return top 3
    
    def generate_educational(self, classification: Classification, 
                            analysis: AnalysisResult) -> Optional[Educational]:
        if classification == Classification.GREEN:
            return None
        
        skill_map = {
            DetectedIssue.PROFANITY: "Expressing feelings without harmful words",
            DetectedIssue.THREAT: "Managing strong emotions safely",
            DetectedIssue.PERSONAL_ATTACK: "Expressing feelings without attacking",
            DetectedIssue.HARSH_CRITICISM: "Constructive feedback",
            DetectedIssue.EXCLUSION_LANGUAGE: "Kindness and boundaries",
            DetectedIssue.DISMISSIVE_TONE: "Respectful disagreement",
        }
        
        issue = analysis.detected_issues[0] if analysis.detected_issues else DetectedIssue.HARSH_CRITICISM
        skill = skill_map.get(issue, "Positive communication")
        
        questions = [
            "How do you think the other person might feel reading this?",
            "What do you really want them to understand?",
            "Is there a way to say this that won't hurt feelings?",
        ]
        
        return Educational(
            skill_focus=skill,
            age_appropriate=True,
            follow_up_question=random.choice(questions)
        )

