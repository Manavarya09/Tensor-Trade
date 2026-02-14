# TensorTrade - Existing Codebase Analysis
**Analysis Date:** February 14, 2026  
**Analyst:** Kiro AI Assistant

---

## 📊 Executive Summary

TensorTrade is a **Python-based FastAPI application** with **Next.js and React Native frontends** that provides AI-powered trading analysis using a 5-agent LLM debate system. The project is **70% complete** with solid backend infrastructure but needs frontend polish, database integration, and production features.

### Current State: ✅ What Works
- ✅ FastAPI backend with 10 specialized agents
- ✅ 5-agent LLM debate council (OpenRouter, Mistral, Gemini, Groq)
- ✅ Asset validation (80+ symbols via yfinance)
- ✅ Economic calendar integration
- ✅ Behavioral pattern detection (10 patterns)
- ✅ Shariah compliance screening
- ✅ Real-time streaming API
- ✅ Self-improvement learning system
- ✅ Basic Next.js frontend
- ✅ React Native mobile app (Expo)
- ✅ Vercel deployment configuration

### Current State: 🚧 What Needs Work
- 🚧 No database (using synthetic trade data)
- 🚧 No authentication system
- 🚧 Frontend UI is minimal (needs dashboard polish)
- 🚧 No trading policy engine
- 🚧 No voice calling agent (Twilio integration)
- 🚧 No IPO calendar scraper
- 🚧 No portfolio optimization
- 🚧 No payment system (Stripe)
- 🚧 Limited testing coverage
- 🚧 No monitoring/observability

---

## 🏗️ Architecture Overview

### Tech Stack

**Backend (Python)**
- FastAPI 0.104+ (async web framework)
- Pydantic 2.0+ (data validation)
- yfinance (market data)
- aiohttp (async HTTP)
- Groq, OpenRouter, Mistral, Gemini (LLM providers)

**Frontend (TypeScript)**
- Next.js 16.1.6 (React framework)
- React 19.2.3
- Tailwind CSS 4
- lightweight-charts 5.1.0 (charting)
- lucide-react (icons)

**Mobile (TypeScript)**
- Expo ~54.0.33
- React Native 0.81.5
- react-native-webview 13.16.0

**Deployment**
- Vercel (serverless Python + static frontend)
- No database configured yet

---

## 📁 Project Structure

```
TensorTrade/
├── agents/                    # 10 specialized AI agents
│   ├── behaviour_agent.py     # Detects 10 trading psychology patterns
│   ├── calling_agent.py       # Trade execution signals
│   ├── compliance_agent.py    # Content moderation
│   ├── market_watcher.py      # Coordinates 5-agent debate
│   ├── moderator.py           # Safety checks
│   ├── narrator.py            # Synthesizes insights
│   ├── persona.py             # Auto-selects communication style
│   ├── risk_manager.py        # Risk assessment
│   ├── sentiment_agent.py     # Sentiment analysis
│   └── shariah_compliance_agent.py  # Islamic finance screening
│
├── llm_council/               # 5-agent debate system
│   ├── core/
│   │   └── config.py          # LLM provider configuration
│   ├── models/
│   │   └── schemas.py         # Pydantic models
│   └── services/
│       ├── agent_prompts.py   # System prompts for each agent
│       ├── debate_engine.py   # Orchestrates 5-agent debate
│       └── llm_client.py      # Multi-provider LLM client
│
├── services/                  # Business logic services
│   ├── asset_validator.py     # Symbol validation (yfinance)
│   ├── economic_calendar.py   # Earnings, news, events
│   ├── market_metrics.py      # VIX, regime, risk index
│   ├── self_improvement.py    # Learning from feedback
│   └── trade_history.py       # Synthetic trade data (needs DB)
│
├── api/                       # Vercel serverless entry
│   ├── index.py               # Vercel handler
│   └── requirements.txt       # Python dependencies
│
├── frontend-next/             # Next.js web app
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx       # Landing page
│   │   └── components/
│   │       ├── Chart.tsx      # Trading chart component
│   │       └── Dashboard.tsx  # Main dashboard
│   └── package.json
│
├── mobile-expo/               # React Native mobile app
│   ├── App.tsx                # Main app component
│   ├── components/
│   │   ├── Chart.tsx
│   │   └── DashboardScreen.tsx
│   └── package.json
│
├── main.py                    # FastAPI application entry
├── index.html                 # Simple HTML frontend
├── frontend.js                # Vanilla JS frontend
├── requirements.txt           # Python dependencies
├── vercel.json                # Vercel deployment config
└── README.md                  # Comprehensive documentation
```

---

