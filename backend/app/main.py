import sys
import os
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.api.api_v1.endpoints import auth, score, question
from app.socketio.handlers import handle_connect, handle_disconnect, handle_message
from fastapi.staticfiles import StaticFiles

from app.db.database import get_db

# Drop and recreate tables
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL
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

# Websocket
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await handle_connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await handle_message(websocket, data)
    except Exception as e:
        print(f"Connection error: {e}")
    # finally:
        # await handle_disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
