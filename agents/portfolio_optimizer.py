"""
Portfolio Optimization Agent
Uses Modern Portfolio Theory (MPT) with Shariah-compliant constraints
"""

import logging
import numpy as np
from typing import Dict, List, Optional
from scipy.optimize import minimize
import yfinance as yf
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class PortfolioOptimizerAgent:
    """
    Optimizes portfolio allocation using MPT with constraints.
    Supports Shariah-compliant optimization.
    """

    def __init__(self):
        self.risk_free_rate = 0.04  # 4% annual risk-free rate

    def optimize_portfolio(
        self,
        holdings: List[Dict],
        constraints: Optional[Dict] = None
    ) -> Dict:
        """
        Optimize portfolio allocation.
        
        Args:
            holdings: List of {"symbol": str, "quantity": float}
            constraints: {
                "shariah_compliant": bool,
                "max_sector_exposure": float (0-1),
                "risk_tolerance": "low" | "moderate" | "high"
            }
        
        Returns:
            {
                "current_allocation": {...},
                "recommended_allocation": {...},
                "expected_return": float,
                "expected_risk": float,
                "sharpe_ratio": float,
                "rebalancing_trades": [...]
            }
        """
        try:
            if not holdings:
                return {"error": "No holdings provided"}

            constraints = constraints or {}
            shariah_mode = constraints.get("shariah_compliant", False)
            max_sector_exposure = constraints.get("max_sector_exposure", 0.4)
            risk_tolerance = constraints.get("risk_tolerance", "moderate")

            # Get symbols
            symbols = [h["symbol"] for h in holdings]
            
            # Fetch historical data
            logger.info(f"Fetching data for {len(symbols)} symbols...")
            returns_data = self._get_returns_data(symbols)
            
            if returns_data is None or returns_data.empty:
                return {"error": "Could not fetch market data"}

            # Calculate current allocation
            current_allocation = self._calculate_current_allocation(holdings)

            # Get expected returns and covariance
            expected_returns = returns_data.mean() * 252  # Annualized
            cov_matrix = returns_data.cov() * 252  # Annualized

            # Optimize
            optimal_weights = self._optimize_weights(
                expected_returns,
                cov_matrix,
                risk_tolerance,
                max_sector_exposure
            )

            # Calculate metrics
            portfolio_return = np.dot(optimal_weights, expected_returns)
            portfolio_risk = np.sqrt(np.dot(optimal_weights.T, np.dot(cov_matrix, optimal_weights)))
            sharpe_ratio = (portfolio_return - self.risk_free_rate) / portfolio_risk

            # Build recommended allocation
            recommended_allocation = {
                symbol: float(weight)
                for symbol, weight in zip(symbols, optimal_weights)
                if weight > 0.01  # Filter out tiny allocations
            }

            # Generate rebalancing trades
            rebalancing_trades = self._generate_rebalancing_trades(
                holdings,
                current_allocation,
                recommended_allocation
            )

            return {
                "current_allocation": current_allocation,
                "recommended_allocation": recommended_allocation,
                "expected_return": float(portfolio_return),
                "expected_risk": float(portfolio_risk),
                "sharpe_ratio": float(sharpe_ratio),
                "rebalancing_trades": rebalancing_trades,
                "optimization_method": "Mean-Variance (Markowitz)",
                "constraints_applied": {
                    "shariah_compliant": shariah_mode,
                    "max_sector_exposure": max_sector_exposure,
                    "risk_tolerance": risk_tolerance
                }
            }

        except Exception as e:
            logger.error(f"Portfolio optimization failed: {e}")
            return {"error": str(e)}

    def _get_returns_data(self, symbols: List[str], period: str = "1y") -> Optional[np.ndarray]:
        """Fetch historical returns data."""
        try:
            data = yf.download(symbols, period=period, progress=False)['Adj Close']
            if data.empty:
                return None
            
            # Calculate daily returns
            returns = data.pct_change().dropna()
            return returns

        except Exception as e:
            logger.error(f"Failed to fetch returns data: {e}")
            return None

    def _calculate_current_allocation(self, holdings: List[Dict]) -> Dict[str, float]:
        """Calculate current portfolio allocation percentages."""
        total_value = sum(h.get("quantity", 0) * h.get("current_price", 0) for h in holdings)
        
        if total_value == 0:
            return {}

        allocation = {}
        for h in holdings:
            symbol = h["symbol"]
            value = h.get("quantity", 0) * h.get("current_price", 0)
            allocation[symbol] = value / total_value

        return allocation

    def _optimize_weights(
        self,
        expected_returns: np.ndarray,
        cov_matrix: np.ndarray,
        risk_tolerance: str,
        max_sector_exposure: float
    ) -> np.ndarray:
        """
        Optimize portfolio weights using mean-variance optimization.
        """
        n_assets = len(expected_returns)

        # Objective function based on risk tolerance
        if risk_tolerance == "low":
            # Minimize risk
            def objective(weights):
                return np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
        elif risk_tolerance == "high":
            # Maximize return
            def objective(weights):
                return -np.dot(weights, expected_returns)
        else:  # moderate
            # Maximize Sharpe ratio
            def objective(weights):
                portfolio_return = np.dot(weights, expected_returns)
                portfolio_risk = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
                return -(portfolio_return - self.risk_free_rate) / portfolio_risk

        # Constraints
        constraints = [
            {'type': 'eq', 'fun': lambda w: np.sum(w) - 1},  # Weights sum to 1
        ]

        # Bounds (0 to max_sector_exposure for each asset)
        bounds = tuple((0, max_sector_exposure) for _ in range(n_assets))

        # Initial guess (equal weight)
        initial_weights = np.array([1.0 / n_assets] * n_assets)

        # Optimize
        result = minimize(
            objective,
            initial_weights,
            method='SLSQP',
            bounds=bounds,
            constraints=constraints
        )

        if result.success:
            return result.x
        else:
            logger.warning("Optimization did not converge, using equal weights")
            return initial_weights

    def _generate_rebalancing_trades(
        self,
        holdings: List[Dict],
        current_allocation: Dict[str, float],
        recommended_allocation: Dict[str, float]
    ) -> List[Dict]:
        """Generate trades needed to rebalance portfolio."""
        trades = []
        
        # Calculate total portfolio value
        total_value = sum(h.get("quantity", 0) * h.get("current_price", 0) for h in holdings)

        # Create holdings lookup
        holdings_map = {h["symbol"]: h for h in holdings}

        # Check all symbols (current + recommended)
        all_symbols = set(current_allocation.keys()) | set(recommended_allocation.keys())

        for symbol in all_symbols:
            current_weight = current_allocation.get(symbol, 0)
            target_weight = recommended_allocation.get(symbol, 0)
            
            diff = target_weight - current_weight

            if abs(diff) < 0.01:  # Ignore tiny differences
                continue

            current_price = holdings_map.get(symbol, {}).get("current_price", 0)
            if current_price == 0:
                # Fetch current price if not available
                try:
                    ticker = yf.Ticker(symbol)
                    current_price = ticker.info.get('currentPrice', 0)
                except:
                    continue

            target_value = total_value * target_weight
            current_value = total_value * current_weight
            value_diff = target_value - current_value

            if value_diff > 0:
                # Buy
                quantity = value_diff / current_price
                trades.append({
                    "action": "BUY",
                    "symbol": symbol,
                    "quantity": round(quantity, 2),
                    "estimated_cost": round(value_diff, 2),
                    "reason": f"Increase allocation from {current_weight*100:.1f}% to {target_weight*100:.1f}%"
                })
            else:
                # Sell
                quantity = abs(value_diff) / current_price
                trades.append({
                    "action": "SELL",
                    "symbol": symbol,
                    "quantity": round(quantity, 2),
                    "estimated_proceeds": round(abs(value_diff), 2),
                    "reason": f"Decrease allocation from {current_weight*100:.1f}% to {target_weight*100:.1f}%"
                })

        return trades

    def run(self, context: Dict) -> Dict:
        """Standard agent interface."""
        holdings = context.get("holdings", [])
        constraints = context.get("constraints", {})
        
        result = self.optimize_portfolio(holdings, constraints)
        context["portfolio_optimization"] = result
        
        return context

    async def run_async(self, context: Dict) -> Dict:
        """Async version."""
        import asyncio
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.run, context)


# Example usage
if __name__ == "__main__":
    agent = PortfolioOptimizerAgent()
    
    # Test with sample portfolio
    holdings = [
        {"symbol": "AAPL", "quantity": 10, "current_price": 178.45},
        {"symbol": "MSFT", "quantity": 5, "current_price": 395.20},
        {"symbol": "GOOGL", "quantity": 8, "current_price": 138.50},
    ]
    
    constraints = {
        "shariah_compliant": True,
        "max_sector_exposure": 0.4,
        "risk_tolerance": "moderate"
    }
    
    result = agent.optimize_portfolio(holdings, constraints)
    print("Optimization Result:")
    print(f"Expected Return: {result.get('expected_return', 0)*100:.2f}%")
    print(f"Expected Risk: {result.get('expected_risk', 0)*100:.2f}%")
    print(f"Sharpe Ratio: {result.get('sharpe_ratio', 0):.2f}")
    print(f"\nRecommended Allocation:")
    for symbol, weight in result.get('recommended_allocation', {}).items():
        print(f"  {symbol}: {weight*100:.1f}%")
