"""
Economic Calendar Service
Fetches economic events and earnings data that may impact stocks.
"""

import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import yfinance as yf

logger = logging.getLogger(__name__)


class EconomicCalendarService:
    """Service to fetch economic events and earnings calendar."""
    
    def __init__(self):
        self.cache = {}
        self.cache_duration = timedelta(hours=1)
    
    def get_stock_events(self, symbol: str) -> Dict:
        """
        Get upcoming economic events and earnings for a stock.
        
        Args:
            symbol: Stock ticker symbol
            
        Returns:
            Dict with earnings, news, and economic indicators
        """
        try:
            ticker = yf.Ticker(symbol)
            
            # Get earnings dates
            earnings = self._get_earnings_calendar(ticker, symbol)
            
            # Get recent news
            news = self._get_recent_news(ticker)
            
            # Get economic indicators (for major indices)
            economic_events = self._get_economic_indicators(symbol)
            
            return {
                "symbol": symbol,
                "earnings_calendar": earnings,
                "recent_news": news,
                "economic_events": economic_events,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error fetching events for {symbol}: {e}")
            return self._get_fallback_events(symbol)
    
    def _get_earnings_calendar(self, ticker, symbol: str) -> Dict:
        """Get earnings dates and estimates."""
        try:
            info = ticker.info
            
            earnings_data = {
                "next_earnings_date": info.get("earningsDate"),
                "last_earnings_date": info.get("mostRecentQuarter"),
                "earnings_estimate": {
                    "eps_estimate": info.get("forwardEps"),
                    "revenue_estimate": info.get("revenueEstimate")
                },
                "last_reported": {
                    "eps": info.get("trailingEps"),
                    "revenue": info.get("totalRevenue"),
                    "earnings_surprise": info.get("earningsSurprise")
                }
            }
            
            return earnings_data
            
        except Exception as e:
            logger.warning(f"Could not fetch earnings for {symbol}: {e}")
            return {
                "next_earnings_date": None,
                "status": "No upcoming earnings data available"
            }
    
    def _get_recent_news(self, ticker) -> List[Dict]:
        """Get recent news headlines."""
        try:
            news = ticker.news[:5]  # Get top 5 news items
            
            formatted_news = []
            for item in news:
                formatted_news.append({
                    "title": item.get("title", ""),
                    "publisher": item.get("publisher", ""),
                    "link": item.get("link", ""),
                    "published": item.get("providerPublishTime")
                })
            
            return formatted_news
            
        except Exception as e:
            logger.warning(f"Could not fetch news: {e}")
            return []
    
    def _get_economic_indicators(self, symbol: str) -> List[str]:
        """
        Get relevant economic indicators based on asset type.
        This is a simplified version - can be enhanced with real API.
        """
        # Major indices and their relevant indicators
        economic_calendar = {
            "SPY": [
                "Federal Reserve FOMC meeting this week",
                "Monthly jobs report (Non-Farm Payrolls) - Friday",
                "CPI inflation data - Next week",
                "GDP growth rate - Q4 preliminary"
            ],
            "QQQ": [
                "Tech sector earnings season ongoing",
                "Interest rate decision pending",
                "Tech regulation hearings scheduled"
            ],
            "DIA": [
                "Industrial production data - Tomorrow",
                "Manufacturing PMI - This week"
            ]
        }
        
        # Default events for individual stocks
        default_events = [
            "Federal Reserve policy meeting this month",
            "Quarterly earnings season in progress",
            "Market volatility elevated on macro uncertainty"
        ]
        
        # Get specific events or return defaults
        return economic_calendar.get(symbol, default_events)
    
    def _get_fallback_events(self, symbol: str) -> Dict:
        """Fallback when API fails."""
        return {
            "symbol": symbol,
            "earnings_calendar": {
                "status": "Data unavailable",
                "next_earnings_date": None
            },
            "recent_news": [],
            "economic_events": [
                "Economic calendar data temporarily unavailable",
                "Check market news sources for latest updates"
            ],
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def get_market_summary(self, symbol: str) -> str:
        """
        Generate a text summary of economic events for LLM consumption.
        """
        events = self.get_stock_events(symbol)
        
        summary_parts = []
        
        # Earnings info
        earnings = events.get("earnings_calendar", {})
        if earnings.get("next_earnings_date"):
            summary_parts.append(f"Next earnings: {earnings['next_earnings_date']}")
        
        # Economic events
        economic = events.get("economic_events", [])
        if economic:
            summary_parts.append(f"Economic calendar: {'; '.join(economic[:3])}")
        
        # Recent news
        news = events.get("recent_news", [])
        if news:
            headlines = [n.get("title", "") for n in news[:3]]
            summary_parts.append(f"Recent headlines: {'; '.join(headlines)}")
        
        return " | ".join(summary_parts) if summary_parts else "No major economic events identified"
