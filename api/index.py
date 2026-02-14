"""
Vercel serverless entry point for FastAPI application.
"""
import sys
import os
import logging
from pathlib import Path

# Configure logging for Vercel
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add parent directory to path so we can import from main
sys.path.insert(0, str(Path(__file__).parent.parent))

# Log environment check
logger.info("=" * 50)
logger.info("VERCEL ENVIRONMENT CHECK")
logger.info("=" * 50)

required_vars = ["GROQ_API_KEY", "OPENROUTER_API_KEY", "MISTRAL_API_KEY"]
for var in required_vars:
    value = os.getenv(var)
    logger.info(f"{var}: {'✓ SET' if value else '✗ MISSING'}")

logger.info("=" * 50)

# Import FastAPI app with detailed error handling
try:
    from main import app
    logger.info("✓ Successfully imported main app")
except Exception as e:
    logger.error(f"✗ Failed to import main app: {e}", exc_info=True)
    
    # Create a minimal FastAPI app for error reporting
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    
    app = FastAPI(title="TensorTrade - Startup Error")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.get("/health")
    def health_error():
        return {
            "status": "error",
            "error": "App failed to start",
            "message": str(e),
            "environment": {
                "groq_key": "✓" if os.getenv("GROQ_API_KEY") else "✗",
                "openrouter_key": "✓" if os.getenv("OPENROUTER_API_KEY") else "✗",
                "mistral_key": "✓" if os.getenv("MISTRAL_API_KEY") else "✗",
            },
            "help": "Set environment variables: GROQ_API_KEY, OPENROUTER_API_KEY, MISTRAL_API_KEY"
        }
    
    @app.get("/")
    def root_error():
        return health_error()
    
    logger.info("✓ Created fallback error app")
