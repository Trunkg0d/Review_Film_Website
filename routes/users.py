from auth.hash_password import HashPassword
from auth.jwt_handler import create_access_token
from database.connection import Database
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from models.users import User, TokenResponse
from pydantic import EmailStr

user_router = APIRouter(
    tags=["User"],
)

user_database = Database(User)
hash_password = HashPassword()


@user_router.post("/signup/checkEmail")
async def check_email_is_valid(input : dict) -> dict:
    user_email_exist = await User.find_one(User.email == input["email"])
    if user_email_exist:
        return {"message": "Existed"}
    else:
        return {"message": "Not exist"}


@user_router.post("/signup/checkUsername")
async def check_username_is_valid(input : dict) -> dict:
    user_username_exist = await User.find_one(User.username == input["username"])
    if user_username_exist:
        return {"message": "Existed"}
    else:
        return {"message": "Not exist"}


@user_router.post("/signup")
async def sign_user_up(user: User) -> dict:
    userEmail_exist = await User.find_one(User.email == user.email)

    if userEmail_exist:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email existed."
        )

    userName_exist = await User.find_one(User.username == user.username)
    if userName_exist:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username existed."
        )

    hashed_password = hash_password.create_hash(user.password)
    user.password = hashed_password
    await user_database.save(user)
    return {
        "message": "User created successfully"
    }

@user_router.post("/signin", response_model=TokenResponse)
async def sign_user_in(user: OAuth2PasswordRequestForm = Depends()) -> dict:
    user_exist = await User.find_one(User.email == user.username)

    if not user_exist:
        user_exist = await User.find_one(User.username == user.username)

    if not user_exist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with email does not exist."
        )
    if hash_password.verify_hash(user.password, user_exist.password):
        access_token = create_access_token(user_exist.email)
        return {
            "access_token": access_token,
            "token_type": "Bearer"
        }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid details passed."
    )