## 🤖 Existing Agents (10 Total)

### 1. **BehaviorMonitorAgent** (`agents/behaviour_agent.py`)
**Status:** ✅ Implemented  
**Purpose:** Detects 10 trading psychology patterns

**Patterns Detected:**
- High Severity: Revenge trading, Ego trading, Loss aversion, Averaging down
- Medium Severity: Overtrading, FOMO, Impulsive decisions, Quick profit taking, Hesitation
- Positive: Calculated risk

**Output:**
```python
{
    "behavior_flags": [
        {
            "pattern": "Revenge Trading",
            "severity": "High",
            "message": "Detected increased position sizes after losses",
            "details": "3 instances in last 30 days"
        }
    ],
    "risk_score": 55  # 0-100
}
```

### 2. **MarketWatcherAgent** (Coordinates 5-Agent Debate)
**Status:** ✅ Implemented  
**Purpose:** Orchestrates 5 specialized LLM agents

**5 Agents:**
1. 🦅 **Macro Hawk** - Macroeconomic strategist (Fed, rates, inflation)
2. 🔬 **Micro Forensic** - Fundamental analyst (earnings, financials)
3. 💧 **Flow Detective** - Market microstructure (dark pools, options)
4. 📊 **Tech Interpreter** - Technical analyst (charts, indicators)
5. 🤔 **Skeptic** - Risk manager (contrarian view)

**LLM Providers:**
- OpenRouter: 4 agents (Mistral-7B, Mythomax-13B)
- Mistral.ai: 1 agent (Mistral-Large-Latest)
- Fallback: Gemini, Groq

**Output:**
```python
{
    "agent_arguments": [
        {
            "agent_name": "🦅 Macro Hawk",
            "thesis": "Fed rate cut expectations surge...",
            "supporting_points": ["...", "...", "..."],
            "confidence": "high"
        },
        # ... 4 more agents
    ],
    "consensus_points": ["Strong earnings", "Favorable macro"],
    "disagreement_points": ["Valuation concerns"],
    "judge_summary": "4/5 agents bullish..."
}
```

### 3. **NarratorAgent** (`agents/narrator.py`)
**Status:** ✅ Implemented  
**Purpose:** Synthesizes all agent outputs into personalized narrative

**LLM:** Groq (Mixtral-8x7B-Instruct)

**Output:**
```python
{
    "summary": "Your AAPL session showed...",
    "final_message": "Hey there - Let's talk about your trading...",
    "market_readiness": "TRADE WITH CAUTION"
}
```

### 4. **PersonaAgent** (`agents/persona.py`)
**Status:** ✅ Implemented  
**Purpose:** Auto-selects communication style based on performance

**Personas:**
- **Coach** - Supportive (win rate <40%)
- **Professional** - Peer-level (win rate >60%)
- **Casual** - Friendly (new traders)
- **Analytical** - Data-focused (default)

### 5. **ModeratorAgent** (`agents/moderator.py`)
**Status:** ✅ Implemented  
**Purpose:** Content safety and tone appropriateness

### 6. **RiskManagerAgent** (`agents/risk_manager.py`)
**Status:** ✅ Implemented  
**Purpose:** Risk assessment and position sizing

### 7. **SentimentAnalysisAgent** (`agents/sentiment_agent.py`)
**Status:** ✅ Implemented  
**Purpose:** Market sentiment analysis

### 8. **ComplianceAgent** (`agents/compliance_agent.py`)
**Status:** ✅ Implemented  
**Purpose:** Regulatory compliance checks

### 9. **ShariahComplianceAgent** (`agents/shariah_compliance_agent.py`)
**Status:** ✅ Implemented  
**Purpose:** Islamic finance screening

**Checks:**
- Business activity (Haram industries: alcohol, gambling, pork, interest-based finance)
- Financial ratios (Debt/Market Cap <33%, Interest Income <5%)

**Output:**
```python
{
    "compliant": True,
    "score": 85,  # 0-100
    "reason": "Passes all Shariah screens",
    "issues": []
}
```

### 10. **CallingAgent** (`agents/calling_agent.py`)
**Status:** ✅ Implemented (basic)  
**Purpose:** Trade execution signals

**Needs:** Twilio integration for voice calls (not implemented)

---

## 🔌 API Endpoints

### Existing Endpoints

#### 1. `POST /analyze-asset` (Primary Endpoint)
**Status:** ✅ Fully Functional  
**Purpose:** Complete analysis with just asset symbol

**Request:**
```bash
POST /analyze-asset?asset=AAPL&user_id=trader123
```

**Response Time:** 100-120 seconds (5 LLM agents in parallel)

