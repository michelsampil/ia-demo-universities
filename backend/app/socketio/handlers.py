# handlers.py

import jwt
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List, Set
import os
import random
import asyncio
import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.models import score as models
from app.schemas import score as schemas
from app.db.database import SessionLocal
from datetime import datetime
from urllib.parse import quote

SECRET_KEY = "your_secret_key"  # Replace with your actual secret key for JWT

class GameHandler:
    def __init__(self):
        self.images_folder = "app/assets/images"
        self.questions: Dict[str, List[str]] = self.scan_images_folder()
        self.user_scores: Dict[str, int] = {}
        self.current_question: Dict[str, str] = {}
        self.question_times: Dict[str, int] = {}  # Track remaining time per user
        self.first_question_time = 60  # Initial time for the first question
        self.time_decrement = 1  # Time decrement for each correct answer
        self.time_update_interval = 1  # Time update interval in seconds
        self.connected_clients: Set[WebSocket] = set()  # Track connected clients

    def scan_images_folder(self) -> Dict[str, List[str]]:
        questions = {}
        valid_extensions = {".png", ".jpg", ".jpeg", ".gif"}  # Add any other valid image extensions

        if not os.path.exists(self.images_folder):
            print(f"Images folder '{self.images_folder}' does not exist.")
            return questions

        print(f"Scanning images folder: {self.images_folder}")
        for category in os.listdir(self.images_folder):
            category_path = os.path.join(self.images_folder, category)
            if os.path.isdir(category_path):
                subfolders = os.listdir(category_path)
                for subfolder in subfolders:
                    subfolder_path = os.path.join(category_path, subfolder)
                    if os.path.isdir(subfolder_path):
                        image_files = [
                            name for name in os.listdir(subfolder_path)
                            if os.path.isfile(os.path.join(subfolder_path, name)) and
                            os.path.splitext(name)[1].lower() in valid_extensions
                        ]
                        if image_files:
                            question_key = f"{category}/{subfolder}"
                            questions[question_key] = image_files
                            print(f"Category: {category}, Subfolder: {subfolder}, Images found: {len(image_files)}")
        return questions
    
    def get_random_question(self) -> str:
        if not self.questions:
            raise ValueError("No questions available.")
        return random.choice(list(self.questions.keys()))

    def get_random_image_path(self, question: str) -> str:
        image_files = self.questions[question]
        image_file = random.choice(image_files)
        return f"{self.images_folder}/{question}/{image_file}"

    def get_options(self, correct_question: str) -> List[str]:
        options = [correct_question]
        while len(options) < 3:
            random_question = self.get_random_question()
            if random_question not in options:
                options.append(random_question)
        random.shuffle(options)
        return options

    def decode_token(self, token: str) -> str:
        if token is None:
            raise ValueError("Token is missing")
        try:
            decoded = jwt.decode(token.encode(), SECRET_KEY, algorithms=["HS256"])
            print(f"🍔 decoded: {decoded}")
            return decoded.get("user")  # Adjust if your JWT structure differs
        except jwt.ExpiredSignatureError:
            raise ValueError("Token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid token")

    async def send_question(self, websocket: WebSocket, user_email: str):
        try:
            # Send current ranking to all connected clients before starting the game
            await self.notify_ranking_update()

            # Proceed with sending the question
            question = self.get_random_question()
            self.current_question[user_email] = question
            self.question_times[user_email] = self.first_question_time  # Initialize timer for user
            image_path = self.get_random_image_path(question)
            encoded_path = quote(image_path)

            options = self.get_options(question)
            category = image_path.split('/')[3]

            question_data = {
                "event": "question",
                "question": {
                    "image_url": encoded_path,
                    "options": options,
                    "category": category
                }
            }
            await websocket.send_json(question_data)
            asyncio.create_task(self.update_time(websocket, user_email))
        except ValueError as e:
            try:
                await websocket.send_json({"event": "error", "message": str(e) + "send_question"})
            except WebSocketDisconnect:
                pass

    async def handle_answer(self, websocket: WebSocket, user_email: str, answer: str):
        correct_question = self.current_question.get(user_email)
        print(f"🍌 correct_question: {correct_question}, answer: {answer}")
        if answer == correct_question:
            self.user_scores[user_email] = self.user_scores.get(user_email, 0) + 1
            self.first_question_time = max(10, self.first_question_time - self.time_decrement)
            print(f"🧙‍♂️ self.user_scores: {self.user_scores}")
            print(f"🥶 self.question_times: {self.question_times}")

            try:
                await websocket.send_json({
                    "event": "answer_result",
                    "correct": True,
                    "score": self.user_scores[user_email]
                })
                await self.send_question(websocket, user_email)  # Send new question only if the answer is correct
            except WebSocketDisconnect:
                pass
        else:
            await self.save_user_score(user_email)
            try:
                await websocket.send_json({
                    "event": "answer_result",
                    "correct": False,
                    "score": self.user_scores[user_email]
                })
                await websocket.send_json({
                    "event": "game_over",
                    "score": self.user_scores[user_email]
                })

                print(f"before removing user... {user_email}")
                print(f"current_question.. {self.current_question}")
                print(f"question_times... {self.question_times}")

                self.clean_up_game(user_email)
            except WebSocketDisconnect:
                pass

    async def save_user_score(self, user_email: str):
        # Save the user's score to the database and update positions
        session: Session = SessionLocal()
        try:
            new_score = models.Score(
                user_email=user_email,
                value=self.user_scores[user_email],
                timestamp=datetime.now()  # Save the timestamp of the score
            )

            session.add(new_score)
            session.commit()
            session.refresh(new_score)

            # Update positions
            scores = session.query(models.Score).order_by(models.Score.value.desc()).all()
            for i, score in enumerate(scores):
                score.position = i + 1
                session.commit()

            # Notify all connected clients with updated rankings
            await self.notify_ranking_update()

        finally:
            session.close()

    async def notify_ranking_update(self):
        print(f"🐶 Notifing Ranking...")
        # Fetch updated rankings from the database
        session: Session = SessionLocal()
        try:
            scores = session.query(models.Score).order_by(models.Score.value.desc()).all()
            ranking_data = [{
                "user_email": score.user_email,
                "score": score.value,
                "position": score.position,
                "timestamp": score.timestamp.strftime("%Y-%m-%d %H:%M:%S")  # Include the timestamp
            } for score in scores]

            print(f"ranking_data: {ranking_data}")

            # Broadcast updated ranking to all connected clients
            print(f"🦁 Connected Clients: {self.connected_clients}")
            
            for websocket in self.connected_clients:
                try:
                    await websocket.send_json({
                        "event": "ranking_update",
                        "ranking": ranking_data
                    })
                except WebSocketDisconnect:
                    pass
        finally:
            print("finally...")
            # session.close()

    def clean_up_game(self, user_email: str):
        self.current_question.pop(user_email, None)  # Remove current question for the user
        self.question_times.pop(user_email, None)  # Remove timer for the user
        self.user_scores.pop(user_email, None)  # Remove the score for the user

    async def update_time(self, websocket: WebSocket, user_email: str):
        while user_email in self.question_times and self.question_times[user_email] > 0:
            await asyncio.sleep(self.time_update_interval)
            if user_email in self.question_times:
                self.question_times[user_email] -= self.time_update_interval
                try:
                    await websocket.send_json({
                        "event": "time",
                        "time": self.question_times[user_email]
                    })
                except WebSocketDisconnect:
                    break

        if user_email in self.question_times and self.question_times[user_email] <= 0:
            try:
                await websocket.send_json({
                    "event": "time_up"
                })
                # Send new question after time is up
                await self.handle_answer(websocket, user_email, "")  # Trigger game over
            except WebSocketDisconnect:
                pass
            
    async def on_connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connected_clients.add(websocket)
        print(f"👽 WebSocket connected")

    async def on_disconnect(self, websocket: WebSocket):
        self.connected_clients.discard(websocket)
        for user_email, ws in self.connected_clients:
            if ws == websocket:
                self.clean_up_game(user_email)
                break
        print("👻 WebSocket disconnected")

    async def on_receive(self, websocket: WebSocket, data: str):
        data = json.loads(data)  # Parse the JSON data
        print(f"data is 🍊: {data}")
        token = data.get("token")
        if not token:
            try:
                await websocket.send_json({"event": "error", "message": "Token is missing"})
            except WebSocketDisconnect:
                pass
            await websocket.close()
            return

        try:
            user_email = self.decode_token(token)
        except ValueError as e:
            try:
                await websocket.send_json({"event": "error", "message": str(e)})
            except WebSocketDisconnect:
                pass
            await websocket.close()
            return

        event = data.get("event")

        print(f"🦋 user_email: {user_email}")
        print(f"🐑 antes del if envent: {event}")
        if event == "start_game":
            await self.send_question(websocket, user_email)
        elif event == "answer":
            answer = data.get("answer")
            print(f"🙊 answer: {answer}, user: {user_email}")
            await self.handle_answer(websocket, user_email, answer)

game_handler = GameHandler()

async def handle_connect(websocket: WebSocket):
    await game_handler.on_connect(websocket)

async def handle_disconnect(websocket: WebSocket):
    await game_handler.on_disconnect(websocket)

async def handle_message(websocket: WebSocket, data: str):
    await game_handler.on_receive(websocket, data)
