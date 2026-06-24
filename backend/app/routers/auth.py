from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from ..ldap_auth import authenticate_ad_user
from ..config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = authenticate_ad_user(form_data.username, form_data.password)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
        )
    token = create_access_token({
        "sub": user["username"],
        "email": user["email"],
        "role": user["role"],
        "ou": user["ou"],
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }