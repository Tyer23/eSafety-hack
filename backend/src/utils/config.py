"""
Configuration management.
"""

import os
from dataclasses import dataclass, field
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


@dataclass
class Config:
    """Application configuration."""
    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = False
    
    # Models
    device: str = "cpu"
    use_models: bool = True
    model_cache_dir: str = "./models"
    
    # Processing
    default_age_range: str = "8-10"
    max_message_length: int = 500
    
    # LLM API Keys (optional)
    hf_api_key: Optional[str] = None
    hf_model_id: Optional[str] = None
    
    @classmethod
    def from_env(cls) -> "Config":
        """Load config from environment variables."""
        return cls(
            api_host=os.getenv("API_HOST", "0.0.0.0"),
            api_port=int(os.getenv("API_PORT", "8000")),
            debug=os.getenv("DEBUG", "false").lower() == "true",
            device=os.getenv("DEVICE", "cpu"),
            use_models=os.getenv("USE_MODELS", "true").lower() == "true",
            default_age_range=os.getenv("DEFAULT_AGE_RANGE", "8-10"),
            hf_api_key=os.getenv("HF_API_KEY"),  # None if not set
            hf_model_id=os.getenv("HF_MODEL_ID"),  # None if not set (uses default)
        )
    
    def to_dict(self) -> dict:
        return {
            "api": {"host": self.api_host, "port": self.api_port, "debug": self.debug},
            "models": {"device": self.device, "use_models": self.use_models},
            "processing": {"age_range": self.default_age_range},
            "llm": {
                "hf_api_key_configured": self.hf_api_key is not None,
                "hf_model_id": self.hf_model_id
            }
        }

