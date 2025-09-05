from fastapi import FastAPI, HTTPException, Query
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
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)

# In-memory storage for history
history_storage: List[Dict[str, Any]] = []

# Mode configurations with example mock data
MODES = {
    "Daily": ["Wallet", "Keys"],
    "College": ["Wallet", "ID", "Earbuds"],
    "Gym": ["Wallet", "Bottle", "Towel"],
    "Trip": ["Wallet", "Charger", "Powerbank"]
}

# Pydantic models
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

def simulate_scan(mode: str) -> List[Dict[str, str]]:
    """Simulate BLE/NFC scan with random mock values"""
    if mode not in MODES:
        raise HTTPException(status_code=400, detail=f"Unknown mode: {mode}")
    
    items = []
    for item_name in MODES[mode]:
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
async def scan_items(mode: str = Query("Daily", description="Scanning mode: College, Gym, Trip, or Daily")):
    """
    GET /scan accepts query parameter 'mode' and returns JSON with required items and random status
    """
    try:
        items = simulate_scan(mode)
        
        # Store missing items in history
        missing_items = [item for item in items if item["status"] == "missing"]
        current_time = datetime.now().isoformat()
        
        for item in missing_items:
            history_entry = {
                "id": len(history_storage) + 1,
                "item_name": item["name"],
                "mode": mode,
                "timestamp": current_time,
                "status": "missing"
            }
            history_storage.append(history_entry)
        
        return ScanResponse(mode=mode, items=items)
    
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)