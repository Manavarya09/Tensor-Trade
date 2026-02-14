"""
Quick test script to verify market metrics service
"""

from services.market_metrics import get_market_metrics_service

def test_market_metrics():
    print("Testing Market Metrics Service...")
    print("=" * 60)
    
    # Get service instance
    service = get_market_metrics_service()
    
    # Test 1: Get VIX
    print("\nTest 1: Fetching VIX...")
    vix = service.get_vix()
    print(f"✓ VIX: {vix}")
    
    # Test 2: Get market regime
    print("\nTest 2: Determining market regime...")
    regime = service.get_market_regime(vix)
    print(f"✓ Market Regime: {regime}")
    regime_color = service.get_regime_color(regime)
    print(f"✓ Regime Color: {regime_color}")
    
    # Test 3: Calculate risk index (without agent data)
    print("\nTest 3: Calculating risk index (no agent data)...")
    risk_index = service.calculate_risk_index(vix)
    print(f"✓ Risk Index: {risk_index}/100")
    risk_level = service.get_risk_level_description(risk_index)
    print(f"✓ Risk Level: {risk_level}")
    
    # Test 4: Get asset volatility
    print("\nTest 4: Calculating asset volatility...")
    volatility = service.get_market_volatility("AAPL")
    print(f"✓ AAPL Volatility: {volatility:.2f}%")
    
    # Test 5: Calculate risk index with mock agent data
    print("\nTest 5: Calculating risk index WITH agent data...")
    mock_agent_data = {
        "consensus_points": ["Point 1", "Point 2"],
        "disagreement_topics": ["Disagreement 1"],
        "council_opinions": [
            "Macro Hawk (HIGH): Bullish",
            "Micro Forensic (MEDIUM): Uncertain",
            "Flow Detective (HIGH): Bullish",
            "Tech Interpreter (LOW): Bearish",
            "Skeptic (MEDIUM): Cautious"
        ]
    }
    risk_index_with_agents = service.calculate_risk_index(vix, mock_agent_data, volatility)
    print(f"✓ Risk Index (with agents): {risk_index_with_agents}/100")
    
    # Test 6: Get all metrics at once
    print("\nTest 6: Getting all metrics for AAPL...")
    all_metrics = service.get_all_metrics("AAPL", mock_agent_data)
    print(f"✓ Complete Metrics:")
    for key, value in all_metrics.items():
        print(f"   - {key}: {value}")
    
    print("\n" + "=" * 60)
    print("All tests passed! ✓")

if __name__ == "__main__":
    test_market_metrics()
