"""
Test script for the 5-agent LLM council debate system.

Usage:
    python -m llm_council.test_council
    python -m llm_council.test_council AAPL
    python -m llm_council.test_council MSFT
"""

import asyncio
import sys
import json
from pathlib import Path

# Add parent directory to path so we can import llm_council
sys.path.insert(0, str(Path(__file__).parent.parent))

from llm_council.services.debate_engine import get_council_analysis


async def test_council(symbol: str = "AAPL"):
    """Test the 5-agent council with a stock symbol."""
    
    print("="*70)
    print(f"🎪 TESTING 5-AGENT LLM COUNCIL")
    print(f"📊 Symbol: {symbol}")
    print("="*70)
    print()
    
    print("🚀 Starting multi-agent debate...")
    print("⏳ This will take 10-30 seconds (5 LLMs running in parallel)")
    print()
    
    try:
        # Run the debate
        result = await get_council_analysis(symbol)
        
        print("✅ DEBATE COMPLETE!")
        print()
        print(result["judge_summary"])
        print()
        
        # Show details
        print("\n📋 DETAILED AGENT ARGUMENTS:")
        print("-" * 70)
        for arg in result["agent_arguments"]:
            print(f"\n{arg.agent_name} ({arg.confidence.value}):")
            print(f"Thesis: {arg.thesis}")
            print(f"Supporting Points:")
            for i, point in enumerate(arg.supporting_points, 1):
                print(f"  {i}. {point}")
        
        print("\n\n✨ CONSENSUS POINTS:")
        print("-" * 70)
        for cp in result["consensus_points"]:
            print(f"✓ {cp.statement}")
            print(f"  Supporting: {', '.join(cp.supporting_agents)}")
        
        print("\n\n⚔️ DISAGREEMENTS:")
        print("-" * 70)
        for dp in result["disagreement_points"]:
            print(f"Topic: {dp.topic}")
            for view, opinion in dp.competing_views.items():
                print(f"  - {view}: {opinion}")
        
        print("\n\n📊 MARKET CONTEXT:")
        print("-" * 70)
        mc = result["market_context"]
        print(f"Price: ${mc['price']:.2f}")
        print(f"Move: {mc['move_direction']} {abs(mc['move_pct']):.2f}%")
        print(f"Volume: {mc['volume']:,}")
        
        # Save to file
        output_file = Path(__file__).parent / f"debate_output_{symbol}.json"
        with open(output_file, "w") as f:
            # Convert Pydantic models to dict for JSON serialization
            output_data = {
                "symbol": result["symbol"],
                "timestamp": result["timestamp"].isoformat(),
                "agent_arguments": [
                    {
                        "agent_name": arg.agent_name,
                        "thesis": arg.thesis,
                        "supporting_points": arg.supporting_points,
                        "confidence": arg.confidence.value,
                        "references": arg.references
                    }
                    for arg in result["agent_arguments"]
                ],
                "consensus_points": [
                    {
                        "statement": cp.statement,
                        "supporting_agents": cp.supporting_agents,
                        "evidence_strength": cp.evidence_strength.value
                    }
                    for cp in result["consensus_points"]
                ],
                "disagreement_points": [
                    {
                        "topic": dp.topic,
                        "competing_views": dp.competing_views
                    }
                    for dp in result["disagreement_points"]
                ],
                "judge_summary": result["judge_summary"],
                "market_context": result["market_context"]
            }
            json.dump(output_data, f, indent=2)
        
        print(f"\n💾 Full results saved to: {output_file}")
        
        return result
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return None


def main():
    """Main entry point."""
    
    # Get symbol from command line or use default
    symbol = sys.argv[1] if len(sys.argv) > 1 else "AAPL"
    
    # Run async test
    result = asyncio.run(test_council(symbol))
    
    if result:
        print("\n✅ Test completed successfully!")
        return 0
    else:
        print("\n❌ Test failed!")
        return 1


if __name__ == "__main__":
    sys.exit(main())
