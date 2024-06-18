from typing import Optional, List
from beanie import Document
from pydantic import BaseModel
from models.movies import Movie
from beanie import PydanticObjectId
from models.users import User
from datetime import datetime


# Example UserInfo and ReviewResponse models
class UserInfo(BaseModel):
    user_id: PydanticObjectId
    username: str
    fullname: str
    img: Optional[str]

class ReviewResponse(BaseModel):
    id: PydanticObjectId
    movie_id: PydanticObjectId
    user_info: UserInfo
    content: str
    created_at: datetime
    updated_at: datetime
    helpful: Optional[List[PydanticObjectId]]
    not_helpful: Optional[List[PydanticObjectId]]

class Review(Document):
    movie_id : PydanticObjectId
    user_id : PydanticObjectId
    content : str 
    updated_at : datetime
    created_at : datetime
    helpful : Optional[List[PydanticObjectId]]
    not_helpful : Optional[List[PydanticObjectId]]   
    
    
    class Config:
        schema_extra = {
            "example": {
                "movie_id": "666b0bcbff071d36d47fa04d",
                "user_id": "666b38f200105718d9a4b48d",
                "content": (
                    "FULL SPOILER-FREE REVIEW @ https://talkingfilms.net/dune-part-two-review-the-new-generational-epitome-of-sci-fi-epics/\n\n"
                    "\"Dune: Part Two surpasses even the highest expectations, establishing itself as an unquestionable technical masterpiece of blockbuster filmmaking.\n\n"
                    "With a narrative that deepens the complex web of political relationships, power, faith, love, and destiny, it not only provides a breathtaking audiovisual spectacle, thanks to the genius of Denis Villeneuve, Greig Fraser, and Hans Zimmer, but it also offers a profound meditation on universal human themes through thematically rich world-building and thoroughly developed characters. The superb performances of the entire cast, led by a career-best Timothée Chalamet and a mesmerizing Zendaya, further elevate this incredibly immersive cinematic experience.\n\n"
                    "It warrants comparisons with the greatest sequels in history, easily becoming the new generational epitome of sci-fi epics.\"\n\n"
                    "Rating: A+"
                ),
                "created_at": "2024-02-22T21:00:01.602Z",
                "updated_at": "2024-02-22T21:00:01.712Z",
                "helpful": None,
                "not_helpful": None
            }
        }

    class Settings:
        name = "reviews"
