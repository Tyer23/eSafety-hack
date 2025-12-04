"""
Logging configuration.
"""

import logging
import sys


def setup_logging(level: str = "INFO", log_file: str = None):
    """Configure application logging."""
    
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    root = logging.getLogger()
    root.setLevel(getattr(logging, level.upper()))
    root.handlers = []
    
    # Console handler
    console = logging.StreamHandler(sys.stdout)
    console.setFormatter(formatter)
    root.addHandler(console)
    
    # File handler (optional)
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        root.addHandler(file_handler)
    
    # Reduce noise from libraries
    logging.getLogger("transformers").setLevel(logging.WARNING)
    logging.getLogger("torch").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    
    logging.info(f"Logging configured: {level}")

