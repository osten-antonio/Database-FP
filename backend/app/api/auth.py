"""
Token verification utilities for all API routes
"""
from fastapi import Depends, HTTPException, status
from ..core.security import oauth2_scheme, decode_access_token

async def verify_token(token: str = Depends(oauth2_scheme)):
    """
    Verify that the provided token is valid.
    
    Args:
        token: JWT token from Authorization header
        
    Returns:
        dict: Decoded token payload
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided"
        )
    
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    
    return payload
