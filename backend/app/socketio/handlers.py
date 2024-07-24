from fastapi import WebSocket
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.question import Question
from app.schemas.user import UserBase
import asyncio
import json
from fastapi.encoders import jsonable_encoder

async def handle_connect(websocket: WebSocket):
    await websocket.accept()
    print(f"Client connected: {websocket.client.host}")

async def handle_disconnect(websocket: WebSocket):
    print(f"Client disconnected: {websocket.client.host}")

async def handle_message(websocket: WebSocket, message: str, db: Session):
    data = json.loads(message)
    event = data.get("event")

    if event == "start_game":
        await handle_start_game(websocket, data, db)
    elif event == "submit_answer":
        await handle_submit_answer(websocket, data, db)
    else:
        await websocket.send_text(json.dumps({"error": "Unknown event"}))

async def handle_start_game(websocket: WebSocket, data: dict, db: Session):
    question = db.query(Question).first()
    if not question:
        await websocket.send_text(json.dumps({"error": "No question found"}))
        return

    json_compatible_item_data = jsonable_encoder(question)

    await websocket.send_text(json.dumps({"question": json_compatible_item_data}))
    
    for i in range(30, 0, -1):
        await websocket.send_text(json.dumps({"time": i}))
        await asyncio.sleep(1)
    
    await websocket.send_text(json.dumps({"time_up": True}))

async def handle_submit_answer(websocket: WebSocket, data: dict, db: Session):
    user = db.query(UserBase).filter(UserBase.full_name == data["username"]).first()
    question = db.query(Question).filter(Question.id == data["question_id"]).first()

    if not user or not question:
        await websocket.send_text(json.dumps({"error": "Invalid data"}))
        return

    if data["answer"] == question.correct_answer:
        score = 50
    else:
        score = 0

    # Update the user's score in the database (implement this logic as needed)
    # user.score += score
    # db.commit()

    await websocket.send_text(json.dumps({"score": score, "correct": data["answer"] == question.correct_answer}))
