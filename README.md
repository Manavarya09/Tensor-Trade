# Multi-Agent Trading Psychology API

**AI-Powered Trading Analysis System using Multi-LLM Debate Council & Behavioral Psychology**

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-green.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-teal.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

</div>

---

## 📖 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [System Architecture](#-system-architecture)
- [AI Models & Agents](#-ai-models--agents)
- [Quick Start](#-quick-start)
- [Features](#-features)
- [API Documentation](#-api-documentation)
- [Technical Stack](#-technical-stack)
- [Installation](#-installation)
- [Use Cases](#-use-cases)
- [Product Requirements Document](#-product-requirements-document-prd)
- [Roadmap](#-roadmap)

---

## 🎯 Problem Statement

### The Trading Psychology Challenge

**85% of retail traders lose money** - not due to lack of market knowledge, but due to **psychological biases** and **emotional decision-making**:

#### Core Problems:
1. **Revenge Trading** - Traders double down after losses, trying to "get even"
2. **FOMO (Fear of Missing Out)** - Chasing trades without proper analysis
3. **Overtrading** - Excessive trading driven by boredom or addiction
4. **Confirmation Bias** - Only seeking information that confirms existing beliefs
5. **Loss Aversion** - Holding losing positions too long, cutting winners too early
6. **Lack of Multi-Perspective Analysis** - Traders typically analyze markets from one angle (technical OR fundamental)

#### Information Overload Problem:
- Traders are bombarded with contradictory opinions from social media, news, analysts
- **No single source provides balanced, multi-perspective analysis**
- Economic events (earnings, Fed meetings, etc.) are scattered across platforms
- Behavioral patterns go unnoticed until significant damage is done

#### Existing Solutions are Inadequate:
- Basic trading journals track trades but **don't analyze psychology**
- Traditional analytics tools focus on P&L, not on **why traders make bad decisions**
- Financial advisors are expensive and not available 24/7
- AI chatbots provide generic advice without **real-time market context**

---

## 💡 Solution Overview

**Multi-Agent Trading Psychology API** is an **AI-powered analysis system** that:

### What We Do:
✅ **Analyzes trader behavior** using 10 psychological pattern detectors  
✅ **Provides multi-perspective market analysis** via 5 specialized LLM agents debating in real-time  
✅ **Validates asset symbols** to prevent analysis on invalid tickers  
✅ **Aggregates economic calendar data** (earnings, Fed meetings, economic indicators)  
✅ **Generates personalized narratives** tailored to trader psychology & market readiness  
✅ **Auto-selects communication personas** (Coach, Professional, Casual, Analytical)  

### How It Works:
1. **Trader submits asset symbol** (e.g., AAPL, BTC-USD)
2. **System validates & fetches market data** (price, volume, economic calendar)
3. **5 AI agents debate** the market move from different perspectives
4. **Behavioral analyzer** scans trade history for psychological patterns
5. **Narrator synthesizes insights** into actionable, personalized feedback
6. **Moderator ensures** content safety and appropriate tone

### Key Innovation:
Instead of a single AI model (which has biases), we use **5 specialized agents** with different expertise areas (macro, fundamental, technical, flow, risk) that **debate each other** to provide balanced analysis - mimicking how professional trading desks operate.

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                          │
│                   POST /analyze-asset?asset=AAPL                │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         FASTAPI SERVER                          │
│                           (main.py)                             │
│  • CORS enabled                                                 │
│  • Request validation                                           │
│  • Async orchestration                                          │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
    ┌──────────────────┐  ┌──────────────┐  ┌─────────────────┐
    │ Asset Validator  │  │ Market Data  │  │ Trade History   │
    │ (yfinance API)   │  │ Service      │  │ Service         │
    │ • Symbol check   │  │ • Price data │  │ • P&L calc      │
    │ • 80+ symbols    │  │ • Volume     │  │ • Win rate      │
    └──────────────────┘  └──────────────┘  └─────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ECONOMIC CALENDAR SERVICE                    │
│  • Earnings dates (via yfinance)                               │
│  • News headlines                                               │
│  • Economic indicators                                          │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    5-AGENT LLM DEBATE COUNCIL                   │
│                    (llm_council/debate_engine.py)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐     │
│  │ 🦅 Macro Hawk │  │ 🔬 Micro      │  │ 💧 Flow       │     │
│  │ (OpenRouter)  │  │   Forensic    │  │   Detective   │     │
│  │ Mistral-7B    │  │ (OpenRouter)  │  │ (OpenRouter)  │     │
│  │               │  │ Mythomax-13B  │  │ Mistral-7B    │     │
│  └───────────────┘  └───────────────┘  └───────────────┘     │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐                         │
│  │ 📊 Tech       │  │ 🤔 Skeptic    │                         │
│  │   Interpreter │  │ (Mistral.ai)  │                         │
│  │ (OpenRouter)  │  │ Large-Latest  │                         │
│  │ Mythomax-13B  │  │               │                         │
│  └───────────────┘  └───────────────┘                         │
│                                                                 │
│  • Parallel execution (5 agents run simultaneously)            │
│  • Structured debate with confidence levels                    │
│  • Consensus/disagreement detection                            │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BEHAVIORAL ANALYSIS AGENT                    │
│                    (agents/behaviour_agent.py)                  │
│  • Detects 10 psychological patterns                           │
│  • Severity classification (High/Medium/Positive)              │
│  • Risk scoring (0-100)                                        │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PERSONA SELECTION AGENT                      │
│                    (agents/persona.py)                          │
│  • Auto-selects style: Coach | Professional | Casual            │
│  • Based on: win rate, P&L, pattern severity                   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         NARRATOR AGENT                          │
│                      (agents/narrator.py)                       │
│  • Groq LLM (Mixtral-8x7B)                                     │
│  • Synthesizes all insights                                     │
│  • Generates personalized narrative                             │
│  • Market readiness assessment                                  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MODERATOR AGENT                          │
│                     (agents/moderator.py)                       │
│  • Content safety checks                                        │
│  • Tone appropriateness                                         │
│  • Final validation                                             │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SHARIAH COMPLIANCE AGENT                      │
│                 (agents/shariah_compliance_agent.py)            │
│  • Islamic finance screening                                     │
│  • Haram industry detection                                      │
│  • Riba & Gharar assessment                                     │
│  • Compliance scoring (0-100)                                   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CALLING AGENT                            │
│                     (agents/calling_agent.py)                   │
│  • Trade execution calls                                        │
│  • Market prediction calls                                      │
│  • API integration for brokers                                  │
│  • Actionable trade signals                                     │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         JSON RESPONSE                           │
│  {                                                              │
│    "trade_history": {...},                                     │
│    "economic_calendar": {...},                                 │
│    "market_analysis": {5-agent debate},                        │
│    "behavioral_analysis": {patterns, risk score},              │
│    "narrative": {personalized summary},                        │
│    "shariah_compliance": {compliant, score, reason},           │
│    "calling_result": {action, details},                        │
│    "recommendations": [...]                                    │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. **API Layer** (`main.py`)
- **FastAPI** async web framework
- CORS middleware for frontend integration
- Request validation via Pydantic
- Error handling & logging

#### 2. **Validation Layer** (`services/asset_validator.py`)
- Validates asset symbols using yfinance API
- Supports 80+ symbols (stocks, ETFs, crypto, forex)
- Rejects invalid tickers instantly
- Case normalization

#### 3. **Market Data Layer** (`services/economic_calendar.py`, `services/market_metrics.py`)
- Real-time price data
- Volume analysis
- Economic calendar (earnings, Fed meetings, CPI, jobs)
- News aggregation

#### 4. **LLM Council** (`llm_council/`)
- **5 specialized agents** with different expertise
- **Parallel execution** for speed (all agents run simultaneously)
- **Structured debate** with thesis, supporting points, risks, confidence
- **Model diversity**: OpenRouter (4 agents) + Mistral.ai (1 agent)

#### 5. **Behavioral Engine** (`agents/behaviour_agent.py`)
- **Pattern matching** on trade history
- **Rule-based detection** (no ML required)
- **10 patterns**: Revenge trading, FOMO, Overtrading, Loss aversion, etc.
- **Risk scoring algorithm**: Weighted by severity

#### 6. **Persona System** (`agents/persona.py`)
- **Auto-selection** based on trader performance
- **4 personas**: Coach (struggling), Professional (winning), Casual (new), Analytical
- **Tone adaptation**: Supportive vs. congratulatory vs. data-driven

#### 7. **Narrative Generator** (`agents/narrator.py`)
- **Groq LLM (Mixtral-8x7B)** for fast inference
- Synthesizes all agent outputs into coherent summary
- **Market readiness recommendation** (Stop/Caution/Continue/Proceed)

#### 8. **Content Moderation** (`agents/moderator.py`)
- Safety checks on LLM outputs
- Prevents inappropriate content
- Ensures professional tone

---

## 🤖 AI Models & Agents

### LLM Provider Strategy

We use a **multi-provider approach** for reliability, cost-efficiency, and model diversity:

| Agent | Provider | Model | Cost | Purpose |
|-------|----------|-------|------|---------|
| 🦅 Macro Hawk | OpenRouter | Mistral-7B-Instruct | Free | Macroeconomic analysis |
| 🔬 Micro Forensic | OpenRouter | Mythomax-L2-13B | Free | Fundamental analysis |
| 💧 Flow Detective | OpenRouter | Mistral-7B-Instruct | Free | Market microstructure |
| 📊 Tech Interpreter | OpenRouter | Mythomax-L2-13B | Free | Technical analysis |
| 🤔 Skeptic | Mistral.ai | Mistral-Large-Latest | Paid | Risk assessment |
| 📖 Narrator | Groq | Mixtral-8x7B-Instruct | Free | Synthesis |

**Total Cost per Request:** ~$0.02 (only Skeptic agent is paid)

### The 5-Agent Debate Council

#### 🦅 **Macro Hawk** - Macroeconomic Strategist
**Expertise:** Fed policy, interest rates, inflation, sector rotation, currency markets

**Analysis Focus:**
- Interest rate expectations (Fed funds futures)
- Treasury yield movements (10Y, 2Y)
- Economic indicators (CPI, jobs, PMI, GDP)
- Dollar strength/weakness impact
- Sector rotation trends
- Global macro events

**Example Output:**
```
PRIMARY DRIVER: Fed rate cut expectations surged to 65% (up from 45%)
after softer CPI print (2.4% vs. 2.6% expected).

SUPPORTING CATALYSTS:
1. Treasury 10Y yield fell 12bps to 3.45%, benefiting growth stocks
2. Dollar weakened 1.2% vs. basket, bullish for multinational exporters
3. PMI manufacturing beat (52.3 vs. 51.5), indicating economic resilience

MACRO RISKS: Fed could still hold rates if employment remains strong
CONVICTION: High (8/10)
```

#### 🔬 **Micro Forensic** - Fundamental Analyst
**Expertise:** Financial statements, earnings, SEC filings, valuation, competitive analysis

**Analysis Focus:**
- Revenue growth & quality
- Earnings per share (EPS) trends
- Cash flow analysis (FCF, OCF)
- Balance sheet health (debt, liquidity)
- Management guidance
- Competitive positioning
- Sector-specific metrics

**Example Output:**
```
EARNINGS QUALITY ANALYSIS:
- Revenue: $45.2B (+8.2% YoY) vs. consensus $44.8B → BEAT
- EPS: $4.20 (+15% YoY) vs. $4.10 expected → BEAT
- Operating Cash Flow: $16.8B (up 22% YoY) → High quality
- Free Cash Flow: $11.3B (FCF margin = 25%, best in 5 years)
- Guidance: FY25 EPS $16.50-$17.00 (consensus: $16.80) → RAISED

VALUATION: P/E 28x vs. sector avg 24x → Premium justified by growth
CONVICTION: Moderate (6/10) - priced in, but solid fundamentals
```

#### 💧 **Flow Detective** - Market Microstructure Expert
**Expertise:** Order flow, options positioning, institutional flows, dark pools

**Analysis Focus:**
- Dark pool activity
- Options market (Call/Put ratios, IV, open interest)
- Institutional vs. retail flows
- Block trades & smart money indicators
- VWAP positioning
- Volume profile analysis

**Example Output:**
```
SMART MONEY SIGNALS:
- Dark pool buy volume: 2.3M shares (45% of total) vs. avg 1.8M
- Options: Call volume +125%, Put/Call ratio 0.65 (bullish)
- Block trades: 47 blocks today vs. avg 28 → Institutional accumulation
- VWAP: Price trading above VWAP all day → Sustained buying

INTERPRETATION: This move is backed by REAL institutional money,
not retail noise. Smart money is accumulating.

CONVICTION: High (9/10) - Strong flow confirmation
```

#### 📊 **Tech Interpreter** - Technical Analyst
**Expertise:** Chart patterns, support/resistance, indicators, price action

**Analysis Focus:**
- Support/resistance levels
- Moving averages (20, 50, 200-day)
- Chart patterns (breakouts, reversals)
- RSI, MACD, volume indicators
- Fibonacci levels
- Trend analysis

**Example Output:**
```
TECHNICAL SETUP:
- Price broke above $175 resistance (held since August)
- Now trading above 50-day MA ($172) and 200-day MA ($165)
- RSI: 68 (strong momentum, not yet overbought)
- MACD: Bullish crossover 3 days ago
- Volume: 1.5x average → Conviction behind move

PRICE TARGETS:
- Next resistance: $185 (gap fill from July)
- Support if pullback: $172 (50-day MA)

CONVICTION: Moderate (7/10) - Breakout confirmed but watch overbought
```

#### 🤔 **Skeptic** - Risk Manager
**Expertise:** Risk assessment, contrarian analysis, bearish scenarios

**Analysis Focus:**
- What could go wrong?
- Overvaluation risks
- Sentiment extremes (contrarian signals)
- Historical analogs
- Black swan scenarios
- Risk/reward ratio

**Example Output:**
```
DEVIL'S ADVOCATE VIEW:
1. VALUATION CONCERN: P/E 28x vs. 5-year avg of 22x
2. SENTIMENT WARNING: Bullish sentiment at 75% (near contrarian sell signal)
3. MACRO RISK: Fed could pause rate cuts if inflation re-accelerates
4. TECHNICAL: RSI approaching 70 (overbought territory)

WHAT COULD TRIGGER REVERSAL:
- Disappointing guidance on earnings call
- Competitor takes market share
- Macro shock (geopolitical event)

RISK/REWARD: 2:1 (potential upside $190, downside $165)
CONVICTION: Low bearish (4/10) - Concerns valid but trend is strong
```

### How the Debate Works

1. **Parallel Execution**: All 5 agents receive the same market data simultaneously
2. **Independent Analysis**: Each agent analyzes from their unique perspective (no groupthink)
3. **Structured Output**: Each agent provides:
   - **Thesis** (main argument)
   - **Supporting Points** (3-4 evidence-backed catalysts)
   - **Risks** (what could invalidate the thesis)
   - **Confidence Level** (High/Moderate/Low)
4. **Consensus Detection**: System identifies areas of agreement/disagreement
5. **Synthesis**: Narrator combines insights into actionable summary

---

## 🚀 Quick Start

### Prerequisites
```bash
# Python 3.10+
python --version

# pip installed
pip --version
```

### Installation
```bash
# Clone repository
git clone <repo-url>
cd deriv

# Create virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### Configuration
Create `.env` file in project root:
```env
# OpenRouter (Free tier - 4 agents)
OPENROUTER_API_KEY=your_key_here

# Mistral.ai (Paid - 1 agent)
MISTRAL_API_KEY=your_key_here

# Groq (Free tier - narrator)
GROQ_API_KEY=your_key_here

# Optional
DATABASE_URL=postgresql://user:pass@localhost/db
REDIS_URL=redis://localhost:6379
```

### Start Server
```bash
# Development (auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Test API
```bash
# Health check
curl http://localhost:8000/health

# Analyze asset
curl -X POST "http://localhost:8000/analyze-asset?asset=AAPL&user_id=trader123"
```

### Python Example
```python
import requests

response = requests.post(
    "http://localhost:8000/analyze-asset",
    params={"asset": "TSLA", "user_id": "trader123"}
)

data = response.json()
print(f"P&L: ${data['trade_history']['total_pnl']:.2f}")
print(f"Win Rate: {data['trade_history']['win_rate']}%")
print(f"Risk Score: {data['behavioral_analysis']['risk_score']}/100")
```

---

## 📋 Features

### ✅ Asset Symbol Validation
- **Validates genuine assets** - Rejects invalid/random symbols
- **Comprehensive coverage** - 80+ tested symbols (stocks, ETFs, crypto, international)
- **Instant feedback** - Clear error messages for users
- **Smart caching** - Fast validation for repeated symbols
- **Case normalization** - Accepts lowercase input
- **Multiple asset types** - Stocks, ETFs, crypto (BTC-USD), forex, international
- **Free & open-source** - Uses yfinance API (no registration needed)
- See [ASSET_VALIDATION.md](ASSET_VALIDATION.md) and [ASSET_COVERAGE.md](ASSET_COVERAGE.md)

### 🤖 5-Agent LLM Council
- **Diverse perspectives** from macro, fundamental, flow, technical, and skeptic experts
- **Parallel execution** for 100-120 second response time
- **Structured debate format** with confidence levels
- **Consensus & disagreement detection**
- **Evidence-backed analysis** with citations

### 🧠 Behavioral Pattern Detection
Detects 10 trading psychology patterns:
- **High Severity:** Revenge trading, Ego trading, Loss aversion, Averaging down
- **Medium Severity:** Overtrading, FOMO, Impulsive decisions, Quick profit taking, Hesitation
- **Positive:** Calculated risk (good win rate + controlled losses)

### 📈 Economic Calendar Integration
- Real-time earnings dates
- Economic indicators (Fed meetings, CPI, jobs reports)
- Market news headlines
- Sector-specific events

### 🎭 Intelligent Persona Selection
Auto-selects communication style based on trader performance:
- **Coach** - Supportive (struggling traders, win rate <40%)
- **Professional** - Peer-level (winning traders, win rate >60%)
- **Casual** - Friendly (new traders, <5 trades)
- **Analytical** - Data-focused (default)

### 📊 Market Readiness Assessment
- **Risk Score** (0-100) calculated from behavioral patterns
- **4 Readiness Levels:**
  - STOP TRADING (Risk 60+)
  - TRADE WITH CAUTION (Risk 40-59)
  - CONTINUE TRADING (Risk <40 + Calculated Risk)
  - PROCEED CAREFULLY (Risk <40)

### 🕌 Shariah Compliance Agent
- **Islamic Finance Screening** - Validates assets against Shariah principles
- **Haram Industry Detection** - Blocks alcohol, tobacco, gambling, weapons
- **Riba & Gharar Assessment** - Checks for interest and excessive uncertainty
- **Compliance Scoring** - 0-100 score with detailed reasoning
- **LLM-Powered Evaluation** - Uses AI for nuanced interpretations
- **Customizable Thresholds** - Adjustable for different madhabs/schools

### 📞 Calling Agent
- **Trade Execution Calls** - Simulates or executes buy/sell orders via APIs
- **Market Prediction Calls** - Generates BUY/SELL/HOLD signals
- **Broker API Integration** - Connects to trading platforms (Alpaca, etc.)
- **Actionable Signals** - Real-time trade recommendations
- **Safety Gates** - Only executes Shariah-compliant trades

---

## 🛠️ Technical Stack

### Core Framework
- **FastAPI** - Modern async web framework
- **Pydantic v2.8+** - Data validation
- **Uvicorn** - ASGI server
- **Python 3.10+** - Runtime

### LLM Providers
- **OpenRouter** - 4 agents (Mistral-7B, Mythomax-L2-13B)
- **Mistral.ai** - 1 agent (Mistral-Large-Latest)
- **Groq** - Narrator (Mixtral-8x7B-Instruct)

### Data Sources
- **yfinance** - Market data, earnings, economic calendar
- **aiohttp** - Async HTTP requests
- **BeautifulSoup4 + lxml** - Web scraping (if needed)

### Infrastructure (Optional)
- **PostgreSQL** - Trade history persistence
- **Redis** - Caching layer
- **Docker** - Containerization

---

## 📡 API Documentation

### Endpoint Overview

| Endpoint | Method | Purpose | Response Time |
|----------|--------|---------|---------------|
| `/analyze-asset` | POST | Full market + behavioral analysis | 100-120s |
| `/run-agents` | POST | Legacy endpoint with manual inputs | 100-120s |
| `/health` | GET | Service health check | <1s |
| `/` | GET | API information | <1s |

### POST /analyze-asset (Recommended)

**Simplified analysis endpoint with auto-generation of market context.**

#### Request:
```bash
POST /analyze-asset?asset=AAPL&user_id=trader123
```

#### Query Parameters:
- `asset` (required): Stock symbol (e.g., AAPL, MSFT, BTC-USD)
- `user_id` (optional): Trader identifier for personalization

#### Response Structure:
```json
{
  "trade_history": {
    "total_trades": 15,
    "total_pnl": -245.50,
    "win_rate": 40.0,
    "wins": 6,
    "losses": 9,
    "largest_win": 120.00,
    "largest_loss": -85.00,
    "avg_win": 65.50,
    "avg_loss": -45.30
  },
  "economic_calendar": {
    "symbol": "AAPL",
    "earnings_calendar": {
      "next_earnings_date": "2026-04-25",
      "last_reported": "2026-01-28"
    },
    "recent_news": [
      "Apple announces new AI features...",
      "iPhone sales beat expectations..."
    ],
    "economic_events": [
      "Fed Meeting - March 19, 2026",
      "CPI Report - March 12, 2026"
    ]
  },
  "market_analysis": {
    "council_opinions": [
      "🦅 Macro Hawk (High): Fed rate cut expectations surge...",
      "🔬 Micro Forensic (Moderate): Earnings beat expectations...",
      "💧 Flow Detective (High): Strong institutional buying...",
      "📊 Tech Interpreter (Moderate): Breakout above $175...",
      "🤔 Skeptic (Low): Valuation concerns remain..."
    ],
    "consensus_points": [
      "Strong earnings performance",
      "Favorable macro environment"
    ],
    "disagreements": [
      "Valuation (Forensic: Fair, Skeptic: Overvalued)"
    ]
  },
  "behavioral_analysis": {
    "flags": [
      {
        "pattern": "Overtrading",
        "severity": "Medium",
        "message": "High trade count (15) for session",
        "details": "Consider reducing frequency"
      },
      {
        "pattern": "Loss Aversion",
        "severity": "High",
        "message": "Holding losing positions too long",
        "details": "Average loss duration: 3.2 days vs. wins: 1.1 days"
      }
    ],
    "risk_score": 55,
    "patterns_detected": 2,
    "positive_patterns": 0
  },
  "narrative": {
    "styled_message": "Hey there - Let's talk about your AAPL session...",
    "persona": "Coach",
    "market_readiness": "TRADE WITH CAUTION",
    "key_recommendations": [
      "Set stricter stop-losses to prevent loss aversion",
      "Reduce trade frequency to avoid overtrading",
      "Wait for clearer setups given current risk profile"
    ]
  },
  "timestamp": "2026-02-07T14:30:00Z",
  "processing_time": 112.5
}
```

### POST /run-agents (Legacy)

**Full control over inputs for advanced users.**

#### Request:
```json
{
  "market_event": "AAPL moved up 2.5% on strong earnings",
  "user_trades": [
    {
      "timestamp": "2026-02-07 09:00:00",
      "symbol": "AAPL",
      "action": "BUY",
      "price": 175.50,
      "quantity": 10,
      "pnl": -50.00,
      "status": "CLOSED"
    }
  ],
  "persona_style": "professional"
}
```

### GET /health

**Health check endpoint.**

#### Response:
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "services": {
    "llm_council": "operational",
    "economic_calendar": "operational",
    "asset_validator": "operational"
  },
  "timestamp": "2026-02-07T14:30:00Z"
}
```

### Error Responses

#### Invalid Asset Symbol:
```json
{
  "error": "Invalid asset symbol",
  "message": "Symbol 'INVALIDXYZ' is not a valid asset. Validation failed: No data found.",
  "suggestions": ["Check spelling", "Try common symbols like AAPL, MSFT, TSLA"],
  "status_code": 400
}
```

#### Rate Limit Exceeded:
```json
{
  "error": "Rate limit exceeded",
  "message": "Maximum 10 requests per minute",
  "retry_after": 45,
  "status_code": 429
}
```

---

## 💼 Use Cases

### 1. **Post-Session Analysis**
**Scenario:** Trader finishes a day of trading and wants feedback

```python
import requests

# After trading session
response = requests.post(
    "http://localhost:8000/analyze-asset",
    params={"asset": "SPY", "user_id": "trader123"}
)

data = response.json()

# Display insights
print(f"📊 P&L: ${data['trade_history']['total_pnl']:.2f}")
print(f"🎯 Win Rate: {data['trade_history']['win_rate']}%")
print(f"⚠️ Risk Score: {data['behavioral_analysis']['risk_score']}/100")
print(f"\n{data['narrative']['styled_message']}")
```

**Output:**
```
📊 P&L: -$245.50
🎯 Win Rate: 40.0%
⚠️ Risk Score: 55/100

Hey there - Let's talk about your SPY session. I noticed you hit some
rough patches with a 40% win rate and -$245 P&L. The 5 LLM agents debated
the market move, and here's what they found...

[Full personalized narrative with recommendations]
```

### 2. **Pre-Trade Market Research**
**Scenario:** Trader researching an asset before entering position

```python
# Get multi-perspective analysis
response = requests.post(
    "http://localhost:8000/analyze-asset",
    params={"asset": "NVDA"}
)

data = response.json()

# Review agent perspectives
for opinion in data['market_analysis']['council_opinions']:
    print(opinion)

# Check economic events
print("\nUpcoming Events:")
for event in data['economic_calendar']['economic_events']:
    print(f"  - {event}")
```

### 3. **Trading Journal Integration**
**Scenario:** Automated journaling with psychological insights

```python
# Your trading journal system
class TradingJournal:
    def add_session_analysis(self, asset, analysis):
        # Store in database
        self.db.insert({
            "date": datetime.now(),
            "asset": asset,
            "pnl": analysis['trade_history']['total_pnl'],
            "risk_score": analysis['behavioral_analysis']['risk_score'],
            "patterns": [f['pattern'] for f in analysis['behavioral_analysis']['flags']],
            "market_readiness": analysis['narrative']['market_readiness'],
            "recommendations": analysis['narrative']['key_recommendations']
        })

# Get analysis
response = requests.post(f"{API_URL}/analyze-asset", params={"asset": "TSLA"})
data = response.json()

# Save to journal
journal = TradingJournal()
journal.add_session_analysis("TSLA", data)
```

### 4. **Risk Management Dashboard**
**Scenario:** Monitor trader risk levels across portfolio

```python
import asyncio
import aiohttp

async def analyze_portfolio(assets):
    """Analyze multiple assets concurrently"""
    async with aiohttp.ClientSession() as session:
        tasks = []
        for asset in assets:
            url = f"http://localhost:8000/analyze-asset?asset={asset}"
            tasks.append(session.post(url))
        
        responses = await asyncio.gather(*tasks)
        return [await r.json() for r in responses]

# Analyze portfolio
portfolio = ["AAPL", "MSFT", "GOOGL", "TSLA"]
results = asyncio.run(analyze_portfolio(portfolio))

# Aggregate risk
total_risk = sum(r['behavioral_analysis']['risk_score'] for r in results) / len(results)
print(f"Portfolio Risk Score: {total_risk:.1f}/100")

# Flag high-risk assets
for result in results:
    if result['behavioral_analysis']['risk_score'] > 60:
        print(f"⚠️ HIGH RISK: {result['economic_calendar']['symbol']}")
```

### 5. **Educational Chatbot Integration**
**Scenario:** Trading education platform with AI feedback

```python
# User asks: "Should I trade AAPL today?"

# Get analysis
response = requests.post(f"{API_URL}/analyze-asset", params={"asset": "AAPL"})
data = response.json()

# Extract key insights for chatbot
chatbot_response = f"""
Based on 5 AI analyst perspectives:

**Market Analysis:**
{data['market_analysis']['council_opinions'][0]}  # Macro view
{data['market_analysis']['council_opinions'][4]}  # Risk view

**Your Readiness:** {data['narrative']['market_readiness']}

**Recommendation:** {data['narrative']['key_recommendations'][0]}
"""

return chatbot_response
```

### 6. **Algorithmic Trading Integration**
**Scenario:** Use behavioral insights to pause/resume algo trading

```python
class AlgoTradingBot:
    def should_trade_today(self, asset):
        # Check behavioral risk
        response = requests.post(
            f"{API_URL}/analyze-asset",
            params={"asset": asset, "user_id": "algo_bot"}
        )
        data = response.json()
        
        risk_score = data['behavioral_analysis']['risk_score']
        readiness = data['narrative']['market_readiness']
        
        # Pause trading if risk too high
        if risk_score > 60 or readiness == "STOP TRADING":
            self.pause_trading()
            self.send_alert(f"Trading paused due to risk: {risk_score}/100")
            return False
        
        return True

# Before executing trades
bot = AlgoTradingBot()
if bot.should_trade_today("SPY"):
    bot.execute_strategy()
else:
    print("Trading paused - risk too high")
```

---

## 📂 Project Structure

```
deriv/
├── main.py                         # FastAPI server & orchestration
├── requirements.txt                # Python dependencies
├── .env                            # Environment variables (not committed)
├── README.md                       # This file
│
├── agents/                         # Behavioral & communication agents
│   ├── behaviour_agent.py          # 10 pattern detector
│   ├── narrator.py                 # Groq LLM synthesis
│   ├── persona.py                  # Auto-persona selection
│   ├── moderator.py                # Content safety
│   └── market_watcher.py           # Market analysis coordinator
│
├── llm_council/                    # 5-agent debate system
│   ├── core/
│   │   └── config.py               # LLM provider settings
│   ├── models/
│   │   └── schemas.py              # Pydantic data models
│   └── services/
│       ├── llm_client.py           # Multi-provider abstraction
│       ├── agent_prompts.py        # System prompts for 5 agents
│       └── debate_engine.py        # Parallel debate execution
│
├── services/                       # Supporting services
│   ├── asset_validator.py          # yfinance symbol validation
│   ├── economic_calendar.py        # Earnings & economic events
│   ├── market_metrics.py           # Price & volume data
│   └── trade_history.py            # P&L calculations
│
├── tests/                          # Test suite
│   ├── test_api.py
│   ├── test_asset_validator.py
│   ├── test_market_metrics.py
│   └── test_integrated_workflow.py
│
└── data/                           # Sample data (for testing)
    ├── demo_prices/
    └── demo_trades/
```

---

## 🧪 Testing

### Run Full Test Suite
```bash
# Test all components
python test_integrated_workflow.py

# Test asset validation
python test_asset_validator.py

# Test API endpoints
python test_api.py

# Test market metrics
python test_market_metrics.py
```

### Test Specific Features
```bash
# Test asset validation
python demo_comprehensive_validation.py

# Test behavioral analysis
python demo_validation.py
```

### Manual API Testing
```bash
# Basic request
curl -X POST "http://localhost:8000/analyze-asset?asset=AAPL"

# With user ID
curl -X POST "http://localhost:8000/analyze-asset?asset=TSLA&user_id=trader123"

# Health check
curl http://localhost:8000/health
```

---

## 🔒 Security Considerations

### Current Implementation (Development)
- ⚠️ No authentication required
- ⚠️ No rate limiting
- ✅ CORS enabled for all origins
- ✅ Content moderation via ModeratorAgent
- ✅ Input validation via Pydantic

### Production Recommendations

#### 1. **Add Authentication**
```python
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

@app.post("/analyze-asset")
async def analyze_asset(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    # Validate JWT token
    token = credentials.credentials
    user = verify_jwt_token(token)
    # ...
```

#### 2. **Implement Rate Limiting**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/analyze-asset")
@limiter.limit("10/minute")
async def analyze_asset():
    # ...
```

#### 3. **Restrict CORS**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific origins only
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)
```

#### 4. **Add API Key Authentication**
```python
@app.post("/analyze-asset")
async def analyze_asset(api_key: str = Header(...)):
    if api_key != os.getenv("API_KEY"):
        raise HTTPException(status_code=401, detail="Invalid API key")
    # ...
```

---

## 📊 Performance Optimization

### Current Performance
- **Average Response Time:** 100-120 seconds (due to LLM calls)
- **Bottleneck:** LLM inference (5 agents in parallel)
- **Throughput:** ~4-8 requests/minute per worker

### Optimization Strategies

#### 1. **Increase Workers**
```bash
# 4 workers for better throughput
uvicorn main:app --workers 4 --host 0.0.0.0 --port 8000
```

#### 2. **Add Redis Caching**
```python
import redis

cache = redis.Redis(host='localhost', port=6379, db=0)

# Cache economic calendar (1 hour TTL)
@lru_cache(maxsize=100)
def get_economic_data(symbol):
    cached = cache.get(f"economic:{symbol}")
    if cached:
        return json.loads(cached)
    
    data = fetch_economic_data(symbol)
    cache.setex(f"economic:{symbol}", 3600, json.dumps(data))
    return data
```

#### 3. **Use Faster Models**
```python
# Replace with faster models for non-critical agents
"🦅 Macro Hawk": LLMClient(
    provider_type="groq",
    model="mixtral-8x7b-32768"  # Groq is faster
)
```

#### 4. **Stream Responses**
```python
@app.post("/analyze-asset-stream")
async def analyze_asset_stream(asset: str):
    async def generate():
        yield json.dumps({"status": "validating"})
        # ... validation
        
        yield json.dumps({"status": "fetching market data"})
        # ... market data
        
        yield json.dumps({"status": "running LLM council"})
        # ... debate
        
        yield json.dumps({"status": "complete", "data": results})
    
    return StreamingResponse(generate(), media_type="application/json")
```

---

## 🛣️ Roadmap

### Phase 1: Core Enhancements (Q1 2026) ✅
- [x] Asset symbol validation
- [x] 5-agent LLM debate council
- [x] Behavioral pattern detection
- [x] Economic calendar integration
- [x] Auto-persona selection

### Phase 2: Data Persistence (Q2 2026)
- [ ] PostgreSQL integration
- [ ] Redis caching layer
- [ ] Historical trade analysis
- [ ] User profile persistence
- [ ] Trade pattern tracking over time

### Phase 3: Advanced Features (Q3 2026)
- [ ] WebSocket streaming responses
- [ ] Real-time trade monitoring
- [ ] Multi-timeframe analysis (1D, 1W, 1M)
- [ ] Portfolio-level analysis
- [ ] Custom pattern definitions

### Phase 4: Production Ready (Q4 2026)
- [ ] JWT authentication
- [ ] Rate limiting
- [ ] API key management
- [ ] Usage analytics
- [ ] Monitoring & alerting (Datadog, Sentry)

### Phase 5: ML Enhancements (2027)
- [ ] Predictive behavioral modeling
- [ ] Custom LLM fine-tuning
- [ ] Sentiment analysis from social media
- [ ] Market regime detection
- [ ] Automated strategy recommendations

---

## 📝 License

MIT License - See LICENSE file for details

---

## � Product Requirements Document (PRD)

### 1. Executive Summary
**TensorTrade** is an AI-powered multi-agent trading psychology platform that combines behavioral analysis, multi-perspective market insights, Shariah compliance, and automated trade execution. Designed for retail traders, it addresses psychological biases, information overload, and ethical trading needs, with a focus on Islamic finance for UAE markets.

**Target Audience:** Retail traders, Islamic finance practitioners, fintech enthusiasts, hackathon participants.

**Key Value Proposition:** "Ethical AI trading with psychological insights and Shariah compliance for smarter, halal investing."

### 2. Objectives
- **Primary:** Provide comprehensive trading analysis that mitigates psychological risks and ensures ethical compliance.
- **Secondary:** Win UAE hackathons by demonstrating innovative AI agents, real-world applicability, and cultural relevance.
- **Success Metrics:** 90%+ compliance accuracy, <2min response time, positive user feedback on ethical features.

### 3. Features & Requirements

#### Core Features
- **Multi-Agent LLM Council:** 5 AI agents debate market analysis for balanced insights.
- **Behavioral Analysis:** Detects 10 psychological patterns with risk scoring.
- **Shariah Compliance:** Screens assets for Islamic finance principles (no riba, no haram industries).
- **Calling Agent:** Executes trades or generates actionable signals post-compliance check.
- **Economic Calendar:** Real-time market events and news integration.
- **Persona Selection:** Adaptive communication styles based on trader profile.

#### Functional Requirements
- **FR1:** System must validate asset symbols and reject invalid ones.
- **FR2:** LLM Council must provide consensus analysis within 120 seconds.
- **FR3:** Behavioral agent must classify patterns with severity levels.
- **FR4:** Shariah agent must score compliance 0-100 with reasoning.
- **FR5:** Calling agent must execute only compliant trades.
- **FR6:** API must handle 100+ concurrent requests.

#### Non-Functional Requirements
- **NFR1:** Response time <120s for full analysis.
- **NFR2:** 99% uptime with error handling.
- **NFR3:** GDPR/CCPA compliant data handling.
- **NFR4:** Scalable to 10,000 users.
- **NFR5:** Accessible via web UI and API.

### 4. User Stories
- **As a trader,** I want behavioral analysis so I can avoid revenge trading.
- **As an Islamic investor,** I want Shariah screening to ensure halal portfolios.
- **As a developer,** I want API integration for automated trading bots.
- **As a hackathon judge,** I want innovative AI demos that solve real problems.

### 5. Technical Architecture
- **Frontend:** HTML/CSS/JS for demo UI.
- **Backend:** FastAPI with async agents.
- **AI Layer:** OpenRouter, Mistral, Groq LLMs.
- **Data Layer:** yfinance for market data, PostgreSQL for persistence.
- **Agents:** Modular classes in `/agents/` directory.

### 6. Design Considerations
- **UI/UX:** Simple web interface for asset input and results display.
- **Security:** API key management, input sanitization.
- **Ethics:** Bias mitigation in LLMs, transparent compliance scoring.
- **Scalability:** Docker containerization, cloud deployment.

### 7. Implementation Plan
- **Phase 1 (MVP):** Core agents + API (2 weeks).
- **Phase 2:** Shariah + Calling agents (1 week).
- **Phase 3:** UI polish + testing (1 week).
- **Phase 4:** Hackathon prep + demos (1 week).

### 8. Risks & Mitigations
- **Risk:** LLM API failures → Mitigation: Fallback to cached responses.
- **Risk:** Shariah interpretation debates → Mitigation: Configurable thresholds.
- **Risk:** High latency → Mitigation: Parallel agent execution.

### 9. Success Criteria
- **Technical:** All agents functional, API stable.
- **Business:** Positive feedback from UAE judges on innovation and ethics.
- **User:** Improved trading decisions via psychological insights.

---

## �👥 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support & Contact

- **Issues:** Create an issue in the repository
- **Discussions:** Use GitHub Discussions for questions
- **Documentation:** See [API_REQUEST_FORMAT.md](API_REQUEST_FORMAT.md) for complete API docs

---

## 🙏 Acknowledgments

- **OpenRouter** - Multi-model LLM access
- **Mistral.ai** - High-quality language models
- **Groq** - Fast LLM inference
- **yfinance** - Market data & economic calendar
- **FastAPI** - Modern Python web framework

---

<div align="center">

**Version:** 2.0.0  
**Last Updated:** February 7, 2026  
**Server:** http://localhost:8000  
**Docs:** http://localhost:8000/docs

---

**Built with ❤️ for better trading psychology**

</div>
