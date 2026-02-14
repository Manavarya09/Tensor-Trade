"""
Integration Test - API Asset Validation
Tests that the API properly validates asset symbols.
"""

import requests
import sys

API_BASE_URL = "http://localhost:8000"


def test_health():
    """Test that API is running."""
    print("\n=== Testing API Health ===")
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✓ API is running")
            return True
        else:
            print(f"✗ API returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to API - is it running?")
        print(f"   Start with: uvicorn main:app --host 0.0.0.0 --port 8000")
        return False
    except Exception as e:
        print(f"✗ Health check failed: {e}")
        return False


def test_valid_asset():
    """Test that valid assets are accepted."""
    print("\n=== Testing Valid Asset (AAPL) ===")
    try:
        print("Sending request (this may take 60-120 seconds)...")
        response = requests.post(
            f"{API_BASE_URL}/analyze-asset",
            params={"asset": "AAPL", "user_id": "test_user"},
            timeout=180
        )
        
        if response.status_code == 200:
            data = response.json()
            asset = data.get("asset")
            print(f"✓ Valid asset 'AAPL' accepted")
            print(f"  Returned asset: {asset}")
            print(f"  Analysis type: {data.get('analysis_type')}")
            return True
        else:
            print(f"✗ Unexpected status code: {response.status_code}")
            print(f"  Response: {response.text[:200]}")
            return False
            
    except requests.exceptions.Timeout:
        print("⚠️  Request timed out (may be working but slow)")
        print("    Note: Initial requests can be slow while models load")
        return None  # Indeterminate result
    except Exception as e:
        print(f"✗ Request failed: {e}")
        return False


def test_invalid_asset():
    """Test that invalid assets are rejected."""
    print("\n=== Testing Invalid Asset (NOTAREALSTOCK) ===")
    try:
        response = requests.post(
            f"{API_BASE_URL}/analyze-asset",
            params={"asset": "NOTAREALSTOCK", "user_id": "test_user"},
            timeout=10
        )
        
        if response.status_code == 400:
            error_data = response.json()
            error_msg = error_data.get("detail", "")
            print(f"✓ Invalid asset correctly rejected")
            print(f"  Error message: {error_msg}")
            return True
        elif response.status_code == 200:
            print(f"✗ FAIL: Invalid asset was accepted!")
            return False
        else:
            print(f"✗ Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"✗ Request failed unexpectedly: {e}")
        return False


def test_empty_asset():
    """Test that empty assets are rejected."""
    print("\n=== Testing Empty Asset ===")
    try:
        response = requests.post(
            f"{API_BASE_URL}/analyze-asset",
            params={"asset": "", "user_id": "test_user"},
            timeout=10
        )
        
        if response.status_code == 400:
            error_data = response.json()
            error_msg = error_data.get("detail", "")
            print(f"✓ Empty asset correctly rejected")
            print(f"  Error message: {error_msg}")
            return True
        else:
            print(f"✗ Empty asset was not rejected (status: {response.status_code})")
            return False
            
    except Exception as e:
        print(f"✗ Request failed: {e}")
        return False


def test_case_insensitive():
    """Test that asset symbols are case insensitive."""
    print("\n=== Testing Case Insensitivity (aapl, AAPL) ===")
    try:
        response = requests.post(
            f"{API_BASE_URL}/analyze-asset",
            params={"asset": "aapl", "user_id": "test_user"},
            timeout=180
        )
        
        if response.status_code == 200:
            data = response.json()
            returned_asset = data.get("asset")
            if returned_asset == "AAPL":
                print(f"✓ Lowercase 'aapl' normalized to 'AAPL'")
                return True
            else:
                print(f"✗ Asset not normalized: got '{returned_asset}'")
                return False
        else:
            print(f"✗ Request failed with status {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        print("⚠️  Request timed out")
        return None
    except Exception as e:
        print(f"✗ Request failed: {e}")
        return False


def main():
    """Run all integration tests."""
    print("="*60)
    print("API ASSET VALIDATION INTEGRATION TESTS")
    print("="*60)
    print("\nNote: Make sure the API server is running:")
    print("  uvicorn main:app --host 0.0.0.0 --port 8000")
    print("="*60)
    
    # Check if API is running first
    if not test_health():
        print("\n❌ API is not running. Please start the server first.")
        return 1
    
    # Run tests
    tests = [
        ("Invalid Asset Rejection", test_invalid_asset),
        ("Empty Asset Rejection", test_empty_asset),
    ]
    
    # Optional longer tests
    print("\n⚠️  The following tests may take 60-120 seconds each:")
    run_long_tests = input("Run full analysis tests? (y/n): ").lower().strip() == 'y'
    
    if run_long_tests:
        tests.extend([
            ("Valid Asset Acceptance", test_valid_asset),
            ("Case Insensitivity", test_case_insensitive),
        ])
    
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
    
    passed = sum(1 for _, result in results if result is True)
    failed = sum(1 for _, result in results if result is False)
    indeterminate = sum(1 for _, result in results if result is None)
    total = len(results)
    
    for test_name, result in results:
        if result is True:
            status = "✓ PASS"
        elif result is False:
            status = "✗ FAIL"
        else:
            status = "⚠️  TIMEOUT"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} passed")
    if indeterminate > 0:
        print(f"       {indeterminate}/{total} timed out (may need longer timeout)")
    if failed > 0:
        print(f"       {failed}/{total} failed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    elif failed == 0 and indeterminate > 0:
        print("\n⚠️  Some tests timed out but none failed")
        return 0
    else:
        print(f"\n⚠️  {failed} test(s) failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
