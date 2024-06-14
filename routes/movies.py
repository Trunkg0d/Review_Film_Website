from typing import List
from auth.authenticate import authenticate
from beanie import PydanticObjectId
from database.connection import Database
from fastapi import APIRouter, Depends, HTTPException, status
from models.movies import Movie, MovieUpdate, MovieResponse
from models.celebrities import Celebrity

movie_router = APIRouter(
    tags=["Movies"]
)

movie_database = Database(MovieResponse)
celebrity_database =  Database(Celebrity)

async def get_celebrities_by_ids(ids: List[PydanticObjectId]) -> List[Celebrity]:
    # Truy vấn để lấy danh sách các Celebrity theo ObjectId
    celebrities = await celebrity_database.model.find({"_id": {"$in": ids}}).to_list()
    return celebrities

@movie_router.get("/", response_model=List[Movie])
async def retrieve_all_movies() -> List[Movie]:
    movies = await movie_database.get_all()
    for movie in movies:
        movie.director = await get_celebrities_by_ids(movie.director)
        if movie.actors:
            movie.actors = await get_celebrities_by_ids(movie.actors)
    # print(movies)
    return movies

@movie_router.get("/{id}", response_model=Movie)
async def retrieve_movie(id: PydanticObjectId) -> Movie:
    movie = await movie_database.get(id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie with supplied ID does not exist"
        )
    return movie

@movie_router.post("/new")
async def create_movie(body: Movie, user: str = Depends(authenticate)) -> dict:
    body.creator = user
    await movie_database.save(body)
    return {
        "message": "Movie created successfully"
    }

@movie_router.put("/{id}", response_model=Movie)
async def update_movie(id: PydanticObjectId, body: MovieUpdate, user: str = Depends(authenticate)) -> Movie:
    movie = await movie_database.get(id)
    if movie.creator != user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Operation not allowed"
        )
    updated_movie = await movie_database.update(id, body)
    if not updated_movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie with supplied ID does not exist"
        )
    return updated_movie

@movie_router.delete("/{id}")
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
    movie = await movie_database.delete(id)

    return {
        "message": "Movie deleted successfully."
    }