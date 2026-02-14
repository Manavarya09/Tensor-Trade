# TensorTrade Dashboard Build Status

**Date:** February 14, 2026  
**Status:** In Progress

---

## ✅ Completed Components

### 1. Dashboard Layout (`frontend-next/src/app/dashboard/layout.tsx`)
- ✅ Responsive sidebar navigation
- ✅ Top navigation bar with notifications
- ✅ Mobile-friendly menu
- ✅ Dark mode support
- ✅ Navigation items:
  - Home
  - Portfolio
  - Analyze
  - Policies
  - IPO Calendar
  - Journal
  - Voice Agent
  - Analytics
  - Settings

### 2. Dashboard Home Page (`frontend-next/src/app/dashboard/page.tsx`)
- ✅ Portfolio summary cards (Total Value, P&L, Market Regime, Risk Index)
- ✅ Quick action buttons
- ✅ Recent activity feed
- ✅ Real-time metrics display
- ✅ Loading states

### 3. Portfolio Page (`frontend-next/src/app/dashboard/portfolio/page.tsx`)
- ✅ Holdings table with all metrics
- ✅ Portfolio summary cards
- ✅ Shariah compliance scoring
- ✅ P&L tracking per asset
- ✅ Add asset modal
- ✅ Refresh functionality

---

## 🚧 Components To Build Next

### Priority 1: Core Analysis Features

#### 1. Analyze Page (`frontend-next/src/app/dashboard/analyze/page.tsx`)
**Features Needed:**
- Asset symbol input with validation
- Real-time 5-agent debate display
- Streaming analysis results
- Shariah compliance check
- Behavioral analysis display
- Economic calendar integration
- Download report button
- Share to social media

**API Integration:**
```typescript
// Connect to existing backend
POST /analyze-asset-stream?asset=AAPL&user_id=user_123
```

#### 2. Policies Page (`frontend-next/src/app/dashboard/policies/page.tsx`)
**Features Needed:**
- List all trading policies
- Create new policy (loss limit, trade frequency, position size)
- Policy templates (Conservative, Moderate, Aggressive, Islamic)
- Active/Inactive toggle
- Violation history
- Real-time policy evaluation

**Policy Types:**
- Daily loss limit
- Trade frequency cap
- Position size limit
- Stop trading after X losses
- Custom rules

#### 3. Voice Agent Page (`frontend-next/src/app/dashboard/voice/page.tsx`)
**Features Needed:**
- Schedule calling agent
- Natural language scheduling ("Every Tuesday at 9 AM")
- Call history with transcripts
- Voice settings (language, content type)
- Test call button
- Upcoming calls calendar

**Twilio Integration:**
```typescript
POST /v1/voice/schedule
{
  "phone": "+971501234567",
  "schedule": "Every Tuesday at 09:00 Dubai time",
  "content": "market_update",
  "language": "en"
}
```

### Priority 2: Supporting Features

#### 4. IPO Calendar Page (`frontend-next/src/app/dashboard/ipo/page.tsx`)
**Features Needed:**
- Upcoming IPO listings
- Shariah pre-screening
- Price range estimates
- Historical IPO performance
- Alert system for halal IPOs
- Filter by region (UAE, Saudi, Global)

#### 5. Journal Page (`frontend-next/src/app/dashboard/journal/page.tsx`)
**Features Needed:**
- Trade journal entries
- AI-powered insights
- Behavioral pattern tracking
- Export to PDF/CSV
- Search and filter
- Performance analytics

#### 6. Analytics Page (`frontend-next/src/app/dashboard/analytics/page.tsx`)
**Features Needed:**
- Advanced portfolio analytics
- Sharpe ratio, max drawdown
- Win rate trends
- Risk-adjusted returns
- Sector allocation charts
- Performance attribution

#### 7. Settings Page (`frontend-next/src/app/dashboard/settings/page.tsx`)
**Features Needed:**
- User profile
- API key management
- Notification preferences
- Shariah mode toggle
- Language selection (English/Arabic)
- Theme settings
- Subscription management

---

## 🤖 New Agents To Implement

Based on the PRD, these agents need to be created or enhanced:

### Backend Agents (Python)

#### 1. Portfolio Optimization Agent
**File:** `agents/portfolio_optimizer.py`

**Features:**
- Modern Portfolio Theory (MPT)
- Shariah-compliant constraints
- Risk-adjusted allocation
- Rebalancing recommendations

