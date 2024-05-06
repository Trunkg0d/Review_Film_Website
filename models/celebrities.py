from beanie import Document
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import date

class Celebrity(Document):
    creator: Optional[str]
    name: str
    born: date
    award_list: Optional[List[str]]

    class Settings:
        name = "celebrities"

    class Config:
        schema_extra = {
            "example": {
                "name": "Trấn Thành",
                "born": "2003-10-25",
                "movie_list": [
                    {
                        "_id": "5eb7cf5a86d9755df3a6c593",
                        "title": "FastAPI BookLaunch",
                        "image": "https://linktomyimage.com/image.png",
                        "description": "We will be discussing the contents of the FastAPI book in this event.Ensure to come with your own copy to win gifts!",
                        "tags": ["comedy", "korean", "18+"],
                        "language": "Vietnamese",
                        "runtime": 60,
                        "average_rating": 4.5
                    }
                ],
                "award_list": [
                                "Sao Vàng", "Oscar"
                              ]
            }
        }

class CelebrityUpdate(BaseModel):
    name: Optional[str]
    born: Optional[date]
    award_list: Optional[List[str]]

    class Config:
        schema_extra = {
            "example": {
                "name": "Trấn Thành",
                "born": "2003-10-25",
                "movie_list": [
                    {
                        "_id": "5eb7cf5a86d9755df3a6c593",
                        "title": "FastAPI BookLaunch",
                        "image": "https://linktomyimage.com/image.png",
                        "description": "We will be discussing the contents of the FastAPI book in this event.Ensure to come with your own copy to win gifts!",
                        "tags": ["comedy", "korean", "18+"],
                        "language": "Vietnamese",
                        "runtime": 60,
                        "average_rating": 4.5
                    }
                ],
                "award_list": [
                    "Sao Vàng", "Oscar"
                ]
            }
        }