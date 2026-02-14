"""
Trading Narrator Agent
=======================

A standalone module for generating AI-powered trading session summaries with
risk assessment and market readiness recommendations.

Author: AI Trading Psychology Team
License: MIT
Version: 2.0.0 - ENHANCED

NEW IN v2.0:
------------
- Enhanced summaries with trend analysis
- Coaching advice integration
- Historical context in narratives
- Improved LLM prompts for better feedback

FEATURES:
---------
- AI-generated session narratives using Groq LLM (llama-3.1-8b-instant)
- Automated risk scoring (0-100 scale)
- Market readiness assessment (4 levels)
- Contextual feedback based on behavioral patterns
- Integration with Market Watcher data

RISK ASSESSMENT SYSTEM:
-----------------------
Risk Score: 0-100 (calculated from pattern severities)
- High Severity: +25 points
- Medium Severity: +15 points
- Positive Pattern: -20 points

Market Readiness Recommendations:
1. STOP TRADING (Risk 60+): Critical patterns detected
2. TRADE WITH CAUTION (Risk 40-59): Concerning patterns
3. CONTINUE TRADING (Risk <40 + Calculated Risk): Good behavior
4. PROCEED CAREFULLY (Risk <40): No major red flags

USAGE EXAMPLE:
--------------
```python
from narrator_agent import NarratorAgent

# Initialize (requires Groq API key in environment)
narrator = NarratorAgent(persona_name="Trading Performance Coach")

# Prepare inputs
behavioral_insights = [
    {
        "type": "Overtrading",
        "severity": "Medium",
        "details": "High trade count (13) for a single session."
    }
]

market_context = \"\"\"
Symbol: BTCUSD
Sentiment: NEGATIVE
Volatility: HIGH
Trend: DOWNTREND
\"\"\"

trade_summary = {
    "total_trades": 13,
    "net_pnl": -50,
    "win_rate": 38.5,
    "wins": 5,
    "losses": 8
}

# Generate summary
summary = narrator.generate_session_summary(
    behavioral_insights,
    market_context,
    trade_summary
)

print(summary)
```

INTEGRATION NOTES:
------------------
1. Requires Groq API key: Set environment variable `groq_api`
2. Or use .env file with: groq_api=your_key_here
3. LLM Model: llama-3.1-8b-instant (can be changed)
4. Behavioral insights: Use output from BehaviorMonitorAgent
5. Market context: String description of market conditions
6. Trade summary: Dictionary with session statistics

DEPENDENCIES:
-------------
- groq (pip install groq)
- python-dotenv (pip install python-dotenv)

API REFERENCE:
--------------
See class documentation below for detailed method signatures.
"""

import os
from typing import List, Dict, Tuple
from dotenv import load_dotenv

# Make groq import optional
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False
    print("WARNING: groq module not installed. NarratorAgent AI features will be disabled.")
    print("To enable: pip install groq")



