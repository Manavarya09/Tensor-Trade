from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from statistics import mean
from typing import Any, Dict, List, Optional, Tuple


class Stance(str, Enum):
    BULLISH = "BULLISH"
    NEUTRAL = "NEUTRAL"
    BEARISH = "BEARISH"


@dataclass
class AgentOutput:
    agent_name: str
    stance: Stance
    confidence: float
    reasoning: List[str]
    key_metrics: Dict[str, float | str]
    weight: float
    extra: Dict[str, Any] = field(default_factory=dict)


class MacroAgent:
    name = "macro"

    def analyze(self, market_data: Dict[str, Any], weight: float = 0.20) -> AgentOutput:
        fed_rate = float(market_data.get("fed_rate", 5.25))
        inflation = float(market_data.get("inflation_cpi", 3.0))
        unemployment = float(market_data.get("unemployment_rate", 4.0))
        gdp_growth = float(market_data.get("gdp_growth", 2.0))
        spread_10y_2y = float(market_data.get("yield_spread_10y_2y", 0.2))

        score = 0
        reasons: List[str] = []

        if inflation <= 3.0:
            score += 1
            reasons.append("Inflation is moderate, easing pressure on valuations.")
        else:
            score -= 1
            reasons.append("Inflation remains elevated and could pressure multiples.")

        if unemployment < 4.5:
            score += 1
            reasons.append("Labor market remains healthy.")
        else:
            score -= 1
            reasons.append("Labor market is softening.")

        if gdp_growth > 1.5:
            score += 1
            reasons.append("GDP growth indicates expansionary conditions.")
        else:
            score -= 1
            reasons.append("GDP growth is weak.")

        if spread_10y_2y < 0:
            score -= 1
            reasons.append("Yield curve inversion signals recession risk.")
        else:
            score += 1
            reasons.append("Yield curve shape does not signal immediate recession.")

        fed_policy = "hawkish" if fed_rate > 5.0 else "neutral/dovish"
        reasons.append(f"Fed policy is interpreted as {fed_policy}.")

        stance = Stance.BULLISH if score >= 2 else Stance.BEARISH if score <= -2 else Stance.NEUTRAL
        confidence = min(1.0, 0.5 + abs(score) * 0.1)

        return AgentOutput(
            agent_name=self.name,
            stance=stance,
            confidence=confidence,
            reasoning=reasons,
            key_metrics={
                "fed_rate": fed_rate,
                "inflation_cpi": inflation,
                "gdp_growth": gdp_growth,
            },
            weight=weight,
        )


class FundamentalsAgent:
    name = "fundamentals"

    def analyze(self, market_data: Dict[str, Any], weight: float = 0.20) -> AgentOutput:
        pe = float(market_data.get("pe_ratio", 20.0))
        sector_pe = float(market_data.get("sector_pe_ratio", 22.0))
        debt_to_equity = float(market_data.get("debt_to_equity", 0.7))
        roe = float(market_data.get("roe", 0.16))
        revenue_growth = float(market_data.get("revenue_growth", 0.10))

        score = 0
        reasons: List[str] = []

        if pe <= sector_pe:
            score += 1
            reasons.append("P/E is at or below sector average.")
        else:
            score -= 1
            reasons.append("P/E is rich versus sector peers.")

        if debt_to_equity <= 1.0:
            score += 1
            reasons.append("Leverage is manageable.")
        else:
            score -= 1
            reasons.append("Balance sheet leverage is elevated.")

        if roe >= 0.12:
            score += 1
            reasons.append("ROE indicates efficient capital use.")
        else:
            score -= 1
            reasons.append("ROE is below preferred threshold.")

        if revenue_growth >= 0.08:
            score += 1
            reasons.append("Revenue growth remains healthy.")
        else:
            score -= 1
            reasons.append("Revenue growth is slowing.")

        valuation_score = max(0.0, min(10.0, 5.0 + score * 1.5))
        health = "STRONG" if score >= 2 else "WEAK" if score <= -2 else "MODERATE"
        stance = Stance.BULLISH if score >= 2 else Stance.BEARISH if score <= -2 else Stance.NEUTRAL
        confidence = min(1.0, 0.5 + abs(score) * 0.1)

        return AgentOutput(
            agent_name=self.name,
            stance=stance,
            confidence=confidence,
            reasoning=reasons,
            key_metrics={
                "pe_ratio": pe,
                "debt_to_equity": debt_to_equity,
                "roe": roe,
                "revenue_growth": revenue_growth,
            },
            weight=weight,
            extra={"valuation_score": valuation_score, "financial_health": health},
        )


