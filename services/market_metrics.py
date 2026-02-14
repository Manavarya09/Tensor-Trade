"""
Market Metrics Service
Calculates VIX, market regime, and risk index dynamically based on market data and agent responses.
"""

import logging
from typing import Dict, List, Optional
from datetime import datetime
import yfinance as yf

logger = logging.getLogger(__name__)


class MarketMetricsService:
    """Service to calculate dynamic market metrics."""
    
    def __init__(self):
        self.vix_cache = None
        self.cache_timestamp = None
        self.cache_duration_seconds = 300  # Cache for 5 minutes
    
    def get_vix(self) -> float:
        """
        Fetch current VIX (CBOE Volatility Index) value.
        
        Returns:
            Current VIX value, or fallback if unavailable
        """
        # Check cache
        if (self.vix_cache is not None and 
            self.cache_timestamp is not None and
            (datetime.now() - self.cache_timestamp).total_seconds() < self.cache_duration_seconds):
            return self.vix_cache
        
        try:
            ticker = yf.Ticker("^VIX")
            hist = ticker.history(period="1d")
            
            if not hist.empty:
                vix_value = float(hist['Close'].iloc[-1])
                self.vix_cache = vix_value
                self.cache_timestamp = datetime.now()
                logger.info(f"VIX fetched: {vix_value:.2f}")
                return vix_value
        except Exception as e:
            logger.warning(f"Could not fetch VIX: {e}")
        
        # Fallback: estimate based on SPY volatility
        try:
            spy = yf.Ticker("SPY")
            spy_hist = spy.history(period="30d")
            
            if not spy_hist.empty:
                returns = spy_hist['Close'].pct_change().dropna()
                volatility = returns.std() * (252 ** 0.5) * 100  # Annualized volatility
                estimated_vix = volatility * 1.5  # VIX typically ~1.5x realized volatility
                logger.info(f"VIX estimated from SPY: {estimated_vix:.2f}")
                return estimated_vix
        except Exception as e:
            logger.warning(f"Could not estimate VIX from SPY: {e}")
        
        # Final fallback
        return 20.0
    
    def get_market_regime(self, vix: float) -> str:
        """
        Determine market regime based on VIX level.
        
        VIX ranges:
        - < 12: ULTRA LOW VOLATILITY
        - 12-16: LOW VOLATILITY
        - 16-20: NORMAL VOLATILITY
        - 20-30: HIGH VOLATILITY
        - > 30: EXTREME VOLATILITY
        
        Args:
            vix: Current VIX value
            
        Returns:
            Market regime description
        """
        if vix < 12:
            return "ULTRA LOW VOLATILITY"
        elif vix < 16:
            return "LOW VOLATILITY"
        elif vix < 20:
            return "NORMAL VOLATILITY"
        elif vix < 30:
            return "HIGH VOLATILITY"
        else:
            return "EXTREME VOLATILITY"
    
    def calculate_risk_index(
        self,
        vix: float,
        agent_data: Optional[Dict] = None,
        market_volatility: Optional[float] = None
    ) -> int:
        """
        Calculate risk index (0-100) based on multiple factors.
        
        Factors:
        - VIX level (40% weight)
        - Agent sentiment divergence (30% weight)
        - Market volatility (30% weight)
        
        Args:
            vix: Current VIX value
            agent_data: Optional data from agent analysis (consensus, disagreements, confidence)
            market_volatility: Optional realized volatility of the asset
            
        Returns:
            Risk index from 0 (low risk) to 100 (high risk)
        """
        risk_score = 0
        
        # 1. VIX component (40% weight) - Max 40 points
        # Map VIX 0-50 to 0-40 points
        vix_score = min(40, (vix / 50.0) * 40)
        risk_score += vix_score
        
        # 2. Agent sentiment divergence (30% weight) - Max 30 points
        if agent_data:
            # Check for disagreement points
            disagreements = agent_data.get("disagreement_topics", [])
            consensus = agent_data.get("consensus_points", [])
            
            # More disagreement = higher risk
            disagreement_ratio = len(disagreements) / max(len(disagreements) + len(consensus), 1)
            divergence_score = disagreement_ratio * 30
            
            # Check confidence levels
            opinions = agent_data.get("council_opinions", [])
            if opinions:
                # Count low confidence opinions
                low_confidence_indicators = ["MEDIUM", "LOW", "uncertain", "unclear"]
                low_conf_count = sum(
                    1 for opinion in opinions 
                    if any(indicator in str(opinion) for indicator in low_confidence_indicators)
                )
                confidence_penalty = (low_conf_count / len(opinions)) * 10
                divergence_score += confidence_penalty
            
            risk_score += min(30, divergence_score)
        else:
            # Default agent risk
            risk_score += 15
        
        # 3. Market volatility component (30% weight) - Max 30 points
        if market_volatility:
            # Map volatility 0-100% to 0-30 points
            vol_score = min(30, (market_volatility / 100.0) * 30)
            risk_score += vol_score
        else:
            # Estimate from VIX
            estimated_vol_score = (vix / 50.0) * 30
            risk_score += min(30, estimated_vol_score)
        
        # Return as integer 0-100
        return min(100, int(risk_score))
    
    def get_market_volatility(self, symbol: str, period: str = "30d") -> float:
        """
        Calculate realized volatility for a symbol.
        
        Args:
            symbol: Stock ticker
            period: Historical period for calculation
            
        Returns:
            Annualized volatility percentage
        """
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)
            
            if not hist.empty and len(hist) > 5:
                returns = hist['Close'].pct_change().dropna()
                volatility = returns.std() * (252 ** 0.5) * 100  # Annualized
                logger.info(f"Volatility for {symbol}: {volatility:.2f}%")
                return volatility
        except Exception as e:
            logger.warning(f"Could not calculate volatility for {symbol}: {e}")
        
        return 25.0  # Default moderate volatility
    
    def get_all_metrics(
        self,
        symbol: str,
        agent_data: Optional[Dict] = None
    ) -> Dict:
        """
        Get all market metrics in one call.
        
        Args:
            symbol: Stock ticker for volatility calculation
            agent_data: Optional agent analysis data
            
        Returns:
            Dict with VIX, market_regime, risk_index, and volatility
        """
        vix = self.get_vix()
        regime = self.get_market_regime(vix)
        volatility = self.get_market_volatility(symbol)
        risk_index = self.calculate_risk_index(vix, agent_data, volatility)
        
        return {
            "vix": round(vix, 2),
            "market_regime": regime,
            "risk_index": risk_index,
            "asset_volatility": round(volatility, 2),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def get_regime_color(self, regime: str) -> str:
        """
        Get color code for market regime.
        
        Returns:
            Hex color code for UI display
        """
        regime_colors = {
            "ULTRA LOW VOLATILITY": "#44ff88",  # Green
            "LOW VOLATILITY": "#88ff44",  # Light green
            "NORMAL VOLATILITY": "#ffd700",  # Gold
            "HIGH VOLATILITY": "#ff4444",  # Red
            "EXTREME VOLATILITY": "#cc0000"  # Dark red
        }
        return regime_colors.get(regime, "#8899aa")
    
    def get_risk_level_description(self, risk_index: int) -> str:
        """
        Get text description of risk level.
        
        Args:
            risk_index: Risk score 0-100
            
        Returns:
            Risk level description
        """
        if risk_index < 20:
            return "VERY LOW"
        elif risk_index < 40:
            return "LOW"
        elif risk_index < 60:
            return "MODERATE"
        elif risk_index < 80:
            return "HIGH"
        else:
            return "VERY HIGH"


# Singleton instance
_market_metrics_service = None


def get_market_metrics_service() -> MarketMetricsService:
    """Get singleton instance of MarketMetricsService."""
    global _market_metrics_service
    if _market_metrics_service is None:
        _market_metrics_service = MarketMetricsService()
    return _market_metrics_service
