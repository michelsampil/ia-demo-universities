import sys
import os
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.api.api_v1.endpoints import auth, score, question
from app.socketio.handlers import handle_connect, handle_disconnect, handle_message
from fastapi.staticfiles import StaticFiles
from app.helpers.load_backups import load_scores_from_backup

# Drop and recreate tables
# Enable drop for developer mode only
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# Load scores backup from backup
load_scores_from_backup("./backups/score_backup.json")

# Initialize FastAPI app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(score.router, prefix="/scores", tags=["scores"])
app.include_router(question.router, prefix="/questions", tags=["questions"])

# Serve static files
app.mount("/assets", StaticFiles(directory="app/assets"), name="assets")

# WebSocket
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await handle_connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await handle_message(websocket, data)
    except Exception as e:
        print(f"Connection error: {e}")
    finally:
        await handle_disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
