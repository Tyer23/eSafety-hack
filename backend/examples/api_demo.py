"""
API Demo - Shows how to use the REST API

First start the server:
    python main.py --api
    # or: uvicorn src.api.app:app --reload

Then run this demo:
    python examples/api_demo.py
"""

import requests


BASE_URL = "http://localhost:8000"


def main():
    print("=" * 60)
    print("Kid Message Safety API Demo")
    print("=" * 60)
    print()
    print("Make sure the API is running:")
    print("  uvicorn src.api.app:app --reload")
    print()
    
    # Check health
    try:
        r = requests.get(f"{BASE_URL}/health")
        print(f"✅ API Status: {r.json()['status']}")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Start it first!")
        return
    
    print()
    
    # Analyze messages
    messages = [
        "Hello, how are you?",
        "This is boring",
        "You're stupid",
        "fuck you",
    ]
    
    print("Analyzing messages:")
    print("-" * 40)
    
    for msg in messages:
        r = requests.post(f"{BASE_URL}/analyze", json={"message": msg})
        data = r.json()
        
        emoji = {"green": "✅", "yellow": "⚠️", "red": "🚫"}[data["classification"]]
        print(f"{emoji} {data['classification'].upper():6} | \"{msg}\"")
    
    print()
    
    # Quick classify
    print("Quick classify:")
    print("-" * 40)
    
    r = requests.post(f"{BASE_URL}/classify", json={"message": "go die"})
    print(f"'go die' -> {r.json()['classification']}")
    
    print()
    
    # Batch
    print("Batch processing:")
    print("-" * 40)
    
    r = requests.post(f"{BASE_URL}/batch", json=["Hi!", "Idiot", "Whatever"])
    data = r.json()
    print(f"Processed {data['count']} messages")
    
    for i, result in enumerate(data['results']):
        print(f"  {i+1}. {result['classification']}")


def print_curl_examples():
    """Print curl command examples."""
    print("=" * 60)
    print("Curl Examples")
    print("=" * 60)
    print()
    
    examples = [
        ("Health check", "curl http://localhost:8000/health"),
        ("Analyze", 'curl -X POST http://localhost:8000/analyze -H "Content-Type: application/json" -d \'{"message": "You\\'re stupid"}\''),
        ("Quick classify", 'curl -X POST http://localhost:8000/classify -H "Content-Type: application/json" -d \'{"message": "fuck you"}\''),
        ("Examples", "curl http://localhost:8000/examples"),
    ]
    
    for name, cmd in examples:
        print(f"# {name}")
        print(cmd)
        print()


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--curl":
        print_curl_examples()
    else:
        main()

