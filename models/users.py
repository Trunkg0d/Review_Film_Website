from beanie import Document
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from beanie import PydanticObjectId
from models.movies import Movie

class User(Document):
    fullname: str
    username: str
    email: EmailStr
    password: str
    img: Optional[str]
    role: int   # 0: normal user, 1: admin
    wish_list: Optional[List[PydanticObjectId]] = None 

    class Settings:
        name = "users"

    class Config:
        schema_extra = {
            "example": {
                "fullname": "Hitori Gotoh",
                "username": "bocchitherock",
                "email": "fastapi@packt.com",
                "password": "strong!!!",
                "img": "/static/img.png",
                "role": 0,
                "wish_list": [
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
                              ]
            }
        }
    
class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class UserUpdate(BaseModel):
    fullname: Optional[str]
    username: Optional[str]
    email: Optional[EmailStr]
    password: Optional[str]
    img: Optional[str]
    role: int
    # wish_list: Optional[List[PydanticObjectId]] = None

    class Config:
        schema_extra = {
            "example": {
                "fullname": "Hitori Gotoh",
                "username": "bocchitherock",
                "email": "fastapi@packt.com",
                "password": "strong!!!",
                "img": "/static/img.png",
                "role": 0,
                "wish_list": [
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
                ]
            }
        }