"""
Voice service for TensorTrade live calling agent.

Uses:
- ElevenLabs for natural AI voice generation (text-to-speech)
- Twilio for making real phone calls
- Browser audio fallback when no Twilio credentials

Flow:
1. Generate market analysis text from backend agents
2. Convert text → speech via ElevenLabs
3a. If Twilio configured → call user's phone, play ElevenLabs audio
3b. If no Twilio → return audio bytes for browser playback
"""

import os
import io
import logging
from typing import Optional, Tuple
from datetime import datetime

logger = logging.getLogger(__name__)

# ── ElevenLabs TTS ──────────────────────────────────────────

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "JBFqnCBsd6RMkjVDRZzb")  # "George" - professional male
ELEVENLABS_MODEL = os.getenv("ELEVENLABS_MODEL", "eleven_turbo_v2")

# ── Twilio ──────────────────────────────────────────────────

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER", "")  # Your Twilio number


def is_elevenlabs_configured() -> bool:
    return bool(ELEVENLABS_API_KEY)


def is_twilio_configured() -> bool:
    return bool(TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER)


async def generate_speech(text: str) -> Optional[bytes]:
    """
    Convert text to speech using ElevenLabs API.
    Returns MP3 audio bytes, or None if not configured / error.
    """
    if not is_elevenlabs_configured():
        logger.warning("ElevenLabs API key not set – skipping TTS")
        return None

    try:
        import aiohttp
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"

        headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }
        payload = {
            "text": text,
            "model_id": ELEVENLABS_MODEL,
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.8,
                "style": 0.3,
            },
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as resp:
                if resp.status == 200:
                    audio_bytes = await resp.read()
                    logger.info(f"ElevenLabs TTS: generated {len(audio_bytes)} bytes")
                    return audio_bytes
                else:
                    body = await resp.text()
                    logger.error(f"ElevenLabs error {resp.status}: {body}")
                    return None
    except Exception as e:
        logger.error(f"ElevenLabs TTS failed: {e}")
        return None


async def generate_speech_stream(text: str):
    """
    Stream speech audio chunks from ElevenLabs (for real-time playback).
    Yields raw MP3 chunks.
    """
    if not is_elevenlabs_configured():
        return

    try:
        import aiohttp
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}/stream"
        headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }
        payload = {
            "text": text,
            "model_id": ELEVENLABS_MODEL,
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.8,
                "style": 0.3,
            },
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as resp:
                if resp.status == 200:
                    async for chunk in resp.content.iter_chunked(4096):
                        yield chunk
                else:
                    body = await resp.text()
                    logger.error(f"ElevenLabs stream error {resp.status}: {body}")
    except Exception as e:
        logger.error(f"ElevenLabs stream failed: {e}")


def make_twilio_call(
    to_number: str,
    twiml_url: str,
    status_callback_url: Optional[str] = None,
) -> dict:
    """
    Place an outbound phone call via Twilio.
    The call will fetch TwiML from `twiml_url` to know what to say/play.
    Returns Twilio call SID and status.
    """
    if not is_twilio_configured():
        return {"success": False, "error": "Twilio not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER to .env"}

    try:
        from twilio.rest import Client
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

        call_kwargs = {
            "to": to_number,
            "from_": TWILIO_PHONE_NUMBER,
            "url": twiml_url,
        }
        if status_callback_url:
            call_kwargs["status_callback"] = status_callback_url
            call_kwargs["status_callback_event"] = ["completed", "failed", "busy", "no-answer"]

        call = client.calls.create(**call_kwargs)

        logger.info(f"Twilio call initiated: SID={call.sid} to={to_number}")
        return {
            "success": True,
            "call_sid": call.sid,
            "status": call.status,
            "to": to_number,
            "from": TWILIO_PHONE_NUMBER,
        }
    except Exception as e:
        logger.error(f"Twilio call failed: {e}")
        return {"success": False, "error": str(e)}


