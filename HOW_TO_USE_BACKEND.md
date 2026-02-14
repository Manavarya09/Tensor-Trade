# 🎯 HOW TO USE TENSORTRADE - BACKEND FEATURES GUIDE

## ⚠️ IMPORTANT: The Backend IS Working!

Your backend is running and functional. Here's how to actually USE it:

---

## 🧪 STEP 1: Test BackEnd Connection (NEW!)

### Visit: http://localhost:3000/test

1. **Open the test page** in your browser
2. **Click "RUN CONNECTION TESTS"** button
3. **Wait for results** - you'll see:
   - ✅ Backend Health check
   - ✅ API endpoints accessible
   - ✅ Analysis test (may timeout - this is NORMAL)

**If you see green checkmarks** = Backend IS connected! ✅

---

## 📊 STEP 2: Use Main Dashboard

### Visit: http://localhost:3000

### Method A: Quick Demo (Instant Results)
Perfect for testing UI without waiting:

1. **Check "DEMO MODE" checkbox** ✅
2. **Enter any symbol** (e.g., AAPL)
3. **Click "GENERATE REPORT"**
4. **See instant results** (uses mock data)

### Method B: Real Backend Analysis (15-20 seconds)
Gets real AI analysis from backend:

1. **Uncheck "DEMO MODE"** checkbox ❌
2. **Enter a real stock symbol** (e.g., AAPL, MSFT, TSLA)
3. **Click "GENERATE REPORT"**
4. **Wait 15-20 seconds** ⏳ (backend is running 5 AI agents!)
5. **Watch status messages update** in real-time
6. **See full AI analysis** appear

---

## 🤖 STEP 3: Use Agent Actions Panel

In the **LEFT COLUMN** of dashboard:

### What You'll See:
A panel titled **"AGENT ACTIONS"** with 5 clickable cards:

1. **5-Agent LLM Council** 🧠
   - Click to run multi-perspective analysis
   - Backend calls 5 different AI agents
   - Takes 15-20 seconds

2. **Risk Manager** 🛡️
   - Click to get risk assessment
   - Calculates VaR and drawdown
   - Takes 10-15 seconds

3. **Behavior Monitor** ⚠️
   - Click to detect trading patterns
   - Identifies FOMO, revenge trading, etc.
   - Takes 5-10 seconds

4. **Sentiment Analyzer** 📈
   - Click for market sentiment
   - Analyzes news and social media
   - Takes 10-15 seconds

5. **Compliance Check** 📄
   - Click for regulatory compliance
   - Checks SEC and Shariah compliance
   - Takes 5-10 seconds

### How to Use:
1. **Enter stock symbol** at top (e.g., AAPL)
2. **Click ANY agent card**
3. **Wait for "RUNNING..." message**
4. **Results appear in main dashboard**

---

## 📞 STEP 4: Use Calling Agent

In the **LEFT COLUMN** of dashboard:

### What You'll See:
A panel titled **"AI CALLING AGENT"** with:

#### Immediate Call Section:
1. **Enter phone number** (e.g., +1-555-123-4567)
2. **Optional: Add custom message**
3. **Click "TRIGGER CALL NOW"**
4. **Backend processes call request**
5. **See success message**

#### Schedule Call Section:
1. **Enter phone number**
2. **Select date/time** for first call
3. **Click "SCHEDULE DAILY CALLS"**
4. **Backend creates recurring schedule**

### Backend API Called:
- Immediate: `POST /calls/outbound`
- Schedule: `POST /calls/schedule`
- Logs: `GET /calls/logs/{user_id}`

---

## 🔍 STEP 5: View Results

After running any analysis, you'll see:

### Main Dashboard Display:
- **Key Market Drivers** - 5 agent opinions
- **AI Narrative** - Personalized message
- **Charts** - Price and volume data
- **Behavioral Insights** - Trading patterns
- **Risk Metrics** - VaR and drawdown

### What Backend Does:
1. Validates stock symbol
2. Fetches market data (Yahoo Finance)
3. Runs 5 AI agents in parallel
4. Analyzes trading psychology
5. Calculates risk metrics
6. Generates narrative
7. Streams results back to frontend

---

## ⏱️ WHY DOES IT TAKE TIME?

### Backend Processing Steps:
1. **Asset Validation** - 1 second
2. **Market Data** - 2-3 seconds
3. **5 LLM Agents** - 10-15 seconds (AI processing)
4. **Synthesis** - 2-3 seconds
5. **Total** - 15-20 seconds