**Response Structure:**
```json
{
    "asset": "AAPL",
    "market_metrics": {
        "vix": 15.2,
        "market_regime": "Bull Market",
        "risk_index": 35
    },
    "trade_history": {
        "total_trades": 15,
        "total_pnl": -245.50,
        "win_rate": 40.0
    },
    "economic_calendar": {
        "earnings": {"next_earnings_date": "2026-04-25"},
        "recent_news": ["..."],
        "economic_events": ["Fed Meeting - March 19"]
    },
    "behavioral_analysis": {
        "flags": [...],
        "risk_score": 55
    },
    "market_analysis": {
        "council_opinions": ["🦅 Macro Hawk: ...", "..."],
        "consensus": ["..."],
        "disagreements": ["..."]
    },
    "narrative": {
        "styled_message": "Hey there - Let's talk about...",
        "market_readiness": "TRADE WITH CAUTION"
    },
    "shariah_compliance": {
        "compliant": true,
        "score": 85
    }
}
```

#### 2. `GET /analyze-asset-stream` (Streaming)
**Status:** ✅ Implemented  
**Purpose:** Real-time updates via NDJSON

**Response:** Newline-delimited JSON events
```json
{"type": "status", "message": "Validating symbol..."}
{"type": "trade_history", "data": {...}}
{"type": "agent_result", "agent": "🦅 Macro Hawk", "data": {...}}
{"type": "complete", "data": {...}}
```

#### 3. `POST /run-agents` (Legacy)
**Status:** ✅ Functional (but use /analyze-asset instead)  
**Purpose:** Custom inputs for advanced users

#### 4. `GET /health`
**Status:** ✅ Implemented

#### 5. `GET /` and `GET /api`
**Status:** ✅ Implemented (API info)

---

## 🗄️ Data Layer (CRITICAL GAP)

### Current State: ❌ NO DATABASE
- Trade history is **synthetic/mock data**
- No user accounts
- No persistent storage
- No trade history tracking

### What Needs to Be Built:

**Database Schema (PostgreSQL recommended):**

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Trades table
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    action VARCHAR(10) NOT NULL,  -- BUY, SELL
    quantity DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    pnl DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'OPEN',  -- OPEN, CLOSED
    timestamp TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_symbol (user_id, symbol),
    INDEX idx_timestamp (timestamp DESC)
);

-- Trading policies table (NOT IMPLEMENTED YET)
CREATE TABLE trading_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,  -- loss_limit, trade_frequency, position_size
    threshold DECIMAL(10, 2),
    action VARCHAR(20),  -- alert, lock, auto_close
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Agent feedback table (for self-learning)
CREATE TABLE agent_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    analysis_id VARCHAR(100),
    agent_name VARCHAR(50),
    prediction JSONB,
    actual_outcome JSONB,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    helpful BOOLEAN,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Current Workaround:**
- `services/trade_history.py` generates synthetic data
- Works for demo but NOT production-ready

---

## 🎨 Frontend Status

### Next.js Frontend (`frontend-next/`)
**Status:** 🚧 Basic Implementation

**What Exists:**
- ✅ Next.js 16.1.6 setup
- ✅ Tailwind CSS 4
- ✅ Chart component (lightweight-charts)
- ✅ Dashboard component (basic)
- ✅ Landing page

**What's Missing:**
- ❌ No authentication UI
- ❌ No portfolio page
- ❌ No analysis page (asset input + results)
- ❌ No policies page
- ❌ No IPO calendar page
- ❌ No settings page
- ❌ No responsive mobile design
- ❌ No loading states
- ❌ No error handling UI

### Mobile App (`mobile-expo/`)
**Status:** 🚧 Basic Implementation

**What Exists:**
- ✅ Expo 54.0.33 setup
- ✅ React Native 0.81.5
- ✅ WebView component
- ✅ Dashboard screen (basic)

**What's Missing:**
- ❌ Native navigation
- ❌ Push notifications
- ❌ Offline support
- ❌ Native charts

### Vanilla JS Frontend (`index.html` + `frontend.js`)
**Status:** ✅ Basic Working Demo

**What Exists:**
- ✅ Simple HTML/CSS/JS interface
- ✅ Asset input form
- ✅ Results display
- ✅ Works with Vercel deployment

---

## 🚀 Deployment Configuration

### Vercel Setup
**Status:** ✅ Configured

**Files:**
- `vercel.json` - Routes configuration
- `api/index.py` - Serverless entry point
- `runtime.txt` - Python 3.10

