"""
LLM Client for 5-agent debate system.
Supports multiple LLM providers: OpenRouter, Gemini, Mistral
"""
import json
import logging
from typing import Optional
from abc import ABC, abstractmethod
import requests
import asyncio
import aiohttp

logger = logging.getLogger(__name__)


class LLMProvider(ABC):
    """Abstract base for LLM providers."""
    
    @abstractmethod
    def complete(self, prompt: str, system: str = "", temperature: float = 0.7) -> str:
        pass


class OpenRouterProvider(LLMProvider):
    """OpenRouter provider for free tier models."""
    
    def __init__(self, api_key: str, model: str):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://openrouter.ai/api/v1"
    
    def complete(self, prompt: str, system: str = "", temperature: float = 0.7) -> str:
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "HTTP-Referer": "https://llm-council.local",
                "X-Title": "LLM Council",
                "Content-Type": "application/json"
            }
            
            messages = []
            if system:
                messages.append({"role": "system", "content": system})
            messages.append({"role": "user", "content": prompt})
            
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": 2000
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"]
            else:
                logger.error(f"OpenRouter error: {response.status_code}")
                return f"Error: {response.status_code}"
        except Exception as e:
            logger.error(f"OpenRouter error: {e}")
            return f"Error: {str(e)}"
    
    async def complete_async(self, prompt: str, system: str = "", temperature: float = 0.7) -> str:
        """Async version for parallel execution."""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "HTTP-Referer": "https://llm-council.local",
                "X-Title": "LLM Council",
                "Content-Type": "application/json"
            }
            
            messages = []
            if system:
                messages.append({"role": "system", "content": system})
            messages.append({"role": "user", "content": prompt})
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json={
                        "model": self.model,
                        "messages": messages,
                        "temperature": temperature,
                        "max_tokens": 2000
                    },
                    timeout=aiohttp.ClientTimeout(total=60)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result["choices"][0]["message"]["content"]
                    else:
                        logger.error(f"OpenRouter error: {response.status}")
                        return f"Error: {response.status}"
        except Exception as e:
            logger.error(f"OpenRouter async error: {e}")
            return f"Error: {str(e)}"


class GeminiProvider(LLMProvider):
    """Google Gemini provider."""
    
    def __init__(self, api_key: str, model: str = "gemini-1.5-flash"):
        self.api_key = api_key
        self.model = model
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            self.client = genai.GenerativeModel(model)
        except ImportError:
            logger.warning("google-generativeai not installed")
            self.client = None
    
    def complete(self, prompt: str, system: str = "", temperature: float = 0.7) -> str:
        if not self.client:
            return "Error: Gemini client not initialized"
        
        try:
            full_prompt = f"{system}\n\n{prompt}" if system else prompt
            response = self.client.generate_content(
                full_prompt,
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": 2000
                }
            )
            return response.text
        except Exception as e:
            logger.error(f"Gemini error: {e}")
            return f"Error: {str(e)}"


class MistralProvider(LLMProvider):
    """Mistral.ai provider."""
    
    def __init__(self, api_key: str, model: str = "mistral-large-latest"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://api.mistral.ai/v1"
    
    def complete(self, prompt: str, system: str = "", temperature: float = 0.7) -> str:
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            messages = []
            if system:
                messages.append({"role": "system", "content": system})
            messages.append({"role": "user", "content": prompt})
            
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": 2000
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"]
            else:
                logger.error(f"Mistral error: {response.status_code}")
                return f"Error: {response.status_code}"
        except Exception as e:
            logger.error(f"Mistral error: {e}")
            return f"Error: {str(e)}"
    
    async def complete_async(self, prompt: str, system: str = "", temperature: float = 0.7) -> str:
        """Async version for parallel execution."""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            messages = []
            if system:
                messages.append({"role": "system", "content": system})
            messages.append({"role": "user", "content": prompt})
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json={
                        "model": self.model,
                        "messages": messages,
                        "temperature": temperature,
                        "max_tokens": 2000
                    },
                    timeout=aiohttp.ClientTimeout(total=60)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result["choices"][0]["message"]["content"]
                    else:
                        logger.error(f"Mistral error: {response.status}")
                        return f"Error: {response.status}"
        except Exception as e:
            logger.error(f"Mistral async error: {e}")
            return f"Error: {str(e)}"


class LLMClient:
    """Unified LLM client for debate system."""
    
    def __init__(self, provider_type: str, api_key: Optional[str] = None, model: Optional[str] = None, **kwargs):
        """
        Initialize LLM client.
        
        Args:
            provider_type: "openrouter", "gemini", or "mistral"
            api_key: API key for the provider
            model: Model identifier (required for openrouter)
        """
        if provider_type == "openrouter":
            if not model:
                raise ValueError("model required for OpenRouter")
            self.provider = OpenRouterProvider(api_key or "", model)
        elif provider_type == "gemini":
            self.provider = GeminiProvider(api_key or "", model or "gemini-pro")
        elif provider_type == "mistral":
            self.provider = MistralProvider(api_key or "", model or "mistral-large-latest")
        else:
            raise ValueError(f"Unknown provider: {provider_type}")
        
        self.call_count = 0
        self.token_estimate = 0
    
    def complete(self, prompt: str, system: str = "", temperature: float = 0.7) -> str:
        """Get a text completion."""
        try:
            response = self.provider.complete(prompt, system, temperature)
            self.call_count += 1
            self.token_estimate += len(prompt.split()) + len(response.split())
            logger.info(f"LLM call {self.call_count} succeeded")
            return response
        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            raise
    
    async def complete_async(self, prompt: str, system: str = "", temperature: float = 0.7) -> str:
        """Get a text completion asynchronously."""
        try:
            # For Gemini, we don't have async yet, so use sync in executor
            if isinstance(self.provider, GeminiProvider):
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    None, 
                    self.provider.complete, 
                    prompt, 
                    system, 
                    temperature
                )
            else:
                response = await self.provider.complete_async(prompt, system, temperature)
            
            self.call_count += 1
            self.token_estimate += len(prompt.split()) + len(response.split())
            logger.info(f"LLM call {self.call_count} succeeded")
            return response
        except Exception as e:
            logger.error(f"LLM async call failed: {e}")
            raise
    
    def get_stats(self) -> dict:
        """Get usage statistics."""
        return {
            "call_count": self.call_count,
            "estimated_tokens": self.token_estimate
        }
