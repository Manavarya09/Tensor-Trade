"""
Comprehensive API Test Suite
Tests all endpoints of the Multi-Agent Trading Psychology API

Usage:
    python test_api.py
"""

import requests
import json
from datetime import datetime
from typing import Dict, Any


BASE_URL = "http://localhost:8000"
TIMEOUT = 180  # 3 minutes for LLM processing


def print_section(title: str):
    """Print formatted section header."""
    print(f"\n{'='*70}")
    print(f"{title:^70}")
    print(f"{'='*70}\n")


def print_result(test_name: str, passed: bool, details: str = ""):
    """Print test result."""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")


def test_health_endpoint() -> bool:
    """Test GET /health endpoint."""
    print_section("TEST 1: Health Check Endpoint")
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        
        if response.status_code != 200:
            print_result("GET /health", False, f"Status code: {response.status_code}")
            return False
        
        data = response.json()
        
        # Validate response structure
        required_fields = ["status", "version", "services"]
        missing = [f for f in required_fields if f not in data]
        if missing:
            print_result("GET /health", False, f"Missing fields: {missing}")
            return False
        
        # Check status
        if data["status"] != "healthy":
            print_result("GET /health", False, f"Status: {data['status']}")
            return False
        
        print_result("GET /health", True, f"Version: {data['version']}")
        print(f"    Services: {len(data['services'])} operational")
        
        # Display response output
        print("\n📄 API RESPONSE:")
        print(json.dumps(data, indent=2))
        return True
        
    except Exception as e:
        print_result("GET /health", False, str(e))
        return False


def test_root_endpoint() -> bool:
    """Test GET / endpoint."""
    print_section("TEST 2: Root Information Endpoint")
    
    try:
        response = requests.get(BASE_URL, timeout=5)
        
        if response.status_code != 200:
            print_result("GET /", False, f"Status code: {response.status_code}")
            return False
        
        data = response.json()
        
        # Validate response structure
        required_fields = ["message", "version", "endpoints", "agents", "features"]
        missing = [f for f in required_fields if f not in data]
        if missing:
            print_result("GET /", False, f"Missing fields: {missing}")
            return False
        
        print_result("GET /", True, f"API: {data['message']}")
        print(f"    Version: {data['version']}")
        print(f"    Endpoints: {len(data['endpoints'])}")
        print(f"    Agents: {len(data['agents'])}")
        print(f"    Features: {len(data['features'])}")
        
        # Display response output
        print("\n📄 API RESPONSE:")
        print(json.dumps(data, indent=2))
        return True
        
    except Exception as e:
        print_result("GET /", False, str(e))
        return False


def test_analyze_asset_endpoint() -> bool:
    """Test POST /analyze-asset endpoint (simplified)."""
    print_section("TEST 3: Analyze Asset Endpoint (Simplified)")
    
    try:
        print("Sending request for AAPL...")
        print("⏳ This will take 100-120 seconds (5 LLM agents processing)...")
        
        start_time = datetime.now()
        response = requests.post(
            f"{BASE_URL}/analyze-asset",
            params={"asset": "AAPL", "user_id": "test_user"},
            timeout=TIMEOUT
        )
        elapsed = (datetime.now() - start_time).total_seconds()
        
        if response.status_code != 200:
            print_result("POST /analyze-asset", False, 
                        f"Status: {response.status_code} - {response.text[:100]}")
            return False
        
        data = response.json()
        
        # Validate response structure
        required_sections = [
            "asset", "user_id", "analysis_type", "persona_selected",
            "trade_history", "economic_calendar", "behavioral_analysis",
            "market_analysis", "narrative", "timestamp"
        ]
        missing = [f for f in required_sections if f not in data]
        if missing:
            print_result("POST /analyze-asset", False, f"Missing sections: {missing}")
            return False
        
        # Validate trade history
        th = data["trade_history"]
        if "total_trades" not in th or "total_pnl" not in th or "win_rate" not in th:
            print_result("POST /analyze-asset", False, "Invalid trade_history structure")
            return False
        
        # Validate market analysis
        ma = data["market_analysis"]
        if "council_opinions" not in ma or len(ma["council_opinions"]) != 5:
            print_result("POST /analyze-asset", False, "Invalid market_analysis (need 5 agents)")
            return False
        
        print_result("POST /analyze-asset", True, f"Completed in {elapsed:.1f}s")
        print(f"    Asset: {data['asset']}")
        print(f"    Persona: {data['persona_selected']}")
        print(f"    Trades: {th['total_trades']} | P&L: ${th['total_pnl']:.2f} | Win Rate: {th['win_rate']:.1f}%")
        print(f"    Economic Events: {len(data['economic_calendar'].get('economic_events', []))}")
        print(f"    Behavioral Flags: {len(data['behavioral_analysis'].get('flags', []))}")
        print(f"    Council Opinions: {len(ma['council_opinions'])} agents")
        print(f"    Consensus Points: {len(ma.get('consensus', []))}")
        
        # Check for errors
        errors = data.get("errors", {})
        if errors:
            print(f"    ⚠️ Agent Errors: {list(errors.keys())}")
        
        # Display key parts of response output
        print("\n📄 API RESPONSE SAMPLE:")
        print("\n📊 Trade History:")
        print(json.dumps(data['trade_history'], indent=2))
        
        print("\n📈 Economic Calendar Summary:")
        print(f"  {data['economic_calendar'].get('summary', 'N/A')[:200]}...")
        
        print("\n🦅 Council Opinions:")
        for i, opinion in enumerate(ma['council_opinions'], 1):
            print(f"  {i}. {opinion[:100]}...")
        
        if ma.get('consensus'):
            print("\n✓ Consensus Points:")
            for cp in ma['consensus'][:3]:
                print(f"  • {cp[:100]}...")
        
        print("\n📝 Narrative (styled message):")
        styled_msg = data['narrative'].get('styled_message', '')
        if styled_msg:
            print(f"  {styled_msg[:300]}...")
        
        return True
        
    except requests.exceptions.Timeout:
        print_result("POST /analyze-asset", False, f"Timeout after {TIMEOUT}s")
        return False
    except Exception as e:
        print_result("POST /analyze-asset", False, str(e))
        return False


