from fastapi import APIRouter, HTTPException, status, Depends
from ..schemas import ErrorResponse
from ..services.dashboard import get_top_products_qty, get_top_products_money, get_total_sales_card, get_total_sales_month, get_warehouse_stocks
from .auth import verify_token
from typing import List

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/top-products-qty", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def top_products_by_quantity(token: dict = Depends(verify_token)):
    """Get top 5 products by quantity sold"""
    try:
        result = get_top_products_qty()
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/top-products-revenue", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def top_products_by_revenue(token: dict = Depends(verify_token)):
    """Get top 5 products by revenue"""
    try:
        result = get_top_products_money()
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/total-sales", response_model=dict, responses={401: {"model": ErrorResponse}})
async def total_sales(token: dict = Depends(verify_token)):
    """Get total sales"""
    try:
        result = get_total_sales_card()
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/sales-by-month", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def sales_by_month(token: dict = Depends(verify_token)):
    """Get sales breakdown by month"""
    try:
        result = get_total_sales_month()
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/warehouse-stocks", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def warehouse_stocks(token: dict = Depends(verify_token)):
    """Get stock levels by warehouse"""
    try:
        result = get_warehouse_stocks()
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
