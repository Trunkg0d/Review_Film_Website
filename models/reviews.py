from typing import Optional, List
from beanie import Document
from pydantic import BaseModel
from models.movies import Movie
from models.users import User
from datetime import datetime

class Review(Document):
    creator: Optional[str]
    movie : Movie
    content : str 
    review_date : datetime
    helpful : List[User]  = []
    not_helpful : List[User] = []
    
    
    class Config:
        schema_extra = {
            "example": {
                "movie": {
                    "title": "FastAPI BookLaunch",
                    "backdrop_path": "https://linktomyimage.com/image.png",
                    "poster_path": "https://linktomyimage.com/image.png",
                    "description": "We will be discussing the contents of the FastAPI book in this event.Ensure to come with your own copy to win gifts!",
                    "tags": ["comedy", "korean", "18+"],
                    "language": "Vietnamese",
                    "runtime": 60,
                    "average_rating": 4.5
                },
                "content": "This movie was amazing!",
                "review_date": datetime.now(),
                "helpful": [{
                    "_id": "5eb7cf5a86d9755df3a6c593",
                    "email": "fastapi@packt.com",
                    "password": "strong!!!",
                    "img": "/static/img.png",
                    "role": 0,
                    "wish_list": [{
                        "title": "FastAPI BookLaunch",
                        "backdrop_path": "https://linktomyimage.com/image.png",
                        "poster_path": "https://linktomyimage.com/image.png",
                        "description": "We will be discussing the contents of the FastAPI book in this event.Ensure to come with your own copy to win gifts!",
                        "tags": ["comedy", "korean", "18+"],
                        "language": "Vietnamese",
                        "runtime": 60,
                        "average_rating": 4.5
                    }]
                }],
                "not_helpful": []
            }
        }

    class Settings:
        name = "reviews"

# class ReviewUpdateContent (BaseModel):
#     content : Optional[str] 
    
#     class Config:
#         schema_extra = {
#             "example": {
#                 "title": "FastAPI BookLaunch",
#                 "backdrop_path": "https://linktomyimage.com/image.png",
#                 "poster_path": "https://linktomyimage.com/image.png",
#                 "description": "We will be discussing the contents of the FastAPI book in this event.Ensure to come with your own copy to win gifts!",
#                 "tags": ["comedy", "korean", "18+"],
#                 "language": "Vietnamese",
#                 "runtime": 60,
#                 "average_rating": 4.5
#             }
#         }
        
# class ReviewUpdateHelpful (BaseModel):
