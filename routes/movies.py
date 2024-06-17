from typing import List
from auth.authenticate import authenticate
from beanie import PydanticObjectId
from database.connection import Database
from fastapi import APIRouter, Depends, HTTPException, status
from models.movies import Movie, MovieUpdate

movie_router = APIRouter(
    tags=["Movies"]
)

movie_database = Database(Movie)

# Retrieve all movies
@movie_router.get("/", response_model=List[Movie])
async def retrieve_all_movies() -> List[Movie]:
    movies = await movie_database.get_all()
    return movies

# Retrieve a single movie by ID
@movie_router.get("/{id}", response_model=Movie)
async def retrieve_movie(id: PydanticObjectId) -> Movie:
    movie = await movie_database.get(id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie with supplied ID does not exist"
        )
    return movie

# Create a new movie
@movie_router.post("/new", response_model=dict)
async def create_movie(body: Movie, user: str = Depends(authenticate)) -> dict:
    body.creator = user
    await movie_database.save(body)
    return {
        "message": "Movie created successfully"
    }

# Update a movie by ID
@movie_router.put("/{id}", response_model=Movie)
async def update_movie(id: PydanticObjectId, body: MovieUpdate, user: str = Depends(authenticate)) -> Movie:
    movie = await movie_database.get(id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie with supplied ID does not exist"
        )
    if movie.creator != user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Operation not allowed"
        )
    update_data = body.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(movie, key, value)
    updated_movie = await movie_database.update(id, movie)
    return updated_movie

# Delete a movie by ID
@movie_router.delete("/{id}", response_model=dict)
async def delete_movie(id: PydanticObjectId, user: str = Depends(authenticate)) -> dict:
    movie = await movie_database.get(id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )
    if movie.creator != user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Operation not allowed"
        )
    await movie_database.delete(id)
    return {
        "message": "Movie deleted successfully."
    }