class FlowAgent:
    name = "flow"

    def analyze(self, market_data: Dict[str, Any], weight: float = 0.20) -> AgentOutput:
        volume_ratio = float(market_data.get("volume_ratio", 1.0))
        institutional_change = float(market_data.get("institutional_change_pct", 0.0))
        insider_net = float(market_data.get("insider_net_buy_musd", 0.0))
        short_interest = float(market_data.get("short_interest_pct_float", 5.0))

        score = 0
        reasons: List[str] = []

        if volume_ratio > 1.2:
            score += 1
            reasons.append("Volume is above average, confirming participation.")

        if institutional_change > 0:
            score += 1
            reasons.append("Institutional ownership is increasing.")
        elif institutional_change < 0:
            score -= 1
            reasons.append("Institutional ownership is falling.")

        if insider_net > 0:
            score += 1
            reasons.append("Net insider buying supports accumulation thesis.")
        elif insider_net < 0:
            score -= 1
            reasons.append("Net insider selling is a caution signal.")

        if short_interest > 12:
            score -= 1
            reasons.append("Short interest is elevated.")

        money_flow = "ACCUMULATION" if score >= 2 else "DISTRIBUTION" if score <= -2 else "NEUTRAL"
        stance = Stance.BULLISH if score >= 2 else Stance.BEARISH if score <= -2 else Stance.NEUTRAL
        confidence = min(1.0, 0.5 + abs(score) * 0.1)

        return AgentOutput(
            agent_name=self.name,
            stance=stance,
            confidence=confidence,
            reasoning=reasons,
            key_metrics={
                "volume_ratio": volume_ratio,
                "institutional_change_pct": institutional_change,
                "short_interest_pct_float": short_interest,
                "insider_net_buy_musd": insider_net,
            },
            weight=weight,
            extra={"money_flow": money_flow},
        )


class TechnicalAgent:
    name = "technical"

    def analyze(self, market_data: Dict[str, Any], weight: float = 0.20) -> AgentOutput:
        rsi = float(market_data.get("rsi", 50))
        macd_hist = float(market_data.get("macd_histogram", 0.0))
        price = float(market_data.get("price", 100))
        ma_200 = float(market_data.get("ma_200", 95))

        score = 0
        reasons: List[str] = []

        if 45 <= rsi <= 70:
            score += 1
            reasons.append("RSI is constructive without extreme overbought risk.")
        elif rsi > 75:
            score -= 1
            reasons.append("RSI indicates overbought conditions.")
        elif rsi < 30:
            score += 1
            reasons.append("RSI suggests oversold rebound potential.")

        if macd_hist > 0:
            score += 1
            reasons.append("MACD histogram is positive.")
        else:
            score -= 1
            reasons.append("MACD histogram is negative.")

        if price >= ma_200:
            score += 1
            reasons.append("Price is above 200-day moving average.")
        else:
            score -= 1
            reasons.append("Price is below 200-day moving average.")

        trend = "UPTREND" if score >= 2 else "DOWNTREND" if score <= -2 else "SIDEWAYS"
        stance = Stance.BULLISH if score >= 2 else Stance.BEARISH if score <= -2 else Stance.NEUTRAL
        confidence = min(1.0, 0.5 + abs(score) * 0.1)

        return AgentOutput(
            agent_name=self.name,
            stance=stance,
            confidence=confidence,
            reasoning=reasons,
            key_metrics={"rsi": rsi, "macd_histogram": macd_hist, "price_vs_200ma": price / ma_200},
            weight=weight,
            extra={"trend": trend},
        )


