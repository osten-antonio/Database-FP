from ..db import connect
from ..core import hash_password, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, oauth2_scheme, decode_access_token
from fastapi import HTTPException, status, Depends, Request
from datetime import timedelta

def get_user(email: str):
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute("SELECT account_id, name, password, account_type FROM Account WHERE email = %s", (email,))
        row = cursor.fetchone()
        cursor.close()
        if row:
            return {"id": row[0], "username": row[1], "password": row[2], "role": row[3]}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def login_user(email: str, password: str):
    user = get_user(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )


    if not verify_password(password, user["password"]):  
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user["id"]}, expires_delta=access_token_expires
    ) 

    return {'id':user["id"], 'username':user["username"], "role": user["role"], "access_token": token, "token_type": "bearer"}

