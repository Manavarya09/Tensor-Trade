import os
import json
import logging
from services.self_improvement import SelfImprovementService
from main import app, get_improvement_metrics

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_self_improvement():
    print("Testing SelfImprovementService...")
    service = SelfImprovementService("data/test_history.json")

    # Clean up previous test
    if os.path.exists("data/test_history.json"):
        os.remove("data/test_history.json")

    # Test record run
    service.record_run(
        asset="TEST",
        agent_outputs={"Agent1": "Output1"},
        moderator_verdict={"verdict": "POST", "reason": "Safe"}
    )

    # Verify file created
    if not os.path.exists("data/test_history.json"):
        print("FAIL: History file not created")
        return False

    with open("data/test_history.json", "r") as f:
        data = json.load(f)
        if len(data) != 1:
            print(f"FAIL: Expected 1 entry, got {len(data)}")
            return False

    # Test metrics
    metrics = service.analyze_performance()
    if metrics["post_rate"] != 100.0:
        print(f"FAIL: Expected 100% post rate, got {metrics['post_rate']}")
        return False

    print("SelfImprovementService OK")
    return True

def test_app_endpoint():
    print("Testing App Endpoint logic...")
    # Mock the global service in main for testing
    import main
    main.self_improvement_service = SelfImprovementService("data/test_history.json")

    try:
        metrics = get_improvement_metrics()
        print(f"Metrics Endpoint: {metrics}")
        if "post_rate" not in metrics:
            print("FAIL: Metrics endpoint missing keys")
            return False
    except Exception as e:
        print(f"FAIL: Endpoint error: {e}")
        return False

    print("App Endpoint OK")
    return True

if __name__ == "__main__":
    if test_self_improvement() and test_app_endpoint():
        print("ALL CHECKS PASSED")
        # Clean up
        if os.path.exists("data/test_history.json"):
            os.remove("data/test_history.json")
    else:
        print("CHECKS FAILED")
        exit(1)