class RiskAgent:
    name = "risk"

    def analyze(self, market_data: Dict[str, Any], weight: float = 0.20) -> AgentOutput:
        volatility = float(market_data.get("volatility_30d", 0.2))
        beta = float(market_data.get("beta", 1.0))
        max_drawdown = float(market_data.get("max_drawdown_1y", 0.2))
        var_95 = float(market_data.get("var_95_daily", 0.03))

        risk_points = 0
        reasons: List[str] = []

        if volatility > 0.35:
            risk_points += 1
            reasons.append("Volatility is high.")
        if beta > 1.4:
            risk_points += 1
            reasons.append("Beta indicates high market sensitivity.")
        if max_drawdown > 0.30:
            risk_points += 1
            reasons.append("Historical drawdown is severe.")
        if var_95 > 0.05:
            risk_points += 1
            reasons.append("Daily VaR is elevated.")

        risk_level = "LOW" if risk_points <= 1 else "MEDIUM" if risk_points <= 2 else "HIGH"
        recommended_position = max(0.05, min(0.30, 0.30 - risk_points * 0.06))

        return AgentOutput(
            agent_name=self.name,
            stance=Stance.NEUTRAL,
            confidence=min(1.0, 0.5 + risk_points * 0.1),
            reasoning=reasons or ["Risk profile appears contained."],
            key_metrics={
                "volatility_30d": volatility,
                "beta": beta,
                "max_drawdown_1y": max_drawdown,
                "var_95_daily": var_95,
            },
            weight=weight,
            extra={"risk_level": risk_level, "recommended_position_size": round(recommended_position, 2)},
        )


class MultiAgentOrchestrator:
    def __init__(self, weights: Optional[Dict[str, float]] = None):
        self.weights = weights or {
            "macro": 0.20,
            "fundamentals": 0.20,
            "flow": 0.20,
            "technical": 0.20,
            "risk": 0.20,
        }
        self.agents = [MacroAgent(), FundamentalsAgent(), FlowAgent(), TechnicalAgent(), RiskAgent()]

    def analyze(self, market_data: Dict[str, Any]) -> Dict[str, Any]:
        outputs: List[AgentOutput] = []
        for agent in self.agents:
            outputs.append(agent.analyze(market_data, self.weights.get(agent.name, 0.20)))

        bullish_score = sum(o.weight * o.confidence for o in outputs if o.stance == Stance.BULLISH)
        bearish_score = sum(o.weight * o.confidence for o in outputs if o.stance == Stance.BEARISH)
        total_votes = bullish_score + bearish_score

        if total_votes == 0:
            consensus_stance = Stance.NEUTRAL
            consensus_confidence = 0.5
        else:
            consensus_stance = Stance.BULLISH if bullish_score >= bearish_score else Stance.BEARISH
            consensus_confidence = max(bullish_score, bearish_score) / total_votes

        return {
            "consensus_stance": consensus_stance.value,
            "consensus_confidence": round(consensus_confidence, 3),
            "bullish_score": round(bullish_score, 3),
            "bearish_score": round(bearish_score, 3),
            "agent_outputs": [o.__dict__ | {"stance": o.stance.value} for o in outputs],
        }


class LearningEngine:
    def __init__(self):
        self.predictions: List[Dict[str, Any]] = []

    def record_prediction(self, user_id: str, symbol: str, analysis: Dict[str, Any]) -> Dict[str, Any]:
        entry = {
            "user_id": user_id,
            "symbol": symbol,
            "timestamp": datetime.utcnow().isoformat(),
            "consensus_stance": analysis["consensus_stance"],
            "agent_outputs": analysis["agent_outputs"],
            "outcome": None,
        }
        self.predictions.append(entry)
        return entry

    def record_outcome(self, symbol: str, price_change_pct: float, horizon: str = "1w") -> int:
        updated = 0
        actual = Stance.BULLISH.value if price_change_pct > 0 else Stance.BEARISH.value if price_change_pct < 0 else Stance.NEUTRAL.value
        for p in self.predictions:
            if p["symbol"] == symbol and p["outcome"] is None:
                p["outcome"] = {"horizon": horizon, "price_change_pct": price_change_pct, "actual_stance": actual}
                updated += 1
        return updated

    def optimize_weights(self, user_id: str, base_weights: Dict[str, float]) -> Dict[str, float]:
        relevant = [p for p in self.predictions if p["user_id"] == user_id and p["outcome"]]
        if not relevant:
            return base_weights

        per_agent: Dict[str, List[int]] = {name: [] for name in base_weights}
        for pred in relevant:
            actual = pred["outcome"]["actual_stance"]
            for output in pred["agent_outputs"]:
                name = output["agent_name"]
                if name in per_agent and output["stance"] != Stance.NEUTRAL.value:
                    per_agent[name].append(1 if output["stance"] == actual else 0)

        scores = {name: (mean(vals) if vals else 0.5) for name, vals in per_agent.items()}
        total = sum(scores.values()) or 1
        return {name: round(score / total, 3) for name, score in scores.items()}


