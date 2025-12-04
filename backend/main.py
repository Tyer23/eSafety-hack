"""
Kid Message Safety & Communication Coach System

Entry point:
    python main.py                  # Interactive mode (default)
    python main.py --demo           # Run demo
    python main.py --api            # Start API server
"""

import sys
import os
import argparse
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(__file__))

from src.pipeline import MessageProcessor
from src.models import Classification

# Load environment variables
load_dotenv()


def demo(processor):
    """Run demo with example messages."""
    print("=" * 60)
    print("Kid Message Safety System - Demo")
    print("=" * 60)
    print()
    
    examples = [
        ("Hello, how are you?", "Friendly greeting"),
        ("You played really well!", "Positive feedback"),
        ("This game is boring", "Mild complaint"),
        ("Whatever, I don't care", "Dismissive"),
        ("You're so stupid", "Personal attack"),
        ("fuck you", "Profanity"),
        ("go die", "Threat"),
        ("Garen, fuck your spinning", "Gaming toxicity"),
        ("I hate your art, go die", "Combined attack"),
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
        
        print(f"   [{result.metadata.processing_time_ms:.0f}ms]")
        print()


def interactive(processor):
    """Interactive testing mode."""
    print("=" * 60)
    print("Kid Message Safety - Interactive Mode")
    print("=" * 60)
    print()
    print("Type a message to analyze, or 'quit' to exit")
    print("Commands: 'status', 'cache', 'clear'")
    print()
    
    while True:
        try:
            msg = input("📝 Message: ").strip()
            
            if msg.lower() in ['quit', 'exit', 'q']:
                print("Goodbye! Remember: kind words make better friends! 👋")
                break
            
            if msg.lower() == 'status':
                status = processor.get_system_status()
                print(f"\n📊 System Status:")
                print(f"   Models loaded: {status['analyzer']['toxicity']['model_loaded']}")
                print(f"   Feedback mode: {status['feedback']['mode']}")
                if status['feedback'].get('hf_llm'):
                    hf_status = status['feedback']['hf_llm']
                    print(f"   HF LLM: {'✅ Available' if hf_status.get('api_key_configured') else '❌ Not configured'}")
                    if hf_status.get('api_key_configured'):
                        print(f"   HF Model: {hf_status.get('model', 'N/A')}")
                if status['cache']['enabled']:
                    print(f"   Cache: {status['cache']['size']}/{status['cache']['max_size']} ({status['cache']['hit_rate_percent']}% hit rate)")
                print()
                continue
            
            if msg.lower() == 'cache':
                if processor.cache:
                    stats = processor.cache.get_stats()
                    print(f"\n📦 Cache Stats:")
                    print(f"   Size: {stats['size']}/{stats['max_size']}")
                    print(f"   Hits: {stats['hits']}, Misses: {stats['misses']}")
                    print(f"   Hit Rate: {stats['hit_rate_percent']}%")
                print()
                continue
            
            if msg.lower() == 'clear':
                processor.clear_cache()
                print("Cache cleared!\n")
                continue
            
            if not msg:
                continue
            
            result = processor.process(msg)
            
            emoji = {
                Classification.GREEN: "✅",
                Classification.YELLOW: "⚠️",
                Classification.RED: "🚫"
            }[result.classification]
            
            print(f"\n{emoji} Classification: {result.classification.value.upper()}")
            print(f"   Confidence: {result.confidence:.0%}")
            print(f"   Toxicity: {result.analysis.toxicity.score:.2f}")
            
            if result.analysis.detected_issues:
                issues = [i.value for i in result.analysis.detected_issues]
                print(f"   Issues: {', '.join(issues)}")
            
            if result.feedback:
                print(f"\n💬 {result.feedback.main_message}")
                if result.feedback.suggested_alternatives:
                    print("\n💡 Better ways:")
                    for alt in result.feedback.suggested_alternatives[:2]:
                        print(f"   • {alt}")
                if result.feedback.communication_tip:
                    print(f"\n📚 Tip: {result.feedback.communication_tip}")
            
            # Only show processing time if not GREEN (GREEN = no message needed)
            if result.classification != Classification.GREEN:
                llm_indicator = " (HF LLM)" if result.metadata.used_llm else " (templates)"
                print(f"\n   [{result.metadata.processing_time_ms:.0f}ms{llm_indicator}]")
            print()
            
        except KeyboardInterrupt:
            print("\n\nGoodbye! 👋")
            break


def start_api():
    """Start the FastAPI server."""
    import uvicorn
    from src.config.model_config import ProductionConfig
    
    config = ProductionConfig.from_env()
    
    print("=" * 60)
    print("Kid Message Safety API Server")
    print("=" * 60)
    print(f"Starting on http://{config.api_host}:{config.api_port}")
    print(f"API docs: http://{config.api_host}:{config.api_port}/docs")
    print()
    
    uvicorn.run(
        "src.api.app:app",
        host=config.api_host,
        port=config.api_port,
        workers=1,
        reload=False
    )


def main():
    parser = argparse.ArgumentParser(
        description="Kid Message Safety & Communication Coach System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Uses Hugging Face LLM for personalized feedback.
Requires HF_API_KEY in .env file (get from https://huggingface.co/settings/tokens)

Examples:
  python main.py                     # Interactive mode
  python main.py --demo              # Run demo
  python main.py --api               # Start API server
        """
    )
    
    parser.add_argument(
        "--demo", 
        action="store_true",
        help="Run demo with example messages"
    )
    parser.add_argument(
        "--api",
        action="store_true", 
        help="Start API server"
    )
    parser.add_argument(
        "--no-cache",
        action="store_true",
        help="Disable response caching"
    )
    
    args = parser.parse_args()
    
    if args.api:
        start_api()
        return
    
    # Create processor with HF LLM mode
    print("Loading (Hugging Face LLM mode)...")
    hf_api_key = os.getenv("HF_API_KEY")
    hf_model_id = os.getenv("HF_MODEL_ID")
    
    if not hf_api_key:
        print("⚠️  Warning: HF_API_KEY not found in .env file")
        print("   The system will use template fallback for feedback.")
        print("   Get your token from: https://huggingface.co/settings/tokens\n")
    
    processor = MessageProcessor(
        use_models=True,
        feedback_mode="hf_llm",
        hf_api_key=hf_api_key,
        hf_model_id=hf_model_id,
        cache_enabled=not args.no_cache
    )
    
    print("Ready!\n")
    
    if args.demo:
        demo(processor)
    else:
        interactive(processor)


if __name__ == "__main__":
    main()
