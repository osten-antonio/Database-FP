from fastapi import APIRouter, HTTPException, status, Depends, Body
from ..schemas import ErrorResponse
from ..services.supplier import get_suppliers, search_supplier, create_supplier, update_supplier, delete_supplier
from .auth import verify_token
from typing import List

router = APIRouter(prefix="/supplier", tags=["supplier"])

@router.get("/", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def get_all_suppliers(token: dict = Depends(verify_token)):
    """Get all suppliers"""
    result = get_suppliers()
    return result

@router.get("/search", response_model=List[dict], responses={401: {"model": ErrorResponse}})
async def search(
    name: str = "",
    email: str = "",
    address: str = "",
    token: dict = Depends(verify_token)
):
    """Search suppliers by name, email, or address"""
    result = search_supplier(name=name, email=email, address=address)
    return result

@router.post("/", response_model=dict, responses={401: {"model": ErrorResponse}})
async def create_new_supplier(
    name: str,
    address: str,
    email: str,
    phone_number: str = "",
    token: dict = Depends(verify_token)
):
    """Create a new supplier"""
    result = create_supplier(name=name, address=address, email=email, phone_number=phone_number)
    return result

@router.put("/{supplier_id}", response_model=dict, responses={401: {"model": ErrorResponse}})
async def update_supplier_endpoint(
    supplier_id: int,
    name: str = Body(...),
    address: str = Body(...),
    email: str = Body(...),
    phone_number: str = Body(""),
    token: dict = Depends(verify_token)
):
    """Update an existing supplier"""
    result = update_supplier(id=supplier_id, name=name, address=address, email=email, phone_number=phone_number)
    return result

@router.delete("/{supplier_id}", response_model=dict, responses={401: {"model": ErrorResponse}})
async def remove_supplier(supplier_id: int, token: dict = Depends(verify_token)):
    """Delete a supplier"""
    result = delete_supplier(supplier_id)
    return result
