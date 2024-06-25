import uvicorn
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from database.connection import Settings
from routes.movies import movie_router
from routes.users import user_router
from routes.celebrities import celebrity_router
from routes.reviews import review_router
from routes.chatbot import chatbot_router

app = FastAPI()

settings = Settings()

# register origins

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes

app.include_router(user_router, prefix="/user")
app.include_router(movie_router, prefix="/movie")
app.include_router(celebrity_router, prefix="/celebrity")
app.include_router(review_router, prefix="/review")
app.include_router(chatbot_router, prefix="/chatbot")

#/reviews/movie_id
@app.on_event("startup")
async def init_db():
    await settings.initialize_database()


@app.get("/")
async def home():
    return RedirectResponse(url="/docs/")