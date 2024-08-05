from fastapi import WebSocket
from typing import Dict, List
import os
import random

class GameHandler:
    def __init__(self):
        self.images_folder = "app/assets/images"
        self.questions: Dict[str, List[str]] = self.scan_images_folder()
        self.user_scores: Dict[str, int] = {}
        self.current_question: Dict[str, str] = {}
        self.first_question_time = 30  # Initial time for the first question
        self.time_decrement = 2  # Time decrement for each correct answer

    def scan_images_folder(self) -> Dict[str, List[str]]:
        questions = {}
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
                        image_files = [name for name in os.listdir(subfolder_path) if os.path.isfile(os.path.join(subfolder_path, name))]
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

    async def send_question(self, websocket: WebSocket, user_id: str):
        try:
            question = self.get_random_question()
            self.current_question[user_id] = question
            image_path = self.get_random_image_path(question)
            options = self.get_options(question)
            question_data = {
                "image_url": image_path,
                "options": options
            }
            await websocket.send_json(question_data)
        except ValueError as e:
            await websocket.send_json({"error": str(e)})

    async def handle_answer(self, websocket: WebSocket, user_id: str, answer: str):
        correct_question = self.current_question[user_id]
        if answer == correct_question:
            self.user_scores[user_id] = self.user_scores.get(user_id, 0) + 1
            self.first_question_time = max(10, self.first_question_time - self.time_decrement)
            await websocket.send_json({"correct": True, "score": self.user_scores[user_id]})
        else:
            await websocket.send_json({"correct": False, "score": self.user_scores[user_id]})
        await self.send_question(websocket, user_id)

    async def on_connect(self, websocket: WebSocket):
        await websocket.accept()
        user_id = websocket.headers.get("user_id")
        self.user_scores[user_id] = 0
        await self.send_question(websocket, user_id)

    async def on_disconnect(self, websocket: WebSocket):
        user_id = websocket.headers.get("user_id")
        if user_id in self.user_scores:
            del self.user_scores[user_id]
            del self.current_question[user_id]

    async def on_receive(self, websocket: WebSocket, data: dict):
        user_id = websocket.headers.get("user_id")
        answer = data.get("answer")
        if answer is not None:
            await self.handle_answer(websocket, user_id, answer)

game_handler = GameHandler()

async def handle_connect(websocket: WebSocket):
    await game_handler.on_connect(websocket)

async def handle_disconnect(websocket: WebSocket):
    await game_handler.on_disconnect(websocket)

async def handle_message(websocket: WebSocket, data: str, db):
    await game_handler.on_receive(websocket, {"answer": data})
