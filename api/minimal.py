"""
Ultra-minimal Vercel test
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Minimal Test")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Minimal test working",
        "env_check": {
            "groq": "set" if os.getenv("GROQ_API_KEY") else "not set",
            "openrouter": "set" if os.getenv("OPENROUTER_API_KEY") else "not set",
            "mistral": "set" if os.getenv("MISTRAL_API_KEY") else "not set",
        }
    }

