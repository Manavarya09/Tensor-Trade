import requests
import json
import os
import time
from dotenv import load_dotenv

class PersonaAgent:
    def __init__(self):
        """Initialize PersonaAgent with API key from environment."""
        # Load environment variables - try agents folder first, then parent
        env_path = os.path.join(os.path.dirname(__file__), '.env')
        load_dotenv(dotenv_path=env_path)
        
        self.api_key = os.getenv("MISTRAL_API_KEY")
        
        # If not found, try parent directory
        if not self.api_key:
            parent_env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
            load_dotenv(dotenv_path=parent_env_path, override=True)
            self.api_key = os.getenv("MISTRAL_API_KEY")
        
        if not self.api_key:
            print("WARNING: Mistral API key not found. Set 'MISTRAL_API_KEY' environment variable.")
            print(f"Checked paths: {env_path} and {parent_env_path if 'parent_env_path' in locals() else 'N/A'}")

    def run(self, context: dict) -> dict:
        # Expects context with session_summary from NarratorAgent
        market_opinions = context.get("market_opinions", [])
        asset = context.get("asset", "")
        price_change_pct = context.get("price_change_pct", "")
        persona_style = context.get("persona_style", "Meme Style")

        merged_summary = " ".join(market_opinions)
        prompt_x = f"Format this as a viral, emoji-heavy tweet about {asset} moving {price_change_pct}%: {merged_summary}"
        prompt_linkedin = f"Format this as a professional LinkedIn post about {asset} moving {price_change_pct}%: {merged_summary}"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        base_url = "https://api.mistral.ai/v1/chat/completions"
        model = "mistral-small-latest"

        def query_mistral(prompt):
            if not self.api_key:
                # Fallback message when API key is not configured
                if "tweet" in prompt.lower() or "emoji" in prompt.lower():
                    return f"🚀 {asset} just moved {price_change_pct}%! Market analysis shows interesting signals. #Trading #Markets"
                else:
                    return f"Market Analysis Update: {asset} moved {price_change_pct}%. Our 5-agent LLM council has completed analysis."
            
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 200
            }
            
            # Try with retry logic for rate limits
            max_retries = 2
            for attempt in range(max_retries):
                try:
                    response = requests.post(base_url, headers=headers, data=json.dumps(payload), timeout=10)
                    response.raise_for_status()
                    result = response.json()
                    return result["choices"][0]["message"]["content"].strip()
                except requests.exceptions.HTTPError as e:
                    if response.status_code == 429:  # Rate limit
                        if attempt < max_retries - 1:
                            print(f"Rate limited, waiting 2s before retry {attempt + 1}/{max_retries}...")
                            time.sleep(2)
                            continue
                        else:
                            # Fallback message for rate limit
                            print(f"Mistral API rate limited after retries")
                            if "tweet" in prompt.lower() or "emoji" in prompt.lower():
                                return f"🚀 {asset} just moved {price_change_pct}%! Market signals detected. Analysis complete. #Trading"
                            else:
                                return f"Professional Market Analysis: {asset} moved {price_change_pct}%. Our multi-agent system has completed comprehensive analysis. Key insights available in the full report."
                    print(f"Mistral API error: {e}")
                    return f"[Error: {str(e)}]"
                except Exception as e:
                    print(f"Mistral API error: {e}")
                    if attempt < max_retries - 1:
                        time.sleep(1)
                        continue
                    return f"[Error: {str(e)}]"

        x_post = query_mistral(prompt_x)
        linkedin_post = query_mistral(prompt_linkedin)

        context["persona_post"] = {
            "x": x_post,
            "linkedin": linkedin_post
        }
        print("X post:", x_post)
        print("LinkedIn post:", linkedin_post)
        return context
