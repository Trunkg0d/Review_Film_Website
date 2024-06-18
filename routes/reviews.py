from typing import List
from auth.authenticate import authenticate
from beanie import PydanticObjectId
from database.connection import Database
from fastapi import APIRouter, Depends, HTTPException, status
from models.reviews import Review, ReviewResponse
from models.users import User
from bson import objectid
from datetime import datetime

import logging
logger = logging.getLogger('uvicorn.error')


review_router = APIRouter(
    tags=["Review"]
)

review_database = Database(Review)
user_database = Database(User)

# Get all reviews
@review_router.get("/", response_model=List[Review])
async def retrieve_all_reviews() -> List[Review]:
    reviews = await review_database.get_all()
    return reviews

async def fill_userinfo(review_data: Review) -> ReviewResponse:
    user_id = review_data.user_id
    user_profile = await user_database.get(user_id)  
    
    if not user_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found."
        )
    
    return ReviewResponse(
        id=review_data.id,  # Populate the ID field here
        movie_id=review_data.movie_id,
        user_info={
            "user_id": user_id,
            "username": user_profile.username,
            "fullname": user_profile.fullname,
            "img": user_profile.img
        },
        content=review_data.content,
        created_at=review_data.created_at,
        updated_at=review_data.updated_at,
        helpful=review_data.helpful,
        not_helpful=review_data.not_helpful
    )


# Get reviews of a movie by movie_id
@review_router.get("/movie/{movie_id}", response_model=List[ReviewResponse])
async def retrieve_reviews_by_movie(movie_id: PydanticObjectId) -> List[ReviewResponse]:
    # Query the database for reviews with the given movie_id
    reviews = await review_database.get_all()
    review_list = []
    for review in reviews:
        if review.movie_id == movie_id:
            review_list.append(review)
    if review_list == []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This movie still does not have any reviews. Be the first to review!"
        )
    
    # Use a list comprehension to fill user info asynchronously
    reviews_with_userinfo = [await fill_userinfo(review) for review in review_list]
    
    return reviews_with_userinfo

# Get a single review by review_id
@review_router.get("/{id}", response_model=Review)
async def retrieve_review(id: PydanticObjectId) -> Review:
    review = await review_database.get(id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    return review

# Create a new review
@review_router.post("/new", response_model=dict)
async def create_review(body: dict, user: str = Depends(authenticate)) -> dict:
    # body.creator = user
    user_info = await User.find_one(User.email == user)
    new_review = Review (
        movie_id = body.get("movie_id"),
        user_id = user_info.id,
        content= body.get("content"),
        created_at = datetime.now(),
        updated_at=  datetime.now(),
        helpful = None,
        not_helpful = None)
    await review_database.save(new_review)
    return {
        "message": "Review created successfully"
    }
from pydantic import BaseModel

class UpdateReviewRequest(BaseModel):
    content: str

@review_router.put("/content/{id}", response_model=Review)
async def update_review(id: PydanticObjectId, request: UpdateReviewRequest, user: str = Depends(authenticate)) -> Review:
    new_review = request.content
    review = await review_database.get(id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review with supplied ID does not exist"
        )
    # if review.creator != user:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Operation not allowed"
    #     )
    review.content = new_review
    updated_review = await review_database.update(id, review)
    if not updated_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review with supplied ID does not exist"
        )
    return updated_review

# # Update a review by review_id
# @review_router.put("/content/{id}", response_model=Review)
# async def update_review(id: PydanticObjectId, new_review: str, user: str = Depends(authenticate)) -> Review:
#     print(new_review)
#     review = await review_database.get(id)
#     if not review:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Review with supplied ID does not exist"
#         )
#     # if review.creator != user:
#     #     raise HTTPException(
#     #         status_code=status.HTTP_400_BAD_REQUEST,
#     #         detail="Operation not allowed"
#     #     )
#     review.content = new_review
#     updated_review = await review_database.update(id, review)
#     if not updated_review:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Review with supplied ID does not exist"
#         )
#     return updated_review

# Delete a review by review_id
@review_router.delete("/{id}", response_model=dict)
async def delete_review(id: PydanticObjectId, user: str = Depends(authenticate)) -> dict:
    review = await review_database.get(id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    if review.creator != user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Operation not allowed"
        )
    await review_database.delete(id)
    return {
        "message": "Review deleted successfully."
    }
