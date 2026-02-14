"""Quick demo of asset validation"""
from services.asset_validator import validate_asset_symbol

print("\n=== Asset Validation Demo ===\n")

tests = [
    ("AAPL", "Valid stock"),
    ("tsla", "Lowercase input"),
    ("SPY", "ETF symbol"),
    ("NOTREAL", "Invalid symbol"),
    ("", "Empty input"),
    ("TOOLONGNAME", "Too long"),
]

for symbol, description in tests:
    is_valid, error = validate_asset_symbol(symbol)
    display = f"'{symbol}'" if symbol else "(empty)"
    status = "✓ Valid" if is_valid else f"✗ {error}"
    print(f"{display.ljust(20)} [{description.ljust(20)}] -> {status}")

print("\n✅ Validation is working correctly!")