**Routes:**
```json
{
    "/api/*": "api/index.py",
    "/analyze-asset": "api/index.py",
    "/health": "api/index.py",
    "/": "index.html"
}
```

**Environment Variables Required:**
```env
OPENROUTER_API_KEY=sk-or-...
MISTRAL_API_KEY=...
GROQ_API_KEY=...
GEMINI_API_KEY=...  # Optional
```

---

## 📊 Feature Gap Analysis

### ✅ Already Implemented (70%)

1. **Asset Validation** - 80+ symbols via yfinance
2. **5-Agent LLM Debate** - Macro, Fundamental, Flow, Technical, Skeptic
3. **Behavioral Analysis** - 10 psychology patterns
4. **Economic Calendar** - Earnings, news, events
5. **Shariah Compliance** - Islamic finance screening
6. **Market Metrics** - VIX, regime, risk index
7. **Persona Selection** - Auto-selects communication style
8. **Narrative Generation** - Personalized summaries
9. **Content Moderation** - Safety checks
10. **Self-Improvement** - Learning from feedback
11. **Streaming API** - Real-time updates
12. **Basic Frontend** - HTML/CSS/JS demo
13. **Next.js Setup** - Modern React framework
14. **Mobile App** - Expo/React Native
15. **Vercel Deployment** - Serverless configuration

### 🚧 Partially Implemented (20%)

1. **Trade History** - Synthetic data (needs database)
2. **Risk Management** - Basic agent (needs policy engine)
3. **Calling Agent** - Signals only (needs Twilio)
4. **Dashboard UI** - Basic components (needs polish)

### ❌ Not Implemented (10%)

1. **Database Integration** - PostgreSQL/Supabase
2. **Authentication** - Clerk/Auth0/Supabase Auth
3. **Trading Policies Engine** - Loss limits, frequency caps
4. **Voice Calling** - Twilio integration
5. **IPO Calendar Scraper** - Automated data collection
6. **Portfolio Optimization** - Asset allocation algorithms
7. **Payment System** - Stripe integration
8. **Testing** - Unit, integration, E2E tests
9. **Monitoring** - Sentry, PostHog
10. **Documentation** - API docs (Swagger)

---

## 🎯 Recommended Build Plan

### Phase 1: Database & Auth (Week 1-2)
**Priority:** CRITICAL

**Tasks:**
1. Set up Supabase (PostgreSQL + Auth)
2. Create database schema (users, trades, policies, feedback)
3. Implement authentication (Clerk or Supabase Auth)
4. Replace synthetic trade data with real DB queries
5. Add user registration/login UI

**Why First:** Everything else depends on persistent data

### Phase 2: Dashboard UI Polish (Week 3-4)
**Priority:** HIGH

**Tasks:**
1. Build portfolio page (holdings, P&L, charts)
2. Build analysis page (asset input + 5-agent results)
3. Build policies page (create/manage trading rules)
4. Add loading states and error handling
5. Make responsive (mobile-friendly)

**Why Second:** Users need a polished interface

### Phase 3: Trading Policies Engine (Week 5-6)
**Priority:** HIGH

**Tasks:**
1. Implement policy evaluator (loss limits, frequency caps)
2. Create policy templates (beginner, intermediate, advanced)
3. Add real-time policy enforcement
4. Build policy violation alerts
5. Add policy analytics dashboard

**Why Third:** Core value proposition for risk management

### Phase 4: Advanced Features (Week 7-8)
**Priority:** MEDIUM

**Tasks:**
1. Voice calling agent (Twilio integration)
2. IPO calendar scraper (NYSE, NASDAQ, DFM, ADX)
3. Portfolio optimization algorithms
4. Payment system (Stripe)
5. Email notifications (SendGrid/Resend)

**Why Fourth:** Nice-to-have features for differentiation

### Phase 5: Testing & Monitoring (Week 9-10)
**Priority:** MEDIUM

**Tasks:**
1. Write unit tests (>80% coverage)
2. Write integration tests
3. Write E2E tests (Playwright)
4. Set up Sentry (error tracking)
5. Set up PostHog (analytics)
6. Add performance monitoring

**Why Fifth:** Quality assurance before launch

### Phase 6: Launch Prep (Week 11-12)
**Priority:** HIGH

**Tasks:**
1. Security audit
2. Performance optimization
3. API documentation (Swagger)
4. User guide + video tutorials
5. Production deployment
6. Marketing materials

**Why Last:** Final polish before public launch

---

## 🔑 Critical Dependencies

### Environment Variables Required

