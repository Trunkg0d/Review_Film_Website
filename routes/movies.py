from typing import List
from auth.authenticate import authenticate
from beanie import PydanticObjectId
from database.connection import Database
from fastapi import APIRouter, Depends, HTTPException, status
from models.movies import Movie, MovieUpdate, MovieResponse
from models.celebrities import Celebrity
from models.users import User

movie_router = APIRouter(
    tags=["Movies"]
)

movie_database = Database(Movie)
user_database = Database(User)
celebrity_database =  Database(Celebrity)


async def get_celebrities_by_ids(ids: List[PydanticObjectId]) -> List[Celebrity]:
    celebrities = await celebrity_database.model.find({"_id": {"$in": ids}}).to_list()
    return celebrities




@movie_router.get("/", response_model=List[Movie])
async def retrieve_all_movies() -> List[Movie]:
    movies = await movie_database.get_all()
    for movie in movies:
        movie.director = await get_celebrities_by_ids(movie.director)
        if movie.actors:
            movie.actors = await get_celebrities_by_ids(movie.actors)
    return movies


@movie_router.get('/page/{pagenumber}', response_model=List[Movie])
async def retrieve_subset_movies(pagenumber : int) -> List[Movie]:
    movies = await retrieve_all_movies()
    start_idx = 12 * pagenumber
    return movies[start_idx : start_idx + 12]


# @movie_router.get('/numberOfMovies')
# async def retrieve_subset_movies() -> int:
#     movies = await retrieve_all_movies()
#     return len(movies)

@movie_router.get("/{id}", response_model=Movie)
async def retrieve_movie(id: PydanticObjectId) -> Movie:
    movie = await movie_database.get(id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie with supplied ID does not exist"
        )
    movie.director = await get_celebrities_by_ids(movie.director)
    if movie.actors:
        movie.actors = await get_celebrities_by_ids(movie.actors)
    return movie

# Create a new movie
@movie_router.post("/new", response_model=dict)
async def create_movie(body: Movie, user: str = Depends(authenticate)) -> dict:
    body.creator = user
    await movie_database.save(body)
    return {
        "message": "Movie created successfully"
    }

@movie_router.put("/{id}", response_model=Movie)
async def update_movie(id: PydanticObjectId, body: MovieUpdate, user: str = Depends(authenticate)) -> Movie:
    user_info = await User.find_one(User.email == user)
    # movie = await movie_database.get(id)
    # if not movie:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail="Movie with supplied ID does not exist"
    #     )
    if user_info.role != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden"
        )
    
    new_movie = Movie(
    title=body.title,
    backdrop_path=body.backdrop_path,
    poster_path=body.poster_path,
    description=body.description,
    release_date=body.release_date,
    tags=body.tags,
    director=['666b130500105718d9a4b3a2'],
    language=body.language,
    runtime=body.runtime,
    average_rating=body.average_rating,
    actors=['666b130500105718d9a4b3a2'],
)


    # if movie.creator != user:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Operation not allowed"
    #     )
    updated_movie = await movie_database.update(id, new_movie)
    if not updated_movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie with supplied ID does not exist"
        )
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
