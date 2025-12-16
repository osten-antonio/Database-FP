from fastapi import APIRouter, HTTPException, status,Body, Depends
from ..schemas import ErrorResponse
from ..services.restock import add_stock, complete_order, get_restock_orders
from .auth import verify_token
from typing import List

router = APIRouter(prefix="/restock", tags=["restock"])

@router.get("/{warehouse_id}", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def get_restock(warehouse_id: int, token: dict = Depends(verify_token)):
    """Get restock orders for a warehouse"""
    try:
        result = get_restock_orders(warehouse_id)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/", response_model=dict, responses={401: {"model": ErrorResponse}})
async def create_restock(
    product_id: int = Body(...),
    warehouse_id: int = Body(...),
    amount: int = Body(...),
    cost: float = Body(...),
    date: str = Body(...),
    token: dict = Depends(verify_token)
):
    """Create a restock order"""
    try:
        add_stock(product_id=product_id, warehouse_id=warehouse_id, amount=amount, cost=cost, date=date)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/{restock_id}/complete", response_model=None, responses={401: {"model": ErrorResponse}})
async def complete_restock(restock_id: int, token: dict = Depends(verify_token)):
    """Mark a restock order as complete"""
    try:
        result = complete_order(restock_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
