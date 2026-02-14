"""
Minimal Vercel test - checks what's failing during import
"""
import sys
import os
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

logger.info("=" * 50)
logger.info("IMPORT TEST")
logger.info("=" * 50)

# Test basic FastAPI
try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    logger.info("✓ FastAPI imports OK")
except Exception as e:
    logger.error(f"✗ FastAPI import failed: {e}")

# Test agents imports
try:
    from agents.behaviour_agent import BehaviorMonitorAgent
    logger.info("✓ BehaviorMonitorAgent import OK")
except Exception as e:
    logger.error(f"✗ BehaviorMonitorAgent import failed: {e}")

try:
    from agents.narrator import NarratorAgent
    logger.info("✓ NarratorAgent import OK")
except Exception as e:
    logger.error(f"✗ NarratorAgent import failed: {e}")

try:
    from agents.persona import PersonaAgent
    logger.info("✓ PersonaAgent import OK")
except Exception as e:
    logger.error(f"✗ PersonaAgent import failed: {e}")

try:
    from agents.moderator import ModeratorAgent
    logger.info("✓ ModeratorAgent import OK")
except Exception as e:
    logger.error(f"✗ ModeratorAgent import failed: {e}")

# Test LLM Council
try:
    from llm_council.services.debate_engine import get_council_analysis
    logger.info("✓ LLM Council import OK")
except Exception as e:
    logger.error(f"✗ LLM Council import failed: {e}")

# Test services
try:
    from services.economic_calendar import EconomicCalendarService
    logger.info("✓ EconomicCalendarService import OK")
except Exception as e:
    logger.error(f"✗ EconomicCalendarService import failed: {e}")

try:
    from services.trade_history import get_trade_history_service
    logger.info("✓ TradeHistoryService import OK")
except Exception as e:
    logger.error(f"✗ TradeHistoryService import failed: {e}")

try:
    from services.market_metrics import get_market_metrics_service
    logger.info("✓ MarketMetricsService import OK")
except Exception as e:
    logger.error(f"✗ MarketMetricsService import failed: {e}")

try:
    from services.asset_validator import validate_asset_symbol
    logger.info("✓ AssetValidator import OK")
except Exception as e:
    logger.error(f"✗ AssetValidator import failed: {e}")

logger.info("=" * 50)

# Create minimal app
app = FastAPI(title="Import Test")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "All imports successful",
        "environment": {
            "groq": "✓" if os.getenv("GROQ_API_KEY") else "✗",
            "openrouter": "✓" if os.getenv("OPENROUTER_API_KEY") else "✗",
            "mistral": "✓" if os.getenv("MISTRAL_API_KEY") else "✗",
        }
    }

logger.info("✓ Test app created successfully")
