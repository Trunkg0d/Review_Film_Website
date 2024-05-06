from typing import Optional, List
from beanie import Document
from pydantic import BaseModel
from celebrities import Celebrity
from datetime import datetime

class Movie(Document):
    creator: Optional[str]
    title: str
    backdrop_path: str
    poster_path: str
    description: str
    release_date: datetime
    language: str
    tags: List[str]
    director: List[Celebrity]
    runtime: int # minutes
    average_rating: float
    casts: Optional[List[Celebrity]]

    class Config:
        schema_extra = {
            "example": {
                "title": "FastAPI BookLaunch",
                "backdrop_path": "https://linktomyimage.com/image.png",
                "poster_path": "https://linktomyimage.com/image.png",
                "description": "We will be discussing the contents of the FastAPI book in this event.Ensure to come with your own copy to win gifts!",
                "tags": ["comedy", "korean", "18+"],
                "language": "Vietnamese",
                "runtime": 60,
                "average_rating": 4.5
            }
        }

    class Settings:
        name = "movies"

class MovieUpdate(BaseModel):
    title: Optional[str]
    backdrop_path: Optional[str]
    poster_path: Optional[str]
    description: Optional[str]
    release_date: Optional[datetime]
    tags: Optional[List[str]]
    director: Optional[List[Celebrity]]
    language: Optional[str]
    runtime: Optional[int]  # minutes
    average_rating: Optional[float]
    casts: Optional[List[Celebrity]]

    class Config:
        schema_extra = {
            "example": {
                "title": "FastAPI BookLaunch",
                "backdrop_path": "https://linktomyimage.com/image.png",
                "poster_path": "https://linktomyimage.com/image.png",
                "description": "We will be discussing the contents of the FastAPI book in this event.Ensure to come with your own copy to win gifts!",
                "tags": ["comedy", "korean", "18+"],
                "language": "Vietnamese",
                "runtime": 60,
                "average_rating": 4.5
            }
        }