**API Endpoint:**
```python
POST /v1/portfolio/optimize
{
  "holdings": [{"symbol": "AAPL", "quantity": 10}],
  "constraints": {
    "shariah_compliant": true,
    "max_sector_exposure": 0.3,
    "risk_tolerance": "moderate"
  }
}
```

#### 2. IPO Scraper Agent
**File:** `agents/ipo_scraper.py`

**Features:**
- Scrape NYSE/NASDAQ IPO calendar
- Scrape DFM/ADX (UAE exchanges)
- Scrape Saudi Stock Exchange
- Auto-run Shariah screening
- Store in database

**Cron Job:**
```python
# Run daily at 2 AM
0 2 * * * python scripts/scrape_ipos.py
```

#### 3. Trading Policy Evaluator
**File:** `agents/policy_evaluator.py`

**Features:**
- Real-time policy evaluation
- Violation detection
- Action execution (alert, lock, auto-close)
- Policy effectiveness tracking

**Example:**
```python
def evaluate_policy(policy, trades):
    if policy.type == 'loss_limit':
        total_loss = sum(t.pnl for t in trades if t.pnl < 0)
        if abs(total_loss) >= policy.threshold:
            if policy.action == 'lock':
                lock_user_trading(user_id)
            elif policy.action == 'alert':
                send_alert(user_id, f"Policy {policy.name} violated")
```

#### 4. Enhanced Calling Agent
**File:** `agents/calling_agent.py` (already exists, needs enhancement)

**Enhancements Needed:**
- Twilio integration
- Two-way conversation support
- Voice transcription (Whisper API)
- Scheduled calls (cron)
- Call history storage

**Implementation:**
```python
import twilio
from twilio.rest import Client

def execute_call(schedule_id):
    schedule = get_calling_schedule(schedule_id)
    content = generate_call_content(schedule.user_id, schedule.content_type)
    
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    call = client.calls.create(
        url=f"{BASE_URL}/api/v1/voice/twiml?content={content}",
        to=schedule.phone,
        from_=TWILIO_PHONE_NUMBER
    )
```

#### 5. Self-Improvement Agent
**File:** `agents/self_improvement_agent.py`

**Features:**
- Collect user feedback
- Track agent accuracy
- A/B testing framework
- Model weight updates
- Prompt optimization

**Weekly Learning Job:**
```python
def weekly_learning_job():
    # 1. Evaluate agent predictions
    agent_scores = evaluate_all_agent_predictions()
    update_agent_weights(agent_scores)
    
    # 2. Refine behavioral patterns
    pattern_accuracy = analyze_behavioral_patterns()
    adjust_detection_thresholds(pattern_accuracy)
    
    # 3. Update Shariah scoring
    shariah_feedback = get_scholar_feedback()
    update_shariah_scoring_model(shariah_feedback)
```

---

## 📊 Database Schema Needed

### PostgreSQL Tables

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    phone VARCHAR(20),
    subscription_tier VARCHAR(20) DEFAULT 'free',
    shariah_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio table
CREATE TABLE portfolio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    avg_cost DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, symbol)
);

-- Trades table
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    action VARCHAR(10) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    pnl DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'OPEN',
    timestamp TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_symbol (user_id, symbol),
    INDEX idx_timestamp (timestamp DESC)
);

-- Trading policies table
CREATE TABLE trading_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    threshold DECIMAL(10, 2),
    action VARCHAR(20),
    rules JSONB,
    active BOOLEAN DEFAULT true,
    violations INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Calling schedules table
CREATE TABLE calling_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    cron VARCHAR(100) NOT NULL,
    content_type VARCHAR(50) DEFAULT 'market_update',
    language VARCHAR(5) DEFAULT 'en',
    active BOOLEAN DEFAULT true,
    next_call TIMESTAMP,
    last_call TIMESTAMP,
    total_calls INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Agent feedback table
CREATE TABLE agent_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    analysis_id VARCHAR(100),
    agent_name VARCHAR(50),
    prediction JSONB,
    actual_outcome JSONB,
    accuracy_score DECIMAL(5,2),
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    helpful BOOLEAN,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- IPO listings table
CREATE TABLE ipo_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(200) NOT NULL,
    ticker VARCHAR(20),
    exchange VARCHAR(50),
    ipo_date DATE,
    price_range_low DECIMAL(10,2),
    price_range_high DECIMAL(10,2),
    sector VARCHAR(100),
    shariah_compliant BOOLEAN,
    shariah_score INTEGER,
    market_cap_estimate BIGINT,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_policies_user ON trading_policies(user_id);
