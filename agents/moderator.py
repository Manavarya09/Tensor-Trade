import requests
import json
import os
import logging

logger = logging.getLogger(__name__)

class ModeratorAgent:
    def run(self, context: dict) -> dict:
        # Expects context with persona_post from PersonaAgent
        persona_post = context.get("persona_post", {})
        asset = context.get("asset", "")
        price_change_pct = context.get("price_change_pct", "")
        behavior_label = context.get("behavior_label", "")

        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            logger.warning("OPENROUTER_API_KEY not found. Returning default moderation.")
            context["moderation"] = {
                "x": {"verdict": "WARN", "reason": "Moderation service unavailable (missing API key)."},
                "linkedin": {"verdict": "WARN", "reason": "Moderation service unavailable (missing API key)."}
            }
            context["moderated_output"] = "Moderation unavailable."
            return context

        headers = {
            "Authorization": "Bearer " + api_key,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://tensortrade.ai",
            "X-Title": "TensorTrade"
        }
        base_url = "https://openrouter.ai/api/v1/chat/completions"
        model = "meta-llama/llama-3.3-70b-instruct:free"

        def moderation_prompt(platform, post):
            return (
                f"Review this {platform} post about {asset} moving {price_change_pct}%: '{post}'. "
                f"Behavior label: {behavior_label}. "
                "Criteria: exaggeration, hype, emotional triggers, harmful patterns. "
                "Respond with a JSON object: { 'verdict': 'POST|WARN|BLOCK', 'reason': '<explanation>' }"
            )

        def query_openrouter(prompt):
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 200,
                "temperature": 0.1
            }
            try:
                response = requests.post(base_url, headers=headers, data=json.dumps(payload), timeout=10)
                response.raise_for_status()
                result = response.json()
                content = result["choices"][0]["message"]["content"].strip()

                # Simple JSON extraction
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()

                return json.loads(content)
            except Exception as e:
                logger.error(f"Moderation API error: {e}")
                return {"verdict": "WARN", "reason": f"API error: {str(e)}"}

        moderation = {}
        overall_status = "SAFE"

        for platform in ["x", "linkedin"]:
            post = persona_post.get(platform, "")
            if not post:
                moderation[platform] = {"verdict": "SKIP", "reason": "No post generated."}
                continue

            prompt = moderation_prompt(platform, post)
            result = query_openrouter(prompt)
            moderation[platform] = result

            if result.get("verdict") == "BLOCK":
                overall_status = "BLOCKED"
            elif result.get("verdict") == "WARN" and overall_status != "BLOCKED":
                overall_status = "WARNING"

        context["moderation"] = moderation
        context["moderated_output"] = f"Content Status: {overall_status}. " + " | ".join([f"{k.upper()}: {v.get('verdict')}" for k,v in moderation.items()])

        logger.info(f"Moderation complete: {overall_status}")
        return context
