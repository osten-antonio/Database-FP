from fastapi import APIRouter, HTTPException, status, Depends
from ..schemas import ErrorResponse
from ..services.category import get_categories, insert_categories
from .auth import verify_token
from typing import List
router = APIRouter(prefix="/category", tags=["category"])

@router.get("/", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def get_all_categories(token: dict = Depends(verify_token)):
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
    name: str,
    bg_color: str = "#FFFFFF",
    text_color: str = "#000000",
    token: dict = Depends(verify_token)
):
    """Create a new category"""
    try:
        insert_categories(name=name, bg=bg_color, text=text_color)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
