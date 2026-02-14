from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from uuid import uuid4


@dataclass
class CallSchedule:
    schedule_id: str
    user_id: str
    phone_number: str
    call_type: str
    frequency: str
    next_call_at: str
    active: bool = True
    asset: Optional[str] = None
    timezone: str = "UTC"
    created_at: str = datetime.utcnow().isoformat()
    last_called_at: Optional[str] = None


class CallingAgent:
    """
    Two-way calling agent with in-memory scheduling and call logs.

    Features:
    - outbound calls (agent can call user)
    - inbound calls (user can call agent and receive intent-aware response)
    - schedule management for recurring market updates
    - due-call processing for cron/background workers
    """

    _schedules: Dict[str, CallSchedule] = {}
    _call_logs: List[Dict[str, Any]] = []

    def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        return self.run_async(context)

    async def run_async(self, context: Dict[str, Any]) -> Dict[str, Any]:
        shariah_compliance = context.get("shariah_compliance", {})
        if shariah_compliance and not shariah_compliance.get("compliant", True):
            context["calling_result"] = {
                "action": "BLOCKED",
                "reason": "Shariah non-compliant",
                "capabilities": ["inbound", "outbound", "scheduled_updates"],
            }
            return context

        user_id = context.get("user_id", "default_user")
        phone_number = context.get("phone_number", "+10000000000")
        message = self.generate_market_update(context)
        outbound = self.trigger_outbound_call(
            user_id=user_id,
            phone_number=phone_number,
            message=message,
            call_type="market_update",
            asset=context.get("asset"),
            metadata={"source": "agent_pipeline"},
        )

        context["market_call"] = self._determine_trade_call(context)
        context["calling_result"] = {
            "action": "CALLED",
            "details": outbound,
            "capabilities": ["inbound", "outbound", "scheduled_updates"],
        }
        return context

    def schedule_call(
        self,
        user_id: str,
        phone_number: str,
        first_call_at: datetime,
        call_type: str = "daily_summary",
        frequency: str = "daily",
        asset: Optional[str] = None,
        timezone: str = "UTC",
    ) -> Dict[str, Any]:
        schedule = CallSchedule(
            schedule_id=str(uuid4()),
            user_id=user_id,
            phone_number=phone_number,
            call_type=call_type,
            frequency=frequency,
            next_call_at=first_call_at.isoformat(),
            asset=asset,
            timezone=timezone,
        )
        self._schedules[schedule.schedule_id] = schedule
        return asdict(schedule)

    def list_schedules(self, user_id: str) -> List[Dict[str, Any]]:
        return [asdict(s) for s in self._schedules.values() if s.user_id == user_id and s.active]

    def cancel_schedule(self, schedule_id: str, user_id: str) -> Dict[str, Any]:
        schedule = self._schedules.get(schedule_id)
        if not schedule or schedule.user_id != user_id:
            return {"success": False, "message": "Schedule not found"}
        schedule.active = False
        return {"success": True, "schedule_id": schedule_id}

    def process_due_calls(
        self,
        now: Optional[datetime] = None,
        market_payload_by_user: Optional[Dict[str, Dict[str, Any]]] = None,
    ) -> List[Dict[str, Any]]:
        now = now or datetime.utcnow()
        market_payload_by_user = market_payload_by_user or {}
        executed: List[Dict[str, Any]] = []

        for schedule in self._schedules.values():
            if not schedule.active:
                continue

            call_at = datetime.fromisoformat(schedule.next_call_at)
            if call_at > now:
                continue

            payload = market_payload_by_user.get(schedule.user_id, {})
            context = {"asset": schedule.asset or payload.get("asset", "SPY"), **payload}
            message = self.generate_market_update(context)
            log = self.trigger_outbound_call(
                user_id=schedule.user_id,
                phone_number=schedule.phone_number,
                message=message,
                call_type=schedule.call_type,
                asset=schedule.asset,
                metadata={"schedule_id": schedule.schedule_id},
            )
            executed.append(log)

            schedule.last_called_at = now.isoformat()
            schedule.next_call_at = self._next_call_time(now, schedule.frequency).isoformat()

        return executed

    def trigger_outbound_call(
        self,
        user_id: str,
        phone_number: str,
        message: str,
        call_type: str,
        asset: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        call_log = {
            "call_id": str(uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "direction": "OUTBOUND",
            "user_id": user_id,
            "phone_number": phone_number,
            "call_type": call_type,
            "asset": asset,
            "message": message,
            "status": "COMPLETED",
            "metadata": metadata or {},
        }
        self._call_logs.append(call_log)
        return call_log

    def handle_inbound_call(
        self,
        user_id: str,
        phone_number: str,
        transcript: str,
        asset: Optional[str] = None,
    ) -> Dict[str, Any]:
        intent = self._detect_intent(transcript)
        response = self._generate_inbound_response(intent, transcript, asset)

        call_log = {
            "call_id": str(uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "direction": "INBOUND",
            "user_id": user_id,
            "phone_number": phone_number,
            "call_type": "user_query",
            "asset": asset,
            "transcript": transcript,
            "intent": intent,
            "response": response,
            "status": "COMPLETED",
        }
        self._call_logs.append(call_log)
        return call_log

    def get_call_logs(self, user_id: str) -> List[Dict[str, Any]]:
        return [log for log in self._call_logs if log.get("user_id") == user_id]

    def generate_market_update(self, context: Dict[str, Any]) -> str:
        asset = context.get("asset", "SPY")
        current_price = context.get("current_price", "N/A")
        move = context.get("price_change_pct", "0.0")
        sentiment = context.get("market_sentiment", "neutral")
        risk_level = context.get("risk_level", context.get("risk", {}).get("risk_level", "MEDIUM"))
        market_call = context.get("market_call", "HOLD")

        return (
            f"Market update for {asset}. Current price: {current_price}. "
            f"Recent move: {move}%. Sentiment: {sentiment}. "
            f"Risk level: {risk_level}. Current agent call: {market_call}."
        )

    @staticmethod
    def _next_call_time(from_time: datetime, frequency: str) -> datetime:
        if frequency == "hourly":
            return from_time + timedelta(hours=1)
        if frequency == "weekly":
            return from_time + timedelta(days=7)
        return from_time + timedelta(days=1)

    @staticmethod
    def _detect_intent(transcript: str) -> str:
        text = transcript.lower()
        if "sell" in text:
            return "SELL"
        if "buy" in text:
            return "BUY"
        if "hold" in text:
            return "HOLD"
        if "analysis" in text or "why" in text:
            return "FULL_ANALYSIS"
        if text.strip() in {"yes", "yeah", "yep"}:
            return "YES"
        if text.strip() in {"no", "nope"}:
            return "NO"
        return "QUESTION"

    @staticmethod
    def _generate_inbound_response(intent: str, transcript: str, asset: Optional[str]) -> str:
        if intent == "FULL_ANALYSIS":
            return f"Here is your expanded analysis for {asset or 'your watchlist'} with macro, technical, and risk context."
        if intent in {"BUY", "SELL", "HOLD"}:
            return f"Acknowledged {intent} request for {asset or 'the selected asset'}. Please confirm in app to execute."
        if intent == "YES":
            return "Great. I will continue with a deeper market breakdown now."
        if intent == "NO":
            return "Understood. I will keep updates concise and alert you only for important events."
        return f"I heard: '{transcript}'. I can provide analysis, execute hold/sell/buy confirmation, or schedule calls."

    @staticmethod
    def _determine_trade_call(context: Dict[str, Any]) -> str:
        consensus = context.get("consensus_stance") or context.get("move_direction") or "NEUTRAL"
        normalized = str(consensus).upper()
        if "BULL" in normalized or "UP" in normalized:
            return "BUY"
        if "BEAR" in normalized or "DOWN" in normalized:
            return "SELL"
        return "HOLD"
