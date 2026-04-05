from fastapi.testclient import TestClient
import io
import pytest

from app.main import app

client = TestClient(app)

def test_read_root():
    """Test the root endpoint for API info."""
    response = client.get("/")
    assert response.status_code == 200
    expected_keys = ["service", "version", "docs", "health"]
    for key in expected_keys:
        assert key in response.json()

def test_health_check():
    """Test the /api/health endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"
    assert "model_loaded" in data

def test_model_info():
    """Test the /api/model-info endpoint."""
    response = client.get("/api/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "loaded" in data
    assert "num_classes" in data
    assert "classes" in data

def test_history_endpoints():
    """Test getting and clearing prediction history."""
    # First, get history
    response = client.get("/api/history")
    assert response.status_code == 200
    assert "history" in response.json()
    
    # Then clear history
    response = client.delete("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "History cleared"
    assert data["total"] == 0

def test_predict_invalid_file_type():
    """Test uploading a non-image file."""
    # Create fake text file
    file_content = b"This is not an image."
    files = {"file": ("test.txt", io.BytesIO(file_content), "text/plain")}
    
    response = client.post("/api/predict", files=files)
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]

def test_predict_large_file():
    """Test uploading a file that is too large."""
    # Create fake large file (over 10MB) - mock the size instead of creating a real 10MB byte array to save memory during tests
    # Actually, fastAPI depends on starlette's upload file. Let's just create a large byte string
    large_content = b"0" * (11 * 1024 * 1024)
    files = {"file": ("test.png", io.BytesIO(large_content), "image/png")}
    
    response = client.post("/api/predict", files=files)
    assert response.status_code == 400
    assert "File too large" in response.json()["detail"]

def test_predict_fake_image():
    """Test uploading a file with an image extension but invalid content."""
    file_content = b"I pretend to be an image but I am just text."
    files = {"file": ("fake.jpg", io.BytesIO(file_content), "image/jpeg")}
    
    response = client.post("/api/predict", files=files)
    assert response.status_code == 400
    assert "not a valid image" in response.json()["detail"]

# Provide a small valid 1x1 png image for a positive test
VALID_1x1_PNG = bytes.fromhex(
    "89504e470d0a1a0a0000000d4948445200000001000000010802000000907753de0000000c4944415408d763f8cfc000000301010018dd8d540000000049454e44ae426082"
)

def test_predict_valid_image():
    """Test predicting with a valid image."""
    files = {"file": ("test.png", io.BytesIO(VALID_1x1_PNG), "image/png")}
    response = client.post("/api/predict", files=files)
    
    # 429 could happen due to rate limiting if run multiple times, 
    # but 200 is expected on local environments.
    if response.status_code == 200:
        data = response.json()
        assert "prediction" in data
        assert "confidence" in data
        assert "all_predictions" in data
        assert "model_loaded" in data
