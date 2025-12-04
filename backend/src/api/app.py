"""
FastAPI REST API for Kid Message Safety System.
"""

import logging
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ..pipeline import MessageProcessor
from ..models import ProcessingResult, Classification

logger = logging.getLogger(__name__)

# Global processor
_processor: Optional[MessageProcessor] = None


class AnalyzeRequest(BaseModel):
    """Request for message analysis."""
    message: str = Field(..., max_length=500)
    age_range: str = Field(default="8-10")
    
    model_config = {
        "json_schema_extra": {
            "examples": [{"message": "You're stupid", "age_range": "8-10"}]
        }
    }


class QuickClassifyRequest(BaseModel):
    message: str = Field(..., max_length=500)


class QuickClassifyResponse(BaseModel):
    classification: str


class HealthResponse(BaseModel):
    status: str
    ready: bool


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize processor on startup."""
    import os
    from dotenv import load_dotenv
    
    global _processor
    logger.info("Starting Kid Message Safety API...")
    
    load_dotenv()
    hf_api_key = os.getenv("HF_API_KEY")
    hf_model_id = os.getenv("HF_MODEL_ID")
    
    _processor = MessageProcessor(
        use_models=True,
        feedback_mode="hf_llm",
        hf_api_key=hf_api_key,
        hf_model_id=hf_model_id
    )
    logger.info("API ready")
    yield
    _processor = None


def create_app() -> FastAPI:
    """Create FastAPI application."""
    app = FastAPI(
        title="Kid Message Safety System",
        description='AI-powered communication coach. "We help you say it better, not stop you from saying it."',
        version="1.0.0",
        lifespan=lifespan
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    return app


app = create_app()


def get_processor() -> MessageProcessor:
    if _processor is None:
        raise HTTPException(status_code=503, detail="Service not ready")
    return _processor


@app.get("/", tags=["General"])
async def root():
    return {
        "name": "Kid Message Safety System",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse, tags=["General"])
async def health():
    return HealthResponse(status="healthy", ready=_processor is not None)


@app.post("/analyze", response_model=ProcessingResult, tags=["Analysis"])
async def analyze(request: AnalyzeRequest):
    """Analyze a message and get feedback."""
    processor = get_processor()
    result = processor.process(request.message, request.age_range)
    
    if not result.success:
        raise HTTPException(status_code=400, detail=result.error_message)
    
    return result


@app.post("/classify", response_model=QuickClassifyResponse, tags=["Analysis"])
async def classify(request: QuickClassifyRequest):
    """Quick classification without feedback."""
    processor = get_processor()
    classification = processor.quick_classify(request.message)
    return QuickClassifyResponse(classification=classification.value)


@app.post("/batch", tags=["Analysis"])
async def batch(messages: list[str], age_range: str = "8-10"):
    """Analyze multiple messages."""
    if len(messages) > 100:
        raise HTTPException(status_code=400, detail="Max 100 messages per batch")
    
    processor = get_processor()
    results = [processor.process(msg, age_range) for msg in messages]
    
    return {"count": len(results), "results": [r.model_dump() for r in results]}


@app.get("/examples", tags=["Examples"])
async def examples():
    """Example messages for each classification."""
    return {
        "green": ["Hello!", "Can we try again?", "I don't like this game"],
        "yellow": ["This is boring", "Whatever", "Your idea is bad"],
        "red": ["You're stupid", "fuck you", "go die", "Nobody likes you"]
    }


@app.post("/settings/age-range", tags=["Settings"])
async def set_age_range(age_range: str):
    if age_range not in ["8-10", "11-13"]:
        raise HTTPException(status_code=400, detail="Must be '8-10' or '11-13'")
    get_processor().set_age_range(age_range)
    return {"message": f"Age range set to {age_range}"}

