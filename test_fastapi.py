#!/usr/bin/env python3
"""
Test script for Pocket Guardian FastAPI backend
"""
import subprocess
import time
import requests
import sys
import signal
import os

def test_fastapi_server():
    """Test the FastAPI server endpoints"""
    
    print("🚀 Starting FastAPI server...")
    
    # Start the server
    proc = subprocess.Popen([
        'uvicorn', 'fastapi_server:app', 
        '--host', '0.0.0.0', 
        '--port', '8000'
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Wait for server to start
    time.sleep(4)
    
    try:
        base_url = "http://localhost:8000"
        
        print("📡 Testing endpoints...")
        
        # Test 1: Root endpoint
        try:
            response = requests.get(f"{base_url}/")
            print(f"✅ Root endpoint: {response.json()}")
        except Exception as e:
            print(f"❌ Root endpoint failed: {e}")
        
        # Test 2: Scan endpoint with different modes
        modes = ["Daily Essentials", "College Mode", "Gym Mode", "Trip Mode"]
        
        for mode in modes:
            try:
                response = requests.get(f"{base_url}/scan", params={"mode": mode})
                data = response.json()
                print(f"✅ Scan endpoint ({mode}): Found {len(data['items'])} items")
                
                # Show item details
                for item in data['items']:
                    status_icon = "🟢" if item['status'] == 'detected' else "🔴"
                    print(f"   {status_icon} {item['name']}: {item['status']}")
            except Exception as e:
                print(f"❌ Scan endpoint ({mode}) failed: {e}")
        
        # Test 3: History endpoint (GET)
        try:
            response = requests.get(f"{base_url}/history")
            history = response.json()
            print(f"✅ History endpoint: {len(history)} entries")
            
            if history:
                print("📝 Recent history entries:")
                for entry in history[:3]:  # Show first 3 entries
                    print(f"   - {entry['item_name']} missing in {entry['mode']} at {entry['timestamp'][:19]}")
        except Exception as e:
            print(f"❌ History endpoint failed: {e}")
        
        # Test 4: Modes endpoint
        try:
            response = requests.get(f"{base_url}/modes")
            modes_data = response.json()
            print(f"✅ Modes endpoint: {len(modes_data['modes'])} modes available")
            
            for mode_name, items in modes_data['modes'].items():
                print(f"   - {mode_name}: {', '.join(items)}")
        except Exception as e:
            print(f"❌ Modes endpoint failed: {e}")
        
        # Test 5: POST to history
        try:
            test_entry = {
                "item_name": "Test Item",
                "mode": "Test Mode", 
                "timestamp": "2024-01-01T12:00:00"
            }
            response = requests.post(f"{base_url}/history", json=test_entry)
            print(f"✅ History POST endpoint: {response.json()['message']}")
        except Exception as e:
            print(f"❌ History POST endpoint failed: {e}")
        
        print("\n🎉 All API tests completed!")
        
    except KeyboardInterrupt:
        print("\n🛑 Tests interrupted by user")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        # Clean up
        print("🧹 Cleaning up server...")
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()
            proc.wait()

if __name__ == "__main__":
    test_fastapi_server()