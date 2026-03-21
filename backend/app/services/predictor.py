"""
ML Model Predictor Service for Chest X-Ray Classification.

Supports loading both TensorFlow (.h5) and PyTorch (.pt/.pth) models.
Falls back to a demo mode with realistic random predictions when no model is found.
"""

import os
import logging
import numpy as np
from typing import Dict, Optional, Tuple
from pathlib import Path
import json

from app.utils.preprocessing import preprocess_image

# Attempt to import custom model class so torch.load can unpickle it
try:
    from train_custom_model import ChestXRNet
except ImportError:
    pass

logger = logging.getLogger(__name__)

# Class labels for chest X-ray classification
CLASS_LABELS = [
    "Normal",
    "Pneumonia",
    "COVID-19",
    "Tuberculosis",
    "Lung Opacity",
]

# Path to the model directory
MODEL_DIR = Path(os.getenv("MODEL_DIR", "model"))


class Predictor:
    """
    Chest X-Ray classification predictor.
    
    Supports:
        - TensorFlow/Keras .h5 models
        - PyTorch .pt/.pth models
        - Demo mode (no model required)
    """
    
    def __init__(self):
        self.model = None
        self.framework: Optional[str] = None
        self.class_labels = CLASS_LABELS
        self._load_classes()
        self._load_model()
        
    def _load_classes(self) -> None:
        """Load dynamically generated classes from model training if available."""
        classes_file = MODEL_DIR / "classes.json"
        if classes_file.exists():
            try:
                with open(classes_file, "r") as f:
                    loaded_classes = json.load(f)
                    if isinstance(loaded_classes, list) and len(loaded_classes) > 0:
                        self.class_labels = loaded_classes
                        logger.info(f"Loaded custom class labels from classes.json: {self.class_labels}")
            except Exception as e:
                logger.error(f"Failed to load classes.json: {e}")
    
    def _load_model(self) -> None:
        """
        Attempt to load a trained model from the model directory.
        Checks for .h5 (TensorFlow) first, then .pt/.pth (PyTorch).
        Falls back to demo mode if no model is found.
        """
        model_dir = MODEL_DIR
        
        if not model_dir.exists():
            model_dir.mkdir(parents=True, exist_ok=True)
            logger.warning(f"Model directory created at {model_dir}. No model found — running in DEMO mode.")
            return
        
        # Try loading TensorFlow/Keras model
        h5_files = list(model_dir.glob("*.h5"))
        if h5_files:
            try:
                import tensorflow as tf
                model_path = h5_files[0]
                self.model = tf.keras.models.load_model(str(model_path))
                self.framework = "tensorflow"
                logger.info(f"Loaded TensorFlow model from {model_path}")
                
                # Try to infer class count from model output
                output_shape = self.model.output_shape
                if isinstance(output_shape, tuple) and len(output_shape) == 2:
                    num_classes = output_shape[1]
                    if num_classes != len(self.class_labels):
                        self.class_labels = [f"Class_{i}" for i in range(num_classes)]
                        logger.info(f"Adjusted class labels to {num_classes} classes")
                return
            except Exception as e:
                logger.error(f"Failed to load TensorFlow model: {e}")
        
        # Try loading PyTorch model
        pt_files = list(model_dir.glob("*.pt")) + list(model_dir.glob("*.pth"))
        if pt_files:
            try:
                import torch
                model_path = pt_files[0]
                self.model = torch.load(str(model_path), map_location=torch.device("cpu"))
                self.model.eval()
                self.framework = "pytorch"
                logger.info(f"Loaded PyTorch model from {model_path}")
                logger.info(f"Loaded PyTorch model from {model_path}")
                return
            except Exception as e:
                logger.error(f"Failed to load PyTorch model: {e}")
                
        # Try loading Scikit-Learn model
        pkl_files = list(model_dir.glob("*.pkl")) + list(model_dir.glob("*.joblib"))
        if pkl_files:
            try:
                import joblib
                model_path = pkl_files[0]
                self.model = joblib.load(model_path)
                self.framework = "sklearn"
                logger.info(f"Loaded Scikit-Learn model from {model_path}")
                return
            except Exception as e:
                logger.error(f"Failed to load Scikit-Learn model: {e}")
        
        logger.warning("No model file found in model directory — running in DEMO mode.")
    
    def predict(self, image_bytes: bytes) -> Dict:
        """
        Run inference on a chest X-ray image.
        
        Args:
            image_bytes: Raw bytes of the uploaded image
            
        Returns:
            Dictionary with prediction label, confidence, and all class probabilities
        """
        if self.model is None:
            return self._demo_predict()
        
        try:
            # Preprocess the image
            processed = preprocess_image(
                image_bytes,
                framework=self.framework or "tensorflow"
            )
            
            if self.framework == "tensorflow":
                predictions = self.model.predict(processed, verbose=0)
                probabilities = predictions[0]
            
            elif self.framework == "pytorch":
                import torch
                tensor = torch.from_numpy(processed)
                with torch.no_grad():
                    output = self.model(tensor)
                    probabilities = torch.nn.functional.softmax(output, dim=1)[0].numpy()
            
            elif self.framework == "sklearn":
                # Scikit-learn predict_proba returns array of shape (1, num_classes)
                # Note: Not all SVCs support probabilities, but RandomForests do.
                probabilities = self.model.predict_proba(processed)[0]
                
            else:
                return self._demo_predict()
            
            return self._format_result(probabilities)
        
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return self._demo_predict()
    
    def _format_result(self, probabilities: np.ndarray) -> Dict:
        """Format model output probabilities into a structured response."""
        predicted_idx = int(np.argmax(probabilities))
        confidence = float(probabilities[predicted_idx])
        
        # Build per-class probability breakdown
        all_predictions = {
            self.class_labels[i]: round(float(probabilities[i]), 4)
            for i in range(len(self.class_labels))
        }
        
        return {
            "prediction": self.class_labels[predicted_idx],
            "confidence": round(confidence, 4),
            "all_predictions": all_predictions,
            "model_loaded": True,
        }
    
    def _demo_predict(self) -> Dict:
        """
        Generate realistic demo predictions when no model is loaded.
        Useful for frontend development and testing.
        """
        # Generate plausible probability distribution
        raw = np.random.dirichlet(np.ones(len(self.class_labels)) * 0.5)
        
        # Make one class dominant for realism
        dominant_idx = np.random.randint(0, len(self.class_labels))
        raw[dominant_idx] += 0.4
        probabilities = raw / raw.sum()
        
        result = self._format_result(probabilities)
        result["model_loaded"] = False
        result["note"] = "Demo mode — place your trained model (.h5 or .pt) in the /model directory"
        
        return result
    
    @property
    def is_loaded(self) -> bool:
        """Check if a real model is loaded."""
        return self.model is not None
    
    @property
    def model_info(self) -> Dict:
        """Return metadata about the loaded model."""
        return {
            "loaded": self.is_loaded,
            "framework": self.framework,
            "classes": self.class_labels,
            "num_classes": len(self.class_labels),
        }
