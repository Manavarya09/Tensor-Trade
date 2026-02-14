"""
Trade History Service (Placeholder)
In production, this would fetch from your database.
For now, generates synthetic trade history.
"""

import logging
from datetime import datetime, timedelta
from typing import List, Dict
import random

logger = logging.getLogger(__name__)


class TradeHistoryService:
    """
    Service to fetch user trade history.
    Currently generates synthetic data - replace with real DB queries in production.
    """
    
    def __init__(self):
        self.db_connected = False  # Flag for future DB integration
    
    def get_user_trades(self, asset: str, user_id: str = "default_user") -> List[Dict]:
        """
        Fetch user trade history for an asset.
        
        Args:
            asset: Stock symbol
            user_id: User identifier (for DB lookup)
            
        Returns:
            List of trade dictionaries
        """
        # TODO: Replace with real database query
        # Example: SELECT * FROM trades WHERE user_id = ? AND symbol = ? ORDER BY timestamp DESC LIMIT 10
        
        logger.info(f"Fetching trade history for {user_id} on {asset}")
        
        # For now, generate synthetic trades
        return self._generate_synthetic_trades(asset)
    
    def _generate_synthetic_trades(self, asset: str) -> List[Dict]:
        """
        Generate synthetic trade history for testing.
        Replace this with real DB queries in production.
        """
        num_trades = random.randint(1, 5)
        trades = []
        
        base_price = self._get_base_price(asset)
        base_time = datetime.now() - timedelta(hours=random.randint(1, 8))
        
        # Generate random trading patterns
        pattern_type = random.choice(["winning", "losing", "mixed", "revenge"])
        
        for i in range(num_trades):
            trade_time = base_time + timedelta(minutes=i * random.randint(15, 60))
            
            # Determine P&L based on pattern
            if pattern_type == "winning":
                pnl = random.uniform(100, 500)
            elif pattern_type == "losing":
                pnl = -random.uniform(50, 300)
            elif pattern_type == "revenge":
                # Losses followed by bigger position
                pnl = -random.uniform(100, 300) if i < num_trades - 1 else random.uniform(400, 800)
            else:  # mixed
                pnl = random.uniform(-200, 400)
            
            trades.append({
                "timestamp": trade_time.strftime("%Y-%m-%d %H:%M:%S"),
                "symbol": asset,
                "action": random.choice(["BUY", "SELL"]),
                "price": base_price + random.uniform(-5, 5),
                "pnl": round(pnl, 2),
                "status": "CLOSED"
            })
        
        # Sort by timestamp
        trades.sort(key=lambda x: x["timestamp"])
        
        logger.info(f"Generated {len(trades)} synthetic trades for {asset}")
        return trades
    
    def _get_base_price(self, asset: str) -> float:
        """Get approximate base price for asset."""
        price_map = {
            "SPY": 480.0,
            "AAPL": 180.0,
            "TSLA": 240.0,
            "MSFT": 380.0,
            "NVDA": 480.0,
            "META": 380.0,
            "GOOGL": 140.0,
            "AMZN": 155.0
        }
        return price_map.get(asset, 100.0)
    
    def get_trading_summary(self, asset: str, user_id: str = "default_user") -> Dict:
        """
        Get summary statistics for user's trading on this asset.
        """
        trades = self.get_user_trades(asset, user_id)
        
        if not trades:
            return {
                "total_trades": 0,
                "total_pnl": 0.0,
                "win_rate": 0.0,
                "status": "No trading history"
            }
        
        total_pnl = sum(t["pnl"] for t in trades)
        wins = sum(1 for t in trades if t["pnl"] > 0)
        win_rate = (wins / len(trades)) * 100 if trades else 0
        
        return {
            "total_trades": len(trades),
            "total_pnl": round(total_pnl, 2),
            "win_rate": round(win_rate, 1),
            "last_trade": trades[-1]["timestamp"] if trades else None,
            "trades": trades
        }
    
    def auto_select_persona(self, trades: List[Dict]) -> str:
        """
        Auto-select persona style based on trading performance.
        
        Returns:
            "coach" | "professional" | "casual" | "analytical"
        """
        if not trades:
            return "coach"
        
        total_pnl = sum(t["pnl"] for t in trades)
        wins = sum(1 for t in trades if t["pnl"] > 0)
        win_rate = (wins / len(trades)) * 100 if trades else 0
        
        # Logic for persona selection
        if total_pnl < -500 or win_rate < 30:
            return "coach"  # Struggling trader needs coaching
        elif len(trades) >= 5 and win_rate > 60:
            return "professional"  # Successful trader gets professional tone
        elif len(trades) <= 2:
            return "casual"  # New trader gets friendly approach
        else:
            return "analytical"  # Default for most cases


# Singleton instance
_trade_history_service = None

def get_trade_history_service() -> TradeHistoryService:
    """Get singleton instance of trade history service."""
    global _trade_history_service
    if _trade_history_service is None:
        _trade_history_service = TradeHistoryService()
    return _trade_history_service
