from typing import List
from auth.authenticate import authenticate
from beanie import PydanticObjectId
from database.connection import Database
from fastapi import APIRouter, Depends, HTTPException, status
from models.reviews import Review

review_router = APIRouter(
    tags=["Review"]
)

review_database = Database(Review)

# Get all reviews
@review_router.get("/", response_model=List[Review])
async def retrieve_all_reviews() -> List[Review]:
    reviews = await review_database.get_all()
    return reviews

# Get reviews of a movie by movie_id
@review_router.get("/movie/{movie_id}", response_model=List[Review])
async def retrieve_reviews_by_movie(movie_id: PydanticObjectId) -> List[Review]:
    reviews = await review_database.get_all({"movie_id": movie_id})
    if not reviews:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This movie still does not have any reviews. Be the first to review!"
        )
    return reviews

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
async def create_review(body: Review, user: str = Depends(authenticate)) -> dict:
    body.creator = user
    await review_database.save(body)
    return {
        "message": "Review created successfully"
    }

# Update a review by review_id
@review_router.put("/content/{id}", response_model=Review)
async def update_review(id: PydanticObjectId, new_review: str, user: str = Depends(authenticate)) -> Review:
    review = await review_database.get(id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review with supplied ID does not exist"
        )
    if review.creator != user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Operation not allowed"
        )
    review.content = new_review
    updated_review = await review_database.update(id, review)
    if not updated_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review with supplied ID does not exist"
        )
    return updated_review

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
