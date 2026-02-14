from datetime import datetime, timedelta

from agents.calling_agent import CallingAgent


def test_inbound_outbound_and_schedule_flow():
    agent = CallingAgent()

    outbound = agent.trigger_outbound_call(
        user_id="u1",
        phone_number="+1234567890",
        message="Daily update",
        call_type="daily_summary",
        asset="AAPL",
    )
    assert outbound["direction"] == "OUTBOUND"

    inbound = agent.handle_inbound_call(
        user_id="u1",
        phone_number="+1234567890",
        transcript="yes give me full analysis",
        asset="AAPL",
    )
    assert inbound["direction"] == "INBOUND"
    assert inbound["intent"] in {"YES", "FULL_ANALYSIS"}

    due_time = datetime.utcnow() - timedelta(minutes=1)
    schedule = agent.schedule_call(
        user_id="u1",
        phone_number="+1234567890",
        first_call_at=due_time,
        call_type="market_close_summary",
        frequency="daily",
        asset="AAPL",
    )
    assert schedule["user_id"] == "u1"

    executed = agent.process_due_calls(now=datetime.utcnow())
    assert len(executed) >= 1

    logs = agent.get_call_logs("u1")
    assert len(logs) >= 3


def test_run_async_populates_context_calling_result():
    agent = CallingAgent()
    context = {
        "user_id": "u2",
        "phone_number": "+1987654321",
        "asset": "TSLA",
        "consensus_stance": "BULLISH",
    }

    import asyncio

    result = asyncio.run(agent.run_async(context))
    assert result["calling_result"]["action"] == "CALLED"
    assert result["market_call"] == "BUY"
