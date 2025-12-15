from fastapi import APIRouter, HTTPException, status, Depends, Body
from ..schemas import ErrorResponse
from ..services.customer import get_customers, search_customers, add_customer, edit_customer
from .auth import verify_token
from typing import List

router = APIRouter(prefix="/customer", tags=["customer"])

@router.get("/", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def get_all_customers(token: dict = Depends(verify_token)):
    """Get all customers"""
    result = get_customers()
    return result

@router.get("/{customer_id}/address", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def get_customer_addresses(customer_id: int, token: dict = Depends(verify_token)):
    """Get all addresses for a specific customer"""
    try:
        from ..services.customer import get_customer_addresses
        result = get_customer_addresses(customer_id)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/search", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def search(
    name: str = Body(...),
    email: str = Body(...),
    address: str = Body(...),
    phone: str = Body(...),
    token: dict = Depends(verify_token)
):
    """Search customers by name, email, address, or phone"""
    result = search_customers(name=name, email=email, address=address, phone=phone)
    return result

@router.post("/", response_model=dict, responses={401: {"model": ErrorResponse}})
async def create_new_customer(
    name: str = Body(...),
    email: str = Body(...),
    addresses: list[dict] = Body(...),
    token: dict = Depends(verify_token)
):
    """Create a new customer"""
    if addresses is None:
        addresses = []
    try:
        customer_id = add_customer(name=name, email=email, addresses=addresses)
        return {"status": "success", "customer_id": customer_id}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.put("/{customer_id}", response_model=dict, responses={401: {"model": ErrorResponse}})
async def update_customer(
    customer_id: int,
    name: str = Body(...),
    email: str = Body(...),
    addresses: list[dict] = Body(...),
    token: dict = Depends(verify_token)
):
    """Update an existing customer"""
    if addresses is None:
        addresses = []
    try:
        edit_customer(id=customer_id, name=name, email=email, addresses=addresses)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
