# TensorTrade — Multi-Agent Trading Psychology API

AI-powered trading analysis system using a multi-LLM debate council and behavioral psychology detection.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [System Architecture](#system-architecture)
- [AI Models and Agents](#ai-models-and-agents)
- [Quick Start](#quick-start)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Use Cases](#use-cases)
- [Testing](#testing)
- [Security](#security)
- [Performance](#performance)
- [Roadmap](#roadmap)

---

## Problem Statement

85% of retail traders lose money — not due to lack of market knowledge, but due to psychological biases and emotional decision-making.

**Core problems:**
- Revenge trading after losses
- FOMO-driven entries without analysis
- Overtrading from boredom or impulse
- Confirmation bias in research
- Loss aversion (holding losers, cutting winners too early)
- Single-perspective analysis — most traders rely on one framework (technical or fundamental, never both)

**Information overload:**
- Traders face contradictory signals from news, social media, and analysts
- No single source provides balanced, multi-perspective analysis
- Economic events are scattered across platforms
- Behavioral patterns go unnoticed until the damage is done

**Existing solutions are insufficient:**
- Basic journals track trades but do not analyze psychology
- Traditional analytics focus on P&L, not decision quality
- Financial advisors are expensive and unavailable 24/7
- Generic AI chatbots lack real-time market context

---

## Solution Overview

TensorTrade is an AI-powered analysis system that:

- Analyzes trader behavior using 10 psychological pattern detectors
- Provides multi-perspective market analysis via 5 specialized LLM agents debating in parallel
- Validates asset symbols before analysis
- Aggregates economic calendar data (earnings, Fed meetings, economic indicators)
- Generates personalized narratives tailored to trader psychology and market readiness
- Auto-selects communication personas (Coach, Professional, Casual, Analytical)

**How it works:**
1. Trader submits an asset symbol (e.g., AAPL, BTC-USD)
2. System validates the symbol and fetches market data
3. Five AI agents debate the market from different perspectives
4. Behavioral analyzer scans trade history for psychological patterns
5. Narrator synthesizes insights into actionable, personalized feedback
6. Moderator ensures content safety and appropriate tone

**Key innovation:** Instead of a single AI model (which carries inherent bias), TensorTrade uses 5 specialized agents with different expertise areas — macro, fundamental, technical, flow, and risk — that debate each other to produce balanced analysis. This mirrors how professional trading desks operate.

---

## System Architecture

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
│  - CORS enabled                                                 │
│  - Request validation                                           │
│  - Async orchestration                                          │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
    ┌──────────────────┐  ┌──────────────┐  ┌─────────────────┐
    │ Asset Validator  │  │ Market Data  │  │ Trade History   │
    │ (yfinance API)   │  │ Service      │  │ Service         │
    │ - Symbol check   │  │ - Price data │  │ - P&L calc      │
    │ - 80+ symbols    │  │ - Volume     │  │ - Win rate      │
    └──────────────────┘  └──────────────┘  └─────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ECONOMIC CALENDAR SERVICE                    │
│  - Earnings dates (via yfinance)                                │
│  - News headlines                                               │
│  - Economic indicators                                          │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    5-AGENT LLM DEBATE COUNCIL                   │
│                    (llm_council/debate_engine.py)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │
│  │  Macro Hawk   │  │    Micro      │  │     Flow      │      │
│  │ (OpenRouter)  │  │  Forensic     │  │  Detective    │      │
│  │  Mistral-7B   │  │ (OpenRouter)  │  │ (OpenRouter)  │      │
│  │               │  │ Mythomax-13B  │  │  Mistral-7B   │      │
│  └───────────────┘  └───────────────┘  └───────────────┘      │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐                          │
│  │     Tech      │  │    Skeptic    │                          │
│  │ Interpreter   │  │ (Mistral.ai)  │                          │
│  │ (OpenRouter)  │  │ Large-Latest  │                          │
│  │ Mythomax-13B  │  │               │                          │
│  └───────────────┘  └───────────────┘                          │
│                                                                 │
│  - Parallel execution (all 5 agents run simultaneously)        │
│  - Structured debate with confidence levels                    │
│  - Consensus and disagreement detection                        │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BEHAVIORAL ANALYSIS AGENT                    │
│                    (agents/behaviour_agent.py)                  │
│  - Detects 10 psychological patterns                           │
│  - Severity classification (High / Medium / Positive)          │
│  - Risk scoring (0-100)                                        │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PERSONA SELECTION AGENT                      │
│                    (agents/persona.py)                          │
│  - Auto-selects style: Coach | Professional | Casual           │
│  - Based on: win rate, P&L, pattern severity                   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         NARRATOR AGENT                          │
│                      (agents/narrator.py)                       │
│  - Groq LLM (Mixtral-8x7B)                                     │
│  - Synthesizes all insights                                     │
│  - Generates personalized narrative                             │
│  - Market readiness assessment                                  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MODERATOR AGENT                          │
│                     (agents/moderator.py)                       │
│  - Content safety checks                                        │
│  - Tone appropriateness                                         │
│  - Final validation                                             │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SHARIAH COMPLIANCE AGENT                      │
│                 (agents/shariah_compliance_agent.py)            │
│  - Islamic finance screening                                     │
│  - Haram industry detection                                      │
│  - Riba and Gharar assessment                                    │
│  - Compliance scoring (0-100)                                   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CALLING AGENT                            │
│                     (agents/calling_agent.py)                   │
│  - Trade execution calls                                        │
│  - Market prediction signals                                    │
│  - Broker API integration                                       │
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

---

## AI Models and Agents

### LLM Provider Strategy

Multi-provider approach for reliability, cost-efficiency, and model diversity:

| Agent | Provider | Model | Cost | Purpose |
|-------|----------|-------|------|---------|
| Macro Hawk | OpenRouter | Mistral-7B-Instruct | Free | Macroeconomic analysis |
| Micro Forensic | OpenRouter | Mythomax-L2-13B | Free | Fundamental analysis |
| Flow Detective | OpenRouter | Mistral-7B-Instruct | Free | Market microstructure |
| Tech Interpreter | OpenRouter | Mythomax-L2-13B | Free | Technical analysis |
| Skeptic | Mistral.ai | Mistral-Large-Latest | Paid | Risk assessment |
| Narrator | Groq | Mixtral-8x7B-Instruct | Free | Synthesis |

Total cost per request: ~$0.02 (only the Skeptic agent is paid).

### The 5-Agent Debate Council

**Macro Hawk** — Macroeconomic Strategist
Expertise: Fed policy, interest rates, inflation, sector rotation, currency markets.

**Micro Forensic** — Fundamental Analyst
Expertise: Financial statements, earnings, SEC filings, valuation, competitive analysis.

**Flow Detective** — Market Microstructure Expert
Expertise: Order flow, options positioning, institutional flows, dark pools.

**Tech Interpreter** — Technical Analyst
Expertise: Chart patterns, support/resistance, indicators, price action.

**Skeptic** — Risk Manager
Expertise: Risk assessment, contrarian analysis, bearish scenarios, black swan scenarios.

### How the Debate Works

1. **Parallel execution** — all 5 agents receive the same market data simultaneously
2. **Independent analysis** — each agent analyzes from their unique perspective (no groupthink)
3. **Structured output** — each agent provides: thesis, supporting points, risks, confidence level
4. **Consensus detection** — system identifies areas of agreement and disagreement
5. **Synthesis** — Narrator combines insights into an actionable summary

---

## Quick Start

### Prerequisites

```bash
python --version  # 3.12+
pip --version
```

### Installation

```bash
git clone <repo-url>
cd TensorTrade

python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

### Configuration

Copy `.env.example` to `.env` and fill in your keys:

```env
OPENROUTER_API_KEY=your_key_here
MISTRAL_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
```

### Start the Backend

```bash
# Development
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Start the Frontend

```bash
cd frontend-next
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Test the API

```bash
curl http://localhost:8000/health
curl -X POST "http://localhost:8000/analyze-asset?asset=AAPL&user_id=trader123"
```

---

## Features

### Asset Symbol Validation
- Validates genuine assets — rejects invalid or random symbols
- 80+ tested symbols: stocks, ETFs, crypto, forex, international
- Instant feedback with clear error messages
- Smart caching for repeated symbols
- Case normalization — accepts lowercase input

### 5-Agent LLM Council
- Diverse perspectives from macro, fundamental, flow, technical, and skeptic experts
- Parallel execution for 100-120 second response time
- Structured debate format with confidence levels
- Consensus and disagreement detection
- Evidence-backed analysis

### Behavioral Pattern Detection

Detects 10 trading psychology patterns:

- **High severity:** Revenge trading, ego trading, loss aversion, averaging down
- **Medium severity:** Overtrading, FOMO, impulsive decisions, quick profit taking, hesitation
- **Positive:** Calculated risk (good win rate with controlled losses)

### Economic Calendar Integration
- Real-time earnings dates
- Economic indicators (Fed meetings, CPI, jobs reports)
- Market news headlines
- Sector-specific events

### Intelligent Persona Selection

Auto-selects communication style based on trader performance:
- **Coach** — supportive tone for struggling traders (win rate under 40%)
- **Professional** — peer-level tone for winning traders (win rate over 60%)
- **Casual** — friendly tone for new traders (fewer than 5 trades)
- **Analytical** — data-focused (default)

### Market Readiness Assessment

Risk score (0-100) calculated from behavioral patterns, mapped to 4 readiness levels:
- STOP TRADING — risk 60+
- TRADE WITH CAUTION — risk 40-59
- CONTINUE TRADING — risk under 40 with calculated risk pattern
- PROCEED CAREFULLY — risk under 40

### Shariah Compliance Agent
- Islamic finance screening — validates assets against Shariah principles
- Haram industry detection (alcohol, tobacco, gambling, weapons)
- Riba and Gharar assessment
- Compliance scoring 0-100 with detailed reasoning
- Configurable thresholds for different madhabs/schools

### Calling Agent
- Trade execution calls — simulates or executes buy/sell orders via broker APIs
- Market prediction signals (BUY/SELL/HOLD)
- Safety gate — only executes Shariah-compliant trades

---

## API Documentation

### Endpoints

| Endpoint | Method | Purpose | Response Time |
|----------|--------|---------|---------------|
| `/analyze-asset` | POST | Full market and behavioral analysis | 100-120s |
| `/run-agents` | POST | Legacy endpoint with manual inputs | 100-120s |
| `/health` | GET | Service health check | <1s |
| `/` | GET | API information | <1s |

### POST /analyze-asset

Simplified analysis endpoint with auto-generation of market context.

**Request:**
```bash
POST /analyze-asset?asset=AAPL&user_id=trader123
```

**Query parameters:**
- `asset` (required) — stock symbol, e.g., AAPL, MSFT, BTC-USD
- `user_id` (optional) — trader identifier for personalization

**Response:**
```json
{
  "trade_history": {
    "total_trades": 15,
    "total_pnl": -245.50,
    "win_rate": 40.0,
    "wins": 6,
    "losses": 9,
    "largest_win": 120.00,
    "largest_loss": -85.00
  },
  "economic_calendar": {
    "symbol": "AAPL",
    "earnings_calendar": {
      "next_earnings_date": "2026-04-25"
    },
    "recent_news": ["Apple announces new AI features..."],
    "economic_events": ["Fed Meeting - March 19, 2026"]
  },
  "market_analysis": {
    "council_opinions": [
      "Macro Hawk (High): Fed rate cut expectations surge...",
      "Skeptic (Low): Valuation concerns remain..."
    ],
    "consensus_points": ["Strong earnings performance"],
    "disagreements": ["Valuation (Forensic: Fair, Skeptic: Overvalued)"]
  },
  "behavioral_analysis": {
    "flags": [
      {
        "pattern": "Overtrading",
        "severity": "Medium",
        "message": "High trade count (15) for session"
      },
      {
        "pattern": "Loss Aversion",
        "severity": "High",
        "message": "Holding losing positions too long"
      }
    ],
    "risk_score": 55,
    "patterns_detected": 2
  },
  "narrative": {
    "styled_message": "Let's talk about your AAPL session...",
    "persona": "Coach",
    "market_readiness": "TRADE WITH CAUTION",
    "key_recommendations": [
      "Set stricter stop-losses to prevent loss aversion",
      "Reduce trade frequency to avoid overtrading"
    ]
  },
  "timestamp": "2026-02-07T14:30:00Z",
  "processing_time": 112.5
}
```

### GET /health

```json
{
  "status": "healthy",
  "version": "2.0.0",
  "services": {
    "llm_council": "operational",
    "economic_calendar": "operational",
    "asset_validator": "operational"
  }
}
```

### Error Responses

**Invalid asset:**
```json
{
  "error": "Invalid asset symbol",
  "message": "Symbol 'INVALIDXYZ' is not a valid asset.",
  "suggestions": ["Check spelling", "Try common symbols like AAPL, MSFT, TSLA"],
  "status_code": 400
}
```

**Rate limit exceeded:**
```json
{
  "error": "Rate limit exceeded",
  "message": "Maximum 10 requests per minute",
  "retry_after": 45,
  "status_code": 429
}
```

---

## Technical Stack

### Core Framework
- **FastAPI** — async web framework
- **Pydantic v2.8+** — data validation
- **Uvicorn** — ASGI server
- **Python 3.12** — runtime

### LLM Providers
- **OpenRouter** — 4 debate agents (Mistral-7B, Mythomax-L2-13B)
- **Mistral.ai** — Skeptic agent (Mistral-Large-Latest)
- **Groq** — Narrator (Mixtral-8x7B-Instruct)

### Data Sources
- **yfinance** — market data, earnings, economic calendar
- **aiohttp** — async HTTP requests
- **BeautifulSoup4 + lxml** — web scraping

### Frontend
- **Next.js 14** (App Router) — React framework
- **TypeScript** — type safety
- **Tailwind CSS** — styling
- **ElevenLabs / Twilio** — voice agent (optional)

### Infrastructure (Optional)
- **PostgreSQL** — trade history persistence
- **Redis** — caching layer
- **Docker** — containerization

---

## Project Structure

```
TensorTrade/
├── main.py                         # FastAPI server and orchestration
├── requirements.txt                # Python dependencies
├── .env                            # Environment variables (not committed)
│
├── agents/                         # Behavioral and communication agents
│   ├── behaviour_agent.py          # 10 pattern detector
│   ├── narrator.py                 # Groq LLM synthesis
│   ├── persona.py                  # Auto-persona selection
│   ├── moderator.py                # Content safety
│   ├── shariah_compliance_agent.py # Islamic finance screening
│   ├── calling_agent.py            # Trade execution
│   └── market_watcher.py           # Market analysis coordinator
│
├── llm_council/                    # 5-agent debate system
│   ├── core/config.py              # LLM provider settings
│   ├── models/schemas.py           # Pydantic data models
│   └── services/
│       ├── llm_client.py           # Multi-provider abstraction
│       ├── agent_prompts.py        # System prompts for 5 agents
│       └── debate_engine.py        # Parallel debate execution
│
├── services/                       # Supporting services
│   ├── asset_validator.py          # yfinance symbol validation
│   ├── economic_calendar.py        # Earnings and economic events
│   ├── market_metrics.py           # Price and volume data
│   └── trade_history.py            # P&L calculations
│
├── frontend-next/                  # Next.js dashboard
│   └── src/
│       ├── app/                    # App Router pages
│       ├── components/             # Reusable UI components
│       └── lib/                    # API client, auth, utilities
│
└── test/                           # Test suite
```

---

## Use Cases

### Post-Session Analysis

After a trading session, get behavioral feedback and market context:

```python
import requests

response = requests.post(
    "http://localhost:8000/analyze-asset",
    params={"asset": "SPY", "user_id": "trader123"}
)

data = response.json()
print(f"P&L: ${data['trade_history']['total_pnl']:.2f}")
print(f"Win Rate: {data['trade_history']['win_rate']}%")
print(f"Risk Score: {data['behavioral_analysis']['risk_score']}/100")
print(data['narrative']['styled_message'])
```

### Pre-Trade Research

Get multi-perspective analysis before entering a position:

```python
response = requests.post(
    "http://localhost:8000/analyze-asset",
    params={"asset": "NVDA"}
)

data = response.json()

for opinion in data['market_analysis']['council_opinions']:
    print(opinion)

for event in data['economic_calendar']['economic_events']:
    print(f"  - {event}")
```

### Algorithmic Trading Gate

Pause an algo bot when behavioral risk is too high:

```python
class AlgoTradingBot:
    def should_trade_today(self, asset):
        response = requests.post(
            f"{API_URL}/analyze-asset",
            params={"asset": asset, "user_id": "algo_bot"}
        )
        data = response.json()

        risk_score = data['behavioral_analysis']['risk_score']
        readiness = data['narrative']['market_readiness']

        if risk_score > 60 or readiness == "STOP TRADING":
            self.pause_trading()
            return False

        return True
```

### Portfolio Risk Monitoring

Analyze multiple assets concurrently:

```python
import asyncio, aiohttp

async def analyze_portfolio(assets):
    async with aiohttp.ClientSession() as session:
        tasks = [
            session.post(f"http://localhost:8000/analyze-asset?asset={a}")
            for a in assets
        ]
        responses = await asyncio.gather(*tasks)
        return [await r.json() for r in responses]

portfolio = ["AAPL", "MSFT", "GOOGL", "TSLA"]
results = asyncio.run(analyze_portfolio(portfolio))
avg_risk = sum(r['behavioral_analysis']['risk_score'] for r in results) / len(results)
print(f"Portfolio Risk Score: {avg_risk:.1f}/100")
```

---

## Testing

```bash
# Full integration test
python test_integrated_workflow.py

# Asset validation
python test_asset_validator.py

# API endpoints
python test_api.py

# Market metrics
python test_market_metrics.py

# Manual health check
curl http://localhost:8000/health
```

---

## Security

### Current Implementation (Development)
- No authentication required
- No rate limiting
- CORS enabled for all origins
- Content moderation via ModeratorAgent
- Input validation via Pydantic

### Production Recommendations

**Authentication (JWT):**
```python
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

@app.post("/analyze-asset")
async def analyze_asset(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    user = verify_jwt_token(token)
```

**Rate limiting:**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/analyze-asset")
@limiter.limit("10/minute")
async def analyze_asset():
    ...
```

**Restrict CORS:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
)
```

---

## Performance

**Current metrics:**
- Average response time: 100-120 seconds (limited by LLM inference)
- Bottleneck: 5 parallel LLM calls
- Throughput: 4-8 requests per minute per worker

**Optimization strategies:**

Increase workers:
```bash
uvicorn main:app --workers 4 --host 0.0.0.0 --port 8000
```

Add Redis caching for economic calendar data (1-hour TTL):
```python
cache.setex(f"economic:{symbol}", 3600, json.dumps(data))
```

Stream responses to reduce perceived latency:
```python
@app.post("/analyze-asset-stream")
async def analyze_asset_stream(asset: str):
    async def generate():
        yield json.dumps({"status": "validating"})
        yield json.dumps({"status": "running LLM council"})
        yield json.dumps({"status": "complete", "data": results})
    return StreamingResponse(generate(), media_type="application/json")
```

---

## Roadmap

**Phase 1 — Core (complete)**
- [x] Asset symbol validation
- [x] 5-agent LLM debate council
- [x] Behavioral pattern detection
- [x] Economic calendar integration
- [x] Auto-persona selection
- [x] Shariah compliance agent
- [x] Calling agent
- [x] Next.js frontend dashboard

**Phase 2 — Data Persistence (Q2 2026)**
- [ ] PostgreSQL integration
- [ ] Redis caching layer
- [ ] Historical trade analysis
- [ ] User profile persistence

**Phase 3 — Advanced Features (Q3 2026)**
- [ ] WebSocket streaming responses
- [ ] Real-time trade monitoring
- [ ] Multi-timeframe analysis (1D, 1W, 1M)
- [ ] Portfolio-level analysis

**Phase 4 — Production Ready (Q4 2026)**
- [ ] JWT authentication
- [ ] Rate limiting
- [ ] API key management
- [ ] Monitoring and alerting

**Phase 5 — ML Enhancements (2027)**
- [ ] Predictive behavioral modeling
- [ ] Custom LLM fine-tuning
- [ ] Sentiment analysis from social media
- [ ] Market regime detection

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a pull request

---

## Acknowledgments

- OpenRouter — multi-model LLM access
- Mistral.ai — high-quality language models
- Groq — fast LLM inference
- yfinance — market data and economic calendar
- FastAPI — modern Python web framework
