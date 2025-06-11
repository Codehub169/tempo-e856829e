from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash # Assuming auth.py will have this utility
from typing import List, Optional

# --- User CRUD Operations ---

def get_user(db: Session, user_id: int) -> Optional[models.User]:
    """Retrieve a single user by their ID."""
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    """Retrieve a single user by their email address."""
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    """Retrieve a single user by their username."""
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]: # Corrected: Type hint
    """Retrieve a list of users with pagination."""
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    """Create a new user in the database."""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, db_user: models.User, user_in: schemas.UserUpdate) -> models.User:
    """Update an existing user's information."""
    update_data = user_in.model_dump(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        hashed_password = get_password_hash(update_data["password"])
        db_user.hashed_password = hashed_password
        del update_data["password"] # Don't try to set 'password' attribute directly
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> Optional[models.User]:
    """Delete a user from the database by their ID."""
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

# --- Post CRUD Operations ---

def get_post(db: Session, post_id: int) -> Optional[models.Post]:
    """Retrieve a single post by its ID."""
    return db.query(models.Post).filter(models.Post.id == post_id).first()

def get_posts(db: Session, skip: int = 0, limit: int = 100) -> List[models.Post]: # Corrected: Type hint
    """Retrieve a list of posts with pagination, ordered by creation date descending."""
    return db.query(models.Post).order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()

def get_posts_by_user(db: Session, owner_id: int, skip: int = 0, limit: int = 100) -> List[models.Post]: # Corrected: Parameter name and Type hint
    """Retrieve posts for a specific user with pagination."""
    return db.query(models.Post).filter(models.Post.owner_id == owner_id).order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()

def create_post(db: Session, post: schemas.PostCreate, owner_id: int) -> models.Post:
    """Create a new post for a given user."""
    db_post = models.Post(**post.model_dump(), owner_id=owner_id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def update_post(db: Session, db_post: models.Post, post_in: schemas.PostUpdate) -> models.Post:
    """Update an existing post. Assumes ownership check is done prior to calling."""
    update_data = post_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_post, field, value)
    
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def delete_post(db: Session, db_post: models.Post) -> models.Post: # Corrected: Parameter name to db_post
    """Delete a post. Assumes ownership check is done prior to calling."""
    db.delete(db_post)
    db.commit()
    return db_post
