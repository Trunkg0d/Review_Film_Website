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

# Get all review
@review_router.get("/", response_model=List[Review])
async def retrieve_all_reviews() -> List[Review]:
    reviews = await review_database.get_all()
    return reviews

# Get review of a movie , movie id retreive from Movie model
@review_router.get("/{movie_id}", response_model=List[Review])
async def retrieve_review(movie_id: PydanticObjectId) -> List[Review]:
    review = await review_database.get(movie_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This movie still not have any review. Be the first to review !!!"
        )
    return review
# Get only one review

@review_router.post("/new")
async def create_review(body: Review, user: str = Depends(authenticate)) -> dict:
    body.creator = user
    await review_database.save(body)
    return {
        "message": "Reviews created successfully"
    }

@review_router.put("/content/{id}", response_model=Review)
async def update_review(id: PydanticObjectId, new_review: str, user: str = Depends(authenticate)) -> Review:
    reviews = await review_database.get(id)
    if reviews.creator != user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Operation not allowed"
        )
    reviews.content = new_review
    updated_reviews = await review_database.update(id, reviews)
    if not updated_reviews:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review with supplied ID does not exist"
        )
    return updated_reviews

@review_router.delete("/{id}")
async def delete_review(id: PydanticObjectId, user: str = Depends(authenticate)) -> dict:
    reviews = await review_database.get(id)
    if not reviews:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reviews not found"
        )
    if reviews.creator != user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Operation not allowed"
        )
    reviews = await review_database.delete(id)

    return {
        "message": "reviews deleted successfully."
    }