def test_run_agents_endpoint() -> bool:
    """Test POST /run-agents endpoint (legacy)."""
    print_section("TEST 4: Run Agents Endpoint (Legacy)")
    
    payload = {
        "market_event": "SPY moved up 1.5% on strong jobs report",
        "user_trades": [
            {
                "timestamp": "2026-02-07 10:30:00",
                "symbol": "SPY",
                "action": "BUY",
                "price": 480.0,
                "pnl": -150.0,
                "status": "CLOSED"
            },
            {
                "timestamp": "2026-02-07 14:30:00",
                "symbol": "SPY",
                "action": "SELL",
                "price": 482.5,
                "pnl": 400.0,
                "status": "CLOSED"
            }
        ],
        "persona_style": "professional"
    }
    
    try:
        print("Sending request for SPY with 2 trades...")
        print("⏳ This will take 100-120 seconds (5 LLM agents processing)...")
        
        start_time = datetime.now()
        response = requests.post(
            f"{BASE_URL}/run-agents",
            json=payload,
            timeout=TIMEOUT
        )
        elapsed = (datetime.now() - start_time).total_seconds()
        
        if response.status_code != 200:
            print_result("POST /run-agents", False, 
                        f"Status: {response.status_code} - {response.text[:100]}")
            return False
        
        data = response.json()
        
        # Validate response structure
        required_fields = ["message", "agents_run", "result"]
        missing = [f for f in required_fields if f not in data]
        if missing:
            print_result("POST /run-agents", False, f"Missing fields: {missing}")
            return False
        
        # Validate agents ran
        if data["agents_run"] != 5:
            print_result("POST /run-agents", False, f"Expected 5 agents, got {data['agents_run']}")
            return False
        
        # Validate result context
        result = data["result"]
        if "market_opinions" not in result or len(result["market_opinions"]) != 5:
            print_result("POST /run-agents", False, "Missing market_opinions or wrong count")
            return False
        
        print_result("POST /run-agents", True, f"Completed in {elapsed:.1f}s")
        print(f"    Message: {data['message']}")
        print(f"    Agents Run: {data['agents_run']}")
        print(f"    Asset: {result.get('asset', 'N/A')}")
        print(f"    Behavioral Flags: {len(result.get('behavior_flags', []))}")
        print(f"    Market Opinions: {len(result.get('market_opinions', []))}")
        print(f"    Has Narrative: {'summary' in result}")
        
        # Display key parts of response output
        print("\n📄 API RESPONSE SAMPLE:")
        print("\n🦅 Market Opinions from Council:")
        for i, opinion in enumerate(result.get('market_opinions', [])[:5], 1):
            print(f"  {i}. {opinion[:100]}...")
        
        if result.get('consensus_points'):
            print("\n✓ Consensus Points:")
            for cp in result['consensus_points'][:3]:
                print(f"  • {cp[:100]}...")
        
        if result.get('final_message'):
            print("\n📝 Final Message:")
            print(f"  {result['final_message'][:300]}...")
        
        return True
        
    except requests.exceptions.Timeout:
        print_result("POST /run-agents", False, f"Timeout after {TIMEOUT}s")
        return False
    except Exception as e:
        print_result("POST /run-agents", False, str(e))
        return False


def run_all_tests():
    """Run complete test suite."""
    print("\n" + "="*70)
    print("MULTI-AGENT TRADING PSYCHOLOGY API - TEST SUITE".center(70))
    print("="*70)
    print(f"\nBase URL: {BASE_URL}")
    print(f"Timeout: {TIMEOUT}s")
    print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = []
    
    # Test 1: Health check (fast)
    results.append(("GET /health", test_health_endpoint()))
    
    # Test 2: Root endpoint (fast)
    results.append(("GET /", test_root_endpoint()))
    
    # Test 3: Analyze asset (slow - LLM calls)
    results.append(("POST /analyze-asset", test_analyze_asset_endpoint()))
    
    # Test 4: Run agents (slow - LLM calls)
    results.append(("POST /run-agents", test_run_agents_endpoint()))
    
    # Summary
    print_section("TEST SUMMARY")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for endpoint, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {endpoint}")
    
    print(f"\n{'='*70}")
    print(f"Results: {passed}/{total} tests passed ({passed/total*100:.0f}%)")
    print(f"End Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*70}\n")
    
    if passed == total:
        print("🎉 All tests passed! API is fully operational.")
        return 0
    else:
        print("⚠️ Some tests failed. Check logs above for details.")
        return 1


if __name__ == "__main__":
    exit_code = run_all_tests()
    exit(exit_code)
