"""
Kid Message Safety & Communication Coach System

An AI-powered system that helps children (ages 8-13) improve their 
digital communication by detecting potentially harmful messages and 
providing constructive, age-appropriate feedback.

Core Philosophy: "We help you say it better, not stop you from saying it."
"""

__version__ = "1.0.0"
__author__ = "Kids Helper Team"

from .pipeline import MessageProcessor
from .models import ProcessingResult, Classification, Feedback

__all__ = ["MessageProcessor", "ProcessingResult", "Classification", "Feedback"]

