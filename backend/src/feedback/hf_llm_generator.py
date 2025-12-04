"""
Hugging Face Inference API LLM Generator

Uses Hugging Face's free Inference API for generating personalized feedback.
"""

import os
import logging
from typing import Optional
from dotenv import load_dotenv

from ..models import Classification, AnalysisResult, Feedback, Educational, DetectedIssue

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Import requests at module level
import requests

# Try to use InferenceClient (recommended), fall back to requests
try:
    from huggingface_hub import InferenceClient
    HAS_INFERENCE_CLIENT = True
except ImportError:
    HAS_INFERENCE_CLIENT = False


class HuggingFaceLLMGenerator:
    """
    Generates feedback using Hugging Face Inference API.
    
    Free tier: 1,000 requests/month (can request more)
    Models: Mistral, Llama, Zephyr, and many others
    """
    
    # Default model - fast and good quality
    DEFAULT_MODEL = "mistralai/Mistral-7B-Instruct-v0.2"
    
    # Alternative models you can try:
    # "meta-llama/Llama-3-8b-Instruct" (requires access request)
    # "HuggingFaceH4/zephyr-7b-beta"
    # "google/flan-t5-large" (smaller, faster)
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        model_id: Optional[str] = None,
        age_range: str = "8-10",
        timeout: int = 30
    ):
        """
        Initialize Hugging Face LLM generator.
        
        Args:
            api_key: HF API token (defaults to HF_API_KEY env var)
            model_id: Model to use (defaults to Mistral-7B-Instruct)
            age_range: Age range for feedback (8-10 or 11-13)
            timeout: Request timeout in seconds
        """
        self.api_key = api_key or os.getenv("HF_API_KEY")
        self.model_id = model_id or self.DEFAULT_MODEL
        self.age_range = age_range
        self.timeout = timeout
        
        if not self.api_key:
            logger.warning(
                "HF_API_KEY not found. Set it in .env file or environment variables. "
                "Get your token from: https://huggingface.co/settings/tokens"
            )
        
        # Initialize InferenceClient if available (handles new router endpoint automatically)
        if HAS_INFERENCE_CLIENT and self.api_key:
            try:
                self.client = InferenceClient(model=self.model_id, token=self.api_key)
                self.use_client = True
                logger.info(f"HuggingFaceLLMGenerator initialized with InferenceClient (model={self.model_id})")
            except Exception as e:
                logger.warning(f"Failed to initialize InferenceClient: {e}, falling back to requests")
                self.client = None
                self.use_client = False
                # Fallback to router endpoint
                self.api_url = f"https://router.huggingface.co/models/{self.model_id}"
        else:
            self.client = None
            self.use_client = False
            # Use router endpoint (old api-inference endpoint is deprecated)
            self.api_url = f"https://router.huggingface.co/models/{self.model_id}"
            logger.info(f"HuggingFaceLLMGenerator initialized with requests (model={self.model_id})")
    
    def is_available(self) -> bool:
        """Check if API key is configured."""
        return self.api_key is not None
    
    def generate(
        self,
        message: str,
        classification: Classification,
        analysis: AnalysisResult
    ) -> Optional[Feedback]:
        """
        Generate feedback using Hugging Face API.
        
        Returns:
            Feedback object or None if generation fails
        """
        if not self.is_available():
            logger.warning("HF API key not available, cannot generate feedback")
            return None
        
        try:
            prompt = self._build_prompt(message, classification, analysis)
            response_text = self._call_api(prompt)
            
            if response_text:
                return self._parse_response(response_text, message, analysis)
            
        except Exception as e:
            logger.warning(f"HF API generation failed: {e}")
        
        return None
    
    def _build_prompt(
        self,
        message: str,
        classification: Classification,
        analysis: AnalysisResult
    ) -> str:
        """Build detailed prompt for LLM."""
        issues = ", ".join([i.value.replace("_", " ") for i in analysis.detected_issues]) or "communication issue"
        emotion = analysis.emotion.primary_emotion.value
        
        # Extract specific items from message for context
        message_lower = message.lower()
        specific_items = []
        if "drawing" in message_lower or "art" in message_lower:
            specific_items.append("drawing")
        if "game" in message_lower or "playing" in message_lower:
            specific_items.append("game")
        if "haircut" in message_lower or "hair" in message_lower:
            specific_items.append("haircut")
        if "shirt" in message_lower or "clothes" in message_lower:
            specific_items.append("clothing")
        
        context_note = ""
        if specific_items:
            items_str = " or ".join(specific_items)
            context_note = f"\nIMPORTANT: They mentioned {items_str}. Reference this in your response."
        
        # Add explicit warning about profanity
        profanity_warning = ""
        if analysis.patterns.profanity_detected or DetectedIssue.PROFANITY in analysis.detected_issues:
            profanity_warning = "\n\n⚠️ CRITICAL RULES - READ CAREFULLY:\n- The original message contains profanity.\n- NEVER repeat or include ANY profanity in your response.\n- NEVER include profanity in your suggestions or alternatives.\n- Only suggest clean, appropriate, child-friendly alternatives.\n- Do not quote the profanity back - just acknowledge the feeling.\n- Examples of BAD alternatives: 'fuck you', 'shit', 'damn'\n- Examples of GOOD alternatives: 'I'm frustrated', 'I'm upset', 'I need a break'"
        
        prompt = f"""You are a helpful communication coach for children (age {self.age_range}).

A child said: "{message}"

Issues detected: {issues}
Emotion: {emotion}
Severity: {classification.value.upper()}
{context_note}{profanity_warning}

Provide constructive, age-appropriate feedback in 3-4 sentences (be concise but complete):
1. Acknowledge their feeling (be empathetic) - but DO NOT repeat any profanity
2. Explain why the message might hurt others (be specific - mention what they said if relevant, but use clean language)
3. Suggest a kinder alternative (ONLY clean, appropriate alternatives)

CRITICAL RULES:
- NEVER include profanity, threats, or inappropriate language anywhere in your response
- NEVER include profanity in your suggestions or alternatives
- NEVER suggest the original message as an alternative - all alternatives must be DIFFERENT and constructive
- If the original message had profanity, do not repeat it - just acknowledge the feeling
- All suggestions must be clean, child-appropriate, and DIFFERENT from the original message
- Examples of clean alternatives: "I'm frustrated", "I'm upset", "Can we talk?", "I need a break"
- DO NOT quote or repeat the original message in your suggestions

Be warm, supportive, and educational. Never shame them.
Reference specific things they mentioned (like "drawing" or "game") when relevant.

Your response (clean, no profanity, no original message):"""
        
        return prompt
    
    def _call_api(self, prompt: str) -> Optional[str]:
        """Call Hugging Face Inference API using InferenceClient or requests."""
        
        # Use InferenceClient if available (recommended - handles new endpoint automatically)
        if self.use_client and self.client:
            try:
                # Try text generation first
                try:
                    response = self.client.text_generation(
                        prompt,
                        max_new_tokens=300,  # Increased to allow longer responses
                        temperature=0.7,
                        top_p=0.9,
                        do_sample=True,
                        return_full_text=False
                    )
                    text = response.strip()
                except Exception:
                    # If text_generation fails, try conversational API
                    # For instruction-tuned models, we format as a conversation
                    response = self.client.chat_completion(
                        messages=[{"role": "user", "content": prompt}],
                        max_tokens=300,  # Increased to allow longer responses
                        temperature=0.7,
                        top_p=0.9
                    )
                    # Extract text from chat completion response
                    if isinstance(response, dict) and "choices" in response:
                        text = response["choices"][0]["message"]["content"]
                    else:
                        text = str(response)
                    text = text.strip()
                
                # Remove prompt if model included it
                if prompt in text:
                    text = text.replace(prompt, "").strip()
                
                return text if text else None
                
            except Exception as e:
                logger.warning(f"HF InferenceClient failed: {e}, trying requests fallback")
                # Fall through to requests fallback
        
        # Fallback to requests (for older huggingface_hub versions or if InferenceClient fails)
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 300,  # Increased to allow longer responses
                "temperature": 0.7,
                "return_full_text": False,
                "do_sample": True,
                "top_p": 0.9,
            }
        }
        
        try:
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Response format can vary by model
                if isinstance(result, list) and len(result) > 0:
                    text = result[0].get("generated_text", "")
                elif isinstance(result, dict):
                    text = result.get("generated_text", "")
                else:
                    text = str(result)
                
                text = text.strip()
                if prompt in text:
                    text = text.replace(prompt, "").strip()
                
                return text if text else None
            
            elif response.status_code == 503:
                logger.warning("Model is loading, please wait a moment and try again")
                return None
            elif response.status_code == 410:
                logger.error("API endpoint deprecated. Please update huggingface_hub library")
                return None
            else:
                error_text = response.text
                logger.warning(f"HF API error {response.status_code}: {error_text}")
                return None
                
        except Exception as e:
            logger.warning(f"HF API request failed: {e}")
            return None
    
    def _contains_profanity(self, text: str) -> bool:
        """Check if text contains profanity using pattern matching."""
        import re
        from ..analyzer.patterns import PatternAnalyzer
        
        # Use the same profanity patterns as PatternAnalyzer
        profanity_patterns = PatternAnalyzer.PROFANITY_PATTERNS
        text_lower = text.lower()
        
        for pattern in profanity_patterns:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True
        
        # Also check for common profanity words
        profanity_words = {"fuck", "shit", "ass", "bitch", "damn", "hell", "crap"}
        words = set(text_lower.split())
        if words & profanity_words:
            return True
        
        return False
    
    def _parse_response(
        self,
        text: str,
        original_message: str,
        analysis: AnalysisResult
    ) -> Feedback:
        """
        Parse LLM response into Feedback object.
        
        The response should be a brief, constructive message.
        We'll extract alternatives and tips from the response if present.
        CRITICAL: Filter out any profanity from alternatives.
        """
        # Clean up the response
        text = text.strip()
        
        # Remove any markdown formatting
        text = text.replace("**", "").replace("*", "")
        
        # Split into sentences
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        
        # Main message - truncate intelligently at sentence boundaries
        # Allow up to 1000 characters, but cut at sentence boundary
        max_length = 1000
        if len(text) > max_length:
            # Find the last complete sentence before the limit
            truncated = text[:max_length]
            last_period = truncated.rfind('.')
            last_exclamation = truncated.rfind('!')
            last_question = truncated.rfind('?')
            
            # Find the last sentence ending
            last_sentence_end = max(last_period, last_exclamation, last_question)
            
            if last_sentence_end > max_length * 0.7:  # Only if we're not cutting too much
                main_message = text[:last_sentence_end + 1].strip()
            else:
                # If no good sentence boundary, just truncate and add ellipsis
                main_message = truncated.strip() + "..."
        else:
            main_message = text
        
        # Try to extract alternatives if mentioned
        alternatives = []
        if "instead" in text.lower() or "could say" in text.lower() or "try saying" in text.lower():
            # Simple extraction - look for quoted phrases or suggestions
            import re
            quoted = re.findall(r'"([^"]+)"', text)
            alternatives.extend(quoted[:5])  # Get more, then filter
        
        # CRITICAL: Filter out any profanity and original message from alternatives
        clean_alternatives = []
        original_lower = original_message.lower().strip()
        
        for alt in alternatives:
            alt_lower = alt.lower().strip()
            
            # Skip if it contains profanity
            if self._contains_profanity(alt):
                continue
            
            # Skip if it's the same as the original message (case-insensitive)
            if alt_lower == original_lower:
                continue
            
            # Skip if it's very similar to the original (contains most of the same words)
            import difflib
            similarity = difflib.SequenceMatcher(None, original_lower, alt_lower).ratio()
            if similarity > 0.7:  # More than 70% similar
                continue
            
            # Skip if the alternative is just the original message with minor changes
            if original_lower in alt_lower or alt_lower in original_lower:
                original_words = set(original_lower.split())
                alt_words = set(alt_lower.split())
                if len(original_words) > 0 and len(original_words & alt_words) / len(original_words) > 0.5:
                    continue
            
            clean_alternatives.append(alt)
        
        # If no clean alternatives found, use safe defaults
        if not clean_alternatives:
            clean_alternatives = [
                "I'm feeling frustrated right now",
                "Can we talk about this?",
                "I need a moment"
            ]
        else:
            # Limit to 3 clean alternatives
            clean_alternatives = clean_alternatives[:3]
        
        # Communication tip
        tip = "Remember: kind words make better connections."
        
        return Feedback(
            main_message=main_message,
            suggested_alternatives=clean_alternatives,
            communication_tip=tip
        )
    
    def generate_educational(
        self,
        classification: Classification,
        analysis: AnalysisResult
    ) -> Optional[Educational]:
        """Generate educational content (uses templates for now)."""
        # For now, we'll let the template generator handle this
        # Could be enhanced with LLM in the future
        return None
    
    def get_status(self) -> dict:
        """Get generator status."""
        return {
            "provider": "huggingface",
            "model": self.model_id,
            "api_key_configured": self.is_available(),
            "age_range": self.age_range
        }

