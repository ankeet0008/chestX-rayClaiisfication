"""
Image preprocessing utilities for Chest X-Ray classification.
Handles resizing, normalization, and format conversion for model input.
"""

import io
import numpy as np
from PIL import Image
from typing import Tuple


# Standard input size for most CXR models
DEFAULT_IMAGE_SIZE = (224, 224)

# ImageNet normalization values (commonly used for transfer learning models)
IMAGENET_MEAN = np.array([0.485, 0.456, 0.406])
IMAGENET_STD = np.array([0.229, 0.224, 0.225])


def validate_image(file_bytes: bytes) -> bool:
    """
    Validate that the uploaded bytes represent a valid image file.
    
    Args:
        file_bytes: Raw bytes of the uploaded file
        
    Returns:
        True if valid image, False otherwise
    """
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()
        return True
    except Exception:
        return False


def preprocess_image(
    file_bytes: bytes,
    target_size: Tuple[int, int] = DEFAULT_IMAGE_SIZE,
    normalize: bool = True,
    framework: str = "tensorflow"
) -> np.ndarray:
    """
    Preprocess a chest X-ray image for model inference.
    
    Pipeline:
        1. Load image from bytes
        2. Convert to RGB (handles grayscale CXRs)
        3. Resize to target dimensions
        4. Convert to float32 array
        5. Normalize pixel values
        6. Add batch dimension
    
    Args:
        file_bytes: Raw image bytes
        target_size: (height, width) tuple for resizing
        normalize: Whether to apply ImageNet normalization
        framework: "tensorflow" or "pytorch" for correct axis ordering
        
    Returns:
        Preprocessed numpy array ready for model inference
    """
    if framework == "sklearn":
        img = Image.open(io.BytesIO(file_bytes)).convert("L")
        # Match resolution of 96x96
        img = img.resize((96, 96), Image.Resampling.LANCZOS)
        # Normalize to [0, 1] and flatten
        img_array = np.array(img).flatten().astype(np.float32) / 255.0
        return np.expand_dims(img_array, axis=0)
        
    # Load and convert to RGB
    img = Image.open(io.BytesIO(file_bytes))
    img = img.convert("RGB")
    
    # Resize with high-quality resampling
    img = img.resize(target_size, Image.Resampling.LANCZOS)
    
    # Convert to numpy array and normalize to [0, 1]
    img_array = np.array(img, dtype=np.float32) / 255.0
    
    if normalize:
        # Apply ImageNet normalization
        img_array = (img_array - IMAGENET_MEAN) / IMAGENET_STD
    
    if framework == "pytorch":
        # PyTorch expects (C, H, W) format
        img_array = np.transpose(img_array, (2, 0, 1))
    
    # Add batch dimension: (1, H, W, C) for TF or (1, C, H, W) for PyTorch
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array.astype(np.float32)
