# Frontend-Backend Connection Setup Guide

This guide explains how to connect and run the TensorTrade frontend and backend together.

## 📋 Prerequisites

Before you start, make sure you have installed:

- **Python 3.10+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)

## 🔑 Step 1: Configure API Keys

The backend requires API keys to function. You need to sign up for free API keys from:

1. **Groq API** - https://console.groq.com/
2. **OpenRouter API** - https://openrouter.ai/
3. **Mistral API** - https://console.mistral.ai/

### Add Your API Keys

1. Open the `.env` file in the root directory
2. Replace the empty values with your actual API keys:

```env
GROQ_API_KEY=gsk_your_actual_key_here
OPENROUTER_API_KEY=sk-or-your_actual_key_here
MISTRAL_API_KEY=your_actual_mistral_key_here
```

**Important:** Never commit the `.env` file with real API keys to Git!

## 🚀 Step 2: Running the Application

You have three options to start the application:

### Option A: Start Everything Together (Recommended)

Run both frontend and backend simultaneously in separate windows:

```powershell
.\start-all.ps1
```

This will open two PowerShell windows:
- Backend server on `http://localhost:8000`
- Frontend server on `http://localhost:3000`

### Option B: Start Backend Only

```powershell
.\start-backend.ps1
```

The backend API will be available at:
- API: `http://localhost:8000`
- Interactive API docs: `http://localhost:8000/docs`

### Option C: Start Frontend Only

```powershell
.\start-frontend.ps1
```

The frontend will be available at `http://localhost:3000`

**Note:** The frontend requires the backend to be running to fetch real data. If the backend is not running, use "Demo Mode" in the frontend.

## 🔗 How They Connect

### Backend (FastAPI)
- Runs on port **8000**
- Provides REST API endpoints
- Main endpoints:
  - `GET /health` - Health check
  - `GET /analyze-asset-stream?asset=AAPL&user_id=user123` - Streaming analysis
  - `POST /analyze-asset` - Non-streaming analysis
  - `GET /api` - API information

### Frontend (Next.js)
- Runs on port **3000**
- Connects to backend via `http://localhost:8000`
- Configuration in `frontend-next/.env.local`:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```

### Connection Flow

```
┌─────────────────┐         HTTP Request          ┌─────────────────┐
│                 │  ──────────────────────────>  │                 │
│   Frontend      │                               │    Backend      │
│   (Next.js)     │  <────────────────────────    │    (FastAPI)    │
│   Port 3000     │         JSON Response         │    Port 8000    │
└─────────────────┘                               └─────────────────┘
```

## 🧪 Testing the Connection

### 1. Test Backend Health

Open a browser and go to: `http://localhost:8000/health`

You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-02-14T...",
  "version": "2.0.0"
}
```

### 2. Test API Documentation

Visit: `http://localhost:8000/docs`

This shows the interactive Swagger UI with all available endpoints.

### 3. Test Frontend

1. Open: `http://localhost:3000`
2. You should see the TensorTrade landing page
3. Click "ENTER DASHBOARD"
4. Enter an asset symbol (e.g., `AAPL`)
5. Click "RUN ANALYSIS"

If the connection is working:
- You'll see status messages updating in real-time
- Council opinions will appear
- Analysis results will be displayed

### 4. Test Demo Mode

If you want to test the frontend without the backend:
1. Check the "DEMO MODE" checkbox
2. Run analysis - it will use mock data

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`
**Solution:** Install dependencies:
```powershell
pip install -r requirements.txt
```

**Problem:** Backend starts but API returns errors
**Solution:** Check that your API keys are valid in `.env`

**Problem:** Port 8000 already in use
**Solution:** 
- Find and kill the process using port 8000
- Or change the port in `.env` and `frontend-next/.env.local`

### Frontend Issues

**Problem:** `Cannot find module` errors
**Solution:** Install dependencies:
```powershell
cd frontend-next
npm install
```

**Problem:** Frontend can't connect to backend
**Solution:** 
1. Make sure backend is running on port 8000
2. Check `frontend-next/.env.local` has correct API URL
3. Check browser console for CORS errors

**Problem:** Analysis returns "Invalid asset symbol"
**Solution:** Make sure you're using valid stock symbols (e.g., AAPL, MSFT, TSLA)

### CORS Issues

If you see CORS errors in the browser console:

1. Check that the backend allows your frontend origin
2. In `main.py`, the CORS middleware should include:
```python
allow_origins=["*"]  # Or specifically ["http://localhost:3000"]
```

## 📝 Development Tips

### Hot Reload

Both services support hot reload:
- **Backend:** Changes to `.py` files automatically restart the server
- **Frontend:** Changes to `.tsx`/`.ts` files automatically refresh the page

### Debugging

**Backend:**
- Check terminal output for error messages
- Use `logger.info()` to add debug statements
- View logs in the terminal where backend is running

**Frontend:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab to see API requests

### Environment Variables

**Backend:** `.env` in root directory
```env
GROQ_API_KEY=...
OPENROUTER_API_KEY=...
MISTRAL_API_KEY=...
PORT=8000
```

**Frontend:** `frontend-next/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🌐 Deployment

For production deployment:

1. **Backend:** Deploy to Vercel/Railway/Render
   - Set environment variables in hosting platform
   - Backend URL will be something like `https://your-app.vercel.app`

2. **Frontend:** Deploy to Vercel/Netlify
   - Update `NEXT_PUBLIC_API_URL` to your production backend URL
   - Build command: `npm run build`
   - Start command: `npm start`

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Main README](../README.md) - Full project documentation

## 🆘 Getting Help

If you encounter issues:

1. Check this guide for solutions
2. Review the error messages in terminal/console
3. Check that all prerequisites are installed
4. Verify API keys are valid
5. Try demo mode to isolate frontend vs backend issues

## ✅ Quick Checklist

Before running the application:

- [ ] Python 3.10+ installed
- [ ] Node.js 18+ installed
- [ ] API keys added to `.env`
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`cd frontend-next && npm install`)
- [ ] Ports 3000 and 8000 are available

Ready to run:
```powershell
.\start-all.ps1
```

Visit: `http://localhost:3000` 🚀
