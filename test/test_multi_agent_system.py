from services.multi_agent_system import (
    BehaviorDetector,
    LearningEngine,
    Madhab,
    MultiAgentOrchestrator,
    PortfolioManager,
    ShariahComplianceScreener,
    TradingPolicy,
    TradingPolicyEngine,
)


def test_orchestrator_returns_consensus_and_agents():
    orchestrator = MultiAgentOrchestrator()
    analysis = orchestrator.analyze(
        {
            "fed_rate": 4.5,
            "inflation_cpi": 2.5,
            "gdp_growth": 2.2,
            "yield_spread_10y_2y": 0.5,
            "pe_ratio": 18,
            "sector_pe_ratio": 22,
            "debt_to_equity": 0.5,
            "roe": 0.18,
            "revenue_growth": 0.14,
            "volume_ratio": 1.4,
            "institutional_change_pct": 1.2,
            "insider_net_buy_musd": 5,
            "rsi": 56,
            "macd_histogram": 0.8,
            "price": 120,
            "ma_200": 110,
        }
    )

    assert analysis["consensus_stance"] in {"BULLISH", "BEARISH", "NEUTRAL"}
    assert len(analysis["agent_outputs"]) == 5


def test_learning_engine_weight_optimization():
    engine = LearningEngine()
    analysis = {
        "consensus_stance": "BULLISH",
        "agent_outputs": [
            {"agent_name": "macro", "stance": "BULLISH"},
            {"agent_name": "fundamentals", "stance": "BULLISH"},
            {"agent_name": "flow", "stance": "NEUTRAL"},
            {"agent_name": "technical", "stance": "BEARISH"},
            {"agent_name": "risk", "stance": "NEUTRAL"},
        ],
    }
    engine.record_prediction("u1", "AAPL", analysis)
    engine.record_outcome("AAPL", 2.0)

    weights = engine.optimize_weights(
        "u1", {"macro": 0.2, "fundamentals": 0.2, "flow": 0.2, "technical": 0.2, "risk": 0.2}
    )

    assert round(sum(weights.values()), 3) == 1.0
    assert weights["macro"] > weights["technical"]


def test_portfolio_manager_alerts_and_pnl():
    pm = PortfolioManager()
    pm.create_portfolio("u1", cash_balance=1000)
    pm.add_position("u1", "AAPL", 10, 100, sector="Tech")
    pm.add_position("u1", "MSFT", 2, 200, sector="Tech")

    analytics = pm.update_prices("u1", {"AAPL": 120, "MSFT": 190})

    assert analytics["portfolio_value"] > 0
    assert isinstance(analytics["alerts"], list)


def test_behavior_and_policies_and_shariah():
    detector = BehaviorDetector()
    patterns = detector.detect(
        {
            "weekly_move_pct": 14,
            "has_position": False,
            "recent_loss_pct": -7,
            "hours_since_loss": 12,
            "planned_size_increase_x": 1.5,
            "ignored_risk_warnings": 3,
        }
    )
    assert len(patterns) >= 2

    screener = ShariahComplianceScreener()
    report = screener.screen("AAPL", "Technology", 0.18, 0.005, 0.15, madhab=Madhab.HANAFI)
    assert report["overall_ruling"] in {"HALAL", "MOSTLY_HALAL", "QUESTIONABLE", "HARAM"}

    policy_engine = TradingPolicyEngine()
    ok, violations = policy_engine.evaluate_trade(
        TradingPolicy(stop_loss_pct=10, max_position_weight=0.15, min_hours_between_trades=24, strict_shariah=True),
        entry_price=100,
        current_price=85,
        planned_weight=0.2,
        hours_since_last_trade=2,
        shariah_score=60,
    )

    assert not ok
    assert len(violations) >= 3