class NarratorAgent:
    """
    Generates AI-powered trading session summaries with risk assessment.
    
    Attributes:
        persona_name (str): Name of the coaching persona
        api_key (str): Groq API key
        client (Groq): Groq client instance
    """
    
    def __init__(self, persona_name: str = "The Trading Coach"):
        """
        Initialize the Narrator Agent.
        
        Args:
            persona_name: Name/role of the AI coaching persona
        
        Note:
            Requires Groq API key in environment variable 'groq_api'
            or in .env file in the same directory.
        """
        self.persona_name = persona_name
        
        # Load environment variables
        env_path = os.path.join(os.path.dirname(__file__), '.env')
        load_dotenv(dotenv_path=env_path)
        
        self.api_key = os.getenv("groq_api")
        self.client = None
        
        if not GROQ_AVAILABLE:
            print("WARNING: Groq module not available. AI summary generation disabled.")
        elif self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                print(f"Narrator Init Error: {e}")
        else:
            print("WARNING: Groq API key not found. Set 'groq_api' environment variable.")


    def run(self, context: dict) -> dict:
        """
        Pipeline integration method.
        Expects context with market_opinions and behavior analysis from previous agents.
        Outputs session summary for PersonaAgent.
        """
        # TODO: Implement logic using context["market_opinions"] and behavior analysis
        context["session_summary"] = "Session summary goes here."
        return context

    def calculate_risk_score(self, behavioral_insights: List[Dict]) -> int:
        """
        Calculate risk score from behavioral patterns.
        
        Args:
            behavioral_insights: List of pattern dictionaries from BehaviorMonitorAgent
        
        Returns:
            int: Risk score 0-100 (lower is better)
        
        Scoring:
            - High severity: +25 points
            - Medium severity: +15 points
            - Positive pattern: -20 points
            - Capped between 0-100
        
        Example:
            >>> narrator = NarratorAgent()
            >>> insights = [{"type": "FOMO Trading", "severity": "Medium", "details": "..."}]
            >>> risk = narrator.calculate_risk_score(insights)
            >>> print(f"Risk: {risk}/100")
        """
        risk_score = 0
        severity_weights = {
            "High": 25,
            "Medium": 15,
            "Positive": -20
        }
        
        for insight in behavioral_insights:
            severity = insight.get('severity', 'Medium')
            risk_score += severity_weights.get(severity, 10)
        
        return max(0, min(100, risk_score))
    
    def assess_market_readiness(
        self, 
        risk_score: int, 
        behavioral_insights: List[Dict]
    ) -> Dict[str, any]:
        """
        Assess whether trader should enter the market.
        
        Args:
            risk_score: Calculated risk score (0-100)
            behavioral_insights: List of detected patterns
        
        Returns:
            Dict containing:
                - ready (bool): Whether trader is market-ready
                - recommendation (str): One of 4 levels
                - reason (str): Explanation for the recommendation
        
        Recommendation Levels:
            1. "STOP TRADING" - High risk, critical patterns
            2. "TRADE WITH CAUTION" - Moderate risk
            3. "CONTINUE TRADING" - Low risk, positive patterns
            4. "PROCEED CAREFULLY" - Low risk, no red flags
        
        Example:
            >>> readiness = narrator.assess_market_readiness(70, insights)
            >>> if not readiness['ready']:
            ...     print(f"⚠️ {readiness['recommendation']}: {readiness['reason']}")
        """
        pattern_types = [ins['type'] for ins in behavioral_insights]
        
        # Critical patterns requiring immediate stop
        critical_patterns = ["Revenge Trading", "Ego Trading", "Averaging Down"]
        has_critical = any(p in pattern_types for p in critical_patterns)
        
        if risk_score >= 60 or has_critical:
            return {
                "ready": False,
                "recommendation": "STOP TRADING",
                "reason": "High-risk emotional patterns detected. Take a break, review your plan, and return when calm."
            }
        elif risk_score >= 40:
            return {
                "ready": True,
                "recommendation": "TRADE WITH CAUTION",
                "reason": "Some concerning patterns detected. Reduce position sizes and stick strictly to your trading plan."
            }
        elif "Calculated Risk" in pattern_types:
            return {
                "ready": True,
                "recommendation": "CONTINUE TRADING",
                "reason": "Disciplined behavior with good risk management. Maintain your current approach."
            }
        else:
            return {
                "ready": True,
                "recommendation": "PROCEED CAREFULLY",
                "reason": "No major red flags, but stay vigilant and follow your trading rules."
            }

    def generate_session_summary(
        self,
        behavioral_insights: List[Dict],
        market_context: str,
        trade_summary: Dict
    ) -> str:
        """
        Generate AI narrative summary of trading session.
        
        Args:
            behavioral_insights: Patterns from BehaviorMonitorAgent
            market_context: Market conditions description
            trade_summary: Dictionary with:
                - total_trades (int)
                - net_pnl (float)
                - win_rate (float)
                - wins (int)
                - losses (int)
        
        Returns:
            str: AI-generated session summary with risk assessment
        
        Example:
            >>> summary = narrator.generate_session_summary(
            ...     insights, market_context, trade_summary
            ... )
            >>> print(summary)
            
        Note:
            Requires valid Groq API key. Returns error message if unavailable.
        """
        if not self.client:
            return "❌ Narrator Error: Groq API Key missing. Cannot generate summary."
        
        # Calculate risk metrics
        risk_score = self.calculate_risk_score(behavioral_insights)
        readiness = self.assess_market_readiness(risk_score, behavioral_insights)

        # System prompt for LLM
        system_prompt = f"""You are {self.persona_name}.
Your role is to analyze a trader's session and provide actionable, emotionally-aware feedback.
You are talking directly to the trader.

FOCUS AREAS:
- Emotional patterns: FOMO, Ego Trading, Revenge Trading, Impulsive Decisions
- Risk management: Calculated vs Reckless risk-taking
- Discipline: Adherence to trading plan vs emotional reactions

TONE:
- If negative patterns detected: Be firm but constructive
- If positive patterns detected: Reinforce and encourage
- Always connect behavior to market context
- Provide specific, actionable advice for next session
"""

        # Format insights
        insights_text = "\\n".join([
            f"- {ins['type']} ({ins.get('severity', 'N/A')}): {ins['details']}" 
            for ins in behavioral_insights
        ])

        # User prompt with all context
        user_prompt = f"""
SESSION DATA:
- Total Trades: {trade_summary['total_trades']}
- Net PnL: ${trade_summary['net_pnl']}
- Win Rate: {trade_summary['win_rate']}%
- Wins: {trade_summary['wins']} | Losses: {trade_summary['losses']}

BEHAVIORAL INSIGHTS (Detected by Monitor):
{insights_text}

RISK ASSESSMENT:
- Risk Score: {risk_score}/100 (Higher = More Risky)
- Market Readiness: {readiness['recommendation']}
- Assessment: {readiness['reason']}

MARKET CONTEXT (from Market Watcher):
{market_context}

TASK:
Write a session summary (200-250 words) that:
1. Acknowledges the market conditions
2. Analyzes the trader's EMOTIONAL state and decision-making patterns
3. Comments on specific behavioral insights (Revenge Trading, FOMO, Ego, Impulsive, Calculated Risk)
4. EXPLICITLY states the Risk Score and Market Readiness assessment
5. Provides 2-3 specific action items for the next session

Be direct and honest. If the trader made emotional mistakes, call them out clearly.
If the risk score is high (>60), STRONGLY recommend taking a break from trading.
"""

        try:
            # Call Groq LLM
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model="llama-3.1-8b-instant",
                temperature=0.7,
            )
            summary = completion.choices[0].message.content
            
            # Append risk assessment banner
            risk_banner = f"\\n\\n{'='*60}\\n🎯 RISK ASSESSMENT\\n{'='*60}\\n"
            risk_banner += f"Risk Score: {risk_score}/100\\n"
            risk_banner += f"Market Readiness: {readiness['recommendation']}\\n"
            risk_banner += f"Recommendation: {readiness['reason']}\\n"
            risk_banner += "="*60
            
            return summary + risk_banner
        except Exception as e:
            return f"❌ Error generating narrative: {e}"
    
    def generate_summary_with_trends(
        self,
        behavioral_insights: List[Dict],
        market_context: str,
        trade_summary: Dict,
        trend_summary: str = None,
        historical_risk_score: int = None
    ) -> str:
        """
        Generate enhanced session summary with trend analysis.
        
        NEW in v2.0: Includes historical context and behavioral trends.
        
        Args:
            behavioral_insights: Patterns from BehaviorMonitorAgent
            market_context: Market conditions description
            trade_summary: Session statistics
            trend_summary: Optional trend analysis text
            historical_risk_score: Optional risk score from past sessions
        
        Returns:
            Enhanced narrative with trends and historical comparison
        
        Example:
            >>> summary = narrator.generate_summary_with_trends(
            ...     insights, market_context, trade_summary,
            ...     trend_summary="✅ Improving: Revenge Trading decreased by 30%",
            ...     historical_risk_score=65
            ... )
        """
        if not self.client:
            return "❌ Narrator Error: Groq API Key missing. Cannot generate summary."
        
        # Calculate current risk
        risk_score = self.calculate_risk_score(behavioral_insights)
        readiness = self.assess_market_readiness(risk_score, behavioral_insights)
        
        # Build enhanced context
        enhanced_context = ""
        
        if historical_risk_score is not None:
            risk_delta = risk_score - historical_risk_score
            if risk_delta > 10:
                enhanced_context += f"\n⚠️ RISK INCREASED: Current risk ({risk_score}) is {risk_delta} points higher than your historical average ({historical_risk_score})."
            elif risk_delta < -10:
                enhanced_context += f"\n✅ RISK DECREASED: Current risk ({risk_score}) is {abs(risk_delta)} points lower than your historical average ({historical_risk_score})."
            else:
                enhanced_context += f"\n➡️ RISK STABLE: Current risk ({risk_score}) is similar to your historical average ({historical_risk_score})."
        
        if trend_summary:
            enhanced_context += f"\n\nTREND ANALYSIS:\n{trend_summary}"
        
        # Enhanced system prompt
        system_prompt = f"""You are {self.persona_name}.
Your role is to analyze a trader's session with HISTORICAL CONTEXT and provide actionable feedback.

FOCUS AREAS:
- Compare current session to historical patterns
- Identify improving vs. worsening trends
- Emotional patterns: FOMO, Ego Trading, Revenge Trading, Impulsive Decisions
- Risk management: Calculated vs Reckless risk-taking
- Disciplined adherence to trading plan

TONE:
- If patterns are improving: Reinforce and encourage momentum
- If patterns are worsening: Be firm but constructive about regression
- Always acknowledge progress or setbacks
- Provide specific action items for next session based on trends
"""

        # Format insights with historical markers
        insights_text = "\\n".join([
            f"- {ins['type']} ({ins.get('severity', 'N/A')}): {ins['details']}" +
            (f" [{ins.get('historical_context', '')}]" if 'historical_context' in ins else "") +
            (f" [Trend: {ins.get('trend', '')}]" if 'trend' in ins else "")
            for ins in behavioral_insights
        ])

        # Enhanced user prompt
        user_prompt = f"""
SESSION DATA:
- Total Trades: {trade_summary['total_trades']}
- Net PnL: ${trade_summary['net_pnl']}
- Win Rate: {trade_summary['win_rate']}%
- Wins: {trade_summary['wins']} | Losses: {trade_summary['losses']}

BEHAVIORAL INSIGHTS:
{insights_text}

RISK ASSESSMENT:
- Current Risk Score: {risk_score}/100
- Market Readiness: {readiness['recommendation']}
- Assessment: {readiness['reason']}
{enhanced_context}

MARKET CONTEXT:
{market_context}

TASK:
Write a session summary (250-300 words) that:
1. Acknowledges market conditions
2. Analyzes emotional state and decision-making
3. COMPARES current session to historical patterns (if trend data provided)
4. Highlights what's improving or worsening
5. States Risk Score and Market Readiness clearly
6. Provides 3 specific action items for next session based on trends

If risk increased from historical average, emphasize what changed.
If patterns are improving, reinforce positive momentum.
"""

        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model="llama-3.1-8b-instant",
                temperature=0.7,
            )
            summary = completion.choices[0].message.content
            
            # Enhanced risk banner
            risk_banner = f"\n\n{'='*60}\n🎯 ENHANCED RISK ASSESSMENT\n{'='*60}\n"
            risk_banner += f"Current Risk Score: {risk_score}/100\n"
            if historical_risk_score is not None:
                risk_banner += f"Historical Average: {historical_risk_score}/100\n"
            risk_banner += f"Market Readiness: {readiness['recommendation']}\n"
            risk_banner += f"Recommendation: {readiness['reason']}\n"
            risk_banner += "="*60
            
            return summary + risk_banner
        except Exception as e:
            return f"❌ Error generating enhanced narrative: {e}"


