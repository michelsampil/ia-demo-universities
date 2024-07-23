from fastapi_socketio import SocketManager
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.question import Question
from app.schemas.user import UserBase, UserCreate, UserOut

socket_manager = None

def init_socket_manager(app):
    global socket_manager
    socket_manager = SocketManager(app)
    setup_event_handlers()

def setup_event_handlers():
    @socket_manager.on("connect")
    async def handle_connect(sid, environ):
        print(f"Client {sid} connected")

    @socket_manager.on("disconnect")
    async def handle_disconnect(sid):
        print(f"Client {sid} disconnected")

    @socket_manager.on("start_game")
    async def handle_start_game(sid, data, db: Session = Depends(get_db)):
        question = db.query(Question).first()
        if not question:
            await socket_manager.emit("error", {"message": "No question found"}, room=sid)
            return
        
        await socket_manager.emit("question", {"question": question}, room=sid)
        
        for i in range(30, 0, -1):
            await socket_manager.emit("time", {"time": i}, room=sid)
            await asyncio.sleep(1)
        
        await socket_manager.emit("time_up", room=sid)

    @socket_manager.on("submit_answer")
    async def handle_submit_answer(sid, data, db: Session = Depends(get_db)):
        user = db.query(UserBase).filter(UserBase.full_name == data["username"]).first()
        question = db.query(Question).filter(Question.id == data["question_id"]).first()
        
        if not user or not question:
            await socket_manager.emit("error", {"message": "Invalid data"}, room=sid)
            return
        
        if data["answer"] == question.correct_answer:
            score = 50
        else:
            score = 0
        
        # Update the user's score in the database (you need to implement this logic)
        # user.score += score
        # db.commit()
        
        await socket_manager.emit("answer_result", {"score": score, "correct": data["answer"] == question.correct_answer}, room=sid)