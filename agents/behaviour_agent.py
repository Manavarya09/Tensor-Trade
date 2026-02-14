"""
Trading Behavior Monitor Agent
================================

A standalone module for detecting behavioral trading patterns from trade history.
Designed for easy integration with any trading system or analytics platform.

Author: AI Trading Psychology Team
License: MIT
Version: 2.0.0 - ENHANCED

NEW IN v2.0:
------------
- Enhanced analysis with historical context (optional)
- Predictive warnings for next trade
- Contextual alerts based on market conditions
- All features work standalone OR with UserBehaviorProfile integration

FEATURES:
---------
- Detects 10 behavioral patterns (8 negative, 1 positive, 1 neutral)
- Severity classification (High, Medium, Positive)
- Configurable pattern detection
- No external dependencies except Python standard library

DETECTED PATTERNS:
------------------
High Severity:
1. Revenge Trading - Consecutive losses in short timeframe
2. Ego Trading - Excessive risk after win streaks
3. Loss Aversion - Holding losers too long
4. Averaging Down - Adding to losing positions

Medium Severity:
5. Overtrading - Excessive trade volume
6. FOMO Trading - Rapid re-entry after wins
7. Impulsive Decisions - Trades executed too quickly
8. Quick Profit Taking - Closing winners too fast
9. Hesitation - Large gaps between trades

Positive:
10. Calculated Risk - Good win rate with controlled losses

USAGE EXAMPLE:
--------------
```python
from behavior_agent import BehaviorMonitorAgent

# Initialize agent
monitor = BehaviorMonitorAgent()

# Your trade data
trades = [
    {
        "timestamp": "2026-02-07 09:00:00",
        "symbol": "BTCUSD",
        "action": "BUY",
        "price": 45000,
        "pnl": -100,
        "status": "CLOSED"
    },
    # ... more trades
]

# Analyze
insights = monitor.analyze_session(trades)

# Process results
for insight in insights:
    print(f"{insight['type']} ({insight.get('severity', 'N/A')})")
    print(f"  {insight['details']}")
```

INTEGRATION NOTES:
------------------
1. Trade data format: List of dictionaries with required fields
2. Timestamp format: "YYYY-MM-DD HH:MM:SS"
3. PnL: Profit/Loss in your base currency
4. Status: "OPEN" or "CLOSED"
5. Returns: List of insight dictionaries

API REFERENCE:
--------------
See class documentation below for detailed method signatures.
"""

from datetime import datetime
from typing import List, Dict, Optional