**This is NORMAL!** Real AI takes time.

### If You Want Instant Results:
- Use **DEMO MODE** checkbox ✅
- Perfect for testing UI
- No backend calls made

---

## 🐛 TROUBLESHOOTING

### "Nothing happens when I click"

**Check:**
1. Open browser DevTools (Press F12)
2. Go to "Console" tab
3. Look for errors in red
4. Look for "Failed to fetch" or "CORS" errors

**Solutions:**
- Backend might have stopped → Restart it
- CORS issue → Check backend CORS settings
- Network error → Check both servers running

### "Analysis times out"

**This is NORMAL!** LLM processing takes time.

**Try:**
- Use streaming endpoint (already configured)
- Use demo mode for testing
- Wait longer (up to 30 seconds)
- Check backend terminal for errors

### "Can't see Calling Agent or Agent Actions panels"

**Check:**
1. Scroll down on dashboard (left column)
2. Panels are below "Analysis Setup"
3. Browser window might be too small
4. Try refreshing page (Ctrl+R)

### "Gets stuck on 'ANALYZING...'"

**Reasons:**
- Backend is actually working (check backend terminal)
- API response is slow (LLM processing)
- Network timeout

**Solutions:**
- Check backend terminal for output
- Wait 30 seconds total
- Use demo mode instead
- Check http://localhost:8000/docs for direct API testing

---

## 🎮 RECOMMENDED TESTING FLOW

### First Time:
1. ✅ Visit http://localhost:3000/test
2. ✅ Click "RUN CONNECTION TESTS"
3. ✅ Verify checkmarks appear
4. ✅ Open http://localhost:3000
5. ✅ Try DEMO MODE first (instant)
6. ✅ Then try real analysis (15-20 sec wait)

### Regular Use:
1. Open dashboard: http://localhost:3000
2. Enter stock symbol
3. Click "GENERATE REPORT"
4. Wait for results
5. Or click specific agent for targeted analysis

---

## 📱 BACKEND API ENDPOINTS (Direct Access)

You can test backend directly:

### Browser URLs:
- Health: http://localhost:8000/health
- API Docs: http://localhost:8000/docs
- API Info: http://localhost:8000/api

### Interactive Testing:
1. Open: http://localhost:8000/docs
2. Find `GET /analyze-asset-stream`
3. Click "Try it out"
4. Enter: asset=AAPL, user_id=test
5. Click "Execute"
6. See backend response directly

---

## ✅ VERIFICATION CHECKLIST

Before using, verify:

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] http://localhost:8000/health returns "healthy"
- [ ] http://localhost:3000 loads dashboard
- [ ] http://localhost:3000/test shows connection tests
- [ ] Browser console (F12) shows no errors
- [ ] Both PowerShell windows are open

---

## 💡 PRO TIPS

1. **Fast Testing**: Use Demo Mode checkbox
2. **Real Analysis**: Uncheck Demo Mode, wait 20 seconds
3. **Targeted Analysis**: Click specific agent cards
4. **Phone Calls**: Use Calling Agent panel
5. **API Docs**: Visit /docs for direct backend testing
6. **Console**: Keep F12 DevTools open to see requests

---

## 🚀 EXAMPLE: Full Workflow

1. **Open dashboard**: http://localhost:3000
2. **Enter symbol**: AAPL
3. **Uncheck demo mode**: Want real analysis
4. **Click "GENERATE REPORT"**: Starts backend processing
5. **Watch status**: "Fetching market data..."
6. **Wait 15-20 seconds**: Backend runs 5 AI agents
7. **See results**: Council opinions, charts, narrative
8. **Try agent**: Click "Risk Manager" in Agent Actions
9. **Try calling**: Scroll to Calling Agent panel
10. **Enter phone**: +1-555-123-4567
11. **Click trigger**: Backend processes call

---

## 🆘 STILL NOT WORKING?

### Check Backend Terminal:
- Look for error messages
- See if requests are coming in
- Verify AI agents are running

### Check Frontend Console (F12):
- Look for network errors
- Check fetch() calls
- Verify URLs are correct

### Check Both Running:
```powershell
netstat -ano | findstr ":8000 :3000"
```
Should show both ports LISTENING

### Restart Everything:
```powershell
# Stop all
# Close PowerShell windows

# Start again
.\start-all.ps1
```

---

**Your backend IS working! It just needs time to process AI requests. Use the test page and demo mode to verify everything is connected.** 🎉
