"""
Data models for LLM Council.
Pydantic models for request/response validation.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ============================================================================
# Enums
# ============================================================================


class ConfidenceLevel(str, Enum):
    """Confidence in analysis."""
    VERY_LOW = "very_low"
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    VERY_HIGH = "very_high"


class EvidenceStrength(str, Enum):
    """Strength of evidence supporting a claim."""
    WEAK = "weak"
    MODERATE = "moderate"
    STRONG = "strong"
    VERY_STRONG = "very_strong"


# ============================================================================
# Core Models
# ============================================================================


class DocumentReference(BaseModel):
    """Reference to a source document."""
    doc_type: str = Field(..., description="Type (filing, transcript, announcement)")
    source: str = Field(..., description="Source identifier")
    excerpt: str = Field(..., description="Quoted text")
    relevance_score: float = Field(..., ge=0, le=1, description="How relevant (0-1)")


class AgentArgument(BaseModel):
    """Single agent's argument in the debate."""
    agent_name: str = Field(..., description="Name (e.g., 🦅 Macro Hawk)")
    thesis: str = Field(..., description="Main argument")
    supporting_points: list[str] = Field(..., description="Evidence points")
    confidence: ConfidenceLevel = Field(..., description="Confidence in argument")
    references: list[DocumentReference] = Field(default=[], description="Sources")


class ConsensusPoint(BaseModel):
    """A point of agreement across agents."""
    statement: str
    supporting_agents: list[str] = Field(..., description="Which agents agree")
    evidence_strength: EvidenceStrength


class DisagreementPoint(BaseModel):
    """A point where agents disagree."""
    topic: str = Field(..., description="What they disagree about")
    competing_views: dict[str, str] = Field(
        ..., description="Agent name -> their position"
    )
    evidence_strength_per_view: dict[str, EvidenceStrength] = Field(default={})


class DebateResult(BaseModel):
    """Result of multi-agent debate."""
    symbol: str
    timestamp: datetime
    agent_arguments: list[AgentArgument]
    consensus_points: list[ConsensusPoint]
    disagreement_points: list[DisagreementPoint]
    judge_summary: str = Field(..., description="Synthesized view")
    market_context: dict = Field(default={}, description="Market data context")


class DebateRequest(BaseModel):
    """Request to run debate."""
    symbol: str = Field(..., description="Stock symbol (e.g., AAPL)")


class DebateResponse(BaseModel):
    """Response from debate."""
    success: bool
    debate_result: Optional[DebateResult] = None
    error: Optional[str] = None
