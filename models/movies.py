from typing import Optional, List
from beanie import Document
from pydantic import BaseModel

class Movie(Document):
    creator: Optional[str]
    title: str
    image: str
    description: str
    language: str
    tags: List[str]
    runtime: int # minutes
    average_rating: float

    class Config:
        schema_extra = {
            "example": {
                "title": "FastAPI BookLaunch",
                "image": "https://linktomyimage.com/image.png",
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
    image: Optional[str]
    description: Optional[str]
    tags: Optional[List[str]]
    language: Optional[str]
    runtime: Optional[int]  # minutes
    average_rating: Optional[float]

    class Config:
        schema_extra = {
            "example": {
                "title": "FastAPI BookLaunch",
                "image": "https://linktomyimage.com/image.png",
                "description": "We will be discussing the contents of the FastAPI book in this event.Ensure to come with your own copy to win gifts!",
                "tags": ["comedy", "korean", "18+"],
                "language": "Vietnamese",
                "runtime": 60,
                "average_rating": 4.5
            }
        }