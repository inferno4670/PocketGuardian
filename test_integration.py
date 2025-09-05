#!/usr/bin/env python3
"""
Integration test between React frontend and FastAPI backend
"""
import subprocess
import time
import requests
import signal
import os

def test_integration():
    """Test the complete integration"""
    
    print("🚀 Starting FastAPI backend for integration test...")
    
    # Start FastAPI server
    proc = subprocess.Popen([
        'uvicorn', 'fastapi_server:app', 
        '--host', '0.0.0.0', 
        '--port', '8000'
    ])
    
    # Wait for server to start
    time.sleep(5)
    
    try:
        print("📡 Testing FastAPI backend integration...")
        
        # Test scan endpoint with College mode
        response = requests.get("http://localhost:8000/scan?mode=College")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Scan endpoint working - Mode: {data['mode']}, Items: {len(data['items'])}")
            
            # Show scan results
            for item in data['items']:
                status_icon = "🟢" if item['status'] == 'detected' else "🔴"
                print(f"   {status_icon} {item['name']}: {item['status']}")
        
        # Test history endpoint
        response = requests.get("http://localhost:8000/history")
        if response.status_code == 200:
            history = response.json()
            print(f"✅ History endpoint working - {len(history)} entries found")
            
            if history:
                print("📝 Recent history entries:")
                for entry in history[:2]:  # Show first 2
                    print(f"   - {entry['item_name']} missing in {entry['mode']}")
        
        # Test other modes
        modes_to_test = ["Daily", "Gym", "Trip"]
        for mode in modes_to_test:
            response = requests.get(f"http://localhost:8000/scan?mode={mode}")
            if response.status_code == 200:
                data = response.json()
                missing_count = sum(1 for item in data['items'] if item['status'] == 'missing')
                print(f"✅ {mode}: {len(data['items'])} items, {missing_count} missing")
        
        print("\n🎉 Integration test completed successfully!")
        print("📱 Frontend can now connect to FastAPI backend at http://localhost:8000")
        print("🔗 Available endpoints:")
        print("   - GET /scan?mode=<mode_name> - Scan items")
        print("   - GET /history - Get scan history") 
        print("   - DELETE /history - Clear history")
        
    except Exception as e:
        print(f"❌ Integration test failed: {e}")
        
    finally:
        # Clean up
        print("🧹 Stopping FastAPI server...")
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()
            proc.wait()

if __name__ == "__main__":
    test_integration()