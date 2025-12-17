from fastapi import APIRouter, HTTPException, status, Depends, Body
from ..schemas import ErrorResponse
from ..services.category import get_categories, insert_categories
from .auth import verify_token
from typing import List
router = APIRouter(prefix="/category", tags=["category"])

@router.get("/", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def get_all_categories():
    """Get all product categories"""
    try:
        result = get_categories()
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/", response_model=dict, responses={401: {"model": ErrorResponse}})
async def create_category(
    name: str = Body(...),
    bg_color: str = Body(...),
    text_color: str = Body(...),
    token: dict = Depends(verify_token)
):
    """Create a new category"""
    try:
        return insert_categories(name=name, bg=bg_color, text=text_color)
        
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
