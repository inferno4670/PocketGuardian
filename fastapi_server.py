from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
import random

# Initialize FastAPI app
app = FastAPI(title="Pocket Guardian API", description="Backend API for Pocket Guardian item scanning app")

# Configure CORS support for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# In-memory storage for history
history_storage: List[Dict[str, Any]] = []

# In-memory storage for registered BLE objects
ble_objects_storage: Dict[str, str] = {}  # {object_name: ble_uuid}

# Mode configurations with example mock data
MODES = {
    "Daily": ["Wallet", "Keys"],
    "College": ["Wallet", "ID", "Earbuds"],
    "Gym": ["Wallet", "Bottle", "Towel"],
    "Trip": ["Wallet", "Charger", "Powerbank"]
}

# Pydantic models
class ScanRequest(BaseModel):
    mode: str
    custom_items: Optional[List[str]] = None

class ScanResponse(BaseModel):
    mode: str
    items: List[Dict[str, str]]

class HistoryItem(BaseModel):
    item_name: str
    mode: str
    timestamp: str

class HistoryEntry(BaseModel):
    id: int
    item_name: str
    mode: str
    timestamp: str
    status: str

class BLEObjectRegister(BaseModel):
    object_name: str
    ble_uuid: str

class BLEScanRequest(BaseModel):
    ble_uuids: List[str]

class BLEScanResponse(BaseModel):
    results: Dict[str, str]  # {object_name: "present" | "missing"}

def simulate_scan(mode: str, custom_items: Optional[List[str]] = None) -> List[Dict[str, str]]:
    """Simulate BLE/NFC scan with random mock values"""
    # Use custom items if provided, otherwise fall back to default mode items
    items_to_scan = custom_items if custom_items else MODES.get(mode, [])
    
    if not items_to_scan:
        raise HTTPException(status_code=400, detail=f"No items found for mode: {mode}")
    
    items = []
    for item_name in items_to_scan:
        # 70% chance of detection (simulate real-world scanning)
        status = "detected" if random.random() > 0.3 else "missing"
        items.append({
            "name": item_name,
            "status": status
        })
    
    return items

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Pocket Guardian FastAPI Backend", "version": "1.0.0"}

@app.get("/scan")
async def scan_items_get(mode: str = Query("Daily", description="Scanning mode: College, Gym, Trip, or Daily")):
    """
    GET /scan accepts query parameter 'mode' and returns JSON with required items and random status
    """
    try:
        items = simulate_scan(mode)
        return ScanResponse(mode=mode, items=items)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")

@app.post("/scan")
async def scan_items_post(scan_request: ScanRequest):
    """
    POST /scan accepts mode and optional custom_items list, returns JSON with scan results
    """
    try:
        items = simulate_scan(scan_request.mode, scan_request.custom_items)
        return ScanResponse(mode=scan_request.mode, items=items)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")

@app.get("/history")
async def get_history():
    """
    GET /history returns list of past missing events with timestamp and mode
    """
    # Sort by timestamp (most recent first)
    sorted_history = sorted(history_storage, key=lambda x: x["timestamp"], reverse=True)
    return sorted_history

@app.post("/history")
async def add_history_item(history_item: HistoryItem):
    """
    POST /history accepts item name, mode, timestamp and stores in memory
    """
    try:
        new_entry = {
            "id": len(history_storage) + 1,
            "item_name": history_item.item_name,
            "mode": history_item.mode,
            "timestamp": history_item.timestamp,
            "status": "missing"
        }
        history_storage.append(new_entry)
        
        return {"message": "History item added successfully", "entry": new_entry}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add history item: {str(e)}")

@app.delete("/history")
async def clear_history():
    """Clear all history entries"""
    global history_storage
    history_storage = []
    return {"message": "History cleared successfully"}

@app.get("/modes")
async def get_modes():
    """Get available scanning modes and their items"""
    return {"modes": MODES}

@app.post("/register_ble")
async def register_ble_object(ble_object: BLEObjectRegister):
    """
    POST /register_ble accepts object name and BLE UUID, saves in server memory
    """
    try:
        ble_objects_storage[ble_object.object_name] = ble_object.ble_uuid
        
        return {
            "message": "BLE object registered successfully",
            "object_name": ble_object.object_name,
            "ble_uuid": ble_object.ble_uuid
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register BLE object: {str(e)}")

@app.post("/scan/ble")
async def scan_ble_objects(scan_request: BLEScanRequest):
    """
    POST /scan/ble accepts BLE UUID list and responds with which objects are present/missing
    """
    try:
        results = {}
        
        # Check each registered BLE object
        for object_name, stored_uuid in ble_objects_storage.items():
            if stored_uuid in scan_request.ble_uuids:
                results[object_name] = "present"
            else:
                results[object_name] = "missing"
        
        return BLEScanResponse(results=results)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"BLE scan failed: {str(e)}")

@app.get("/objects")
async def get_registered_objects():
    """
    GET /objects returns full list of registered BLE objects
    """
    return {
        "objects": ble_objects_storage,
        "count": len(ble_objects_storage)
    }

@app.delete("/register_ble/{object_name}")
async def unregister_ble_object(object_name: str):
    """
    DELETE /register_ble/{object_name} removes BLE object from storage
    """
    try:
        if object_name in ble_objects_storage:
            del ble_objects_storage[object_name]
            return {"message": f"BLE object '{object_name}' unregistered successfully"}
        else:
            raise HTTPException(status_code=404, detail=f"BLE object '{object_name}' not found")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to unregister BLE object: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)