class BehaviorDetector:
    def detect(self, context: Dict[str, Any]) -> List[Dict[str, str]]:
        patterns: List[Dict[str, str]] = []
        weekly_move = float(context.get("weekly_move_pct", 0))
        has_position = bool(context.get("has_position", False))
        recent_loss = float(context.get("recent_loss_pct", 0))
        hours_since_loss = float(context.get("hours_since_loss", 999))
        planned_size_increase = float(context.get("planned_size_increase_x", 1.0))

        if weekly_move > 10 and not has_position:
            patterns.append({"pattern": "FOMO", "alert": "Stock is extended after a strong weekly move."})

        if recent_loss <= -5 and hours_since_loss < 24 and planned_size_increase > 1.2:
            patterns.append({"pattern": "REVENGE_TRADING", "alert": "Cooling-off period advised after loss."})

        if context.get("ignored_risk_warnings", 0) >= 3:
            patterns.append({"pattern": "CONFIRMATION_BIAS", "alert": "Multiple risk warnings have been ignored."})

        if context.get("holding_loser_days", 0) > 30 and context.get("position_pnl_pct", 0) < -10:
            patterns.append({"pattern": "LOSS_AVERSION", "alert": "Losing position held for a prolonged period."})

        return patterns


class Madhab(str, Enum):
    HANAFI = "Hanafi"
    SHAFI = "Shafi"
    MALIKI = "Maliki"
    HANBALI = "Hanbali"


class ShariahComplianceScreener:
    HARAM_INDUSTRIES = {
        "alcohol", "gambling", "pork", "weapons", "pornography", "conventional_banking", "tobacco"
    }

    def screen(self, symbol: str, industry: str, debt_ratio: float, interest_income_ratio: float, liquidity_ratio: float,
               madhab: Madhab = Madhab.SHAFI) -> Dict[str, Any]:
        industry_key = industry.lower().replace(" ", "_")

        if industry_key in self.HARAM_INDUSTRIES:
            return {
                "symbol": symbol,
                "overall_ruling": "HARAM",
                "score": 0,
                "reason": "Primary business activity is prohibited.",
                "madhab": madhab.value,
                "purification_required": False,
            }

        debt_limit = 0.30 if madhab == Madhab.HANAFI else 0.33
        score = 50

        if debt_ratio < 0.10:
            score += 20
        elif debt_ratio < debt_limit:
            score += 10

        if interest_income_ratio < 0.01:
            score += 20
        elif interest_income_ratio < 0.05:
            score += 10

        if liquidity_ratio < 0.20:
            score += 10
        elif liquidity_ratio < 0.33:
            score += 5

        if score >= 90:
            ruling = "HALAL"
        elif score >= 70:
            ruling = "MOSTLY_HALAL"
        elif score >= 50:
            ruling = "QUESTIONABLE"
        else:
            ruling = "HARAM"

        return {
            "symbol": symbol,
            "overall_ruling": ruling,
            "score": score,
            "madhab": madhab.value,
            "purification_required": interest_income_ratio > 0,
            "purification_percent": round(interest_income_ratio * 100, 2),
            "ratios": {
                "debt_ratio": debt_ratio,
                "interest_income_ratio": interest_income_ratio,
                "liquidity_ratio": liquidity_ratio,
            },
        }