```env
# LLM Providers (at least one required)
OPENROUTER_API_KEY=sk-or-...
MISTRAL_API_KEY=...
GROQ_API_KEY=...
GEMINI_API_KEY=...  # Optional

# Database (NOT SET - CRITICAL)
DATABASE_URL=postgresql://user:pass@host:5432/tensortrade
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=...

# Authentication (NOT SET - CRITICAL)
CLERK_SECRET_KEY=...
CLERK_PUBLISHABLE_KEY=...

# Twilio (NOT SET - for voice agent)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Stripe (NOT SET - for payments)
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Monitoring (NOT SET - optional)
SENTRY_DSN=...
POSTHOG_API_KEY=...
```

---

## 🚨 Critical Issues to Address

### 1. **No Database** (BLOCKER)
**Impact:** Cannot store user data, trades, or policies  
**Solution:** Set up Supabase or PostgreSQL  
**Effort:** 2-3 days

### 2. **No Authentication** (BLOCKER)
**Impact:** No user accounts, no personalization  
**Solution:** Integrate Clerk or Supabase Auth  
**Effort:** 2-3 days

### 3. **Synthetic Trade Data** (BLOCKER)
**Impact:** Demo only, not production-ready  
**Solution:** Replace with real DB queries  
**Effort:** 1-2 days

### 4. **Minimal Frontend** (HIGH)
**Impact:** Poor user experience  
**Solution:** Build dashboard pages  
**Effort:** 2-3 weeks

### 5. **No Testing** (MEDIUM)
**Impact:** Bugs in production  
**Solution:** Write tests  
**Effort:** 1-2 weeks

### 6. **No Monitoring** (MEDIUM)
**Impact:** Can't track errors or usage  
**Solution:** Set up Sentry + PostHog  
**Effort:** 1-2 days

---

## 💡 Strengths to Preserve

### 1. **5-Agent Debate System** ⭐⭐⭐⭐⭐
**Why It's Great:**
- Unique multi-perspective analysis
- Parallel execution (fast)
- Diverse LLM providers (reliability)
- Structured debate format

**DO NOT BREAK:** This is the core innovation

### 2. **Behavioral Pattern Detection** ⭐⭐⭐⭐
**Why It's Great:**
- 10 psychology patterns
- Rule-based (no ML training needed)
- Actionable insights

**DO NOT BREAK:** Key differentiator

### 3. **Economic Calendar Integration** ⭐⭐⭐⭐
**Why It's Great:**
- Real-time earnings, news, events
- Context for LLM agents

**DO NOT BREAK:** Adds market context

### 4. **Shariah Compliance** ⭐⭐⭐⭐
**Why It's Great:**
- Unique feature for Islamic finance
- LLM-powered evaluation

**DO NOT BREAK:** Niche market opportunity

### 5. **Self-Improvement System** ⭐⭐⭐
**Why It's Great:**
- Learns from feedback
- Optimizes agent prompts

**DO NOT BREAK:** Gets better over time

---

## 📝 Next Steps

### Immediate Actions (This Week)

1. **Set up Supabase**
   ```bash
   # Create Supabase project
   # Run database migrations
   # Update .env with DATABASE_URL
   ```

2. **Integrate Authentication**
   ```bash
   npm install @clerk/nextjs
   # Add Clerk provider to Next.js
   # Protect API routes
   ```

3. **Replace Synthetic Data**
   ```python
   # Update services/trade_history.py
   # Query real database instead of mock data
   ```

4. **Build Analysis Page**
   ```typescript
   // frontend-next/src/app/analyze/page.tsx
   // Asset input + results display
   ```

5. **Write Tests**
   ```bash
   pytest tests/
   npm run test
   ```

---

## 🎓 Learning Resources

**For Database:**
- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

**For Authentication:**
- [Clerk Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

**For Testing:**
- [Pytest Documentation](https://docs.pytest.org/)
- [Playwright E2E](https://playwright.dev/)

**For Deployment:**
- [Vercel Deployment](https://vercel.com/docs)
- [Supabase Production](https://supabase.com/docs/guides/platform/going-into-prod)

---

## ✅ Conclusion

TensorTrade has a **solid foundation** with unique AI features (5-agent debate, behavioral analysis, Shariah compliance). The backend is **70% complete** and production-ready for LLM analysis.

**Critical gaps:**
1. Database integration (BLOCKER)
2. Authentication (BLOCKER)
3. Frontend polish (HIGH)
4. Testing (MEDIUM)

**Recommended approach:**
- Focus on database + auth first (Week 1-2)
- Then polish frontend (Week 3-4)
- Then add advanced features (Week 5-8)
- Then test + launch (Week 9-12)

**Estimated time to MVP:** 8-12 weeks with focused development.

---

**END OF ANALYSIS**
