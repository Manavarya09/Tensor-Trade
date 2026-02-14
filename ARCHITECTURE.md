# TensorTrade Architecture & Connection Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                            │
│                     http://localhost:3000                        │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                            │
│                     Port: 3000                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components:                                              │  │
│  │  • LandingPage.tsx   → Market overview                    │  │
│  │  • Dashboard.tsx     → Main trading interface             │  │
│  │  • Chart.tsx         → TradingView charts                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Configuration: frontend-next/.env.local                        │
│  • NEXT_PUBLIC_API_URL=http://localhost:8000                   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ REST API Calls
                             │ • GET /health
                             │ • GET /analyze-asset-stream
                             │ • POST /analyze-asset
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                             │
│                     Port: 8000                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Endpoints (main.py):                                 │  │
│  │  • /health              → Health check                    │  │
│  │  • /analyze-asset-stream → Real-time analysis             │  │
│  │  • /analyze-asset       → Full analysis                   │  │
│  │  • /run-agents          → Custom agent execution          │  │
│  │  • /docs                → API documentation               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Configuration: .env                                            │
│  • GROQ_API_KEY                                                │
│  • OPENROUTER_API_KEY                                          │
│  • MISTRAL_API_KEY                                             │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ Orchestrates
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI AGENT SYSTEM                             │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ LLM COUNCIL      │  │ AGENT SERVICES   │                    │
│  │ (5 Agents)       │  │                  │                    │
│  │ • Macro Hawk     │  │ • BehaviorAgent  │                    │
│  │ • Micro Forensic │  │ • NarratorAgent  │                    │
│  │ • Flow Detective │  │ • PersonaAgent   │                    │
│  │ • Tech Analyst   │  │ • RiskManager    │                    │
│  │ • Skeptic        │  │ • ModeratorAgent │                    │
│  └──────────────────┘  │ • ComplianceAgt  │                    │
│                        │ • ShariahAgent   │                    │
│                        │ • SentimentAgent │                    │
│                        └──────────────────┘                    │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ Data Sources
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Yahoo Finance API    → Market data                     │  │
│  │  • Economic Calendar    → Events & indicators             │  │
│  │  • Groq LLM            → AI processing                    │  │
│  │  • OpenRouter LLM      → AI processing                    │  │
│  │  • Mistral LLM         → AI processing                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow Example

### When user requests analysis for "AAPL":

```
1. USER ACTION
   └─> User enters "AAPL" in Dashboard
   └─> Clicks "RUN ANALYSIS"

2. FRONTEND (Dashboard.tsx)
   └─> Validates input
   └─> Makes HTTP request:
       GET http://localhost:8000/analyze-asset-stream?asset=AAPL&user_id=user123

3. BACKEND (main.py)
   └─> Receives request at /analyze-asset-stream
   └─> Validates symbol using AssetValidator
   └─> Initiates streaming response
   
4. DATA COLLECTION (Sequential)
   ├─> Trade History Service → User's past trades
   ├─> Economic Calendar → Upcoming events
   ├─> Market Metrics → VIX, market regime
   └─> Yahoo Finance → Current price & volume

5. AI AGENT COUNCIL (Parallel Debate)
   ├─> Macro Hawk → Analyzes macroeconomic factors
   ├─> Micro Forensic → Deep dives into fundamentals
   ├─> Flow Detective → Studies money flow patterns
   ├─> Tech Interpreter → Technical chart analysis
   └─> Skeptic → Devil's advocate view
   
6. SYNTHESIS
   ├─> Judge synthesizes consensus & disagreements
   ├─> Behavioral Agent → Detects psychological patterns
   ├─> Risk Manager → Calculates risk metrics
   ├─> Narrator → Creates personalized message
   └─> Moderator → Ensures content safety

7. STREAMING RESPONSE
   └─> Backend sends JSON chunks:
       {"type": "status", "message": "Fetching market data..."}
       {"type": "trade_history", "data": {...}}
       {"type": "council_debate", "data": {...}}
       {"type": "complete", "data": {...}}

8. FRONTEND PROCESSING
   └─> Dashboard receives stream
   └─> Updates UI in real-time:
       • Status messages
       • Council opinions
       • Charts
       • Analysis results

9. USER SEES RESULTS
   └─> Complete analysis displayed
   └─> Interactive charts rendered
   └─> Actions available:
       • Download summary
       • Play audio
       • Share on social
```

