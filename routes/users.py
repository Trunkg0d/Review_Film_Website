from auth.hash_password import HashPassword
from auth.jwt_handler import create_access_token
from auth.authenticate import authenticate
from fastapi.responses import JSONResponse, FileResponse
from database.connection import Database
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from models.users import User, TokenResponse, UserUpdate, UserResponse
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from beanie import PydanticObjectId
from models.movies import MovieResponse, Movie
from routes.movies import retrieve_movie_for_wishlist
import aiofiles
from pathlib import Path
import string
import logging
import random
import datetime
from io import BytesIO
from PIL import Image

user_router = APIRouter(
    tags=["User"],
)

UPLOAD_DIR = Path() / 'uploads' # Avatar image store path

logger = logging.getLogger('uvicorn.error')
class UserInfo(BaseModel):
    user_id: PydanticObjectId
    fullname: str
    username: str
    email: EmailStr
    img: Optional[str]
    role: int
    wish_list: Optional[List[PydanticObjectId]]

class CheckEmailRequest(BaseModel):
    email: EmailStr

class CheckUsernameRequest(BaseModel):
    username: str

user_database = Database(User)
movie_database = Database(Movie)
hash_password = HashPassword()


@user_router.post("/checkEmail")
async def check_email_is_valid(input: CheckEmailRequest) -> dict:
    user_email_exist = await User.find_one(User.email == input.email)
    if user_email_exist:
        return {"message": "Existed"}
    return {"message": "Not exist"}

@user_router.post("/checkUsername")
async def check_username_is_valid(input: CheckUsernameRequest) -> dict:
    user_username_exist = await User.find_one(User.username == input.username)
    if user_username_exist:
        return {"message": "Existed"}
    return {"message": "Not exist"}

@user_router.post("/signup")
async def sign_user_up(user: User) -> dict:
    userEmail_exist = await User.find_one(User.email == user.email)
    if userEmail_exist:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already exists."
        )

    userName_exist = await User.find_one(User.username == user.username)
    if userName_exist:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists."
        )

    hashed_password = hash_password.create_hash(user.password)
    user.password = hashed_password
    await user_database.save(user)
    return {
        "message": "User created successfully"
    }

@user_router.post("/signin", response_model=TokenResponse)
async def sign_user_in(user: OAuth2PasswordRequestForm = Depends()) -> TokenResponse:
    user_exist = await User.find_one(User.email == user.username) or await User.find_one(User.username == user.username)

    if not user_exist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    if hash_password.verify_hash(user.password, user_exist.password):
        access_token = create_access_token(user_exist.email)
        return TokenResponse(access_token=access_token, token_type="Bearer")

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid details provided."
    )

@user_router.post("/profile", response_model=UserInfo)
async def get_user_info(current_user: str = Depends(authenticate)) -> UserInfo:
    user_info = await User.find_one(User.email == current_user)
    if user_info:
        return UserInfo(
            user_id=user_info.id,
            fullname=user_info.fullname,
            username=user_info.username,
            email=user_info.email,
            img=user_info.img,
            role=user_info.role,
            wish_list=user_info.wish_list
        )
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )

@user_router.put("/profile", response_model=User)
async def update_user(request: dict, user: str = Depends(authenticate)) -> User:
    valid_keys = ["fullname", "username", "password", "email", "confirm_password"]
    filtered_request =  {key:value for key, value in request.items() if key in valid_keys}
    
    user_info = await User.find_one(User.email == user)
    if not user_info:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
        )

    # hashed_CP = hash_password.create_hash(filtered_request.get("confirm_password"))
    if not hash_password.verify_hash(filtered_request.get("confirm_password"), user_info.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Confirm password is incorrect"
        )
    
    # check if password change
    if "password" in filtered_request.keys():
        filtered_request["password"] = hash_password.create_hash(filtered_request.password)

    current_info = {
        "fullname":user_info.fullname,
        "username":user_info.username,
        "email":user_info.email,
        "password":user_info.password,
        "img":user_info.img,
        "role":user_info.role
    }

    for key, value in filtered_request.items():
        current_info[key] = value

    update_info = UserUpdate(**current_info)
    # update_info = UserUpdate(**filtered_request)
    updated_user = await user_database.update(user_info.id, update_info)
    return updated_user

