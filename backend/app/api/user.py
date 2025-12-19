from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.security import OAuth2PasswordRequestForm

from ..schemas import UserLogin, UserResponse, ErrorResponse
from ..services import login_user, create_user

router = APIRouter(prefix="/user",
                   tags=["user"])


@router.post("/login", response_model=UserResponse, responses={401: {"model": ErrorResponse}})
async def login_route(payload: UserLogin):
    try:
        info = login_user(payload.email, payload.password)
    
        return info
    except HTTPException as e:
        raise e

@router.post("/create", response_model=dict, responses={401: {"model": ErrorResponse}})
async def create_route(email: str = Body(...), name: str = Body(...), password: str = Body(...), role:int = Body(...)):
    try:
        info = create_user(email=email, password=password, role=role, name=name)
    
        return info
    except HTTPException as e:
        raise e
