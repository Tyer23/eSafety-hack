"""
Tests for FastAPI REST interface.
"""

import pytest
from fastapi.testclient import TestClient


@pytest.fixture(scope="module")
def client():
    """Create test client with initialized processor."""
    from src.api.app import app
    from src.pipeline import MessageProcessor
    import src.api.app as api_module
    
    api_module._processor = MessageProcessor(use_models=False)
    
    with TestClient(app) as client:
        yield client
    
    api_module._processor = None


class TestAPIEndpoints:
    """Test API endpoint functionality."""
    
    def test_root(self, client):
        response = client.get("/")
        assert response.status_code == 200
        assert "name" in response.json()
    
    def test_health(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
    
    def test_analyze_green(self, client):
        response = client.post("/analyze", json={"message": "Hello!"})
        assert response.status_code == 200
        assert response.json()["classification"] == "green"
    
    def test_analyze_red(self, client):
        response = client.post("/analyze", json={"message": "fuck you"})
        assert response.status_code == 200
        assert response.json()["classification"] == "red"
        assert response.json()["feedback"] is not None
    
    def test_classify(self, client):
        response = client.post("/classify", json={"message": "You're stupid"})
        assert response.status_code == 200
        assert response.json()["classification"] == "red"
    
    def test_examples(self, client):
        response = client.get("/examples")
        assert response.status_code == 200
        data = response.json()
        assert "green" in data
        assert "yellow" in data
        assert "red" in data
    
    def test_batch(self, client):
        messages = ["Hello!", "fuck you", "whatever"]
        response = client.post("/batch", json=messages)
        assert response.status_code == 200
        assert response.json()["count"] == 3


class TestAPIValidation:
    """Test input validation."""
    
    def test_missing_message(self, client):
        response = client.post("/analyze", json={})
        assert response.status_code == 422
    
    def test_batch_limit(self, client):
        messages = ["test"] * 150
        response = client.post("/batch", json=messages)
        assert response.status_code == 400


class TestAPISettings:
    """Test settings endpoints."""
    
    def test_set_age_range_valid(self, client):
        response = client.post("/settings/age-range?age_range=11-13")
        assert response.status_code == 200
    
    def test_set_age_range_invalid(self, client):
        response = client.post("/settings/age-range?age_range=invalid")
        assert response.status_code == 400

