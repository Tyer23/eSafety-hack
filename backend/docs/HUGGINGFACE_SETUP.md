# Hugging Face LLM Setup Guide

## Overview

The system now supports using Hugging Face's free Inference API to generate personalized, detailed feedback for children's messages.

## Quick Start

### 1. Get Your Hugging Face API Token

1. Sign up at [huggingface.co](https://huggingface.co) (free)
2. Go to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
3. Create a new token (read access is enough)
4. Copy the token (starts with `hf_`)

### 2. Create `.env` File

Create a `.env` file in the project root:

```bash
# .env
HF_API_KEY=hf_your_actual_token_here
```

**Important**: The `.env` file is already in `.gitignore` - never commit it!

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the System

```bash
# Interactive mode (uses HF LLM automatically)
python main.py

# Or use in code
from src.pipeline import MessageProcessor
import os
from dotenv import load_dotenv

load_dotenv()
processor = MessageProcessor(
    use_models=True,
    feedback_mode="hf_llm",
    hf_api_key=os.getenv("HF_API_KEY")
)
result = processor.process("I hate your drawing")
```

## Usage Examples

### Command Line

```bash
# Interactive mode (uses HF LLM)
python main.py

# Run demo
python main.py --demo

# Start API server
python main.py --api
```

### Python Code

```python
from src.pipeline import MessageProcessor
import os
from dotenv import load_dotenv

load_dotenv()

# Create processor with HF LLM
processor = MessageProcessor(
    use_models=True,
    feedback_mode="hf_llm",
    hf_api_key=os.getenv("HF_API_KEY")
)

# Process a message
result = processor.process("I hate your drawing. I'm bored")

print(f"Classification: {result.classification.value}")
print(f"Used LLM: {result.metadata.used_llm}")
if result.feedback:
    print(f"Feedback: {result.feedback.main_message}")
```

## Free Tier Limits

- **1,000 requests/month** (default)
- Can request more by contacting Hugging Face
- No credit card required
- Models may take 10-30 seconds to load on first request

## Available Models

Default model: `mistralai/Mistral-7B-Instruct-v0.2`

You can specify a different model in `.env`:

```bash
HF_MODEL_ID=meta-llama/Llama-3-8b-Instruct
```

Other good options:
- `HuggingFaceH4/zephyr-7b-beta` - Fast and good quality
- `google/flan-t5-large` - Smaller, faster
- `meta-llama/Llama-3-8b-Instruct` - Requires access request

## Troubleshooting

### "HF_API_KEY not found"

1. Make sure you created a `.env` file in the project root
2. Check that the file contains: `HF_API_KEY=hf_your_token`
3. Verify `.env` is not in `.gitignore` (it should be ignored)

### "Model is loading" (503 error)

- First request to a model takes 10-30 seconds to load
- Wait a moment and try again
- Subsequent requests are fast

### "Request timed out"

- Default timeout is 30 seconds
- Some models are slower than others
- Try a faster model like `google/flan-t5-large`

### Falls back to templates

- If HF API fails, system automatically falls back to templates
- Check logs for error messages
- Verify your API key is correct

## Security Best Practices

✅ **DO:**
- Store API key in `.env` file
- Add `.env` to `.gitignore` (already done)
- Use environment variables in production
- Rotate keys if exposed

❌ **DON'T:**
- Commit `.env` files to git
- Hardcode API keys in code
- Share API keys in screenshots/logs
- Commit keys to public repositories

## Environment Variables

Create a `.env` file with:

```bash
# Required for HF LLM mode
HF_API_KEY=your_token_here

# Optional - specify different model
HF_MODEL_ID=mistralai/Mistral-7B-Instruct-v0.2

# Other settings
USE_MODELS=true
DEFAULT_AGE_RANGE=8-10
```

## Performance

- **First request**: 10-30s (model loading)
- **Subsequent requests**: 2-5s (typical)
- **Cache**: Results are cached for 1 hour
- **Fallback**: Automatically uses templates if HF fails

## Cost

**100% FREE** - No credit card required!

- Free tier: 1,000 requests/month
- Can request more if needed
- All processing happens on Hugging Face servers




