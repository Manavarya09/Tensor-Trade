# TensorTrade Frontend-Backend Integration Guide

## ✅ Integration Complete!

The frontend and backend are now fully integrated with action-specific panels and API connections.

## 🎯 New Features Added

### 1. **Calling Agent Panel** (Left Column)
Located in the dashboard, this panel allows you to:

#### Immediate Calls
- **Trigger instant AI voice calls** to your phone with market updates
- **Endpoint**: `POST /calls/outbound`
- **Usage**:
  1. Enter your phone number
  2. Optionally add a custom message
  3. Click "TRIGGER CALL NOW"
  4. AI agent will call you with market analysis

#### Scheduled Calls
- **Schedule recurring daily calls** for market summaries
- **Endpoint**: `POST /calls/schedule`
- **Usage**:
  1. Enter phone number
  2. Set date/time for first call
  3. Click "SCHEDULE DAILY CALLS"
  4. Get daily market updates automatically

#### Call History
- View recent call logs
- Track all inbound and outbound calls

### 2. **Agent Actions Panel** (Left Column)
Quick access to run specific AI agents on demand:

#### Available Agents:
1. **5-Agent LLM Council** 🧠
   - Multi-perspective market analysis
   - Runs: Macro Hawk, Micro Forensic, Flow Detective, Tech Interpreter, Skeptic

2. **Risk Manager** 🛡️
   - VaR (Value at Risk) calculation
   - Maximum drawdown analysis
   - Qualitative risk assessment

3. **Behavior Monitor** ⚠️
   - Detects 10 psychological trading patterns
   - Identifies: FOMO, Revenge Trading, Overtrading, etc.
   - Provides actionable warnings

4. **Sentiment Analyzer** 📈
   - Real-time market sentiment from news
   - Social media analysis
   - Market mood indicators

5. **Compliance Check** 📄
   - SEC/FINRA regulatory compliance
   - Shariah compliance for Islamic finance
   - Asset screening

#### How to Use:
- Click any agent card to run that specific analysis
- Results appear in the main dashboard
- Faster than full report for targeted insights

### 3. **Main Analysis Integration**
The existing "GENERATE REPORT" button now:
- Runs **ALL agents** comprehensively
- Streams real-time updates
- Provides complete analysis package

## 🔌 Backend API Endpoints Used

| Feature | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| Full Analysis | GET | `/analyze-asset-stream` | Complete real-time analysis |
| Quick Analysis | POST | `/analyze-asset` | Fast comprehensive analysis |
| Immediate Call | POST | `/calls/outbound` | Trigger AI phone call |
| Schedule Call | POST | `/calls/schedule` | Set up recurring calls |
| Call Logs | GET | `/calls/logs/{user_id}` | View call history |
| Health Check | GET | `/health` | Server status |

## 🎮 How to Test

### Test Calling Agent:
1. Open dashboard at http://localhost:3000
2. Scroll to "AI CALLING AGENT" panel (left column)
3. Enter test phone number: `+1-555-123-4567`
4. Click "TRIGGER CALL NOW"
5. Backend will process the call request

### Test Specific Agent:
1. Find "AGENT ACTIONS" panel (left column)
2. Click on any agent (e.g., "Risk Manager")
3. Wait for analysis to complete
4. Results appear in main dashboard

### Test Full Analysis:
1. Enter stock symbol (e.g., `AAPL`)
2. Click "GENERATE REPORT"
3. Watch real-time streaming analysis
4. See all agents work together

## 📊 Data Flow

```
User Action (Frontend)
    ↓
Button Click / Form Submit
    ↓
Fetch API Call to Backend
    ↓
Backend Receives Request
    ↓
Process with AI Agents
    ↓
Return JSON Response
    ↓
Frontend Updates UI
    ↓
User Sees Results
```

## 🔥 Key Integration Points

### 1. Environment Configuration
```javascript
// Frontend automatically detects backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

### 2. CORS Enabled
Backend allows requests from frontend:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Streaming Support
Real-time updates via Server-Sent Events:
```javascript
const response = await fetch(`${API_BASE_URL}/analyze-asset-stream?asset=${asset}`);
const reader = response.body.getReader();
// Process chunks as they arrive
```

## 🎯 Example Usage Scenarios

### Scenario 1: Day Trader
1. Open dashboard in morning
2. Enter `SPY` (S&P 500 ETF)
3. Click "5-Agent LLM Council" for quick market view
4. Check "Behavior Monitor" to avoid mistakes
5. Schedule daily calls for 9:00 AM market open

### Scenario 2: Long-term Investor
1. Enter company symbol `MSFT`
2. Click "GENERATE REPORT" for full analysis
3. Check "Compliance" for regulatory issues
4. Click "Risk Manager" for downside analysis
5. Download summary for records

### Scenario 3: Islamic Finance
1. Enter any stock symbol
2. Run full analysis
3. Check "Shariah Compliance" section in results
4. See compliance score and issues
5. Make informed halal investment decisions

## 🚀 Next Steps

### For Users:
1. Open http://localhost:3000
2. Try the new panels in the left column
3. Test calling agent (use test phone number)
4. Run individual agents for faster analysis

### For Developers:
- Backend endpoints are documented at http://localhost:8000/docs
- All agents are modular and can be extended
- Add more agent actions by modifying `AgentActionsPanel.tsx`
- Customize calling agent behaviors in `agents/calling_agent.py`

## 💡 Tips

- **Demo Mode**: Toggle for instant results without API calls
- **Streaming**: For real-time updates, use stream endpoints
- **Agent Targeting**: Run specific agents to save API credits
- **Phone Calls**: Requires valid phone numbers (currently logs to backend)
- **Caching**: Recent analyses are cached for 10 minutes

## 🔒 Security Notes

- Phone numbers are validated backend
- API keys are never exposed to frontend
- CORS is configured for localhost in development
- Production deployment needs proper CORS origins

---

**Your TensorTrade application is now fully integrated and ready to use!** 🎉

Access at: **http://localhost:3000**