def build_market_update_script(context: dict) -> str:
    """
    Build a natural-sounding spoken script from analysis context.
    This is what the AI voice will say to the user on the phone.
    """
    asset = context.get("asset", "your portfolio")
    price = context.get("current_price") or context.get("market_analysis", {}).get("market_context", {}).get("price", "unknown")
    direction = context.get("move_direction") or context.get("market_analysis", {}).get("market_context", {}).get("move_direction", "")
    change = context.get("price_change_pct") or context.get("market_analysis", {}).get("market_context", {}).get("change_pct", "0")
    regime = context.get("market_metrics", {}).get("market_regime", "")
    risk_level = context.get("market_metrics", {}).get("risk_level", "")
    risk_index = context.get("market_metrics", {}).get("risk_index", "")
    vix = context.get("market_metrics", {}).get("vix", "")

    # Council opinions
    opinions = context.get("market_analysis", {}).get("council_opinions", [])
    consensus = context.get("market_analysis", {}).get("consensus", [])

    # Narrative
    narrative = context.get("narrative", {}).get("styled_message", "") or context.get("narrative", {}).get("summary", "")

    # Behavioral flags
    flags = context.get("behavioral_analysis", {}).get("flags", [])

    # Shariah
    shariah = context.get("shariah_compliance", {})

    # Build the script
    lines = []
    lines.append(f"Hello! This is your TensorTrade AI market analyst calling with your live update for {asset}.")
    lines.append("")

    # Price info
    if price and price != "unknown":
        dir_word = "up" if str(direction).upper() in ("UP", "BULLISH") else "down" if str(direction).upper() in ("DOWN", "BEARISH") else "moving"
        lines.append(f"{asset} is currently trading at {price} dollars, {dir_word} {change} percent today.")

    # Market regime
    if regime:
        lines.append(f"The current market regime is {regime}.")
    if risk_level:
        lines.append(f"Risk level is {risk_level} with a risk index of {risk_index} out of 100.")
    if vix:
        lines.append(f"The VIX volatility index is at {vix}.")

    lines.append("")

    # Council debate summary
    if opinions:
        lines.append("Here's what our 5-agent council concluded:")
        for op in opinions[:3]:  # Top 3 for brevity on phone
            lines.append(f"  {op}")
        lines.append("")

    # Consensus
    if consensus:
        lines.append(f"The council consensus is: {'. '.join(consensus[:2])}.")
        lines.append("")

    # Behavioral warnings
    if flags:
        flag_names = [f.get("pattern", "") if isinstance(f, dict) else str(f) for f in flags]
        lines.append(f"Behavioral alert: We detected potential {', '.join(flag_names)} patterns in your recent activity. Stay disciplined.")
        lines.append("")

    # Shariah
    if shariah.get("compliant") is not None:
        status = "Shariah compliant" if shariah["compliant"] else "not Shariah compliant"
        lines.append(f"Shariah compliance check: {asset} is {status} with a score of {shariah.get('score', 'N/A')} out of 100.")
        lines.append("")

    # Narrative
    if narrative:
        lines.append(f"Your personalized AI insight: {narrative}")
        lines.append("")

    lines.append("That's your TensorTrade market briefing. Stay sharp, and feel free to call back anytime for deeper analysis. Goodbye!")

    return "\n".join(lines)


def get_voice_config_status() -> dict:
    """Return the configuration status of voice services."""
    return {
        "elevenlabs": {
            "configured": is_elevenlabs_configured(),
            "voice_id": ELEVENLABS_VOICE_ID if is_elevenlabs_configured() else None,
            "model": ELEVENLABS_MODEL if is_elevenlabs_configured() else None,
        },
        "twilio": {
            "configured": is_twilio_configured(),
            "phone_number": TWILIO_PHONE_NUMBER if is_twilio_configured() else None,
        },
        "browser_fallback": True,  # Always available
    }
