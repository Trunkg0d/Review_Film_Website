
from database.connection import Database
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from models.users import User
from auth.authenticate import authenticate
from uuid import uuid4
import httpx

# define model backend port
CHATBOT_DEPLOY_PORT = 8005
SESSION_USER_ID = {}
MODEL_ENDPOINT = "http://localhost:{}/chat/".format(CHATBOT_DEPLOY_PORT)

user_database = Database(User)

class ChatbotModel(BaseModel):
    content: str


chatbot_router = APIRouter(
    tags=["Chatbot"]
)

@chatbot_router.post("/chat/")
async def send_chat(body : ChatbotModel, user: str = Depends(authenticate)):
    if user not in SESSION_USER_ID:
        SESSION_USER_ID[user] = str(uuid4())
    request_data = {
        "input": body.content,
        "session_id": SESSION_USER_ID[user]
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(MODEL_ENDPOINT, json=request_data, timeout=30)
        return response.json()

