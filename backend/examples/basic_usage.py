"""
Basic Usage Example

Run with: python examples/basic_usage.py

Note: For production use, set HF_API_KEY in .env to use Hugging Face LLM
for personalized feedback. This example uses rule-based mode for fast demo.
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.pipeline import MessageProcessor
from src.models import Classification


def main():
    print("=" * 60)
    print("Kid Message Safety System - Basic Usage Demo")
    print("=" * 60)
    print()
    
    # Initialize (rule-based for fast demo, use HF LLM in production)
    print("Initializing...")
    processor = MessageProcessor(use_models=False)
    print("Ready!\n")
    
    # Test messages
    examples = [
        ("Hello, how are you?", "Friendly greeting"),
        ("You played really well!", "Positive feedback"),
        ("This game is boring", "Mild complaint"),
        ("Whatever, I don't care", "Dismissive"),
        ("You're so stupid", "Personal attack"),
        ("fuck you", "Profanity"),
        ("go die", "Threat"),
        ("Garen, fuck your spinning", "Gaming toxicity"),
    ]
    
    for message, description in examples:
        result = processor.process(message)
        
        emoji = {
            Classification.GREEN: "✅",
            Classification.YELLOW: "⚠️",
            Classification.RED: "🚫"
        }[result.classification]
        
        print(f"{emoji} {result.classification.value.upper():6} | {message}")
        print(f"   ({description})")
        
        if result.feedback:
            print(f"   💬 {result.feedback.main_message[:60]}...")
            if result.feedback.suggested_alternatives:
                print(f"   💡 Try: \"{result.feedback.suggested_alternatives[0]}\"")
        
        print()


def interactive():
    """Interactive testing mode."""
    print("=" * 60)
    print("Interactive Mode - Type messages to analyze")
    print("=" * 60)
    print()
    
    processor = MessageProcessor(use_models=False)
    
    while True:
        try:
            msg = input("📝 Message: ").strip()
            if msg.lower() in ['quit', 'exit', 'q']:
                break
            if not msg:
                continue
            
            result = processor.process(msg)
            emoji = {"green": "✅", "yellow": "⚠️", "red": "🚫"}[result.classification.value]
            
            print(f"\n{emoji} {result.classification.value.upper()}")
            if result.feedback:
                print(f"💬 {result.feedback.main_message}\n")
            else:
                print("Great message! 👍\n")
                
        except KeyboardInterrupt:
            break
    
    print("Goodbye! 👋")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        interactive()
    else:
        main()

