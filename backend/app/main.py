"""
FastAPI Application — Chest X-Ray Classification Service

Production-ready API server with:
    - CORS middleware for frontend communication
    - Rate limiting to prevent abuse
    - Structured logging
    - Static file serving for uploaded images
"""

import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

from pydantic import BaseModel

# ─── Logging ────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(levelname)-8s │ %(name)s │ %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

from app.api.routes import router

# Load environment variables
load_dotenv()

# ─── Rate Limiter ───────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)


# ─── Lifespan ───────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    logger.info("━" * 60)
    logger.info("  🫁 Chest X-Ray Classification API — Starting Up")
    logger.info("━" * 60)
    
    # Ensure model directory exists
    os.makedirs("model", exist_ok=True)
    
    yield
    
    logger.info("Shutting down Chest X-Ray Classification API")


# ─── App Factory ────────────────────────────────────────────
app = FastAPI(
    title="Chest X-Ray Classification API",
    description=(
        "AI-powered chest X-ray classification service. "
        "Upload a chest X-ray image and receive diagnostic predictions "
        "with confidence scores."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ─── Middleware ──────────────────────────────────────────────

# CORS — allow frontend to communicate with backend
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# ─── Global Error Handler ───────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all error handler to prevent stack traces leaking to clients."""
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred. Please try again.",
            "type": type(exc).__name__,
        },
    )


# ─── Routes ─────────────────────────────────────────────────
app.include_router(router)


@app.get("/", tags=["root"])
async def root():
    """API root — basic info."""
    return {
        "service": "Chest X-Ray Classification API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health",
    }


# ─── Run ────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8000")),
        reload=os.getenv("DEBUG", "true").lower() == "true",
        log_level="info",
    )
