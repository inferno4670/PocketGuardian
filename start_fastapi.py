#!/usr/bin/env python3
"""
Startup script for Pocket Guardian FastAPI server
"""
import uvicorn

if __name__ == "__main__":
    print("🛡️  Starting Pocket Guardian FastAPI Backend...")
    print("📡 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔄 Interactive API: http://localhost:8000/redoc")
    print("\nPress Ctrl+C to stop the server\n")
    
    uvicorn.run(
        "fastapi_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )