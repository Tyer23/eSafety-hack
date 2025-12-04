# Kid Message Safety System - Production Dockerfile
# Multi-stage build for smaller final image

# Stage 1: Base with dependencies
FROM python:3.12-slim as base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Production image
FROM python:3.12-slim as production

WORKDIR /app

# Copy installed packages from base
COPY --from=base /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=base /usr/local/bin /usr/local/bin

# Copy application code
COPY src/ ./src/
COPY main.py .

# Create models directory for caching
RUN mkdir -p /app/models/classification /app/models/feedback

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV API_HOST=0.0.0.0
ENV API_PORT=8000
ENV USE_MODELS=true
ENV FEEDBACK_MODE=templates
ENV CACHE_ENABLED=true

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Run the API server
CMD ["uvicorn", "src.api.app:app", "--host", "0.0.0.0", "--port", "8000"]