class BehaviorMonitorAgent:
    """
    Analyzes trading sessions for behavioral patterns.
    
    Attributes:
        check_revenge_trading (bool): Enable revenge trading detection
        check_overtrading (bool): Enable overtrading detection
        check_emotional_patterns (bool): Enable emotional pattern detection
    """
    
    def __init__(self, 
                check_revenge_trading: bool = True, 
                check_overtrading: bool = True,
                check_emotional_patterns: bool = True):
        """
        Initialize the Behavior Monitor Agent.
        
        Args:
            check_revenge_trading: Enable detection of revenge trading patterns
            check_overtrading: Enable detection of excessive trading
            check_emotional_patterns: Enable detection of emotional patterns
        """
        self.check_revenge_trading = check_revenge_trading
        self.check_overtrading = check_overtrading
        self.check_emotional_patterns = check_emotional_patterns

    def run(self, context: dict) -> dict:
        """Pipeline integration method. Expects context with user_trades from frontend."""
        trades = context.get("user_trades", [])
        patterns = self.analyze_session(trades)
        
        if patterns:
            context["behavior_label"] = patterns[0]["type"]
            context["behavior_reason"] = patterns[0]["details"]
        else:
            context["behavior_label"] = "None"
            context["behavior_reason"] = "No significant behavioral patterns detected."
        return context

    def analyze_session(self, trades: List[Dict]) -> List[Dict]:
        """
        Analyzes a trading session for behavioral patterns.
        
        Args:
            trades: List of trade dictionaries. Each trade must contain:
                - timestamp (str): "YYYY-MM-DD HH:MM:SS"
                - symbol (str): Asset symbol
                - action (str): "BUY" or "SELL"
                - price (float): Execution price
                - pnl (float): Profit/Loss
                - status (str): "OPEN" or "CLOSED"
        
        Returns:
            List[Dict]: Behavioral insights, each containing:
                - type (str): Pattern name
                - severity (str): "High", "Medium", "Positive", or "N/A"
                - details (str): Description of the pattern
        
        Example:
            >>> monitor = BehaviorMonitorAgent()
            >>> insights = monitor.analyze_session(trades)
            >>> for insight in insights:
            ...     print(f"{insight['type']}: {insight['details']}")
        """
        insights = []
        
        if not trades:
            return [{"type": "No Activity", "details": "No trades recorded in this session."}]

        # Sort trades chronologically
        sorted_trades = sorted(trades, key=lambda x: x['timestamp'])
        
        # Run pattern detection
        if self.check_revenge_trading:
            revenge_insight = self._detect_revenge_trading(sorted_trades)
            if revenge_insight:
                insights.append(revenge_insight)

        if self.check_overtrading:
            overtrading_insight = self._detect_overtrading(sorted_trades)
            if overtrading_insight:
                insights.append(overtrading_insight)
        
        if self.check_emotional_patterns:
            # Emotional pattern suite
            patterns_to_check = [
                self._detect_fomo_trading,
                self._detect_ego_trading,
                self._detect_impulsive_decisions,
                self._detect_calculated_risk,
                self._detect_loss_aversion,
                self._detect_quick_profit_taking,
                self._detect_averaging_down,
                self._detect_hesitation
            ]
            
            for pattern_func in patterns_to_check:
                result = pattern_func(sorted_trades)
                if result:
                    insights.append(result)
                
        if not insights:
            insights.append({
                "type": "Disciplined",
                "details": "No negative patterns detected. Good adherence to plan."
            })
            
        return insights
    
    def generate_contextual_alert(self, pattern: str, market_context: Dict,
                                   historical_tendency: float = 0.0) -> str:
        """
        Generate contextual alert connecting market conditions to behavior.
        
        NEW in v2.0: Provides market-aware warnings.
        
        Args:
            pattern: Detected pattern type
            market_context: Dict with 'market_sentiment' containing:
                - 'overall': 'positive', 'negative', or 'neutral'
                - 'volatility': 'low', 'moderate', or 'high'
            historical_tendency: Optional percentage (0.0-1.0) of past occurrences
        
        Returns:
            Contextual warning message
        
        Example:
            >>> alert = monitor.generate_contextual_alert(
            ...     'Revenge Trading',
            ...     {'market_sentiment': {'overall': 'negative', 'volatility': 'high'}},
            ...     historical_tendency=0.60
            ... )
        """
        sentiment = market_context.get('market_sentiment', {}).get('overall', 'neutral')
        volatility = market_context.get('market_sentiment', {}).get('volatility', 'moderate')
        
        tendency_text = ""
        if historical_tendency > 0:
            tendency_text = f" You've shown this pattern in {int(historical_tendency * 100)}% of similar {sentiment} market conditions."
        
        alert_templates = {
            'Revenge Trading': f"⚠️ MARKET ALERT: Market is {sentiment} with {volatility} volatility.{tendency_text} High risk of chasing losses.",
            'FOMO Trading': f"⚠️ MARKET ALERT: Market sentiment is {sentiment}.{tendency_text} Don't chase trades.",
            'Ego Trading': f"⚠️ WIN STREAK ALERT: You tend to overtrade after wins.{tendency_text} Stick to your normal position size.",
            'Impulsive Decisions': f"⚠️ SPEED ALERT: You're trading too fast. In {sentiment} markets, reduce trade frequency. Slow down."
        }
        
        return alert_templates.get(pattern, f"Pattern '{pattern}' detected. Review your trading plan.")
    
    def predict_next_risk(self, current_session_state: Dict,
                          historical_tendencies: Dict = None) -> Dict:
        """
        Predict likely behavioral risks for next trade.
        
        NEW in v2.0: Predictive risk assessment for proactive intervention.
        
        Args:
            current_session_state: Dict with:
                - 'consecutive_losses': int
                - 'consecutive_wins': int
                - 'trades_in_last_hour': int (optional)
            historical_tendencies: Optional Dict with pattern frequencies:
                - 'revenge_trading_tendency': float (0.0-1.0)
                - 'fomo_tendency': float
                - 'ego_trading_tendency': float
                - 'impulsive_tendency': float
        
        Returns:
            Dict with:
                - 'high_risk_predictions': List[str] - Likely patterns
                - 'risk_level': 'low', 'medium', or 'high'
                - 'recommended_action': str - What to do
        
        Example:
            >>> prediction = monitor.predict_next_risk(
            ...     {'consecutive_losses': 3, 'consecutive_wins': 0},
            ...     {'revenge_trading_tendency': 0.75}
            ... )
            >>> print(prediction['recommended_action'])
            'STOP: Do not take the next trade. Take a 15-minute break.'
        """
        high_risk_predictions = []
        confidence_scores = []
        
        consecutive_losses = current_session_state.get('consecutive_losses', 0)
        consecutive_wins = current_session_state.get('consecutive_wins', 0)
        trades_recent = current_session_state.get('trades_in_last_hour', 0)
        
        # Use historical tendencies if provided, otherwise use conservative defaults
        if historical_tendencies:
            revenge_tendency = historical_tendencies.get('revenge_trading_tendency', 0.0)
            fomo_tendency = historical_tendencies.get('fomo_tendency', 0.0)
            ego_tendency = historical_tendencies.get('ego_trading_tendency', 0.0)
            impulsive_tendency = historical_tendencies.get('impulsive_tendency', 0.0)
        else:
            revenge_tendency = 0.3  # Conservative baseline
            fomo_tendency = 0.3
            ego_tendency = 0.3
            impulsive_tendency = 0.3
        
        # Check for revenge trading risk
        if consecutive_losses >= 2:
            if revenge_tendency > 0.5 or consecutive_losses >= 3:
                high_risk_predictions.append('Revenge Trading')
                confidence_scores.append(min(1.0, revenge_tendency + (consecutive_losses * 0.15)))
        
        # Check for FOMO after wins
        if consecutive_wins >= 2:
            if fomo_tendency > 0.4:
                high_risk_predictions.append('FOMO Trading')
                confidence_scores.append(fomo_tendency)
        
        # Check for ego trading after win streak
        if consecutive_wins >= 3:
            if ego_tendency > 0.4:
                high_risk_predictions.append('Ego Trading')
                confidence_scores.append(ego_tendency)
        
        # Check for overtrading/impulsive
        if trades_recent >= 5:
            if impulsive_tendency > 0.4:
                high_risk_predictions.append('Impulsive Trading')
                confidence_scores.append(impulsive_tendency)
        
        # Determine risk level
        avg_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0.0
        
        if len(high_risk_predictions) >= 2 or avg_confidence > 0.7:
            risk_level = 'high'
            recommended_action = "STOP: Do not take the next trade. Take a 15-minute break."
        elif len(high_risk_predictions) >= 1 or avg_confidence > 0.5:
            risk_level = 'medium'
            recommended_action = "CAUTION: Reduce position size by 50% and stick strictly to your plan."
        else:
            risk_level = 'low'
            recommended_action = "Continue trading with normal risk management"
        
        return {
            'high_risk_predictions': high_risk_predictions,
            'risk_level': risk_level,
            'confidence': round(avg_confidence, 2),
            'recommended_action': recommended_action
        }

    # ==================== PATTERN DETECTION METHODS ====================

    def _detect_revenge_trading(self, trades: List[Dict]) -> Optional[Dict]:
        """Detects revenge trading: 3+ consecutive losses within 10 minutes."""
        consecutive_losses = 0
        loss_timestamps = []
        
        for trade in trades:
            if trade['pnl'] < 0:
                consecutive_losses += 1
                try:
                    ts = datetime.strptime(trade['timestamp'], "%Y-%m-%d %H:%M:%S")
                    loss_timestamps.append(ts)
                except ValueError:
                    continue
            else:
                consecutive_losses = 0
                loss_timestamps = []
            
            if consecutive_losses >= 3 and len(loss_timestamps) >= 3:
                time_diff = (loss_timestamps[-1] - loss_timestamps[-3]).total_seconds() / 60
                if time_diff <= 10:
                    return {
                        "type": "Revenge Trading",
                        "severity": "High",
                        "details": f"Detected {consecutive_losses} consecutive losses within {int(time_diff)} minutes. This indicates potential tilt or chasing."
                    }
        return None

    def _detect_overtrading(self, trades: List[Dict]) -> Optional[Dict]:
        """Detects overtrading: More than 10 trades in a session."""
        if len(trades) > 10:
            return {
                "type": "Overtrading",
                "severity": "Medium",
                "details": f"High trade count ({len(trades)}) for a single session. Ensure quality over quantity."
            }
        return None

    def _detect_fomo_trading(self, trades: List[Dict]) -> Optional[Dict]:
        """Detects FOMO: Rapid re-entry on same asset after a win."""
        for i in range(len(trades) - 2):
            if trades[i]['pnl'] > 0:
                try:
                    t1 = datetime.strptime(trades[i]['timestamp'], "%Y-%m-%d %H:%M:%S")
                    t2 = datetime.strptime(trades[i+1]['timestamp'], "%Y-%m-%d %H:%M:%S")
                    
                    time_diff = (t2 - t1).total_seconds() / 60
                    if time_diff <= 5 and trades[i]['symbol'] == trades[i+1]['symbol']:
                        return {
                            "type": "FOMO Trading",
                            "severity": "Medium",
                            "details": "Detected rapid re-entry on same asset after a win. This suggests Fear Of Missing Out (FOMO) rather than strategic planning."
                        }
                except ValueError:
                    continue
        return None

    def _detect_ego_trading(self, trades: List[Dict]) -> Optional[Dict]:
        """Detects ego trading: Large loss after win streak."""
        wins_streak = 0
        for trade in trades:
            if trade['pnl'] > 0:
                wins_streak += 1
            else:
                if wins_streak >= 2 and trade['pnl'] < -150:
                    return {
                        "type": "Ego Trading",
                        "severity": "High",
                        "details": f"After {wins_streak} consecutive wins, took a large loss (${abs(trade['pnl'])}). This suggests overconfidence and excessive risk-taking."
                    }
                wins_streak = 0
        return None

    def _detect_impulsive_decisions(self, trades: List[Dict]) -> Optional[Dict]:
        """Detects impulsive decisions: Trades executed within 60 seconds."""
        rapid_trades = 0
        for i in range(len(trades) - 1):
            try:
                t1 = datetime.strptime(trades[i]['timestamp'], "%Y-%m-%d %H:%M:%S")
                t2 = datetime.strptime(trades[i+1]['timestamp'], "%Y-%m-%d %H:%M:%S")
                
                if (t2 - t1).total_seconds() <= 60:
                    rapid_trades += 1
            except ValueError:
                continue
        
        if rapid_trades >= 3:
            return {
                "type": "Impulsive Decisions",
                "severity": "Medium",
                "details": f"Detected {rapid_trades} trades executed within 60 seconds of each other. Suggests insufficient analysis and impulsive behavior."
            }
        return None

    def _detect_calculated_risk(self, trades: List[Dict]) -> Optional[Dict]:
        """Detects calculated risk: Win rate > 40% with controlled losses."""
        if len(trades) < 3:
            return None
        
        wins = sum(1 for t in trades if t['pnl'] > 0)
        win_rate = (wins / len(trades)) * 100
        max_loss = min((t['pnl'] for t in trades if t['pnl'] < 0), default=0)
        
        if win_rate >= 40 and max_loss >= -200:
            return {
                "type": "Calculated Risk",
                "severity": "Positive",
                "details": f"Win rate of {win_rate:.1f}% with controlled losses. This indicates disciplined risk management and calculated decision-making."
            }
        return None

    def _detect_loss_aversion(self, trades: List[Dict]) -> Optional[Dict]:
        """Detects loss aversion: Holding losers 2x longer than winners."""
        losing_duration, winning_duration = [], []
        
        for i in range(len(trades) - 1):
            if trades[i]['status'] == 'OPEN' and i + 1 < len(trades):
                if trades[i+1]['symbol'] == trades[i]['symbol']:
                    try:
                        t1 = datetime.strptime(trades[i]['timestamp'], "%Y-%m-%d %H:%M:%S")
                        t2 = datetime.strptime(trades[i+1]['timestamp'], "%Y-%m-%d %H:%M:%S")
                        duration = (t2 - t1).total_seconds() / 60
                        
                        if trades[i+1]['pnl'] < 0:
                            losing_duration.append(duration)
                        elif trades[i+1]['pnl'] > 0:
                            winning_duration.append(duration)
                    except ValueError:
                        continue
        
        if losing_duration and winning_duration:
            avg_loss = sum(losing_duration) / len(losing_duration)
            avg_win = sum(winning_duration) / len(winning_duration)
            
            if avg_loss > avg_win * 2:
                return {
                    "type": "Loss Aversion",
                    "severity": "High",
                    "details": f"Losing trades held {avg_loss:.1f} min on average vs {avg_win:.1f} min for winners. This suggests holding onto losers hoping they'll recover."
                }
        return None

    def _detect_quick_profit_taking(self, trades: List[Dict]) -> Optional[Dict]:
        """Detects quick profit taking: Winning trades closed 3x faster than losers."""
        winning_duration, losing_duration = [], []
        
        for i in range(len(trades) - 1):
            if trades[i]['status'] == 'OPEN' and i + 1 < len(trades):
                if trades[i+1]['symbol'] == trades[i]['symbol']:
                    try:
                        t1 = datetime.strptime(trades[i]['timestamp'], "%Y-%m-%d %H:%M:%S")
                        t2 = datetime.strptime(trades[i+1]['timestamp'], "%Y-%m-%d %H:%M:%S")
                        duration = (t2 - t1).total_seconds() / 60
                        
                        if trades[i+1]['pnl'] > 0:
                            winning_duration.append(duration)
                        elif trades[i+1]['pnl'] < 0:
                            losing_duration.append(duration)
                    except ValueError:
                        continue
        
        if winning_duration and losing_duration:
            avg_win = sum(winning_duration) / len(winning_duration)
            avg_loss = sum(losing_duration) / len(losing_duration)
            
            if avg_loss > avg_win * 3 and avg_win < 3:
                return {
                    "type": "Quick Profit Taking",
                    "severity": "Medium",
                    "details": f"Winning trades closed in {avg_win:.1f} min vs {avg_loss:.1f} min for losers. Cutting profits too early limits upside potential."
                }
        return None

    def _detect_averaging_down(self, trades: List[Dict]) -> Optional[Dict]:
        """Detects averaging down: Adding to losing positions."""
        for i in range(len(trades) - 2):
            if trades[i]['pnl'] < 0:
                if trades[i+1]['symbol'] == trades[i]['symbol'] and trades[i+1]['action'] == 'BUY':
                    if i + 2 < len(trades) and trades[i+2]['pnl'] < 0:
                        return {
                            "type": "Averaging Down",
                            "severity": "High",
                            "details": f"Multiple entries on {trades[i]['symbol']} while in losing position. Averaging down increases risk instead of cutting losses."
                        }
        return None

    def _detect_hesitation(self, trades: List[Dict]) -> Optional[Dict]:
        """Detects hesitation: Large time gaps (>60 min) between trades."""
        large_gaps = 0
        
        for i in range(len(trades) - 1):
            try:
                t1 = datetime.strptime(trades[i]['timestamp'], "%Y-%m-%d %H:%M:%S")
                t2 = datetime.strptime(trades[i+1]['timestamp'], "%Y-%m-%d %H:%M:%S")
                
                if (t2 - t1).total_seconds() / 60 > 60:
                    large_gaps += 1
            except ValueError:
                continue
        
        if len(trades) > 3 and large_gaps >= (len(trades) - 1) * 0.3:
            return {
                "type": "Hesitation / Analysis Paralysis",
                "severity": "Medium",
                "details": f"Detected {large_gaps} large time gaps (>60 min) between trades. This suggests fear or overthinking, causing missed opportunities."
            }
        return None


# ==================== STANDALONE USAGE EXAMPLE ====================

if __name__ == "__main__":
    # Example usage
    sample_trades = [
        {"timestamp": "2026-02-07 09:00:00", "symbol": "BTCUSD", "action": "BUY", "price": 45000, "pnl": -100, "status": "CLOSED"},
        {"timestamp": "2026-02-07 09:05:00", "symbol": "BTCUSD", "action": "BUY", "price": 44900, "pnl": -50, "status": "CLOSED"},
        {"timestamp": "2026-02-07 09:08:00", "symbol": "BTCUSD", "action": "BUY", "price": 44850, "pnl": -75, "status": "CLOSED"},
        {"timestamp": "2026-02-07 10:00:00", "symbol": "EURUSD", "action": "BUY", "price": 1.0850, "pnl": 50, "status": "CLOSED"},
    ]
    
    monitor = BehaviorMonitorAgent()
    insights = monitor.analyze_session(sample_trades)
    
    print("=" * 60)
    print("BEHAVIORAL ANALYSIS RESULTS")
    print("=" * 60)
    for insight in insights:
        severity = insight.get('severity', 'N/A')
        print(f"\n[{severity}] {insight['type']}")
        print(f"  {insight['details']}")
    print("\n" + "=" * 60)
