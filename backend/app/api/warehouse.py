from fastapi import APIRouter, HTTPException, status, Depends, Body, Query
from ..schemas import ErrorResponse
from ..services import delete_inv, search_warehouse_product, get_warehouse, create_warehouse, get_name, edit_warehouse, get_warehouse_products, filter_warehouse_product, search_warehouse, delete_warehouse, get_warehouse_specific, get_warehouse_customers, get_warehouse_stats, get_warehouse_order_stats
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
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    

@router.get("/get_name/{id}", response_model=str, responses={401: {"model": ErrorResponse}})
async def search(id: str, token: dict = Depends(verify_token)):
    """Search warehouses by name"""
    try:
        res = get_name(id)
        return res
    except Exception as e:
        print(e)
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
        print(e)
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
        print(e)
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

@router.get("/{warehouse_id}/customers", response_model=dict, responses={401: {"model": ErrorResponse}})
async def get_warehouse_detail_customers(warehouse_id: int, token: dict = Depends(verify_token)):
    """Get customers associated with a warehouse"""
    try:
        res = get_warehouse_customers(warehouse_id)
        return {"status": "success", "data": res}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{warehouse_id}", response_model=dict, responses={401: {"model": ErrorResponse}})
async def get_warehouse_detail(warehouse_id: int, token: dict = Depends(verify_token)):
    """Get warehouse details with manager info"""
    try:
        res = get_warehouse_specific(warehouse_id)
        return {"status": "success", "data": res}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{warehouse_id}/stats", response_model=dict, responses={401: {"model": ErrorResponse}})
async def get_warehouse_detail_stats(warehouse_id: int, token: dict = Depends(verify_token)):
    """Get warehouse statistics"""
    try:
        res = get_warehouse_stats(warehouse_id)
        return {"status": "success", "data": res}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{warehouse_id}/order-stats", response_model=dict, responses={401: {"model": ErrorResponse}})
async def get_warehouse_order_detail_stats(warehouse_id: int, token: dict = Depends(verify_token)):
    """Get warehouse order statistics"""
    try:
        res = get_warehouse_order_stats(warehouse_id)
        return {"status": "success", "data": res}
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{warehouse_id}/products/{product_id}", response_model=dict, responses={401: {"model": ErrorResponse}})
async def delete_product(warehouse_id: int,product_id: int, token: dict = Depends(verify_token)):
    """Get warehouse order statistics"""
    try:
        res = delete_inv(warehouse_id,product_id)
        return {"status": "success"}
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{warehouse_id}/products/filter", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def filter_products(
    warehouse_id: int,    
    min_cost: float = Query(0),
    max_cost: float = Query(1e10),
    suppliers: str = Query(""),
    categories: str = Query(""), 
    token: dict = Depends(verify_token)
):
    """Get products in a warehouse"""
    supplier_list = [s.strip() for s in suppliers.split(",") if s.strip()] if suppliers else []
    category_list = [int(c.strip()) for c in categories.split(",") if c.strip()] if categories else []
    
    try:
        res = filter_warehouse_product(id=warehouse_id,
                                        min_cost=min_cost,
                                        max_cost=max_cost,
                                        suppliers=supplier_list,
                                        category=category_list
                                       )
        return res
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
@router.get("/{warehouse_id}/products/filter", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def filter_products(
    warehouse_id: int,    
    min_cost: float = Query(0),
    max_cost: float = Query(1e10),
    suppliers: str = Query(""),
    category_id: str = Query(""), 
    token: dict = Depends(verify_token)
):
    """Get products in a warehouse"""
    supplier_list = [s.strip() for s in suppliers.split(",") if s.strip()] if suppliers else []
    category_list = [int(c.strip()) for c in category_id.split(",") if c.strip()] if category_id else []
    try:
        res = filter_warehouse_product(id=warehouse_id,
                                        mine_cost=min_cost,
                                        max_cost=max_cost,
                                        suppliers=supplier_list,
                                        category_id=category_list
                                       )
        return res
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{warehouse_id}/products/search", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def search(warehouse_id:int, name: str = "", supplier: str = "", token: dict = Depends(verify_token)):
    """Search products by name or supplier"""
    result = search_warehouse_product(warehouse_id=warehouse_id, name=name, supplier=supplier)
    return result
