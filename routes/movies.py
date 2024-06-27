from typing import List
from auth.authenticate import authenticate
from beanie import PydanticObjectId
from database.connection import Database
from fastapi import APIRouter, Depends, HTTPException, status
from models.movies import Movie, MovieUpdate, MovieResponse
from models.celebrities import Celebrity
import datetime
from models.users import User

movie_router = APIRouter(
    tags=["Movies"]
)

movie_database = Database(Movie)
user_database = Database(User)
celebrity_database =  Database(Celebrity)


def convert_to_response(item : Movie) -> MovieResponse:
    return MovieResponse(
        movie_id=item.id,
        title=item.title,
        backdrop_path=item.backdrop_path,
        poster_path=item.poster_path,
        description=item.description,
        release_date=item.release_date,
        language=item.language,
        tags=item.tags,
        director=item.director,
        runtime=item.runtime,
        average_rating=item.average_rating,
        actors=item.actors
    )

async def get_celebrities_by_ids(ids: List[PydanticObjectId]) -> List[Celebrity]:
    celebrities = await celebrity_database.model.find({"_id": {"$in": ids}}).to_list()
    return celebrities


async def retrieve_celebrity_by_movieid(id: PydanticObjectId) -> List[Celebrity]:
    all_celebs = await retrieve_all_movies()
    res = []
    for celebrity in all_celebs:
        if celebrity.id == id:
            res.append(celebrity)
    return res


@movie_router.get("/", response_model=List[MovieResponse])
async def retrieve_all_movies() -> List[MovieResponse]:
    movies = await movie_database.get_all()
    for movie in movies:
        movie.director = await get_celebrities_by_ids(movie.director)
        if movie.actors:
            movie.actors = await get_celebrities_by_ids(movie.actors)
    res = []
    for item in movies:
        res.append(convert_to_response(item))
    return res


@movie_router.get('/page/{pagenumber}', response_model=List[MovieResponse])
async def retrieve_subset_movies(pagenumber : int) -> List[MovieResponse]:
    movies = await retrieve_all_movies()
    start_idx = 12 * pagenumber
    res = movies[start_idx : start_idx + 12]
    return res


@movie_router.get('/numberOfMovies')
async def retrieve_num_movies() -> int:
    num_movies = await movie_database.len()
    return num_movies

@movie_router.get("/{id}", response_model=MovieResponse)
async def retrieve_movie(id: PydanticObjectId) -> MovieResponse:
    movie = await movie_database.get(id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie with supplied ID does not exist"
        )
    movie.director = await get_celebrities_by_ids(movie.director)
    if movie.actors:
        movie.actors = await get_celebrities_by_ids(movie.actors)
    return convert_to_response(movie)

# Create a new movie
@movie_router.post("/new", response_model=dict)
async def create_movie(body: MovieUpdate, user: str = Depends(authenticate)) -> dict:
    # body.creator = user
    user_info = await User.find_one(User.email == user)
    if user_info.role != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden"
        )

    director_id = [item.id for item in body.director]
    actors_id = [item.id for item in body.actors]

    new_movie = Movie(
    title=body.title,
    backdrop_path=body.backdrop_path,
    poster_path=body.poster_path,
    description=body.description,
    release_date=datetime.datetime.strptime(body.release_date, "%Y-%m-%d"),
    tags=body.tags,
    director=director_id,
    language=body.language,
    runtime=body.runtime,
    average_rating=body.average_rating,
    actors=actors_id)


    await movie_database.save(new_movie)
    return {
        "message": "Movie created successfully"
    }

@movie_router.put("/{id}", response_model=MovieResponse)
async def update_movie(id: PydanticObjectId, body: MovieUpdate, user: str = Depends(authenticate)) -> MovieResponse:
    user_info = await User.find_one(User.email == user)
    if user_info.role != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden"
        )
    director_id = [item.id for item in body.director]
    actors_id = [item.id for item in body.actors]

    new_movie = Movie(
    title=body.title,
    backdrop_path=body.backdrop_path,
    poster_path=body.poster_path,
    description=body.description,
    release_date=datetime.datetime.strptime(body.release_date, "%Y-%m-%d"),
    tags=body.tags,
    director=director_id,
    language=body.language,
    runtime=body.runtime,
    average_rating=body.average_rating,
    actors=actors_id)


    updated_movie = await movie_database.update(id, new_movie)
    if not updated_movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie with supplied ID does not exist"
        )

    return MovieResponse(
        movie_id=id,
        title=body.title,
        backdrop_path=body.backdrop_path,
        poster_path=body.poster_path,
        description=body.description,
        release_date=body.release_date,
        tags=body.tags,
        director=body.director,
        language=body.language,
        runtime=body.runtime,
        average_rating=body.average_rating,
        actors=body.actors)
    

# Delete a movie by ID
@movie_router.delete("/{id}", response_model=dict)
async def delete_movie(id: PydanticObjectId, user: str = Depends(authenticate)) -> dict:
    user_info = await User.find_one(User.email == user)
    if user_info.role != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have enough rights to perform this operation."
        )
    movie = await movie_database.get(id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )
    await movie_database.delete(id)
    return {
        "message": "Movie deleted successfully."
    }

async def retrieve_movie_for_wishlist(id: PydanticObjectId) -> dict:
    movie = await movie_database.get(id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )
    return {
        "movie_id": str(movie.id),
        "title": movie.title,
        "poster_path": movie.poster_path
    }
