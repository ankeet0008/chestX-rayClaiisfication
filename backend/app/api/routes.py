"""
API Routes for the Chest X-Ray Classification service.

Endpoints:
    POST /api/predict    — Upload an image and receive classification results
    GET  /api/health     — Health check
    GET  /api/model-info — Model metadata
"""

import time
import logging
from datetime import datetime
from typing import List

from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from pydantic import BaseModel, ConfigDict

from app.services.predictor import Predictor
from app.utils.preprocessing import validate_image

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["prediction"])

# Initialize predictor (singleton)
predictor = Predictor()

# In-memory prediction history (would be a database in production)
prediction_history: List[dict] = []

# Allowed file types and max size
ALLOWED_EXTENSIONS = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


# ─── Response Models ────────────────────────────────────────

class PredictionResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    
    prediction: str
    confidence: float
    all_predictions: dict
    model_loaded: bool
    note: str = ""
    timestamp: str = ""
    inference_time_ms: float = 0.0


class HealthResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    
    status: str
    model_loaded: bool
    uptime: str


class ModelInfoResponse(BaseModel):
    loaded: bool
    framework: str | None
    classes: list
    num_classes: int


# ─── Endpoints ──────────────────────────────────────────────

@router.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """
    Classify a chest X-ray image.
    
    Accepts: JPEG, PNG, or WebP images up to 10 MB.
    Returns: Predicted class, confidence score, and per-class probabilities.
    """
    # ── Validate file type ──
    if file.content_type not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # ── Read and validate size ──
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)} MB."
        )
    
    # ── Validate image integrity ──
    if not validate_image(contents):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not a valid image."
        )
    
    # ── Run prediction ──
    start_time = time.time()
    result = predictor.predict(contents)
    inference_time = (time.time() - start_time) * 1000  # ms
    
    # ── Build response ──
    timestamp = datetime.now().isoformat()
    response = PredictionResponse(
        prediction=result["prediction"],
        confidence=result["confidence"],
        all_predictions=result["all_predictions"],
        model_loaded=result["model_loaded"],
        note=result.get("note", ""),
        timestamp=timestamp,
        inference_time_ms=round(inference_time, 2),
    )
    
    # ── Store in history ──
    prediction_history.append({
        "id": len(prediction_history) + 1,
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"],
        "timestamp": timestamp,
        "inference_time_ms": round(inference_time, 2),
    })
    
    logger.info(
        f"Prediction: {result['prediction']} "
        f"(confidence: {result['confidence']:.2%}) "
        f"in {inference_time:.1f}ms"
    )
    
    return response


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        model_loaded=predictor.is_loaded,
        uptime="running",
    )


@router.get("/model-info", response_model=ModelInfoResponse)
async def model_info():
    """Return information about the loaded model."""
    info = predictor.model_info
    return ModelInfoResponse(**info)


@router.get("/history")
async def get_history():
    """Return prediction history (most recent first)."""
    return {
        "history": list(reversed(prediction_history)),
        "total": len(prediction_history),
    }


@router.delete("/history")
async def clear_history():
    """Clear prediction history."""
    prediction_history.clear()
    return {"message": "History cleared", "total": 0}
