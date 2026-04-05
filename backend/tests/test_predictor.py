import pytest
from app.services.predictor import Predictor
import numpy as np

def test_demo_predict():
    """Test the demo prediction fallback when no model is loaded."""
    predictor = Predictor()
    predictor.model = None  # Ensure demo mode overrides any loaded model
    
    result = predictor._demo_predict()
    
    assert "prediction" in result
    assert "confidence" in result
    assert "all_predictions" in result
    assert "model_loaded" in result
    assert result["model_loaded"] is False
    assert "note" in result

def test_format_result():
    """Test formatting probabilities into expected response structure."""
    predictor = Predictor()
    
    # Check default classes are loaded or fallback to default
    classes = predictor.class_labels
    
    # Mock probabilities
    probabilities = np.zeros(len(classes))
    # Make the first class the most probable
    probabilities[0] = 0.85
    for i in range(1, len(classes)):
        probabilities[i] = 0.15 / (len(classes) - 1)
        
    result = predictor._format_result(probabilities)
    
    assert result["prediction"] == classes[0]
    assert np.isclose(result["confidence"], 0.85)
    assert result["model_loaded"] is True
    
def test_predictor_initialization():
    """Test that predictor initializes correctly with proper configuration."""
    predictor = Predictor()
    # At minimum, should have default classes
    assert len(predictor.class_labels) > 0
    assert isinstance(predictor.class_labels, list)
    
    info = predictor.model_info
    assert "loaded" in info
    assert "classes" in info
    assert "num_classes" in info
    assert info["num_classes"] == len(predictor.class_labels)
