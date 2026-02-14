"""
Configuration management for LLM Council.
Handles environment variables and application settings.
"""

from functools import lru_cache
from typing import Literal
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"

    # LLM Configuration - 5 Providers
    # OpenRouter (supports multiple free models with single API key)
    OPENROUTER_API_KEY: str | None = os.getenv("OPENROUTER_API_KEY")
    
    # Alternative providers (use at least one)
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")
    MISTRAL_API_KEY: str | None = os.getenv("MISTRAL_API_KEY")
    GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY")
    
    # LLM Settings
    MAX_TOKENS: int = int(os.getenv("MAX_TOKENS", "2048"))
    TEMPERATURE: float = float(os.getenv("TEMPERATURE", "0.7"))

    # Debate Arena Settings
    NUM_AGENTS: int = 5  # Macro Hawk, Forensic, Flow Detective, Tech Interpreter, Skeptic
    DEBATE_MAX_ROUNDS: int = 3
    DEBATE_CONSENSUS_THRESHOLD: float = 0.65
    
    # Market Data Configuration (optional - uses yfinance by default)
    MARKET_DATA_PROVIDER: str = os.getenv("MARKET_DATA_PROVIDER", "yfinance")

    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = os.getenv("LOG_FORMAT", "text")  # "json" or "text"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()
