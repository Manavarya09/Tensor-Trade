# 🚀 TensorTrade - Quick Start Guide

## ⚡ Fastest Way to Start

### Option 1: Double-Click to Start (Windows)
1. Double-click `START.bat` 
2. Both servers will start automatically
3. Visit http://localhost:3000

### Option 2: PowerShell Command
```powershell
.\start-all.ps1
```

---

## 📦 What You Need

### 1️⃣ Install Software
- Python 3.10+ → https://python.org
- Node.js 18+ → https://nodejs.org

### 2️⃣ Get API Keys (Free)
- Groq → https://console.groq.com/
- OpenRouter → https://openrouter.ai/
- Mistral → https://console.mistral.ai/

### 3️⃣ Add Keys to `.env`
```env
GROQ_API_KEY=gsk_your_key_here
OPENROUTER_API_KEY=sk-or-your_key_here
MISTRAL_API_KEY=your_key_here
```

---

## 🎯 Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main web interface |
| **Backend API** | http://localhost:8000 | API server |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |
| **Health Check** | http://localhost:8000/health | Server status |

---

## 🏃 Running Individual Services

### Backend Only
```powershell
.\start-backend.ps1
```

### Frontend Only
```powershell
.\start-frontend.ps1
```

---

## 🔧 First Time Setup

Run these commands once:

```powershell
# Install backend dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd frontend-next
npm install
cd ..
```

The startup scripts will do this automatically if needed.

---

## ✅ Testing the Connection

1. **Start both servers:** `.\start-all.ps1`
2. **Open frontend:** http://localhost:3000
3. **Enter dashboard** → Click "ENTER DASHBOARD"
4. **Enter a symbol:** Type "AAPL"
5. **Run analysis:** Click "RUN ANALYSIS"
6. **Watch the magic** ✨

### Demo Mode (No Backend Required)
- Check "DEMO MODE" checkbox to test without backend
- Uses mock data for testing frontend only

---

## 🐛 Common Issues & Fixes

### "Module not found" errors
```powershell
pip install -r requirements.txt
cd frontend-next && npm install
```

### "Port already in use"
Kill the process or change ports in `.env`

### Backend starts but analysis fails
Check that API keys are valid in `.env`

### Frontend can't connect
Make sure backend is running on port 8000

---

## 📁 Key Files Created

| File | Purpose |
|------|---------|
| `.env` | Backend API keys & configuration |
| `.env.example` | Template for API keys |
| `frontend-next/.env.local` | Frontend configuration |
| `start-all.ps1` | Start both servers |
| `start-backend.ps1` | Start backend only |
| `start-frontend.ps1` | Start frontend only |
| `START.bat` | Quick start (double-click) |
| `SETUP_GUIDE.md` | Detailed setup instructions |

---

## 🌟 Features

✅ Real-time streaming analysis  
✅ 5-agent LLM debate council  
✅ Behavioral pattern detection  
✅ Economic calendar integration  
✅ Shariah compliance checking  
✅ Interactive charts  
✅ Multiple persona styles  
✅ Trade history tracking  

---

## 📖 More Info

- **Detailed Setup:** See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Full Documentation:** See [README.md](README.md)
- **API Endpoints:** Visit http://localhost:8000/docs

---

## 🆘 Need Help?

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for troubleshooting
2. Verify API keys in `.env`
3. Check terminal/console for error messages
4. Try Demo Mode to isolate issues

---

**Ready? Let's go!** 🚀

```powershell
.\start-all.ps1
```
