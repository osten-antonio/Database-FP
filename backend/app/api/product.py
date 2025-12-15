from fastapi import APIRouter, HTTPException, status, Depends, Query
from ..schemas import ErrorResponse
from ..services.product import get_product, search_product, delete_product, create_product, edit_product
from .auth import verify_token
from typing import List

router = APIRouter(prefix="/product", tags=["product"])

@router.get("/", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def get_all_products(token: dict = Depends(verify_token)):
    """Get all products"""
    result = get_product()
    return result

@router.get("/search", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def search(name: str = "", supplier: str = "", token: dict = Depends(verify_token)):
    """Search products by name or supplier"""
    result = search_product(name=name, supplier=supplier)
    return result

@router.post("/", response_model=dict, responses={401: {"model": ErrorResponse}})
async def create_new_product(
    product_name: str,
    price: float = 0,
    category_id: int = 0,
    account_id: int = None,
    token: dict = Depends(verify_token)
):
    """Create a new product"""
    result = create_product(
        product_name=product_name,
        price=price,
        category_id=category_id,
        account_id=account_id
    )
    return result

@router.put("/{product_id}", response_model=dict, responses={401: {"model": ErrorResponse}})
async def update_product(
    product_id: int,
    product_name: str,
    price: float = 0,
    category_id: int = 0,
    account_id: int = None,
    token: dict = Depends(verify_token)
):
    """Update an existing product"""
    result = edit_product(
        id=product_id,
        product_name=product_name,
        price=price,
        category_id=category_id,
        account_id=account_id
    )
    return result

@router.delete("/{product_id}", response_model=dict, responses={401: {"model": ErrorResponse}})
async def remove_product(product_id: int, token: dict = Depends(verify_token)):
    """Delete a product"""
    result = delete_product(product_id)
    return result
