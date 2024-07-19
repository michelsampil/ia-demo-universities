# app/main.py
import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.api.api_v1.endpoints import auth, score, question
from app.socketio.handlers import init_socket_manager

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(score.router, prefix="/scores", tags=["scores"])
app.include_router(question.router, prefix="/questions", tags=["questions"])

# Initialize SocketManager with the FastAPI app instance
socket_manager.init_app(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
