"""
Vercel serverless entry point for FastAPI application.
app must be defined at the absolute top level so Vercel's static
scanner finds it before any try/except blocks run.
"""
import sys
import os
import logging
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Top-level app definition (satisfies Vercel static scanner) ──
# This fallback is replaced by the full app below if imports succeed.
app = FastAPI(title="TensorTrade API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Attempt to load the full app ────────────────────────────────
sys.path.insert(0, str(Path(__file__).parent.parent))
_startup_error: str = ""

try:
    import main as _main_module
    app = _main_module.app
    logger.info("✓ Full TensorTrade app loaded")
except Exception as _e:
    _startup_error = str(_e)
    logger.error(f"✗ Failed to load main app: {_e}", exc_info=True)

    @app.get("/health")
    def _health_error():
        return {
            "status": "error",
            "message": _startup_error,
            "environment": {
                "groq_key": "✓" if os.getenv("GROQ_API_KEY") else "✗",
                "openrouter_key": "✓" if os.getenv("OPENROUTER_API_KEY") else "✗",
                "mistral_key": "✓" if os.getenv("MISTRAL_API_KEY") else "✗",
            },
        }

    @app.get("/")
    def _root_error():
        return _health_error()

    logger.info("✓ Fallback error app ready")