class PortfolioManager:
    def __init__(self):
        self.portfolios: Dict[str, Dict[str, Any]] = {}

    def create_portfolio(self, user_id: str, cash_balance: float = 0.0) -> Dict[str, Any]:
        self.portfolios[user_id] = {
            "user_id": user_id,
            "cash_balance": cash_balance,
            "positions": {},
            "created_at": datetime.utcnow().isoformat(),
        }
        return self.portfolios[user_id]

    def add_position(self, user_id: str, symbol: str, quantity: float, price: float, sector: str = "Unknown") -> Dict[str, Any]:
        portfolio = self.portfolios.setdefault(user_id, self.create_portfolio(user_id))
        positions = portfolio["positions"]

        if symbol in positions:
            existing = positions[symbol]
            new_qty = existing["quantity"] + quantity
            avg_cost = ((existing["average_cost"] * existing["quantity"]) + (price * quantity)) / new_qty
            existing["quantity"] = new_qty
            existing["average_cost"] = round(avg_cost, 4)
        else:
            positions[symbol] = {
                "symbol": symbol,
                "quantity": quantity,
                "average_cost": price,
                "current_price": price,
                "sector": sector,
                "first_purchase_date": datetime.utcnow().isoformat(),
            }

        return positions[symbol]

    def remove_position(self, user_id: str, symbol: str, quantity: float, price: float) -> Dict[str, Any]:
        portfolio = self.portfolios[user_id]
        position = portfolio["positions"].get(symbol)
        if not position or position["quantity"] < quantity:
            raise ValueError("Insufficient quantity to sell")

        realized = (price - position["average_cost"]) * quantity
        position["quantity"] -= quantity

        if position["quantity"] == 0:
            del portfolio["positions"][symbol]

        return {"symbol": symbol, "quantity_sold": quantity, "realized_pnl": round(realized, 2)}

    def update_prices(self, user_id: str, price_map: Dict[str, float]) -> Dict[str, Any]:
        portfolio = self.portfolios[user_id]
        for symbol, pos in portfolio["positions"].items():
            if symbol in price_map:
                pos["current_price"] = price_map[symbol]
        return self.compute_analytics(user_id)

    def compute_analytics(self, user_id: str) -> Dict[str, Any]:
        portfolio = self.portfolios[user_id]
        positions = portfolio["positions"].values()

        total_market_value = 0.0
        total_cost = 0.0
        sector_weights: Dict[str, float] = {}

        for p in positions:
            mv = p["quantity"] * p["current_price"]
            cost = p["quantity"] * p["average_cost"]
            total_market_value += mv
            total_cost += cost
            sector_weights[p["sector"]] = sector_weights.get(p["sector"], 0.0) + mv

        portfolio_value = total_market_value + portfolio["cash_balance"]
        for sector in list(sector_weights):
            sector_weights[sector] = round(sector_weights[sector] / portfolio_value, 3) if portfolio_value else 0

        alerts = []
        if portfolio_value:
            for p in portfolio["positions"].values():
                weight = (p["quantity"] * p["current_price"]) / portfolio_value
                if weight > 0.30:
                    alerts.append(f"{p['symbol']} exceeds 30% position limit")
            for sector, wt in sector_weights.items():
                if wt > 0.40:
                    alerts.append(f"{sector} sector exceeds 40% concentration")
            if len(portfolio["positions"]) < 5:
                alerts.append("Portfolio has fewer than 5 positions")

        return {
            "portfolio_value": round(portfolio_value, 2),
            "unrealized_pnl": round(total_market_value - total_cost, 2),
            "unrealized_pnl_pct": round(((total_market_value - total_cost) / total_cost) * 100, 2) if total_cost else 0.0,
            "positions_count": len(portfolio["positions"]),
            "sector_weights": sector_weights,
            "alerts": alerts,
        }


@dataclass
class TradingPolicy:
    stop_loss_pct: Optional[float] = None
    take_profit_pct: Optional[float] = None
    max_position_weight: Optional[float] = None
    min_hours_between_trades: Optional[int] = None
    strict_shariah: bool = False
    min_shariah_score: int = 70


class TradingPolicyEngine:
    def evaluate_trade(
        self,
        policy: TradingPolicy,
        entry_price: float,
        current_price: float,
        planned_weight: float,
        hours_since_last_trade: float,
        shariah_score: int,
    ) -> Tuple[bool, List[str]]:
        violations: List[str] = []

        change_pct = ((current_price - entry_price) / entry_price) * 100

        if policy.stop_loss_pct is not None and change_pct <= -policy.stop_loss_pct:
            violations.append("Stop loss threshold reached")

        if policy.take_profit_pct is not None and change_pct >= policy.take_profit_pct:
            violations.append("Take profit threshold reached")

        if policy.max_position_weight is not None and planned_weight > policy.max_position_weight:
            violations.append("Planned position exceeds max position weight")

        if policy.min_hours_between_trades is not None and hours_since_last_trade < policy.min_hours_between_trades:
            violations.append("Trade attempted before cooling-off window elapsed")

        if policy.strict_shariah and shariah_score < policy.min_shariah_score:
            violations.append("Trade blocked by strict Shariah policy")

        return len(violations) == 0, violations
