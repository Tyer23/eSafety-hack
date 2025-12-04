"""
Model Configuration for Production Pipeline

Defines all model configurations for:
- Classification (toxicity, emotion)
- Feedback generation (Hugging Face LLM with template fallback)
"""

import os
from dataclasses import dataclass
from typing import Optional


MODEL_CONFIG = {
    # Classification models (fast, always loaded)
    "classification": {
        "toxicity": {
            "source": "HuggingFace",
            "model_id": "unitary/toxic-bert",  # Public model, no auth required
            "cache_dir": "./models/classification",
            "max_length": 512,
            "purpose": "Detect toxic and harmful content"
        },
        "emotion": {
            "source": "HuggingFace", 
            "model_id": "bhadresh-savani/distilbert-base-uncased-emotion",
            "cache_dir": "./models/classification",
            "purpose": "Understand emotional context"
        }
    },
    
    # Feedback generation (Hugging Face LLM with template fallback)
    "feedback": {
        "hf_llm": {
            "description": "Hugging Face LLM for personalized feedback",
            "fallback": "Built-in templates if HF API unavailable"
        }
    },
    
    # Cache settings
    "cache": {
        "enabled": True,
        "max_size": 1000,
        "ttl_seconds": 3600
    }
}


@dataclass
class ProductionConfig:
    """Production configuration with environment overrides."""
    
    # Device
    device: str = "cpu"
    use_gpu: bool = False
    
    # Models
    use_classification_models: bool = True
    
    # Processing
    default_age_range: str = "8-10"
    max_message_length: int = 500
    
    # Cache
    cache_enabled: bool = True
    cache_max_size: int = 1000
    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    workers: int = 4
    
    @classmethod
    def from_env(cls) -> "ProductionConfig":
        """Load config from environment."""
        return cls(
            device=os.getenv("DEVICE", "cpu"),
            use_gpu=os.getenv("USE_GPU", "false").lower() == "true",
            use_classification_models=os.getenv("USE_MODELS", "true").lower() == "true",
            default_age_range=os.getenv("AGE_RANGE", "8-10"),
            cache_enabled=os.getenv("CACHE_ENABLED", "true").lower() == "true",
            api_host=os.getenv("API_HOST", "0.0.0.0"),
            api_port=int(os.getenv("API_PORT", "8000")),
            workers=int(os.getenv("WORKERS", "4")),
        )


def get_model_config(model_type: str, model_name: str) -> dict:
    """Get configuration for a specific model."""
    return MODEL_CONFIG.get(model_type, {}).get(model_name, {})

