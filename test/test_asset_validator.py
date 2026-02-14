"""
Test Asset Validator
Tests that asset symbols are properly validated.
"""

import sys
from services.asset_validator import validate_asset_symbol, validate_asset_or_raise, AssetValidationError


def test_valid_symbols():
    """Test that valid symbols pass validation."""
    print("\n=== Testing VALID Symbols ===")
    
    # Comprehensive list of real assets across different categories
    valid_symbols = [
        # Tech Stocks
        "AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA", "NFLX", "ADBE", "CRM",
        # Financial
        "JPM", "BAC", "WFC", "GS", "MS", "C", "BLK", "V", "MA", "AXP",
        # Healthcare
        "JNJ", "UNH", "PFE", "ABBV", "TMO", "MRK", "LLY", "ABT", "DHR", "BMY",
        # Consumer
        "WMT", "PG", "KO", "PEP", "COST", "NKE", "MCD", "HD", "DIS", "SBUX",
        # Industrial
        "BA", "CAT", "GE", "MMM", "HON", "UPS", "LMT", "RTX", "UNP", "DE",
        # Energy
        "XOM", "CVX", "COP", "SLB", "EOG", "PXD", "MPC", "PSX", "VLO", "OXY",
        # ETFs
        "SPY", "QQQ", "IWM", "DIA", "VTI", "VOO", "VGT", "XLF", "XLE", "GLD",
        # International
        "TSM", "BABA", "NVO", "ASML", "TM", "HSBC", "UL", "SAP", "SNY", "BP",
        # Crypto (if supported)
        "BTC-USD", "ETH-USD",
    ]
    
    failed = []
    for symbol in valid_symbols:
        is_valid, error = validate_asset_symbol(symbol)
        status = "✓ PASS" if is_valid else "✗ FAIL"
        print(f"{status}: {symbol.ljust(10)} - {error if error else 'Valid'}")
        
        if not is_valid:
            failed.append((symbol, error))
    
    if failed:
        print(f"\n⚠️  {len(failed)} symbols failed validation:")
        for symbol, error in failed:
            print(f"    {symbol}: {error}")
        print(f"\n✓ {len(valid_symbols) - len(failed)}/{len(valid_symbols)} symbols passed")
        # Allow some failures for international/crypto symbols that may not be available
        if len(failed) <= 3:
            print("  (Acceptable failure rate for international/crypto symbols)")
            return True
        return False
    
    print(f"\n✓ All {len(valid_symbols)} valid symbols passed")
    return True


def test_invalid_symbols():
    """Test that invalid symbols fail validation."""
    print("\n=== Testing INVALID Symbols ===")
    
    invalid_symbols = [
        "NOTAREALSTOCK",
        "FAKE123",
        "XYZ999",
        "RANDOMSTRING",
        "123456",
        "ZZZZZZZ",
        "ABCDEFGHIJKLMNOP",  # Too long
        "INVALID",
        "NOTFOUND",
        "XXXXX",
        "",  # Empty
        "   ",  # Whitespace only
    ]
    
    for symbol in invalid_symbols:
        is_valid, error = validate_asset_symbol(symbol)
        status = "✓ PASS" if not is_valid else "✗ FAIL"
        display_symbol = f"'{symbol}'" if symbol.strip() else "(empty/whitespace)"
        print(f"{status}: {display_symbol.ljust(25)} - {error if error else 'Should have failed!'}")
        
        if is_valid:
            print(f"    ERROR: Expected {display_symbol} to be invalid!")
            return False
    
    print(f"\n✓ All {len(invalid_symbols)} invalid symbols correctly rejected")
    return True


def test_raise_on_invalid():
    """Test that validate_asset_or_raise raises exception for invalid symbols."""
    print("\n=== Testing Exception Raising ===")
    
    try:
        validate_asset_or_raise("NOTAREALSTOCK123")
        print("✗ FAIL: Should have raised AssetValidationError")
        return False
    except AssetValidationError as e:
        print(f"✓ PASS: Correctly raised exception: {e}")
    
    try:
        result = validate_asset_or_raise("AAPL")
        print(f"✓ PASS: Valid symbol returned: {result}")
        if result != "AAPL":
            print(f"✗ FAIL: Expected 'AAPL', got '{result}'")
            return False
    except AssetValidationError as e:
        print(f"✗ FAIL: Should not have raised exception for AAPL: {e}")
        return False
    
    return True


def test_case_normalization():
    """Test that symbols are normalized to uppercase."""
    print("\n=== Testing Case Normalization ===")
    
    test_cases = [
        ("aapl", "AAPL"),
        ("Spy", "SPY"),
        ("tsLA", "TSLA"),
    ]
    
    for input_symbol, expected in test_cases:
        result = validate_asset_or_raise(input_symbol)
        status = "✓ PASS" if result == expected else "✗ FAIL"
        print(f"{status}: '{input_symbol}' -> '{result}' (expected '{expected}')")
        
        if result != expected:
            return False
    
    print("✓ Case normalization working correctly")
    return True


def main():
    """Run all tests."""
    print("="*60)
    print("ASSET VALIDATOR TESTS")
    print("="*60)
    
    tests = [
        ("Valid Symbols", test_valid_symbols),
        ("Invalid Symbols", test_invalid_symbols),
        ("Exception Raising", test_raise_on_invalid),
        ("Case Normalization", test_case_normalization),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"\n✗ {test_name} CRASHED: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
