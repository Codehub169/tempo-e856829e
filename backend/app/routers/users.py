from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Annotated

from .. import crud, schemas, auth, models
from ..database import get_db

router = APIRouter(
    prefix="/users",  # Corrected: To integrate with main.py's app.include_router(..., prefix="/api/v1")
    tags=["users"],
)

@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    - **username**: Unique username.
    - **email**: Unique email address.
    - **password**: User's password.
    """
    db_user_by_email = crud.get_user_by_email(db, email=user_in.email)
    if db_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    db_user_by_username = crud.get_user_by_username(db, username=user_in.username)
    if db_user_by_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    return crud.create_user(db=db, user=user_in)

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    """
    Authenticate user and return an access token (JWT).
    Uses OAuth2PasswordRequestForm, so expects 'username' and 'password' in form data.
    The 'username' field can be either the actual username or the email.
    """
    user = auth.authenticate_user(db, username_or_email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Inactive user"
        )
    access_token = auth.create_access_token(
        data={"sub": user.username} # 'sub' is standard claim for subject (username)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: Annotated[models.User, Depends(auth.get_current_active_user)]):
    """
    Get current authenticated user's details.
    """
    return current_user

@router.put("/me", response_model=schemas.User)
def update_users_me(
    user_in: schemas.UserUpdate,
    current_user: Annotated[models.User, Depends(auth.get_current_active_user)],
    db: Session = Depends(get_db)
):
    """
    Update current authenticated user's details.
    Allows updating username, email, or password.
    """
    # Check for email conflict if email is being changed
    if user_in.email and user_in.email != current_user.email:
        existing_user = crud.get_user_by_email(db, email=user_in.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered by another user.")
    
    # Check for username conflict if username is being changed
    if user_in.username and user_in.username != current_user.username:
        existing_user = crud.get_user_by_username(db, username=user_in.username)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken by another user.")

    updated_user = crud.update_user(db, db_user=current_user, user_in=user_in)
    return updated_user

@router.get("/{user_id}", response_model=schemas.UserMinimal)
def read_user_by_id(user_id: int, db: Session = Depends(get_db)):
    """
    Get a specific user by ID (minimal public information).
    """
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user

@router.get("", response_model=List[schemas.UserMinimal])
def read_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db)
    # current_user: Annotated[models.User, Depends(auth.get_current_active_user)] # Uncomment for admin-only access
):
    """
    Retrieve a list of users (minimal public information).
    Currently public, can be restricted to admin users if needed.
    """
    users = crud.get_users(db, skip=skip, limit=limit)
    return users
