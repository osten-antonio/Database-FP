from fastapi import APIRouter, HTTPException, status, Depends, Body
from ..schemas import ErrorResponse
from ..services.warehouse import get_warehouse, create_warehouse, edit_warehouse, get_warehouse_products, filter_warehouse_product, search_warehouse, delete_warehouse
from .auth import verify_token
from typing import List
router = APIRouter(prefix="/warehouse", tags=["warehouse"])

@router.get("/", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def get_all_warehouses(token: dict = Depends(verify_token)):
    """Get all warehouses"""
    try:
        res = get_warehouse()
        return res
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/search", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def search(name: str = "", token: dict = Depends(verify_token)):
    """Search warehouses by name"""
    try:
        res = search_warehouse(name)
        return res
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/", response_model=dict, responses={401: {"model": ErrorResponse}})
async def create_new_warehouse(
    name: str = Body(...),
    address: str = Body(...),
    id: int = Body(...),
    token: dict = Depends(verify_token)
):
    """Create a new warehouse"""
    try:
        create_warehouse(name=name, address=address, manager_id=id)
        return {"status": "success"}
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.put("/{warehouse_id}", response_model=dict, responses={401: {"model": ErrorResponse}})
async def update_warehouse(
    warehouse_id: int,
    name: str = Body(...),
    address: str = Body(...),
    id: int = Body(...),
    token: dict = Depends(verify_token)
):
    """Update a warehouse"""
    try:
        edit_warehouse(id=warehouse_id, name=name, address=address)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{warehouse_id}", response_model=dict, responses={401: {"model": ErrorResponse}})
async def remove_warehouse(warehouse_id: int, token: dict = Depends(verify_token)):
    """Delete a warehouse"""
    try:
        delete_warehouse(warehouse_id)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{warehouse_id}/products", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def get_products(warehouse_id: int, limit: int = None, token: dict = Depends(verify_token)):
    """Get products in a warehouse"""
    try:
        res = get_warehouse_products(warehouse_id, limit=limit)
        return res
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# @router.get("/{warehouse_id}/customers", response_model=dict, responses={401: {"model": ErrorResponse}})
# async def get_customers(warehouse_id: int, token: dict = Depends(verify_token)):
#     """Get customers associated with a warehouse"""
#     try:
#         res = get_warehouse_customer(warehouse_id)
#         return {"status": "success", "data": res}
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )
