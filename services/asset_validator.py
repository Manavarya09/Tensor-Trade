"""
Asset Symbol Validator
Validates that asset symbols are genuine before processing.
"""

import logging
from typing import Tuple, Optional
import yfinance as yf

logger = logging.getLogger(__name__)


class AssetValidationError(Exception):
    """Raised when an asset symbol is invalid."""
    pass


class AssetValidator:
    """Validates asset symbols using yfinance data."""
    
    def __init__(self):
        self.cache = {}  # Cache valid symbols to avoid repeated API calls
    
    def validate_symbol(self, symbol: str) -> Tuple[bool, Optional[str]]:
        """
        Validate if a symbol is a real/genuine asset.
        
        Args:
            symbol: The asset symbol to validate (e.g., "AAPL", "SPY", "BTC-USD")
            
        Returns:
            Tuple of (is_valid, error_message)
            - (True, None) if valid
            - (False, error_message) if invalid
        """
        # Quick validation
        if not symbol or not isinstance(symbol, str):
            return False, "Symbol must be a non-empty string"
        
        symbol = symbol.strip().upper()
        
        if len(symbol) == 0:
            return False, "Symbol cannot be empty"
        
        # Allow longer symbols for crypto (e.g., BTC-USD) and forex
        if len(symbol) > 15:
            return False, f"Symbol '{symbol}' is too long (max 15 characters)"
        
        # Check cache first
        if symbol in self.cache:
            return True, None
        
        # Validate using yfinance (open-source Yahoo Finance API)
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            # Check if we got valid data
            # A valid ticker should have at least some basic info
            if not info or len(info) <= 1:
                return False, f"Symbol '{symbol}' not found or has no data"
            
            # Enhanced validation: Check multiple indicators
            validation_checks = {
                'has_symbol': 'symbol' in info or 'ticker' in info,
                'has_type': 'quoteType' in info,
                'has_name': 'longName' in info or 'shortName' in info,
                'has_price': 'currentPrice' in info or 'regularMarketPrice' in info or 'previousClose' in info,
                'has_market': 'market' in info or 'exchange' in info
            }
            
            # Must pass at least 2 validation checks
            passed_checks = sum(validation_checks.values())
            if passed_checks < 2:
                return False, f"Symbol '{symbol}' does not appear to be a valid asset (insufficient data)"
            
            # Try to get recent price history as additional validation
            hist = ticker.history(period="5d")
            
            if hist.empty:
                # Some assets might not have 5d history, try 1 month for less liquid assets
                hist = ticker.history(period="1mo")
                if hist.empty:
                    return False, f"Symbol '{symbol}' has no trading history"
            
            # Additional check: Make sure we have actual price data
            if 'Close' not in hist.columns or hist['Close'].isna().all():
                return False, f"Symbol '{symbol}' has invalid price data"
            
            # Cache valid symbol
            self.cache[symbol] = True
            asset_type = info.get('quoteType', 'UNKNOWN')
            logger.info(f"✓ Symbol '{symbol}' validated successfully (Type: {asset_type})")
            
            return True, None
            
        except Exception as e:
            error_str = str(e)
            # Provide helpful error messages
            if '404' in error_str or 'Not Found' in error_str:
                return False, f"Symbol '{symbol}' not found in market data"
            logger.warning(f"Validation failed for '{symbol}': {e}")
            return False, f"Unable to validate symbol '{symbol}'"
    
    def validate_or_raise(self, symbol: str) -> str:
        """
        Validate symbol and raise exception if invalid.
        
        Args:
            symbol: The asset symbol to validate
            
        Returns:
            The validated (uppercase) symbol
            
        Raises:
            AssetValidationError: If symbol is invalid
        """
        is_valid, error_msg = self.validate_symbol(symbol)
        
        if not is_valid:
            raise AssetValidationError(error_msg)
        
        return symbol.strip().upper()


# Global instance
_validator = AssetValidator()


def validate_asset_symbol(symbol: str) -> Tuple[bool, Optional[str]]:
    """
    Convenience function to validate an asset symbol.
    
    Args:
        symbol: Asset symbol to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    return _validator.validate_symbol(symbol)


def validate_asset_or_raise(symbol: str) -> str:
    """
    Convenience function to validate symbol and raise if invalid.
    
    Args:
        symbol: Asset symbol to validate
        
    Returns:
        Validated symbol (uppercase)
        
    Raises:
        AssetValidationError: If symbol is invalid
    """
    return _validator.validate_or_raise(symbol)