## 📡 API Communication Details

### Request Format
```javascript
// Frontend makes request
fetch('http://localhost:8000/analyze-asset-stream?asset=AAPL&user_id=trader123')
```

### Response Format (Streaming NDJSON)
```json
{"type": "status", "message": "Validating symbol AAPL..."}
{"type": "trade_history", "data": {"total_trades": 42, "win_rate": 58.5}}
{"type": "economic_data", "data": {"events": [...]}}
{"type": "behavior_analysis", "data": {"flags": [...]}}
{"type": "council_debate", "data": {"agent_arguments": [...]}}
{"type": "complete", "data": { /* Full analysis */ }}
```

## 🔐 Environment Configuration

### Backend (.env)
```env
# AI Service Keys
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxx
MISTRAL_API_KEY=xxxxxxxxxxxxx

# Server Config
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development

# CORS
CORS_ORIGINS=http://localhost:3000
```

### Frontend (frontend-next/.env.local)
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional
NEXT_PUBLIC_DEMO_MODE=false
```

## 🚀 Startup Sequence

### Automatic Startup (start-all.ps1)
```
1. Check .env file exists
2. Create/activate Python virtual environment
3. Install backend dependencies
4. Start backend server (Port 8000) in new window
5. Install frontend dependencies
6. Start frontend server (Port 3000) in new window
7. Both services running and connected
```

### Manual Startup
```powershell
# Terminal 1 - Backend
cd c:\Users\kndn2\Desktop\tensortrade-v1
.\venv\Scripts\Activate.ps1
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Frontend
cd c:\Users\kndn2\Desktop\tensortrade-v1\frontend-next
npm run dev
```

## 🔍 Key Integration Points

### 1. API Base URL Configuration
```typescript
// Dashboard.tsx
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

### 2. CORS Configuration
```python
# main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Streaming Connection
```typescript
// Frontend handles streaming response
const response = await fetch(`${API_BASE_URL}/analyze-asset-stream?asset=${asset}`);
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    // Process JSON chunks
}
```

## 📊 Data Flow

```
User Input → Frontend Validation → Backend API → Asset Validation
                                                        ↓
                                                Trade History Service
                                                        ↓
                                                Economic Calendar
                                                        ↓
                                                Market Data (yfinance)
                                                        ↓
                                                LLM Council Debate
                                                        ↓
                                                Behavioral Analysis
                                                        ↓
                                                Risk Assessment
                                                        ↓
                                                Narrative Generation
                                                        ↓
Frontend Display ← JSON Stream ← Moderation ← Synthesis
```

## 🎯 Component Responsibilities

### Frontend (Next.js)
✅ User interface & interactions  
✅ Real-time updates via streaming  
✅ Chart visualization  
✅ State management  
✅ Demo mode for testing  

### Backend (FastAPI)
✅ Request validation  
✅ Agent orchestration  
✅ Data aggregation  
✅ Streaming responses  
✅ Error handling  

### AI Agents
✅ Multi-perspective analysis  
✅ Behavioral pattern detection  
✅ Risk assessment  
✅ Content moderation  
✅ Personalized narratives  

### External Services
✅ Market data (Yahoo Finance)  
✅ LLM processing (Groq, OpenRouter, Mistral)  
✅ Economic events (Calendar API)  

---

**This architecture enables:**
- Real-time analysis with streaming updates
- Multi-perspective insights via agent debates
- Personalized feedback based on trading psychology
- Scalable microservices design
- Easy testing with demo mode
