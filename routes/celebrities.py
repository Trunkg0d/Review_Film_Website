from typing import List
from auth.authenticate import authenticate
from beanie import PydanticObjectId
from database.connection import Database
from fastapi import APIRouter, Depends, HTTPException, status
from models.celebrities import Celebrity, CelebrityUpdate

celebrity_router = APIRouter(
    tags=["Celebrities"]
)

celebrity_database = Database(Celebrity)

@celebrity_router.get("/", response_model=List[Celebrity])
async def retrieve_all_celebrities() -> List[Celebrity]:
    movies = await celebrity_database.get_all()
    return movies

@celebrity_router.get("/{id}", response_model=Celebrity)
async def retrieve_celebrity(id: PydanticObjectId) -> Celebrity:
    celebrity = await celebrity_database.get(id)
    if not celebrity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Celebrity with supplied ID does not exist"
        )
    return celebrity

@celebrity_router.get("/{id}", response_model=Celebrity)
async def retrieve_celebrity(id: PydanticObjectId) -> Celebrity:
    celebrity = await celebrity_database.get(id)
    if not celebrity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Celebrity with supplied ID does not exist"
        )
    return celebrity

@celebrity_router.post("/new")
async def create_celebrity(body: Celebrity, user: str = Depends(authenticate)) -> dict:
    body.creator = user
    await celebrity_database.save(body)
    return {
        "message": "Celebrity created successfully"
    }

@celebrity_router.put("/{id}", response_model=Celebrity)
async def update_celebrity(id: PydanticObjectId, body: CelebrityUpdate, user: str = Depends(authenticate)) -> Celebrity:
    celebrity = await celebrity_database.get(id)
    if celebrity.creator != user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Operation not allowed"
        )
    updated_movie = await celebrity_database.update(id, body)
    if not updated_movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Celebrity with supplied ID does not exist"
        )
    return updated_movie

@celebrity_router.delete("/{id}")
async def delete_celebrity(id: PydanticObjectId, user: str = Depends(authenticate)) -> dict:
    celebrity = await celebrity_database.get(id)
    if not celebrity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Celebrity not found"
        )
    if celebrity.creator != user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Operation not allowed"
        )
    celebrity = await celebrity_database.delete(id)

    return {
        "message": "Celebrity deleted successfully."
    }