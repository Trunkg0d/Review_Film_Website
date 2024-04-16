from beanie import Document
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from models.movies import Movie


class User(Document):
    email: EmailStr
    password: str
    img: str
    role: int   # 0: normal user, 1: admin
    wish_list: Optional[List[Movie]]

    class Settings:
        name = "users"

    class Config:
        schema_extra = {
            "example": {
                "email": "fastapi@packt.com",
                "password": "strong!!!",
                "img": "/static/img.png",
                "role": 0,
                "wish_list": [
                                {
                                  "_id": "5eb7cf5a86d9755df3a6c593",
                                  "creator": "string",
                                  "title": "string",
                                  "image": "string",
                                  "description": "string",
                                  "tags": [
                                    "string"
                                  ],
                                  "location": "string"
                                }
                              ]
            }
        }

class TokenResponse(BaseModel):
    access_token: str
    token_type: str