def generate_random_name():
    characters = string.ascii_letters + string.digits
    random_name = ''.join(random.choice(characters) for _ in range(16))
    datetime_str = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    return f"{datetime_str}_{random_name}"

def crop_to_square(image: Image.Image) -> Image.Image:
    width, height = image.size
    min_dimension = min(width, height)
    left = (width - min_dimension) / 2
    top = (height - min_dimension) / 2
    right = (width + min_dimension) / 2
    bottom = (height + min_dimension) / 2
    return image.crop((left, top, right, bottom))

@user_router.post("/image")    
async def update_profile_image(file: UploadFile = File(...), user: str = Depends(authenticate)):
    user_info = await User.find_one(User.email == user)
    file_extension = file.filename.split('.')[-1]
    if not file_extension:
        return JSONResponse({"error": "File does not have an extension"}, status_code=400)
    filename = f"{generate_random_name()}.{file_extension}"
    file_location = UPLOAD_DIR / filename

    content = await file.read()
    image = Image.open(BytesIO(content))
    cropped_image = crop_to_square(image)
    

    async with aiofiles.open(file_location, 'wb') as out_file:
        cropped_image_bytes = BytesIO()
        cropped_image.save(cropped_image_bytes, format=image.format)
        await out_file.write(cropped_image_bytes.getvalue())
    if user_info is None:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
        )
    new_info = UserUpdate(
        fullname=user_info.fullname,
        username=user_info.username,
        password=user_info.password,
        email=user_info.email,
        img=filename,
        role=user_info.role
    )
    updated_user = await user_database.update(user_info.id, new_info)
    return updated_user
    
@user_router.get("/image/{filename}")
async def get_image(filename: str):
    file_location = UPLOAD_DIR / filename
    if not file_location.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    return FileResponse(file_location)

    
class UserWishListUpdate(BaseModel):
    wish_list: Optional[List[PydanticObjectId]]
@user_router.post("/wish_list/{id}/add")
async def add_to_wishlist(id: PydanticObjectId, user : str = Depends(authenticate)):
    user_info = await User.find_one(User.email == user)
    # check if id is valid
    movie_info = await movie_database.get(id)   
    if not movie_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="MovieID not found"
        )
    if id not in user_info.wish_list:
        user_info.wish_list.append(id)
    # new_info = UserUpdate(
    #     fullname=user_info.fullname,
    #     username=user_info.username,
    #     password=user_info.password,
    #     email=user_info.email,
    #     img=user_info.img,
    #     wish_list=user_info.wish_list,
    #     role=user_info.role
    # )
    new_info = UserWishListUpdate(
        wish_list = user_info.wish_list
    )
    update_user = await user_database.update(user_info.id, new_info)
    return update_user
        

@user_router.post("/wish_list/{id}/remove")
async def remove_to_wishlist(id: PydanticObjectId, user : str = Depends(authenticate)):
    user_info = await User.find_one(User.email == user)
    movie_info = await movie_database.get(id)   
    if not movie_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="MovieID not found"
        )
    if id in user_info.wish_list:
        user_info.wish_list.remove(id)
    new_info = UserWishListUpdate(
        wish_list = user_info.wish_list
    )
    update_user = await user_database.update(user_info.id, new_info)
    return update_user

@user_router.get("/profile/{id}", response_model=dict)
async def get_user_info(id: PydanticObjectId) -> dict:
    user_info = await user_database.get(id) 
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="UserID not found"
        )
    
    # res = UserResponse(
    #         fullname=user_info.fullname,
    #         username=user_info.username,
    #         email=user_info.email,
    #         img=user_info.img,
    #         role=user_info.role,
    #         wish_list=[]
    #     )
    res = {
            "fullname":user_info.fullname,
            "username":user_info.username,
            "email":user_info.email,
            "img":user_info.img,
            "role":user_info.role,
            "wish_list":[]
    }
    if user_info.wish_list:
        for item in user_info.wish_list:
            data = await retrieve_movie_for_wishlist(item)
            res["wish_list"].append(data)
    return res
    
    