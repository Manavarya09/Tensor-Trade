import json
import os
from typing import Dict, List, Optional
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class SelfImprovementService:
    def __init__(self, data_file: str = "data/learning_history.json"):
        self.data_file = data_file
        self.history = self._load_history()

    def _load_history(self) -> List[Dict]:
        if not os.path.exists(self.data_file):
            return []
        try:
            with open(self.data_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load learning history: {e}")
            return []

    def _save_history(self):
        try:
            with open(self.data_file, 'w') as f:
                json.dump(self.history, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save learning history: {e}")

    def record_run(self, asset: str, agent_outputs: Dict[str, str], moderator_verdict: Dict, prompt_used: Dict[str, str] = None):
        """
        Record a run's details for learning.

        Args:
            asset: The asset symbol analyzed.
            agent_outputs: Dictionary of agent names to their generated content.
            moderator_verdict: Dictionary with 'verdict' (POST/WARN/BLOCK) and 'reason'.
            prompt_used: Optional dictionary of agent names to prompts used.
        """
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "asset": asset,
            "agent_outputs": agent_outputs,
            "moderator_verdict": moderator_verdict,
            "prompt_used": prompt_used or {}
        }
        self.history.append(entry)
        self._save_history()
        logger.info(f"Recorded run for {asset} with verdict {moderator_verdict.get('verdict', 'UNKNOWN')}")

    def analyze_performance(self) -> Dict:
        """
        Analyze history to calculate metrics.
        Returns:
            Dict with 'post_rate', 'warn_rate', 'block_rate', 'total_runs'.
        """
        if not self.history:
            return {
                "post_rate": 0.0,
                "warn_rate": 0.0,
                "block_rate": 0.0,
                "total_runs": 0
            }

        total = len(self.history)
        verdicts = [h.get("moderator_verdict", {}).get("verdict", "UNKNOWN") for h in self.history]

        post_count = verdicts.count("POST")
        warn_count = verdicts.count("WARN")
        block_count = verdicts.count("BLOCK")

        return {
            "post_rate": (post_count / total) * 100,
            "warn_rate": (warn_count / total) * 100,
            "block_rate": (block_count / total) * 100,
            "total_runs": total
        }

    def get_optimized_prompt(self, agent_name: str) -> str:
        """
        Get prompt optimizations based on history.
        If an agent frequently triggers warnings, append cautionary instructions.
        """
        if not self.history:
            return ""

        # Analyze last 5 runs for this agent
        recent_runs = self.history[-5:]
        warn_count = 0
        block_count = 0

        for run in recent_runs:
            verdict = run.get("moderator_verdict", {}).get("verdict", "UNKNOWN")
            if verdict == "WARN":
                warn_count += 1
            elif verdict == "BLOCK":
                block_count += 1

        optimization = ""

        if block_count > 0:
            optimization += " CRITICAL: Previous output was blocked. Ensure strict adherence to safety guidelines. Avoid sensationalism."
        elif warn_count > 1:
            optimization += " CAUTION: Recent outputs were flagged. Tone down emotional language and focus on data."

        # Specific agent tuning based on name (mock learning logic)
        if agent_name == "🦅 Macro Hawk" and warn_count > 0:
             optimization += " Focus on interest rate data, avoid political speculation."
        if agent_name == "🤔 Skeptic" and warn_count > 0:
             optimization += " Provide constructive criticism, avoid overly negative doom-mongering."

        return optimization
