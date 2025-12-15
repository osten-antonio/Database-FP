from fastapi import APIRouter, HTTPException, status, Depends, Body
from ..schemas import ErrorResponse
from ..services.order import search_order, filter_order, delete_order, create_order, edit_order, get_order
from .auth import verify_token
from typing import List

router = APIRouter(prefix="/order", tags=["order"])

@router.get("/", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def get_all_orders(limit: int = None, token: dict = Depends(verify_token)):
    """Get all orders"""
    try:
        result = get_order(limit=limit)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/search", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def search(
    item: str = "",
    customer_name: str = "",
    address: str = "",
    token: dict = Depends(verify_token)
):
    """Search orders by item, customer name, or address"""
    try:
        result = search_order(item=item, customer_name=customer_name, address=address)
        return result
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/", response_model=dict, responses={401: {"model": ErrorResponse}})
async def create_new_order(
    customer_id: int = Body(...),
    warehouse_id: int = Body(...),
    delivery_address: str = Body(...),
    order_date: str = Body(...),
    expected_delivery_date: str = Body(...),
    items: list[dict] = Body(...),
    token: dict = Depends(verify_token)
):
    """Create a new order"""
    try:
        create_order(
            customer_id=customer_id,
            warehouse_id=warehouse_id,
            delivery_address=delivery_address,
            order_date=order_date,
            delivery_date=expected_delivery_date,
            items=items
        )
        return {"status": "success"}
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.put("/{order_id}", response_model=dict, responses={401: {"model": ErrorResponse}})
async def update_order(
    order_id: int,                              
    customer_id: int = Body(...),
    warehouse_id: int = Body(...),
    delivery_address: str = Body(...),
    order_date: str = Body(...),
    expected_delivery_date: str = Body(...),
    items: list[dict] = Body(...),
    token: dict = Depends(verify_token)
):
    """Update an order"""
    try:
        if items is None:
            items = []
        edit_order(
            customer_id=customer_id,
            order_id=order_id,
            warehouse_id=warehouse_id,
            delivery_address=delivery_address,
            order_date=order_date,
            expected_delivery_date=expected_delivery_date,
            items=items
        )
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/filter", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def filter_orders(
    order_date_from: str = None,
    order_date_to: str = None,
    deliver_date_from: str = None,
    deliver_date_to: str = None,
    cost_min: float = 0,
    cost_max: float = 1e10,
    delivered: bool = False,
    overdue: bool = False,
    in_progress: bool = False,
    warehouse: str = None,
    supplier: str = None,
    token: dict = Depends(verify_token)
):
    """Filter orders by various criteria"""
    try:
        # Parse warehouse IDs if provided
        warehouse_list = []
        if warehouse:
            warehouse_list = [int(w.strip()) for w in warehouse.split(',')]
        
        result = filter_order(
            order_date_from=order_date_from,
            order_date_to=order_date_to,
            deliver_date_from=deliver_date_from,
            deliver_date_to=deliver_date_to,
            cost_min=cost_min,
            cost_max=cost_max,
            delivered=delivered,
            overdue=overdue,
            in_progress=in_progress,
            warehouse=warehouse_list,
            supplier=supplier
        )
        return result
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{order_id}/{product_id}", response_model=dict, responses={401: {"model": ErrorResponse}})
async def remove_order(order_id: int, product_id: int, token: dict = Depends(verify_token)):
    """Delete an order line item"""
    try:
        delete_order(order_id, product_id)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
