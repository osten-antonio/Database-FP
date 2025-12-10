from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm

from ..schemas import UserLogin, UserResponse, ErrorResponse
from ..services import login_user

router = APIRouter(prefix="/user",
                   tags=["user"])


@router.post("/login", response_model=UserResponse, responses={401: {"model": ErrorResponse}})
async def login_route(payload: UserLogin):
    try:
        info = login_user(payload.email, payload.password)

        return info
    except HTTPException as e:
        raise e
