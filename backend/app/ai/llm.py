import os
import httpx
import json

from app.config import settings


def call_llm(prompt: str, max_tokens: int = 600) -> str:
    """Call an LLM if keys are configured, otherwise return empty (mock fallback)."""
    if settings.USE_MOCK_AI:
        return ""

    if settings.OPENAI_API_KEY:
        try:
            resp = httpx.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                json={
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": max_tokens,
                },
                timeout=30,
            )
            return resp.json()["choices"][0]["message"]["content"]
        except Exception:
            return ""

    if settings.GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
            resp = httpx.post(
                url,
                json={"contents": [{"parts": [{"text": prompt}]}]},
                timeout=30,
            )
            return resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            return ""

    return ""
