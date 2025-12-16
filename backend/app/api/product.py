from fastapi import APIRouter, HTTPException, status, Depends, Body, Query
from ..schemas import ErrorResponse
from ..services.product import get_product, search_product, delete_product, create_product, edit_product, filter_product
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

@router.get("/filter", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def filter_products(
    min_cost: float = Query(0),
    max_cost: float = Query(1e10),
    suppliers: str = Query(""),
    category_id: str = Query(""),
    token: dict = Depends(verify_token)
):
    """Filter products by price range, suppliers, and categories"""
    supplier_list = [s.strip() for s in suppliers.split(",") if s.strip()] if suppliers else []
    category_list = [int(c.strip()) for c in category_id.split(",") if c.strip()] if category_id else []
    
    result = filter_product(
        min_cost=min_cost,
        max_cost=max_cost,
        suppliers=supplier_list,
        category_id=category_list
    )
    return result

@router.post("/", response_model=dict, responses={401: {"model": ErrorResponse}})
async def create_new_product(
    product_name: str = Body(...),
    price: float = Body(...),
    category_id: int = Body(...),
    supplier_name: str = Body(...),
    token: dict = Depends(verify_token)
):
    print(price)
    """Create a new product"""
    result = create_product(
        product_name=product_name,
        price=price,
        category_id=category_id,
        supplier_name=supplier_name
    )
    return result

@router.put("/{product_id}", response_model=dict, responses={401: {"model": ErrorResponse}})
async def update_product(
    product_id: int,
    product_name: str = Body(...),
    price: float = Body(...),
    category_id: int = Body(...),
    supplier_name: str = Body(...),
    token: dict = Depends(verify_token)
):
    """Update an existing product"""
    result = edit_product(
        id=product_id,
        product_name=product_name,
        price=price,
        category_id=category_id,
        supplier_name = supplier_name
    )
    return result

@router.delete("/{product_id}", response_model=dict, responses={401: {"model": ErrorResponse}})
async def remove_product(product_id: int, token: dict = Depends(verify_token)):
    """Delete a product"""
    result = delete_product(product_id)
    return result