CREATE INDEX idx_schedules_user ON calling_schedules(user_id);
CREATE INDEX idx_schedules_next_call ON calling_schedules(next_call) WHERE active = true;
CREATE INDEX idx_feedback_analysis ON agent_feedback(analysis_id);
CREATE INDEX idx_ipo_date ON ipo_listings(ipo_date);
```

---

## 🔌 API Endpoints To Build

### New Endpoints Needed

```typescript
// Portfolio Management
GET  /v1/portfolio/get?user_id=user_123
POST /v1/portfolio/add
POST /v1/portfolio/optimize

// Trading Policies
GET  /v1/policies/list?user_id=user_123
POST /v1/policies/create
PUT  /v1/policies/update/:id
DELETE /v1/policies/delete/:id
POST /v1/policies/evaluate

// Voice Agent
POST /v1/voice/schedule
GET  /v1/voice/history?user_id=user_123
GET  /v1/voice/twiml
POST /v1/voice/callback

// IPO Calendar
GET  /v1/calendar/ipo?region=uae&shariah_only=true
GET  /v1/calendar/ipo/:id

// Journal
GET  /v1/journal/list?user_id=user_123
POST /v1/journal/add
GET  /v1/journal/export

// Analytics
GET  /v1/analytics/performance?user_id=user_123
GET  /v1/analytics/risk-metrics?user_id=user_123
```

---

## 🎨 UI Components To Build

### Reusable Components

```typescript
// components/ui/
- Button.tsx
- Card.tsx
- Input.tsx
- Select.tsx
- Modal.tsx
- Table.tsx
- Badge.tsx
- Alert.tsx
- Spinner.tsx
- Tabs.tsx
- Chart.tsx (already exists)
```

### Feature Components

```typescript
// components/dashboard/
- PortfolioSummary.tsx
- AssetCard.tsx
- PolicyCard.tsx
- AgentDebateDisplay.tsx
- ShariahScoreCard.tsx
- RiskMeter.tsx
- CallingScheduleCard.tsx
- IPOCard.tsx
- TradeJournalEntry.tsx
```

---

## 📱 Mobile App Enhancements

### React Native (`mobile-expo/`)

**Current Status:** Basic WebView implementation

**Enhancements Needed:**
1. Native navigation (React Navigation)
2. Push notifications (Expo Notifications)
3. Biometric authentication
4. Offline support
5. Native charts (react-native-chart-kit)
6. Voice recording for journal
7. Camera for document upload

---

## 🔐 Authentication Integration

### Options:
1. **Clerk** (Recommended)
   - Easy Next.js integration
   - OAuth providers
   - MFA support
   
2. **Supabase Auth**
   - Integrated with database
   - Row-level security
   
3. **Auth0**
   - Enterprise-grade
   - More complex setup

### Implementation:
```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

---

## 🚀 Deployment Checklist

### Frontend (Vercel)
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] API routes working
- [ ] Static assets optimized

### Backend (Railway/Vercel)
- [ ] Database connected
- [ ] Redis configured
- [ ] LLM API keys set
- [ ] Twilio credentials set
- [ ] Cron jobs scheduled

### Database (Supabase)
- [ ] Tables created
- [ ] Indexes added
- [ ] Row-level security enabled
- [ ] Backups configured

---

## 📈 Next Steps (Priority Order)

1. **Week 1-2: Database & Auth**
   - Set up Supabase
   - Create all tables
   - Integrate Clerk authentication
   - Replace mock data with real DB queries

2. **Week 3-4: Core Pages**
   - Build Analyze page
   - Build Policies page
   - Build Voice Agent page
   - Connect to existing backend APIs

3. **Week 5-6: New Agents**
   - Portfolio Optimization Agent
   - IPO Scraper Agent
   - Policy Evaluator Agent
   - Enhanced Calling Agent

4. **Week 7-8: Advanced Features**
   - IPO Calendar page
   - Journal page
   - Analytics page
   - Settings page

5. **Week 9-10: Testing & Polish**
   - Unit tests
   - Integration tests
   - E2E tests
   - UI/UX polish

6. **Week 11-12: Launch Prep**
   - Security audit
   - Performance optimization
   - Documentation
   - Marketing materials

---

## 💡 Quick Start Commands

```bash
# Install dependencies
cd frontend-next
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

---

## 📞 Support

For questions or issues:
- Email: dev@tensortrade.ai
- Slack: #tensortrade-dev
- GitHub: github.com/tensortrade/tensortrade

---

**Last Updated:** February 14, 2026  
**Next Review:** February 21, 2026
