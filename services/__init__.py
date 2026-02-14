"""
Services package initialization.
"""

from .economic_calendar import EconomicCalendarService
from .trade_history import TradeHistoryService, get_trade_history_service
from .multi_agent_system import (
    BehaviorDetector,
    LearningEngine,
    MacroAgent,
    FundamentalsAgent,
    FlowAgent,
    TechnicalAgent,
    RiskAgent,
    MultiAgentOrchestrator,
    PortfolioManager,
    TradingPolicy,
    TradingPolicyEngine,
    ShariahComplianceScreener,
    Madhab,
)

__all__ = [
    'EconomicCalendarService',
    'TradeHistoryService',
    'get_trade_history_service',
    'BehaviorDetector',
    'LearningEngine',
    'MacroAgent',
    'FundamentalsAgent',
    'FlowAgent',
    'TechnicalAgent',
    'RiskAgent',
    'MultiAgentOrchestrator',
    'PortfolioManager',
    'TradingPolicy',
    'TradingPolicyEngine',
    'ShariahComplianceScreener',
    'Madhab'
]