# ==================== STANDALONE USAGE EXAMPLE ====================

if __name__ == "__main__":
    from behaviour_agent import BehaviorMonitorAgent
    
    print("="*60)
    print("NARRATOR AGENT - STANDALONE DEMO")
    print("="*60)
    
    # Sample data
    sample_trades = [
        {"timestamp": "2026-02-07 09:00:00", "symbol": "BTCUSD", "action": "BUY", "price": 45000, "pnl": -100, "status": "CLOSED"},
        {"timestamp": "2026-02-07 09:05:00", "symbol": "BTCUSD", "action": "BUY", "price": 44900, "pnl": -50, "status": "CLOSED"},
        {"timestamp": "2026-02-07 09:08:00", "symbol": "BTCUSD", "action": "BUY", "price": 44850, "pnl": -75, "status": "CLOSED"},
        {"timestamp": "2026-02-07 10:00:00", "symbol": "EURUSD", "action": "BUY", "price": 1.0850, "pnl": 150, "status": "CLOSED"},
    ]
    
    # Step 1: Get behavioral insights
    monitor = BehaviorMonitorAgent()
    insights = monitor.analyze_session(sample_trades)
    
    print("\\n📊 Detected Patterns:")
    for insight in insights:
        print(f"  • {insight['type']} ({insight.get('severity', 'N/A')})")
    
    # Step 2: Prepare market context
    market_context = """
Symbol: BTCUSD
Sentiment: NEGATIVE
Volatility: HIGH
Trend: DOWNTREND
Price: -1.78%
Risk Factors: Heavy selling pressure, potential breakdown below support
"""
    
    # Step 3: Calculate summary statistics
    wins = sum(1 for t in sample_trades if t['pnl'] > 0)
    losses = sum(1 for t in sample_trades if t['pnl'] < 0)
    net_pnl = sum(t['pnl'] for t in sample_trades)
    win_rate = (wins / len(sample_trades)) * 100
    
    trade_summary = {
        "total_trades": len(sample_trades),
        "net_pnl": net_pnl,
        "win_rate": win_rate,
        "wins": wins,
        "losses": losses
    }
    
    # Step 4: Generate narrative
    narrator = NarratorAgent(persona_name="Trading Psychology Coach")
    summary = narrator.generate_session_summary(insights, market_context, trade_summary)
    
    print("\\n" + "="*60)
    print("📝 SESSION SUMMARY")
    print("="*60)
    print(summary)
    print("\\n" + "="*60)
