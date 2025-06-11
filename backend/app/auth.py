import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import ValidationError
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import get_db

# Environment variables - Ensure these are set in your environment for production
# For development, the defaults are used.
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-dev-only-change-in-prod")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

if SECRET_KEY == "your-secret-key-for-dev-only-change-in-prod":
    print("WARNING: Using default SECRET_KEY. This is insecure and should only be used for development.")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# This URL must match the full path to the token endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hashes a plain password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Creates a new JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(db: Session, username_or_email: str, password: str) -> Optional[models.User]:
    """Authenticates a user by username or email and password."""
    # Try to find user by username first
    user = crud.get_user_by_username(db, username=username_or_email)
    if not user:
        # If not found by username, try by email
        user = crud.get_user_by_email(db, email=username_or_email)
    
    if not user:
        return None # User not found by either username or email
    if not verify_password(password, user.hashed_password):
        return None # Password does not match
    return user

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)) -> models.User:
    """Dependency to get the current user from a JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        subject: Optional[str] = payload.get("sub") # 'sub' typically holds the username or user ID
        if subject is None:
            raise credentials_exception
        
        # Validate the payload structure using Pydantic schema
        token_data = schemas.TokenPayload(sub=subject)
    except (JWTError, ValidationError) as e: # Catch JWT errors or Pydantic validation errors
        # For debugging: print(f"Token validation error: {e}")
        raise credentials_exception
    
    # Fetch user based on 'sub' (username) from token payload
    user = crud.get_user_by_username(db, username=token_data.sub) 
    if user is None:
        # This case implies the token's subject refers to a non-existent user.
        # This could happen if a user was deleted after a token was issued.
        raise credentials_exception
    return user

async def get_current_active_user(current_user: Annotated[models.User, Depends(get_current_user)]) -> models.User:
    """Dependency to get the current active user. 
    Builds upon get_current_user and additionally checks if the user is active."""
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user
